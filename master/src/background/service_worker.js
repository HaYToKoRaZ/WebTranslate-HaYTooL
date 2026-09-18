/**
 * WebTranslate HaYTooL - Background Service Worker
 * Context Menus & Translation Bridge
 */

const DEFAULT_SETTINGS = {
  appLang: "tr", // Eklenti arayüz dili (tr / en)
  targetLang: "tr", // Çevrilecek hedef dil
  theme: "system",
  showSelectionHUD: true,
  showContextMenu: true,
  engine: "google"
};

const LANG_NAMES = {
  tr: { tr: "Türkçe", en: "Turkish" },
  en: { tr: "İngilizce", en: "English" },
  de: { tr: "Almanca", en: "German" },
  fr: { tr: "Fransızca", en: "French" },
  es: { tr: "İspanyolca", en: "Spanish" },
  it: { tr: "İtalyanca", en: "Italian" },
  pt: { tr: "Portekizce", en: "Portuguese" },
  ru: { tr: "Rusça", en: "Russian" },
  ar: { tr: "Arapça", en: "Arabic" },
  az: { tr: "Azerbaycan Türkçesi", en: "Azerbaijani" },
  zh: { tr: "Çince (Basitleştirilmiş)", en: "Chinese (Simplified)" },
  ja: { tr: "Japonca", en: "Japanese" },
  ko: { tr: "Korece", en: "Korean" },
  nl: { tr: "Felemenkçe", en: "Dutch" },
  pl: { tr: "Lehçe", en: "Polish" },
  uk: { tr: "Ukraynaca", en: "Ukrainian" },
  el: { tr: "Yunanca", en: "Greek" },
  hi: { tr: "Hintçe", en: "Hindi" },
  fa: { tr: "Farsça", en: "Persian" },
  sv: { tr: "İsveççe", en: "Swedish" },
  no: { tr: "Norveççe", en: "Norwegian" },
  da: { tr: "Danca", en: "Danish" },
  fi: { tr: "Fince", en: "Finnish" },
  cs: { tr: "Çekçe", en: "Czech" },
  ro: { tr: "Romence", en: "Romanian" },
  hu: { tr: "Macarca", en: "Hungarian" },
  bg: { tr: "Bulgarca", en: "Bulgarian" },
  id: { tr: "Endonezce", en: "Indonesian" },
  ms: { tr: "Malayca", en: "Malay" },
  vi: { tr: "Vietnamca", en: "Vietnamese" },
  th: { tr: "Tayca", en: "Thai" },
  he: { tr: "İbranice", en: "Hebrew" },
  kk: { tr: "Kazakça", en: "Kazakh" },
  uz: { tr: "Özbekçe", en: "Uzbek" },
  ur: { tr: "Urduca", en: "Urdu" },
  bn: { tr: "Bengalce", en: "Bengali" },
  sr: { tr: "Sırpça", en: "Serbian" },
  hr: { tr: "Hırvatça", en: "Croatian" },
  sk: { tr: "Slovakça", en: "Slovak" },
  sl: { tr: "Slovence", en: "Slovenian" },
  lt: { tr: "Litvanca", en: "Lithuanian" },
  lv: { tr: "Letonca", en: "Latvian" },
  et: { tr: "Estonca", en: "Estonian" },
  ka: { tr: "Gürcüce", en: "Georgian" }
};

// Tarayıcı her yeniden başlatıldığında (restart) popup taslağını temizle
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.remove(["popupQuickDraft"]);
});

// İlk kurulum veya güncelleme
chrome.runtime.onInstalled.addListener(async (details) => {
  // Tarayıcı / Sistem dilini algıla (örneğin "tr-TR" -> "tr", "en-US" -> "en")
  let detectedLang = "tr";
  try {
    const uiLang = (chrome.i18n.getUILanguage() || "tr").toLowerCase().split("-")[0];
    if (LANG_NAMES[uiLang]) {
      detectedLang = uiLang;
    }
  } catch (e) {
    console.warn("Language detection error:", e);
  }

  const existing = await chrome.storage.local.get(null);
  const data = {
    appLang: existing.appLang || (detectedLang === "en" ? "en" : "tr"),
    targetLang: existing.targetLang || detectedLang,
    theme: existing.theme || DEFAULT_SETTINGS.theme,
    showSelectionHUD: existing.showSelectionHUD !== undefined ? existing.showSelectionHUD : DEFAULT_SETTINGS.showSelectionHUD,
    showContextMenu: existing.showContextMenu !== undefined ? existing.showContextMenu : DEFAULT_SETTINGS.showContextMenu,
    engine: existing.engine || DEFAULT_SETTINGS.engine,
    deeplApiKey: existing.deeplApiKey || ""
  };
  await chrome.storage.local.set(data);
  setupContextMenus(data.targetLang, data.showContextMenu, data.appLang);
});

