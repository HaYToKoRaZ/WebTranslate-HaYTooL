/**
 * WebTranslate HaYTooL - Websites Landing Page Script
 * Çoklu Dil Sözlüğü ve Etkileşimler
 */

const translations = {
  tr: {
    navFeatures: "Özellikler",
    navHow: "Nasıl Çalışır?",
    navPrivacy: "Gizlilik",
    navOtherApps: "🌐 Diğer Uygulamalar",
    heroBadge: "⚡ Manifest V3 & Modern Tarayıcı Uyumlu",
    heroTitle: 'Web Sayfalarını <br /><span class="gradient-text">Işık Hızında</span> Çevirin',
    heroSubtitle: "Tarayıcınızda dilediğiniz sayfada sağ tıklayarak sayfayı tek tıkla çevirin veya seçtiğiniz metinleri zarif bir baloncuk içinde anında görüntüleyin.",
    storeSubStore: "Son Sürüm (Releases)",
    storeNameStore: "Paketi İndir (.ZIP)",
    featHeading: "Neler Sunuyor?",
    featSub: "Hızlı, gizlilik odaklı ve modern web çevirmeni.",
    feat1Title: "Canlı İlerlemeli Sayfa Çevirisi",
    feat1Desc: "Sağ tıklayıp 'Bu Sayfayı Çevir' demeniz yeterli. Canlı yüzde çubuğuyla sayfa düzenini bozmadan anında hedef dilinize çevirir.",
    feat2Title: "Seçili Metin Çevirisi (Floating HUD)",
    feat2Desc: "Bir kelime veya paragraf seçin; hemen yanında beliren şık cam efektli baloncukta orijinal ve çeviri metnini anında görün.",
    feat3Title: "6 Güçlü Çeviri Motoru",
    feat3Desc: "Google Translate (Varsayılan), DeepL AI, Bing, DuckDuckGo, MyMemory ve Lingva entegrasyonuyla kesintisiz çeviri.",
    feat4Title: "Sıfır Telemetri & %100 Gizlilik",
    feat4Desc: "Ziyaret ettiğiniz siteler veya çevirdiğiniz metinler asla üçüncü taraf sunucularda saklanmaz. Yalnızca tarayıcınızda çalışır.",
    feat5Title: "45+ Dünya Dili Desteği",
    feat5Desc: "Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, Rusça, Arapça ve daha fazlası arasında tek tıkla geçiş yapın.",
    feat6Title: "Ultra Hafif & Hızlı",
    feat6Desc: "Ağır kütüphaneler içermez, sıfır gecikmeyle açılır ve tarayıcınızı asla yormaz.",
    feat7Title: "HaYTooL Engine Arena (Hız & Kalite Kıyaslama)",
    feat7Desc: "6 çeviri motorunu aynı anda yarıştırın; milisaniye hızlarını ve çevirilerini canlı karşılaştırarak en beğendiğinizi tek tıkla varsayılan yapın.",
    feat8Title: "Çift Yönlü Dil Değişimi (Swap ⇄)",
    feat8Desc: "Tek tıkla kaynak ve hedef dilleri yer değiştirin; Türkçe'den İngilizce'ye ya da tersine ışık hızında çeviri yapın.",
    feat9Title: "Sayfayı 6 Sekmede Canlı Açma",
    feat9Desc: "Aktif web sayfasını aynı anda 6 farklı sekmede 6 motorla açıp sekme başlığında ve kalıcı HUD'da hız ve çevirileri canlı kıyaslayın.",
    feat10Title: "Hariç Tutulan Siteler (Blacklist)",
    feat10Desc: "Banka, intranet veya kod sitelerini ayarlardan tek liste halinde hariç tutun veya popup'tan tek tıkla o sitede çeviriyi kapatın.",
    howHeading: "Nasıl Kullanılır?",
    howSub: "Saniyeler içinde kurun ve kullanmaya başlayın.",
    step1Title: "Eklentiyi Ekleyin",
    step1Desc: "WebTranslate HaYTooL'u tarayıcınıza tek tıkla ekleyin.",
    step2Title: "Hedef Dili Seçin",
    step2Desc: "Popup menüsünden veya ayarlardan hedef dilinizi (örneğin Türkçe) belirleyin.",
    step3Title: "Sağ Tıklayın & Çevirin",
    step3Desc: "Sayfada herhangi bir yere veya seçtiğiniz bir metne sağ tıklayıp çeviriye başlayın!",
    themeDark: "Koyu Tema",
    themeLight: "Açık Tema",
    supportedBrowsers: "Desteklenen Tarayıcılar:",
    browserChromeTitle: "Chrome Web Store (Yakında / Releases)",
    browserEdgeTitle: "Microsoft Edge Add-ons (Yakında / Releases)",
    browserHeliumTitle: "Helium Browser (Yakında / Releases)",
    privBack: "← Ana Sayfaya Dön",
    privTitle: "Gizlilik Politikası (Privacy Policy)",
    privUpdatedLabel: "Son Güncelleme:",
    privUpdated: "19 Eylül 2026",
    privSec1Title: "1. Genel Bakış",
    privSec1Desc: "WebTranslate HaYTooL ('biz', 'eklenti'), kullanıcı gizliliğini temel prensip olarak benimser. Bu eklenti yalnızca kullanıcının talep ettiği web sayfalarını ve metin parçalarını çevirmek amacıyla tasarlanmıştır.",
    privSec2Title: "2. Toplanan Bilgiler & İzinler",
    privSec2Desc: "Eklentimiz hiçbir kişisel veriyi, tarama geçmişinizi, şifrelerinizi veya kimlik bilgilerinizi toplamaz ve harici sunucularımıza aktarmaz.",
    privPerm1Name: "contextMenus:",
    privPerm1Desc: "Sayfada sağ tık menüsünde 'Bu Sayfayı Çevir' ve 'Seçili Metni Çevir' seçeneklerini sunmak için kullanılır.",
    privPerm2Name: "storage:",
    privPerm2Desc: "Yalnızca seçtiğiniz hedef dil, tema ve son hızlı çeviri taslağınız gibi yerel tercihlerinizi tarayıcınızda saklamak için kullanılır.",
    privPerm3Name: "activeTab & scripting:",
    privPerm3Desc: "Sadece siz sağ tıkladığınızda veya butona bastığınızda o anki aktif sekmede çeviri motorunu çalıştırmak için kullanılır.",
    privSec3Title: "3. Çeviri İstekleri & 6 Motor Güvenliği",
    privSec3Desc: "Çevrilmesini istediğiniz metinler doğrudan seçtiğiniz resmi sağlayıcılara (Google, DeepL, Bing, DuckDuckGo, MyMemory, Lingva) şifreli (HTTPS) olarak anlık iletilir ve sonuç tarayıcınızda görüntülenir. Hiçbir çeviri kaydı veya arama günlüğü tarafımızca tutulmaz.",
    privSec4Title: "4. İletişim & Açık Kaynak",
    privSec4Desc: "Sorularınız, katkılarınız ve geri bildirimleriniz için",
    privSec4End: "üzerinden bizimle iletişime geçebilirsiniz.",
    footerText: "© 2026 WebTranslate <a href=\"https://github.com/HaYToKoRaZ\" target=\"_blank\" class=\"footer-brand-link\">HaYTooL</a> | HaYTo tarafından sevgiyle geliştirilmiştir."
  },
  en: {
    navFeatures: "Features",
    navHow: "How It Works",
    navPrivacy: "Privacy",
    navOtherApps: "🌐 Other Apps",
    heroBadge: "⚡ Manifest V3 & Modern Browser Compatible",
    heroTitle: 'Translate Webpages <br /><span class="gradient-text">Lightning Fast</span>',
    heroSubtitle: "Right-click on any webpage to translate full pages instantly or view selected text translations in an elegant floating HUD.",
    storeSubStore: "Latest Release",
    storeNameStore: "Download Package (.ZIP)",
    featHeading: "What It Offers",
    featSub: "Fast, privacy-focused and modern browser translator.",
    feat1Title: "Live Progress Page Translation",
    feat1Desc: "Simply right-click and choose 'Translate this page'. Real-time progress bar shows translation status without breaking layout.",
    feat2Title: "Selection Translation (Floating HUD)",
    feat2Desc: "Select any word or paragraph to see an instant translation in an elegant glassmorphic floating balloon right beside your selection.",
    feat3Title: "6 Powerful Translation Engines",
    feat3Desc: "Seamless translation powered by Google (Default), DeepL AI, Bing, DuckDuckGo, MyMemory, and Lingva engines.",
    feat4Title: "Zero Telemetry & 100% Privacy",
    feat4Desc: "Your visited pages and translated contents are never stored on third-party servers. Everything runs locally in your browser.",
    feat5Title: "45+ World Languages",
    feat5Desc: "Easily switch between Turkish, English, German, French, Spanish, Russian, Arabic and more.",
    feat6Title: "Ultra Lightweight & Fast",
    feat6Desc: "No heavy dependencies. Opens with zero delay and keeps your browser feather-light.",
    feat7Title: "HaYTooL Engine Arena (Speed & Quality Benchmark)",
    feat7Desc: "Benchmark all 6 translation engines side-by-side in real-time; compare millisecond speeds, outputs, and pick your favorite with one click.",
    feat8Title: "Bidirectional Language Swap (⇄)",
    feat8Desc: "Flip source and target languages in one click; effortlessly translate Turkish to English or reverse.",
    feat9Title: "Open Page in 6 Tabs Live",
    feat9Desc: "Open the current webpage in 6 tabs simultaneously across all 6 engines with live duration tags in tab titles and persistent HUDs.",
    feat10Title: "Excluded Websites (Blacklist)",
    feat10Desc: "Define sensitive sites (banking, internal portals, code repos) in Settings or toggle 'Disable on this site' instantly from the popup.",
    howHeading: "How It Works",
    howSub: "Install and get started in seconds.",
    step1Title: "Install Extension",
    step1Desc: "Add WebTranslate HaYTooL to your browser in one click.",
    step2Title: "Select Target Language",
    step2Desc: "Pick your preferred target language (e.g. English, Turkish) from the popup.",
    step3Title: "Right Click & Translate",
    step3Desc: "Right-click anywhere on the page or on selected text to start translating immediately!",
    themeDark: "Dark Mode",
    themeLight: "Light Mode",
    supportedBrowsers: "Supported Browsers:",
    browserChromeTitle: "Chrome Web Store (Coming Soon / Releases)",
    browserEdgeTitle: "Microsoft Edge Add-ons (Coming Soon / Releases)",
    browserHeliumTitle: "Helium Browser (Coming Soon / Releases)",
    privBack: "← Back to Home",
    privTitle: "Privacy Policy",
    privUpdatedLabel: "Last Updated:",
    privUpdated: "September 19, 2026",
    privSec1Title: "1. Overview",
    privSec1Desc: "WebTranslate HaYTooL ('we', 'extension') prioritizes user privacy. This extension is designed solely to translate webpages and selected text snippets on demand.",
    privSec2Title: "2. Collected Data & Permissions",
    privSec2Desc: "Our extension does NOT collect, store, or transmit any personal data, browsing history, passwords, or credentials to any server.",
    privPerm1Name: "contextMenus:",
    privPerm1Desc: "Used to provide 'Translate this page' and 'Translate selection' options in the right-click menu.",
    privPerm2Name: "storage:",
    privPerm2Desc: "Used only locally on your device to remember user settings such as target language, theme, and quick translate drafts.",
    privPerm3Name: "activeTab & scripting:",
    privPerm3Desc: "Used strictly when triggered by the user to inject the translation engine into the active webpage tab.",
    privSec3Title: "3. Translation Requests & 6-Engine Security",
    privSec3Desc: "Text translation requests are sent directly via encrypted HTTPS connections to official endpoints (Google, DeepL, Bing, DuckDuckGo, MyMemory, Lingva). No translation history is logged.",
    privSec4Title: "4. Contact & Open Source",
    privSec4Desc: "For questions, contributions, and feedback, please visit our",
    privSec4End: "on GitHub.",
    footerText: "© 2026 WebTranslate <a href=\"https://github.com/HaYToKoRaZ\" target=\"_blank\" class=\"footer-brand-link\">HaYTooL</a> | Developed with love by HaYTo."
  }
};

