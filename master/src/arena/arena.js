/**
 * HaYTooL Engine Arena - 6 Motorlu Karşılaştırma & Hız Testi (Benchmark JS)
 */

document.addEventListener("DOMContentLoaded", async () => {
  const benchmarkText = document.getElementById("benchmark-text");
  const arenaTargetLang = document.getElementById("arena-target-lang");
  const btnStart = document.getElementById("btn-start-benchmark");
  const btnComparePage = document.getElementById("btn-compare-page");
  const toast = document.getElementById("toast");

  const engines = ["google", "deepl", "bing", "duckduckgo", "mymemory", "lingva"];

  // Varsayılan kayıtlı hedef dili ve aktif motoru yükle
  const { targetLang, engine: defaultEngine } = await chrome.storage.local.get({
    targetLang: "tr",
    engine: "google"
  });

  if (arenaTargetLang) arenaTargetLang.value = targetLang;

  // URL'den veya query parametresinden metin geldiyse doldur
  const urlParams = new URLSearchParams(window.location.search);
  const paramText = urlParams.get("text");
  if (paramText) {
    benchmarkText.value = paramText;
  } else {
    // Varsayılan ilginç bir kıyaslama metni
    benchmarkText.value = "Artificial intelligence is not just a tool for automation; it is a catalyst that bridges human curiosity with the vast ocean of global knowledge, transforming how we communicate across borders.";
  }

  updateDefaultEngineBadges(defaultEngine);

  // Örnek Metin Butonları
  const samples = {
    technology: "Quantum computing harnesses the strange properties of quantum mechanics to solve complex problems that are beyond the reach of classical supercomputers.",
    literature: "The autumn leaves whispered secrets to the twilight wind, painting the cobblestone path with shades of amber, crimson, and memories of a forgotten summer.",
    casual: "Hey! Could you send me the project report by tomorrow afternoon? Let me know if you need any help with the slides."
  };

  document.querySelectorAll(".sample-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-sample");
      if (samples[type]) {
        benchmarkText.value = samples[type];
      }
    });
  });

  // Varsayılan motor butonları durumu
  function updateDefaultEngineBadges(active) {
    document.querySelectorAll(".set-default-btn").forEach(btn => {
      const eng = btn.getAttribute("data-engine");
      const card = btn.closest(".engine-card");
      if (eng === active) {
        btn.textContent = "✓ Varsayılan";
        btn.classList.add("is-default");
        if (card) card.classList.add("active-default");
      } else {
        btn.textContent = "Varsayılan Yap";
        btn.classList.remove("is-default");
        if (card) card.classList.remove("active-default");
      }
    });
  }

  // Varsayılan Motor Değiştirme Butonları
  document.querySelectorAll(".set-default-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-engine");
      chrome.storage.local.set({ engine: selected });
      updateDefaultEngineBadges(selected);
      showToast(`🎉 ${selected.toUpperCase()} artık varsayılan çeviri motorunuz!`);
    });
  });

  // 6 Motorlu Canlı Benchmark Yarışını Başlat
  btnStart.addEventListener("click", () => {
    runBenchmark();
  });

  async function runBenchmark() {
    const text = benchmarkText.value.trim();
    if (!text) {
      showToast("Lütfen test edilecek bir metin girin!");
      return;
    }

    const target = arenaTargetLang.value;

    btnStart.disabled = true;
    btnStart.style.opacity = "0.6";
    btnStart.querySelector("span").textContent = "Yarış Devam Ediyor...";

    // Tüm kartları 'Çalışıyor' durumuna getir
    engines.forEach(eng => {
      const speedEl = document.getElementById(`speed-${eng}`);
      const outputEl = document.getElementById(`output-${eng}`);
      const statusEl = document.getElementById(`status-${eng}`);

      if (speedEl) {
        speedEl.className = "speed-badge";
        speedEl.textContent = "⏱ Ölçülüyor...";
      }
      if (outputEl) outputEl.textContent = "Çevriliyor, lütfen bekleyin...";
      if (statusEl) statusEl.textContent = "🟡 İstek Gönderildi";
    });

    const startTime = performance.now();
    let fastestTime = Infinity;
    let fastestEngine = null;

    // 6 motoru tamamen paralel olarak yarıştır (Promise.allSettled)
    const benchmarkPromises = engines.map(async (eng) => {
      const engineStart = performance.now();
      try {
        const res = await new Promise((resolve) => {
          chrome.runtime.sendMessage({
            action: "QUICK_TRANSLATE",
            text: text,
            targetLang: target,
            engine: eng
          }, resolve);
        });

        const elapsed = Math.round(performance.now() - engineStart);
        const speedEl = document.getElementById(`speed-${eng}`);
        const outputEl = document.getElementById(`output-${eng}`);
        const statusEl = document.getElementById(`status-${eng}`);

        if (res && res.success && res.translated) {
          if (speedEl) speedEl.textContent = `⚡ ${elapsed} ms`;
          if (outputEl) outputEl.textContent = res.translated;
          if (statusEl) statusEl.textContent = `🟢 Başarılı (${res.translated.length} karakter)`;

          if (elapsed < fastestTime) {
            fastestTime = elapsed;
            fastestEngine = eng;
          }
        } else {
          if (speedEl) speedEl.textContent = `❌ Hata (${elapsed}ms)`;
          if (outputEl) outputEl.textContent = res && res.error ? `Hata: ${res.error}` : "Çeviri yanıtı alınamadı veya API anahtarı eksik.";
          if (statusEl) statusEl.textContent = "🔴 Başarısız";
        }
      } catch (err) {
        const elapsed = Math.round(performance.now() - engineStart);
        const speedEl = document.getElementById(`speed-${eng}`);
        const outputEl = document.getElementById(`output-${eng}`);
        const statusEl = document.getElementById(`status-${eng}`);

        if (speedEl) speedEl.textContent = `❌ ${elapsed}ms`;
        if (outputEl) outputEl.textContent = `Bağlantı hatası: ${err.message}`;
        if (statusEl) statusEl.textContent = "🔴 Hata";
      }
    });

    await Promise.allSettled(benchmarkPromises);

    // En hızlı motor rozetini yeşil parlat
    if (fastestEngine) {
      const fastestBadge = document.getElementById(`speed-${fastestEngine}`);
      if (fastestBadge) {
        fastestBadge.classList.add("fastest");
        fastestBadge.textContent = `🏆 ${fastestBadge.textContent} (En Hızlı)`;
      }
    }

    btnStart.disabled = false;
    btnStart.style.opacity = "1";
    btnStart.querySelector("span").textContent = "Yeniden Yarıştır (Başlat)";
    showToast(`🏁 Karşılaştırma tamamlandı! En hızlı motor: ${fastestEngine ? fastestEngine.toUpperCase() : 'Bilinmiyor'}`);
  }

  // 2. Özellik: Aktif Sayfayı 6 Sekmede 6 Farklı Motorla Açma
  if (btnComparePage) {
    btnComparePage.addEventListener("click", async () => {
      // Aktif sayfayı bul
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      let targetUrl = "https://en.wikipedia.org/wiki/Artificial_intelligence";

      // Arena sekmesi haricindeki son aktif web sayfasını bul
      const allTabs = await chrome.tabs.query({ currentWindow: true });
      const webTab = allTabs.find(t => t.url && !t.url.startsWith("chrome-extension://") && !t.url.startsWith("edge://") && !t.url.startsWith("chrome://"));
      if (webTab && webTab.url) {
        targetUrl = webTab.url;
      }

      showToast("🚀 6 sekme açılıyor ve her birinde farklı çeviri motoru başlatılıyor...");

      // 6 sekme oluştur
      for (const eng of engines) {
        chrome.runtime.sendMessage({
          action: "OPEN_ENGINE_TAB",
          url: targetUrl,
          engine: eng,
          targetLang: arenaTargetLang.value
        });
      }
    });
  }

  // Toast Bildirim Fonksiyonu
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }

  // Sayfa açıldığında otomatik 1 kere yarışı başlat
  setTimeout(runBenchmark, 400);
});