// Ayarlar değiştiğinde menüleri güncelle
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.targetLang || changes.showContextMenu || changes.appLang)) {
    chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
      setupContextMenus(settings.targetLang, settings.showContextMenu, settings.appLang);
    });
  }
});

// Sağ Tık (Context Menus) Güvenli Oluşturucu
async function setupContextMenus(targetLang = "tr", showMenu = true, appLang = "tr") {
  try {
    await chrome.contextMenus.removeAll();
    if (!showMenu) return;

    const uiLang = (appLang === "en" || appLang === "tr") ? appLang : (chrome.i18n.getUILanguage().startsWith("tr") ? "tr" : "en");
    const langDisplay = (LANG_NAMES[targetLang] && LANG_NAMES[targetLang][uiLang]) || targetLang.toUpperCase();

    const pageTitle = uiLang === "tr" ? `🌐 Bu Sayfayı Çevir (${langDisplay})` : `🌐 Translate this page (${langDisplay})`;
    const selectionTitle = uiLang === "tr" ? `🔤 Seçili Metni Çevir (${langDisplay})` : `🔤 Translate selection (${langDisplay})`;
    const optionsTitle = chrome.i18n.getMessage("contextOptions") || "⚙️ Çeviri Ayarları";

    const safeCreate = (options) => {
      chrome.contextMenus.create(options, () => {
        if (chrome.runtime.lastError) {
          // Zaten mevcutsa veya yarış durumunda hata fırlatmasını önle
          const _ = chrome.runtime.lastError;
        }
      });
    };

    // 1. Sayfa Çevirisi (Sayfada herhangi bir boş yere sağ tıklandığında doğrudan çevirir)
    safeCreate({
      id: "translate_full_page",
      title: pageTitle,
      contexts: ["page"]
    });

    // 2. Seçili Metin Çevirisi (Kullanıcı metin seçip sağ tıkladığında doğrudan çevirir)
    safeCreate({
      id: "translate_selection",
      title: selectionTitle,
      contexts: ["selection"]
    });

    // 3. Uzantı simgesine sağ tıklandığında açılan menü (action context)
    const portalTitle = uiLang === "tr" ? "✨ HaYTooL Portal (Web Sitemiz)" : "✨ HaYTooL Portal (Website)";
    safeCreate({
      id: "open_portal",
      title: portalTitle,
      contexts: ["action"]
    });
  } catch (err) {
    console.warn("Context menu setup warning:", err);
  }
}

// Menü Tıklama Olayları
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "open_portal") {
    chrome.tabs.create({ url: "https://haytokoraz.github.io/" });
    return;
  }

  if (!tab || !tab.id) return;

  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);

  if (info.menuItemId === "translate_full_page") {
    // Sayfaya tam sayfa çevirisi mesajı yolla
    chrome.tabs.sendMessage(tab.id, {
      action: "TRANSLATE_PAGE",
      targetLang: settings.targetLang
    }).catch(err => {
      // Content script henüz yüklenmemişse enjekte et
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/content/content.js"]
      }).then(() => {
        chrome.tabs.sendMessage(tab.id, {
          action: "TRANSLATE_PAGE",
          targetLang: settings.targetLang
        });
      });
    });
  } else if (info.menuItemId === "translate_selection") {
    const text = info.selectionText;
    if (!text) return;

    // Metni çevirip content script'e ilet
    try {
      const translated = await translateText(text, settings.targetLang, settings.engine || "google");
      chrome.tabs.sendMessage(tab.id, {
        action: "SHOW_SELECTION_RESULT",
        originalText: text,
        translatedText: translated,
        targetLang: settings.targetLang
      });
    } catch (e) {
      console.error("Çeviri hatası:", e);
    }
  }
});

