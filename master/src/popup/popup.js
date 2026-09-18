/**
 * WebTranslate HaYTooL - Popup JS
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Çoklu Dil (i18n) Başlatıcı
  applyLocalization();

  const selectTargetLang = document.getElementById("select-target-lang");
  const btnTranslatePage = document.getElementById("btn-translate-page");
  const btnRestorePage = document.getElementById("btn-restore-page");
  const btnSettings = document.getElementById("btn-settings");
  const quickInput = document.getElementById("quick-input");
  const btnQuickTranslate = document.getElementById("btn-quick-translate");
  const resultCard = document.getElementById("quick-result-card");
  const resultText = document.getElementById("quick-result-text");
  const btnCopyResult = document.getElementById("btn-copy-result");

  // Sistem / Tarayıcı Dilini Algıla
  let detectedTarget = "tr";
  try {
    const sysLang = (chrome.i18n.getUILanguage() || "tr").toLowerCase().split("-")[0];
    if (sysLang) detectedTarget = sysLang;
  } catch (e) {}

  // Kayıtlı ayarları çek (Dil, Tema ve Çeviri Motoru)
  const { targetLang, theme, engine } = await chrome.storage.local.get({
    targetLang: detectedTarget,
    theme: "system",
    engine: "google"
  });

  const detectedBadge = document.getElementById("detected-badge");
  if (detectedBadge) {
    detectedBadge.textContent = `${(chrome.i18n.getUILanguage() || detectedTarget).toUpperCase()}`;
  }

  if (selectTargetLang) {
    selectTargetLang.value = targetLang;
  }

  // Çeviri Motoru Pill Seçimi
  const enginePills = document.querySelectorAll(".engine-pill");
  function updatePopupEnginePills(activeEngine) {
    enginePills.forEach(pill => {
      if (pill.getAttribute("data-engine") === activeEngine) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }

  updatePopupEnginePills(engine || "google");

  enginePills.forEach(pill => {
    pill.addEventListener("click", () => {
      const selected = pill.getAttribute("data-engine");
      updatePopupEnginePills(selected);
      chrome.storage.local.set({ engine: selected });
    });
  });

  // Temayı algıla ve uygula
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", isSystemDark ? "dark" : "light");
  }

  // Dil seçimi değiştiğinde kaydet
  selectTargetLang.addEventListener("change", () => {
    const newLang = selectTargetLang.value;
    chrome.storage.local.set({ targetLang: newLang });
  });

  // Ayarlar ikonuna tıklama
  btnSettings.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  // Sayfayı Çevir butonu
  btnTranslatePage.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    btnTranslatePage.style.opacity = "0.7";
    btnTranslatePage.textContent = "...";

    chrome.tabs.sendMessage(tab.id, {
      action: "TRANSLATE_PAGE",
      targetLang: selectTargetLang.value
    }).catch(err => {
      // Content script enjekte et ve tekrar yolla
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/content/content.js"]
      }).then(() => {
        chrome.tabs.sendMessage(tab.id, {
          action: "TRANSLATE_PAGE",
          targetLang: selectTargetLang.value
        });
      });
    }).finally(() => {
      setTimeout(() => window.close(), 600);
    });
  });

  // Orijinal Sayfayı Göster
  btnRestorePage.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(tab.id, { action: "RESTORE_PAGE" }).catch(() => {
      chrome.tabs.reload(tab.id);
    });
    window.close();
  });

  // Hızlı Metin Çevirisi
  async function performQuickTranslate() {
    const text = quickInput.value.trim();
    if (!text) return;

    btnQuickTranslate.disabled = true;
    btnQuickTranslate.style.opacity = "0.5";

    chrome.runtime.sendMessage({
      action: "QUICK_TRANSLATE",
      text: text,
      targetLang: selectTargetLang.value
    }, (response) => {
      btnQuickTranslate.disabled = false;
      btnQuickTranslate.style.opacity = "1";

      if (response && response.success) {
        resultText.textContent = response.translated;
        resultCard.classList.remove("hidden");
      } else {
        resultText.textContent = "Hata oluştu veya çevrilemedi.";
        resultCard.classList.remove("hidden");
      }
    });
  }

  btnQuickTranslate.addEventListener("click", performQuickTranslate);
  quickInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      performQuickTranslate();
    }
  });

  // Sonucu Kopyala
  btnCopyResult.addEventListener("click", () => {
    if (resultText.textContent) {
      navigator.clipboard.writeText(resultText.textContent).then(() => {
        btnCopyResult.innerHTML = "✓";
        setTimeout(() => {
          btnCopyResult.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        }, 1500);
      });
    }
  });

  // Yerelleştirme Fonksiyonu (Kullanıcının seçtiği appLang'a göre dinamik)
  async function applyLocalization() {
    try {
      const { appLang } = await chrome.storage.local.get({ appLang: "tr" });
      const url = chrome.runtime.getURL(`_locales/${appLang}/messages.json`);
      const res = await fetch(url);
      if (res.ok) {
        const msgs = await res.json();
        document.querySelectorAll("[data-i18n]").forEach(elem => {
          const key = elem.getAttribute("data-i18n");
          if (msgs[key] && msgs[key].message) elem.textContent = msgs[key].message;
        });

        document.querySelectorAll("[data-i18n-title]").forEach(elem => {
          const key = elem.getAttribute("data-i18n-title");
          if (msgs[key] && msgs[key].message) elem.setAttribute("title", msgs[key].message);
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(elem => {
          const key = elem.getAttribute("data-i18n-placeholder");
          if (msgs[key] && msgs[key].message) elem.setAttribute("placeholder", msgs[key].message);
        });
      }
    } catch (e) {
      // Fallback native
      document.querySelectorAll("[data-i18n]").forEach(elem => {
        const key = elem.getAttribute("data-i18n");
        const msg = chrome.i18n.getMessage(key);
        if (msg) elem.textContent = msg;
      });
    }
  }
});