function setLanguage(lang) {
  if (!translations[lang]) return;

  // Buton aktifliği
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = document.querySelector(`.lang-btn[onclick="setLanguage('${lang}')"]`);
  if (activeBtn) activeBtn.classList.add("active");

  // Metinleri değiştir
  const dict = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach(elem => {
    const key = elem.getAttribute("data-i18n");
    if (dict[key]) {
      if (key === "heroTitle" || key === "footerText") {
        elem.innerHTML = dict[key];
      } else {
        elem.textContent = dict[key];
      }
    }
  });

  // Tooltip / Title özniteliklerini değiştir
  document.querySelectorAll("[data-i18n-title]").forEach(elem => {
    const key = elem.getAttribute("data-i18n-title");
    if (dict[key]) {
      elem.setAttribute("title", dict[key]);
    }
  });

  localStorage.setItem("haytool_wt_lang", lang);

  // Tema etiketini seçili dile göre senkronize et
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(currentTheme);
}

// Tema Yönetimi (Koyu / Açık & Otomatik Sistem Algılama)
function initTheme() {
  const savedTheme = localStorage.getItem("haytool_wt_theme");
  const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (isSystemDark ? "dark" : "light");

  applyTheme(initialTheme);

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = current === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem("haytool_wt_theme", nextTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const moonIcon = document.getElementById("moon-icon");
  const sunIcon = document.getElementById("sun-icon");
  const themeText = document.getElementById("theme-text");
  const currentLang = localStorage.getItem("haytool_wt_lang") || "tr";
  const dict = translations[currentLang] || translations.tr;

  if (theme === "light") {
    if (moonIcon) moonIcon.style.display = "none";
    if (sunIcon) sunIcon.style.display = "block";
    if (themeText) {
      themeText.textContent = dict.themeLight || "Açık Tema";
      themeText.setAttribute("data-i18n", "themeLight");
    }
  } else {
    if (moonIcon) moonIcon.style.display = "block";
    if (sunIcon) sunIcon.style.display = "none";
    if (themeText) {
      themeText.textContent = dict.themeDark || "Koyu Tema";
      themeText.setAttribute("data-i18n", "themeDark");
    }
  }
}

// Başlangıç dili ve teması
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("haytool_wt_lang") || (navigator.language.startsWith("tr") ? "tr" : "en");
  setLanguage(saved);
  initTheme();
});
