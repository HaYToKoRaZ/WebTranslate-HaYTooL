/**
 * WebTranslate HaYTooL - Options JS
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Çoklu dil metinlerini yükle
  applyLocalization();

  const appLangInput = document.getElementById("appLang");
  const targetLangInput = document.getElementById("targetLang");
  const engineSelect = document.getElementById("engine");
  const showSelectionHUDCheck = document.getElementById("showSelectionHUD");
  const showContextMenuCheck = document.getElementById("showContextMenu");
  const btnSave = document.getElementById("btn-save");
  const themeSelect = document.getElementById("theme");
  const saveStatus = document.getElementById("save-status");

  const appLangCards = document.querySelectorAll("[data-applang]");
  const brandLink = document.getElementById("brand-link");
  const appVersionSpan = document.getElementById("app-version");

  // Manifest'ten sürüm bilgisini dinamik al
  try {
    const manifest = chrome.runtime.getManifest();
    if (manifest && manifest.version && appVersionSpan) {
      appVersionSpan.textContent = `v${manifest.version}`;
    }
  } catch (e) {}

  // Logo / Başlığa tıklandığında resmi siteyi aç
  if (brandLink) {
    brandLink.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: "https://haytokoraz.github.io/" });
    });
  }

  // Tarayıcı/Sistem dilini algıla
  let detectedTarget = "tr";
  try {
    const sysLang = (chrome.i18n.getUILanguage() || "tr").toLowerCase().split("-")[0];
    if (TARGET_LANG_MAP && TARGET_LANG_MAP[sysLang]) {
      detectedTarget = sysLang;
    }
  } catch (e) {}

  // Mevcut ayarları çek
  const defaults = {
    appLang: detectedTarget === "en" ? "en" : "tr",
    targetLang: detectedTarget,
    engine: "google",
    theme: "system",
    showSelectionHUD: true,
    showContextMenu: true,
    deeplApiKey: "",
    blacklistDomains: []
  };

  const current = await chrome.storage.local.get(defaults);
  appLangInput.value = current.appLang || "tr";
  targetLangInput.value = current.targetLang || "tr";
  engineSelect.value = current.engine || "google";
  themeSelect.value = current.theme || "system";
  showSelectionHUDCheck.checked = current.showSelectionHUD;
  showContextMenuCheck.checked = current.showContextMenu;

  const blacklistTextarea = document.getElementById("blacklistDomains");
  const blacklistBadge = document.getElementById("blacklist-count-badge");

  function updateBlacklistUI(list) {
    if (blacklistTextarea && list) {
      blacklistTextarea.value = Array.isArray(list) ? list.join("\n") : "";
    }
    if (blacklistBadge) {
      const count = Array.isArray(list) ? list.filter(d => d && d.trim()).length : 0;
      blacklistBadge.textContent = `${count} site`;
    }
  }

  updateBlacklistUI(current.blacklistDomains || []);

  if (blacklistTextarea) {
    blacklistTextarea.addEventListener("input", () => {
      const domains = blacklistTextarea.value
        .split("\n")
        .map(d => d.trim().toLowerCase())
        .filter(d => d.length > 0);
      
      // Tekrarları kaldır
      const uniqueDomains = Array.from(new Set(domains));
      chrome.storage.local.set({ blacklistDomains: uniqueDomains }, () => {
        if (blacklistBadge) blacklistBadge.textContent = `${uniqueDomains.length} site`;
        showSavedToast();
      });
    });
  }

  const optBadge = document.getElementById("opt-detected-badge");
  if (optBadge) {
    optBadge.textContent = `${(chrome.i18n.getUILanguage() || detectedTarget).toUpperCase()}`;
  }

  const deeplKeyInput = document.getElementById("deeplApiKey");
  const btnToggleKey = document.getElementById("btn-toggle-key");
  if (deeplKeyInput) {
    deeplKeyInput.value = current.deeplApiKey || "";
    deeplKeyInput.addEventListener("input", () => {
      chrome.storage.local.set({ deeplApiKey: deeplKeyInput.value }, showSavedToast);
    });
  }

  if (btnToggleKey && deeplKeyInput) {
    btnToggleKey.addEventListener("click", () => {
      deeplKeyInput.type = deeplKeyInput.type === "password" ? "text" : "password";
      btnToggleKey.textContent = deeplKeyInput.type === "password" ? "👁" : "🔒";
    });
  }

  const versionBadge = document.getElementById("app-version");
  if (versionBadge && chrome.runtime.getManifest) {
    const manifest = chrome.runtime.getManifest();
    versionBadge.textContent = `v${manifest.version || "1.0.0"}`;
  }

  let toastTimer = null;
  function showSavedToast() {
    if (!saveStatus) return;
    saveStatus.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      saveStatus.classList.add("hidden");
    }, 1800);
  }

  // Anlık Aktif Kullanıcı Göstergesi (Universal Chrome & Edge Storage API)
  const browserAPI = (typeof chrome !== "undefined" && chrome.storage) ? chrome : (typeof browser !== "undefined" ? browser : null);
  const activeUsersCountEl = document.getElementById("active-users-count");
  if (activeUsersCountEl && browserAPI) {
    try {
      browserAPI.storage.local.get({ activeUserCount: 1 }, (res) => {
        // En az 1 (kullanıcının kendisi), sade ve göz yormayan gösterim
        const val = Math.max(1, res.activeUserCount || 1);
        activeUsersCountEl.textContent = val.toString();
      });
    } catch (e) {
      activeUsersCountEl.textContent = "1";
    }
  }

  // Hedef dil değiştiğinde anında kaydet ve sağ tık menüsünü güncelle
  targetLangInput.addEventListener("change", () => {
    chrome.storage.local.set({ targetLang: targetLangInput.value }, showSavedToast);
  });

  // Çeviri motoru kartları etkileşimi
  const engineCards = document.querySelectorAll(".engine-card");
  function updateEngineCards(activeEngine) {
    engineCards.forEach(card => {
      if (card.getAttribute("data-engine") === activeEngine) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  }

  updateEngineCards(engineSelect.value);

  engineCards.forEach(card => {
    card.addEventListener("click", () => {
      const selectedEngine = card.getAttribute("data-engine");
      engineSelect.value = selectedEngine;
      updateEngineCards(selectedEngine);
      chrome.storage.local.set({ engine: selectedEngine }, showSavedToast);
    });
  });

  // Çeviri motoru inputu doğrudan değişirse (geriye uyumluluk)
  engineSelect.addEventListener("change", () => {
    updateEngineCards(engineSelect.value);
    chrome.storage.local.set({ engine: engineSelect.value }, showSavedToast);
  });

  // Temayı başlat
  applyTheme(themeSelect.value);

  themeSelect.addEventListener("change", () => {
    applyTheme(themeSelect.value);
    chrome.storage.local.set({ theme: themeSelect.value }, showSavedToast);
  });

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      // Sistem temasını algıla
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", isSystemDark ? "dark" : "light");
    }
  }

  // Başlangıç bayrak seçimini aktif et (Uygulama dili)
  updateAppLangCards(appLangInput.value);

  // 1. Uygulama Dili Bayrak Kartları Tıklama (TR / EN)
  appLangCards.forEach(card => {
    card.addEventListener("click", () => {
      const selectedAppLang = card.getAttribute("data-applang");
      appLangInput.value = selectedAppLang;
      updateAppLangCards(selectedAppLang);
      // Tercih edilen dile göre arayüz metinlerini anında güncelle
      applyDynamicLocalization(selectedAppLang);
      chrome.storage.local.set({ appLang: selectedAppLang }, showSavedToast);
    });
  });

  // Switch ve checkboxlar değiştiğinde anında kaydet
  showSelectionHUDCheck.addEventListener("change", () => {
    chrome.storage.local.set({ showSelectionHUD: showSelectionHUDCheck.checked }, showSavedToast);
  });

  showContextMenuCheck.addEventListener("change", () => {
    chrome.storage.local.set({ showContextMenu: showContextMenuCheck.checked }, showSavedToast);
  });

  function updateAppLangCards(activeLang) {
    appLangCards.forEach(card => {
      if (card.getAttribute("data-applang") === activeLang) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  }

  // Varsa manuel buton desteği (geriye uyumluluk)
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      const updated = {
        appLang: appLangInput.value,
        targetLang: targetLangInput.value,
        engine: engineSelect.value,
        theme: themeSelect.value,
        showSelectionHUD: showSelectionHUDCheck.checked,
        showContextMenu: showContextMenuCheck.checked
      };

      chrome.storage.local.set(updated, showSavedToast);
    });
  }

  // Dillerin TR ve EN karşılıkları (Hedef dil açılır menüsünün diliyle tam uyum sağlamak için)
  const TARGET_LANG_MAP = {
    tr: { tr: "Türkçe", en: "Turkish", native: "Türkçe" },
    en: { tr: "İngilizce", en: "English", native: "English" },
    az: { tr: "Azerbaycan Türkçesi", en: "Azerbaijani", native: "Azərbaycan" },
    de: { tr: "Almanca", en: "German", native: "Deutsch" },
    fr: { tr: "Fransızca", en: "French", native: "Français" },
    es: { tr: "İspanyolca", en: "Spanish", native: "Español" },
    it: { tr: "İtalyanca", en: "Italian", native: "Italiano" },
    pt: { tr: "Portekizce", en: "Portuguese", native: "Português" },
    ru: { tr: "Rusça", en: "Russian", native: "Русский" },
    uk: { tr: "Ukraynaca", en: "Ukrainian", native: "Українська" },
    pl: { tr: "Lehçe", en: "Polish", native: "Polski" },
    nl: { tr: "Felemenkçe", en: "Dutch", native: "Nederlands" },
    ar: { tr: "Arapça", en: "Arabic", native: "العربية" },
    fa: { tr: "Farsça", en: "Persian", native: "فارسی" },
    ja: { tr: "Japonca", en: "Japanese", native: "日本語" },
    ko: { tr: "Korece", en: "Korean", native: "한국어" },
    zh: { tr: "Çince (Basitleştirilmiş)", en: "Chinese (Simplified)", native: "中文" },
    el: { tr: "Yunanca", en: "Greek", native: "Ελληνικά" },
    hi: { tr: "Hintçe", en: "Hindi", native: "हिन्दी" },
    ur: { tr: "Urduca", en: "Urdu", native: "اردو" },
    bn: { tr: "Bengalce", en: "Bengali", native: "বাংলা" },
    sv: { tr: "İsveççe", en: "Swedish", native: "Svenska" },
    no: { tr: "Norveççe", en: "Norwegian", native: "Norsk" },
    da: { tr: "Danca", en: "Danish", native: "Dansk" },
    fi: { tr: "Fince", en: "Finnish", native: "Suomi" },
    cs: { tr: "Çekçe", en: "Czech", native: "Čeština" },
    ro: { tr: "Romence", en: "Romanian", native: "Română" },
    hu: { tr: "Macarca", en: "Hungarian", native: "Magyar" },
    bg: { tr: "Bulgarca", en: "Bulgarian", native: "Български" },
    sr: { tr: "Sırpça", en: "Serbian", native: "Српски" },
    hr: { tr: "Hırvatça", en: "Croatian", native: "Hrvatski" },
    sk: { tr: "Slovakça", en: "Slovak", native: "Slovenčina" },
    sl: { tr: "Slovence", en: "Slovenian", native: "Slovenščina" },
    id: { tr: "Endonezce", en: "Indonesian", native: "Bahasa Indonesia" },
    ms: { tr: "Malayca", en: "Malay", native: "Bahasa Melayu" },
    vi: { tr: "Vietnamca", en: "Vietnamese", native: "Tiếng Việt" },
    th: { tr: "Tayca", en: "Thai", native: "ไทย" },
    he: { tr: "İbranice", en: "Hebrew", native: "עברית" },
    kk: { tr: "Kazakça", en: "Kazakh", native: "Қазақ тілі" },
    uz: { tr: "Özbekçe", en: "Uzbek", native: "Oʻzbekcha" },
    lt: { tr: "Litvanca", en: "Lithuanian", native: "Lietuvių" },
    lv: { tr: "Letonca", en: "Latvian", native: "Latviešu" },
    et: { tr: "Estonca", en: "Estonian", native: "Eesti" },
    ka: { tr: "Gürcüce", en: "Georgian", native: "ქართული" }
  };

  // Dinamik / Manuel Yerelleştirme Sözlüğü
  async function applyDynamicLocalization(lang) {
    try {
      const url = chrome.runtime.getURL(`_locales/${lang}/messages.json`);
      const res = await fetch(url);
      if (res.ok) {
        const msgs = await res.json();
        document.querySelectorAll("[data-i18n]").forEach(elem => {
          const key = elem.getAttribute("data-i18n");
          if (msgs[key] && msgs[key].message) {
            elem.textContent = msgs[key].message;
          }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(elem => {
          const key = elem.getAttribute("data-i18n-placeholder");
          if (msgs[key] && msgs[key].message) {
            elem.setAttribute("placeholder", msgs[key].message);
          }
        });

        // Sayfa sekme başlığını güncelle
        if (msgs["optionsHeading"] && msgs["optionsHeading"].message) {
          document.title = `WebTranslate HaYTooL - ${msgs["optionsHeading"].message}`;
        }
      }

      // Hedef dil listesindeki etiketleri seçilen uygulama diline (TR/EN) göre güncelle
      Array.from(targetLangInput.options).forEach(opt => {
        const item = TARGET_LANG_MAP[opt.value];
        if (item) {
          const transName = item[lang] || item["en"];
          opt.textContent = `${item.native} (${transName})`;
        }
      });
    } catch (e) {
      console.warn("Locale load error:", e);
    }
  }

  function applyLocalization() {
    chrome.storage.local.get({ appLang: "tr" }, (res) => {
      applyDynamicLocalization(res.appLang);
    });
  }
});