// Çoklu Çeviri Motoru Sağlayıcısı (Google, DeepL, Bing, MyMemory, Lingva)
async function translateText(text, targetLang = "tr", engine = "google") {
  // 1. DeepL API (Resmi Free veya Pro API Key ile)
  if (engine === "deepl") {
    try {
      const stored = await chrome.storage.local.get({ deeplApiKey: "" });
      const apiKey = stored.deeplApiKey ? stored.deeplApiKey.trim() : "";
      if (apiKey) {
        const isFree = apiKey.endsWith(":fx") || !apiKey.includes(":");
        const endpoint = isFree ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
        
        const params = new URLSearchParams();
        params.append("text", text);
        params.append("target_lang", targetLang.toUpperCase());

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `DeepL-Auth-Key ${apiKey}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: params.toString()
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.translations && data.translations[0]) {
            return data.translations[0].text;
          }
        }
      }
    } catch (e) {
      console.warn("DeepL failed, fallback to Google:", e);
    }
  }

  // 2. Bing / Microsoft Translator
  else if (engine === "bing") {
    try {
      // Bing translator oturum anahtarlarını al
      const homeRes = await fetch("https://www.bing.com/translator", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (homeRes.ok) {
        const html = await homeRes.text();
        const mIg = html.match(/IG:"([A-Za-z0-9]+)"/);
        const mIid = html.match(/data-iid="([^"]+)"/);
        const mKey = html.match(/var\s+params_AbusePreventionHelper\s*=\s*\[([0-9]+),\s*"([^"]+)",\s*([0-9]+)\];/);

        const ig = mIg ? mIg[1] : "";
        const iid = mIid ? mIid[1] : "translator.5028";
        const key = mKey ? mKey[1] : "";
        const token = mKey ? mKey[2] : "";

        if (ig && token) {
          const postUrl = `https://www.bing.com/ttranslatev3?isVertical=1&&IG=${ig}&IID=${iid}`;
          const formBody = new URLSearchParams({
            fromLang: "auto-detect",
            to: targetLang,
            text: text,
            tryFetchingGenderDebiasedTranslations: "true",
            key: key,
            token: token
          });

          const transRes = await fetch(postUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Referer": "https://www.bing.com/translator"
            },
            body: formBody.toString()
          });

          if (transRes.ok) {
            const transData = await transRes.json();
            if (Array.isArray(transData) && transData[0] && transData[0].translations && transData[0].translations[0]) {
              return transData[0].translations[0].text;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Bing Translator failed, fallback to Google:", e);
    }
  }

  // 3. DuckDuckGo Translate
  else if (engine === "duckduckgo") {
    try {
      const homeRes = await fetch("https://duckduckgo.com/?q=translate&ia=translate", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (homeRes.ok) {
        const html = await homeRes.text();
        const mVqd = html.match(/vqd=([a-zA-Z0-9_\-]+)/);
        const vqd = mVqd ? mVqd[1] : "";
        if (vqd) {
          const transUrl = `https://duckduckgo.com/translation.js?query=translate&vqd=${encodeURIComponent(vqd)}&to=${encodeURIComponent(targetLang)}`;
          const transRes = await fetch(transUrl, {
            method: "POST",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "Referer": "https://duckduckgo.com/"
            },
            body: text
          });
          if (transRes.ok) {
            const transData = await transRes.json();
            if (transData && transData.translated) {
              return transData.translated;
            }
          }
        }
      }
    } catch (e) {
      console.warn("DuckDuckGo Translate failed, fallback to Google:", e);
    }
  }

  // 4. MyMemory Translator
  else if (engine === "mymemory") {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${encodeURIComponent(targetLang)}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && data.responseData && data.responseData.translatedText) {
          return data.responseData.translatedText;
        }
      }
    } catch (e) {
      console.warn("MyMemory failed, fallback to Google:", e);
    }
  }

  // 4. Lingva Translate
  else if (engine === "lingva") {
    // Lingva genel aynalarını sırayla dene
    const lingvaInstances = [
      `https://lingva.ml/api/v1/auto/${encodeURIComponent(targetLang)}/${encodeURIComponent(text)}`,
      `https://lingva.lunar.icu/api/v1/auto/${encodeURIComponent(targetLang)}/${encodeURIComponent(text)}`
    ];
    for (const url of lingvaInstances) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && data.translation) {
            return data.translation;
          }
        }
      } catch (e) {
        // Sonraki aynayı dene
      }
    }
  }

  // 5. Varsayılan & Güvenilir Omurga: Google Translate (Resmi Chrome Uzantı API'si)
  try {
    const url1 = `https://translate.googleapis.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${encodeURIComponent(targetLang)}&q=${encodeURIComponent(text)}`;
    const res1 = await fetch(url1);
    if (res1.ok) {
      const data1 = await res1.json();
      if (Array.isArray(data1) && data1[0]) {
        if (Array.isArray(data1[0])) {
          return data1[0][0] || text;
        }
        return data1[0];
      }
    }
  } catch (e) {
    console.warn("Google endpoint 1 failed, trying fallback 2:", e);
  }

  // 2. Google Translate Uç Noktası (clients5 Ayna)
  try {
    const url2 = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${encodeURIComponent(targetLang)}&q=${encodeURIComponent(text)}`;
    const res2 = await fetch(url2);
    if (res2.ok) {
      const data2 = await res2.json();
      if (Array.isArray(data2) && data2[0]) {
        if (Array.isArray(data2[0])) {
          return data2[0][0] || text;
        }
        return data2[0];
      }
    }
  } catch (e) {
    console.warn("Google endpoint 2 failed, trying fallback 3:", e);
  }

  // 3. Google Translate Uç Noktası (Klasik GTX / at)
  try {
    const url3 = `https://translate.googleapis.com/translate_a/single?client=at&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
    const res3 = await fetch(url3);
    if (res3.ok) {
      const data3 = await res3.json();
      if (data3 && data3[0]) {
        return data3[0].map(item => item[0]).join("");
      }
    }
  } catch (e) {
    console.warn("Google endpoint 3 failed:", e);
  }

  // 4. Son Çare: MyMemory
  try {
    const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${encodeURIComponent(targetLang)}`;
    const fbRes = await fetch(fallbackUrl);
    if (fbRes.ok) {
      const fbData = await fbRes.json();
      if (fbData && fbData.responseData && fbData.responseData.translatedText) {
        return fbData.responseData.translatedText;
      }
    }
  } catch (e) { }

  return text;
}

// Content Script ve Popup'tan Gelen Mesaj Köprüsü
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "QUICK_TRANSLATE") {
    chrome.storage.local.get({ engine: "google" }, (res) => {
      const engine = request.engine || res.engine || "google";
      translateText(request.text, request.targetLang, engine)
        .then(translated => sendResponse({ success: true, translated }))
        .catch(error => sendResponse({ success: false, error: error.message }));
    });
    return true; // Asenkron cevap için true dönmeli
  }

  if (request.action === "GET_SETTINGS") {
    chrome.storage.local.get(DEFAULT_SETTINGS, (data) => {
      sendResponse(data);
    });
    return true;
  }

  if (request.action === "OPEN_ENGINE_TAB") {
    chrome.tabs.create({ url: request.url, active: false }, (newTab) => {
      if (!newTab || !newTab.id) return;
      
      const listener = (tabId, changeInfo) => {
        if (tabId === newTab.id && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);
          // Belirlenen motorla tam sayfa çevirisi başlat
          setTimeout(() => {
            chrome.tabs.sendMessage(newTab.id, {
              action: "TRANSLATE_PAGE",
              targetLang: request.targetLang || "tr",
              engine: request.engine
            }).catch(() => {
              chrome.scripting.executeScript({
                target: { tabId: newTab.id },
                files: ["src/content/content.js"]
              }).then(() => {
                chrome.tabs.sendMessage(newTab.id, {
                  action: "TRANSLATE_PAGE",
                  targetLang: request.targetLang || "tr",
                  engine: request.engine
                });
              });
            });
          }, 800);
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
    sendResponse({ status: "opening" });
    return true;
  }
});
