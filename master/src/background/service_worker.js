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
  engine: "lingva"
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

// İlk kurulum veya güncelleme
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(DEFAULT_SETTINGS);
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

// Çoklu Çeviri Motoru Sağlayıcısı (Google Translate, MyMemory, Lingva)
async function translateText(text, targetLang = "tr", engine = "google") {
  if (engine === "mymemory") {
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
  } else if (engine === "lingva") {
    try {
      const url = `https://lingva.ml/api/v1/auto/${encodeURIComponent(targetLang)}/${encodeURIComponent(text)}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && data.translation) {
          return data.translation;
        }
      }
    } catch (e) {
      console.warn("Lingva failed, fallback to Google:", e);
    }
  }

  // Varsayılan & Güçlü Motor: Google Translate
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Translation fetch failed: " + response.status);
  
  const data = await response.json();
  if (data && data[0]) {
    return data[0].map(item => item[0]).join("");
  }
  return "";
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
});
