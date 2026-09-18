/**
 * WebTranslate HaYTooL - Content Script
 * Sayfa İçi Tam Sayfa Çevirisi ve Seçili Metin HUD Balonu
 */

(() => {
  if (window.__webTranslateHaYTooL_Loaded) return;
  window.__webTranslateHaYTooL_Loaded = true;

  let currentFloatingHUD = null;
  let isPageTranslated = false;
  let originalHtmlLang = document.documentElement.lang;

  // Background servisinden gelen komutları dinle
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "TRANSLATE_PAGE") {
      injectPageTranslator(request.targetLang || "tr", request.engine || null);
      sendResponse({ status: "started" });
    } else if (request.action === "RESTORE_PAGE") {
      restoreOriginalPage();
      sendResponse({ status: "restored" });
    } else if (request.action === "SHOW_SELECTION_RESULT") {
      showSelectionHUD(request.originalText, request.translatedText, request.targetLang);
      sendResponse({ status: "shown" });
    }
  });

  // Sayfa İçi Tam Sayfa Çeviricisi (Canlı İlerleme Çubuğu & DOM Motoru)
  async function injectPageTranslator(targetLang = "tr", specificEngine = null) {
    // Sayfadaki tüm görünür metin düğümlerini topla
    const textNodes = [];
    const walk = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
          const val = node.nodeValue.trim();
          if (!val || val.length < 2) return NodeFilter.FILTER_REJECT;

          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          const tag = parent.tagName.toLowerCase();
          if (["script", "style", "noscript", "textarea", "input", "code", "pre"].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest(".haytool-selection-hud") || parent.closest(".haytool-notice-badge")) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let n;
    while ((n = walk.nextNode())) {
      textNodes.push(n);
    }

    if (textNodes.length === 0) {
      showNotificationBadge("Çevrilecek metin bulunamadı.");
      return;
    }

    const startTime = performance.now();

    // Canlı İlerleme HUD'unu başlat
    const progressHUD = showProgressHUD(textNodes.length, specificEngine);

    // Gruplar (batch) halinde arka plana gönderip çevir
    const BATCH_SIZE = 15;
    let translatedCount = 0;
    const totalBatches = Math.ceil(textNodes.length / BATCH_SIZE);

    for (let i = 0; i < textNodes.length; i += BATCH_SIZE) {
      const currentBatchNum = Math.floor(i / BATCH_SIZE) + 1;
      const batch = textNodes.slice(i, i + BATCH_SIZE);
      const textsToTranslate = batch.map(node => node.nodeValue.trim());

      // Metinleri özel bir ayırıcı ile birleştir
      const combinedText = textsToTranslate.join("\n\n---\n\n");

      try {
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage({
            action: "QUICK_TRANSLATE",
            text: combinedText,
            targetLang: targetLang,
            engine: specificEngine
          }, resolve);
        });

        if (response && response.success && response.translated) {
          const translatedParts = response.translated.split(/\n\s*---\s*\n/);
          batch.forEach((node, idx) => {
            if (translatedParts[idx]) {
              // Orijinal metni data niteliğinde sakla
              if (!node.__haytool_original) {
                node.__haytool_original = node.nodeValue;
              }
              node.nodeValue = translatedParts[idx].trim();
            }
          });
          translatedCount += batch.length;
        }
      } catch (e) {
        console.warn("Batch çeviri hatası:", e);
      }

      // Canlı ilerlemeyi güncelle
      const percent = Math.min(99, Math.round((currentBatchNum / totalBatches) * 100));
      progressHUD.update(percent, translatedCount, textNodes.length, currentBatchNum, totalBatches);
    }

    const durationSec = ((performance.now() - startTime) / 1000).toFixed(1);

    // Çeviri tamamlandı (%100)
    progressHUD.complete(translatedCount, durationSec);
    isPageTranslated = true;
  }

  // Orijinal sayfayı geri getir
  function restoreOriginalPage() {
    window.location.reload();
  }

  // Sağ tık veya seçim sonrası Floating HUD (Şık Glassmorphic Baloncuk)
  function showSelectionHUD(originalText, translatedText, targetLang) {
    removeFloatingHUD();

    const selection = window.getSelection();
    let top = 100;
    let left = 100;

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        top = rect.bottom + window.scrollY + 10;
        left = rect.left + window.scrollX;
      }
    }

    const hud = document.createElement("div");
    hud.className = "haytool-selection-hud";
    hud.style.top = `${top}px`;
    hud.style.left = `${Math.max(16, Math.min(left, window.innerWidth - 380))}px`;

    const iconUrl = chrome.runtime.getURL("src/assets/icons/icon32.png");

    hud.innerHTML = `
      <div class="haytool-hud-header">
        <div class="haytool-hud-brand">
          <img src="${iconUrl}" width="18" height="18" alt="Logo" />
          <span>WebTranslate HaYTooL</span>
        </div>
        <div class="haytool-hud-actions">
          <button class="haytool-hud-btn" id="haytool-copy-btn" title="Kopyala">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button class="haytool-hud-btn haytool-close" id="haytool-close-btn" title="Kapat">✕</button>
        </div>
      </div>
      <div class="haytool-hud-body">
        <div class="haytool-hud-target">${escapeHtml(translatedText)}</div>
        <div class="haytool-hud-source">${escapeHtml(originalText)}</div>
      </div>
    `;

    document.body.appendChild(hud);
    currentFloatingHUD = hud;

    // Kopyalama butonu
    hud.querySelector("#haytool-copy-btn").addEventListener("click", () => {
      navigator.clipboard.writeText(translatedText).then(() => {
        const btn = hud.querySelector("#haytool-copy-btn");
        btn.innerHTML = `<span style="font-size:11px;color:#10b981;font-weight:bold;">✓</span>`;
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        }, 1500);
      });
    });

    // Kapatma
    hud.querySelector("#haytool-close-btn").addEventListener("click", removeFloatingHUD);

    // Dışarı tıklanınca kapat
    const outsideClick = (e) => {
      if (!hud.contains(e.target)) {
        removeFloatingHUD();
        document.removeEventListener("mousedown", outsideClick);
      }
    };
    setTimeout(() => document.addEventListener("mousedown", outsideClick), 50);
  }

  function removeFloatingHUD() {
    if (currentFloatingHUD) {
      currentFloatingHUD.remove();
      currentFloatingHUD = null;
    }
  }

  // Canlı Sayfa Çeviri İlerleme Paneli (Live Progress HUD)
  function showProgressHUD(totalNodes, specificEngine = null) {
    const existing = document.querySelector(".haytool-progress-hud");
    if (existing) existing.remove();

    const engineNames = {
      google: "Google Translate",
      deepl: "DeepL Translate",
      bing: "Bing Translator",
      duckduckgo: "DuckDuckGo",
      mymemory: "MyMemory",
      lingva: "Lingva"
    };
    const engineLabel = specificEngine && engineNames[specificEngine] ? ` (${engineNames[specificEngine]})` : "";

    const hud = document.createElement("div");
    hud.className = "haytool-notice-badge haytool-progress-hud";
    hud.innerHTML = `
      <div class="haytool-progress-header">
        <div class="haytool-progress-title">
          <span class="haytool-spinner"></span>
          <span>Sayfa Çevriliyor${engineLabel}...</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="haytool-progress-percent">0%</span>
          <button type="button" class="haytool-hud-close" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;font-size:14px;padding:0 2px;line-height:1;" title="Kapat">×</button>
        </div>
      </div>
      <div class="haytool-progress-track">
        <div class="haytool-progress-fill" style="width: 0%;"></div>
      </div>
      <div class="haytool-progress-sub">
        <span class="haytool-status-label">Başlatılıyor...</span>
        <span class="haytool-count-label">0 / ${totalNodes}</span>
      </div>
    `;

    document.body.appendChild(hud);

    const fillEl = hud.querySelector(".haytool-progress-fill");
    const percentEl = hud.querySelector(".haytool-progress-percent");
    const statusLabel = hud.querySelector(".haytool-status-label");
    const countLabel = hud.querySelector(".haytool-count-label");
    const titleEl = hud.querySelector(".haytool-progress-title");
    const closeBtn = hud.querySelector(".haytool-hud-close");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        hud.classList.add("fade-out");
        setTimeout(() => hud.remove(), 300);
      });
    }

    return {
      update: (percent, currentCount, total, currentBatch, totalBatches) => {
        if (fillEl) fillEl.style.width = `${percent}%`;
        if (percentEl) percentEl.textContent = `${percent}%`;
        if (statusLabel) statusLabel.textContent = `Grup ${currentBatch}/${totalBatches}`;
        if (countLabel) countLabel.textContent = `${currentCount} / ${total}`;
      },
      complete: (totalDone, durationSec = null) => {
        if (fillEl) {
          fillEl.style.width = "100%";
          fillEl.style.background = "linear-gradient(90deg, #10b981, #34d399)";
        }
        if (percentEl) {
          percentEl.textContent = "100%";
          percentEl.style.color = "#34d399";
        }
        const timeText = durationSec ? ` (${durationSec} sn)` : "";
        const engineShort = specificEngine ? `[${engineNames[specificEngine] || specificEngine}] ` : "";

        // 1. Tarayıcı Sekme Başlığına Kalıcı Olarak Yaz (Sekmeler arasında gezerken anında görünür!)
        if (specificEngine) {
          const cleanTitle = document.title.replace(/^\[.*?\]\s*/, "");
          document.title = `[⚡ ${durationSec}s | ${engineNames[specificEngine]}] ${cleanTitle}`;
        }

        // 2. HUD'u Şık ve Kalıcı Sonuç Rozetine Dönüştür
        if (titleEl) {
          titleEl.innerHTML = `<span style="color:#34d399;font-weight:bold;font-size:15px;">✓</span> <span style="color:#34d399;font-weight:700;">${engineNames[specificEngine] || "Çeviri"}</span>`;
        }
        if (statusLabel) {
          statusLabel.innerHTML = `<span style="color:#38bdf8;font-weight:700;font-size:12px;">⚡ Süre: ${durationSec || '0.5'} saniye</span>`;
        }
        if (countLabel) {
          countLabel.textContent = `${totalDone} bölüm`;
        }

        // Çoklu sekme modunda (specificEngine varsa) hemen kaybolmasın, kullanıcı inceleyene kadar (veya kapat butonuna basana kadar) ekranda kalsın!
        if (specificEngine) {
          hud.style.borderColor = "rgba(16, 185, 129, 0.4)";
          hud.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.25)";
          // 40 saniye sonra yavaşça kaybolur, kapatmak isterse '×' butonu var
          setTimeout(() => {
            if (hud && hud.parentNode) {
              hud.classList.add("fade-out");
              setTimeout(() => hud.remove(), 400);
            }
          }, 40000);
        } else {
          setTimeout(() => {
            if (hud && hud.parentNode) {
              hud.classList.add("fade-out");
              setTimeout(() => hud.remove(), 400);
            }
          }, 3500);
        }
      }
    };
  }

  // Bildirim rozeti
  function showNotificationBadge(msg) {
    const badge = document.createElement("div");
    badge.className = "haytool-notice-badge";
    badge.textContent = msg;
    document.body.appendChild(badge);
    setTimeout(() => {
      badge.classList.add("fade-out");
      setTimeout(() => badge.remove(), 400);
    }, 2000);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
