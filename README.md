<div align="center">

<img src="master/src/assets/icons/icon128.png" alt="WebTranslate HaYTooL Logo" width="96" height="96" />

# WebTranslate HaYTooL

**Lightning Fast Full-Page & Selection Web Translator**  
*Işık Hızında Web Sayfası ve Seçili Metin Çevirmeni*

[![GitHub Release](https://img.shields.io/github/v/release/HaYToKoRaZ/WebTranslate-HaYTooL?color=38bdf8&style=flat-square&logo=github)](https://github.com/HaYToKoRaZ/WebTranslate-HaYTooL/releases/latest)
[![GitHub Downloads (latest release)](https://img.shields.io/github/downloads/HaYToKoRaZ/WebTranslate-HaYTooL/latest/total?color=10b981&style=flat-square&logo=github)](https://github.com/HaYToKoRaZ/WebTranslate-HaYTooL/releases/latest)
[![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/HaYToKoRaZ/WebTranslate-HaYTooL/total?color=0284c7&style=flat-square&logo=github)](https://github.com/HaYToKoRaZ/WebTranslate-HaYTooL/releases)
[![Stars](https://img.shields.io/github/stars/HaYToKoRaZ/WebTranslate-HaYTooL?color=eab308&style=flat-square&logo=github)](https://github.com/HaYToKoRaZ/WebTranslate-HaYTooL/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/intro/)

[🌐 **Canlı Web Sitesi (Live Demo)**](https://haytokoraz.github.io/WebTranslate-HaYTooL/) | [📦 **Son Sürümü İndir (Releases)**](https://github.com/HaYToKoRaZ/WebTranslate-HaYTooL/releases/latest) | [🇹🇷 **Türkçe Açıklama**](#-türkçe-açıklama)

<br />

### 🛒 Supported Browsers & Store Downloads
<p align="center">
  <a href="https://github.com/HaYToKoRaZ/WebTranslate-HaYTooL/releases/latest" title="Chrome Web Store (Yakında / Releases)">
    <img src="master/src/assets/badges/chrome.svg" alt="Chrome Web Store" width="36" height="36" style="margin: 0 8px;" />
  </a>
  <a href="https://github.com/HaYToKoRaZ/WebTranslate-HaYTooL/releases/latest" title="Microsoft Edge Add-ons (Yakında / Releases)">
    <img src="master/src/assets/badges/edge.svg" alt="Microsoft Edge" width="36" height="36" style="margin: 0 8px;" />
  </a>
  <a href="https://github.com/HaYToKoRaZ/WebTranslate-HaYTooL/releases/latest" title="Helium Browser (Yakında / Releases)">
    <img src="master/src/assets/badges/helium.png" alt="Helium Browser" width="36" height="36" style="margin: 0 8px;" />
  </a>
</p>
<p align="center">
  <sub><i>*Mağaza inceleme süreçleri tamamlanana kadar <a href="https://github.com/HaYToKoRaZ/WebTranslate-HaYTooL/releases/latest"><b>Releases Sayfasından Son Sürüm ZIP Paketini</b></a> indirip tarayıcınıza yükleyebilirsiniz.</i></sub>
</p>

</div>

---

## 🇬🇧 English

### Overview
**WebTranslate HaYTooL** is a lightweight, privacy-friendly browser extension designed to bring native-like page translation and instant selection translation to modern browsers.

### ✨ Key Features
- **🌐 One-Click Page Translation with Live Progress HUD:** Right-click anywhere on a webpage and choose **"Translate this page"**. Watch real-time completion with a sleek progress bar (%0-%100) as paragraphs translate on the fly!
- **🔤 Selection Translation (Floating HUD):** Highlight any text or paragraph, right-click **"Translate selection"**, and an elegant glassmorphic balloon pops up beside your cursor displaying both original and translated text.
- **🏁 HaYTooL Engine Arena (Benchmark & Speed Test):** Benchmark all 6 translation engines side-by-side in real-time! Compare millisecond response times, side-by-side translation quality, and set your favorite engine as the default with one click.
- **📑 Multi-Tab Live Comparison (6 Tabs Simultaneously):** Launch the active webpage into 6 independent tabs simultaneously across all 6 engines. Each tab displays permanent translation durations in its tab title (`[⚡ 0.8s | Google] Title`) and includes a persistent comparison HUD so you can easily compare speed and quality by switching tabs.
- **🔄 Bidirectional Quick Language Swap (⇄):** Seamlessly flip source and target languages with a single click in the popup to translate Turkish to English, German to Turkish, and vice versa.
- **💾 Automatic Popup Translation Drafts:** Typed text and translated results in the popup are automatically remembered across clicks and window closures until browser restart, accompanied by a clean `×` reset button.
- **🚫 Excluded Websites (Domain Blacklist):** Prevent translation on sensitive websites (banking, internal dashboards, code editors) by defining an exclusion list in Settings or toggling "Disable on this site" right from the popup!
- **⚡ Tokenized Resilient Batching & Fast Bing Token Cache:** Long web pages are split into atomic tokens (`<<<HT_SEP_X>>>`) preventing engine alteration and misalignments. Bing requests leverage an in-memory credential cache with 10-min TTL for rapid, throttle-free translations.
- **🌓 Dark & Light Theme:** Automatically detects system theme upon installation with customizable dark/light modes.
- **🛡️ 100% Privacy & Zero Telemetry:** No user analytics, no background tracking.
- **⚡ Super Lightweight:** Built with vanilla modern JavaScript; opens instantly with zero memory bloat.
- **🌍 45+ Target Languages:** Supports Turkish, English, German, French, Spanish, Russian, Arabic, Japanese, and more.
- **🚀 6 Powerful Translation Engines:**
  - **Google Translate (Default):** High-speed, robust translation with built-in Chrome extension API endpoints.
  - **DeepL Translate:** State-of-the-art AI translation quality (optional free/pro API key support).
  - **Bing / Microsoft Translator:** Microsoft's global translation engine.
  - **DuckDuckGo Translate:** Privacy-focused web translation engine.
  - **MyMemory Translator:** Vast multilingual human & machine memory database.
  - **Lingva Translate:** Decentralized, privacy-first open-source mirror engine.

### 📥 Manual Installation (Developer Mode)
1. Clone or download this repository.
2. Open your browser's extension management page (`chrome://extensions/` or `edge://extensions/`).
3. Enable **Developer mode** toggle.
4. Click **Load unpacked** and select the `master/` folder of this repository.

---

## 🇹🇷 Türkçe Açıklama

### Genel Bakış
**WebTranslate HaYTooL**, web sayfalarını ve seçtiğiniz metin parçalarını sayfa düzenini bozmadan anında hedef dilinize çeviren ultra hafif, modern ve gizlilik odaklı bir tarayıcı eklentisidir.

### ✨ Temel Özellikler
- **🌐 Canlı İlerleme Çubuklu Sayfa Çevirisi (Live Progress HUD):** Sayfada sağ tıklayıp **"Bu Sayfayı Çevir"** dediğinizde sayfanın sağ alt köşesinde canlı yüzde çubuğu (%0-%100) belirir; paragraflar çevrildikçe anında sayfaya işlenir ve tamamlandığında garanti bildirim verir!
- **🔤 Seçili Metin Çevirisi (Floating HUD):** Herhangi bir cümleyi veya kelimeyi seçip sağ tıkladığınızda hemen imlecin yanında zarif cam efektli bir baloncuk belirir.
- **🏁 HaYTooL Engine Arena (Hız & Kalite Kıyaslama Arenası):** 6 çeviri motorunu aynı anda yan yana yarıştırın! Milisaniye cinsinden hızlarını ve çeviri kalitelerini karşılaştırıp tek tıkla en beğendiğiniz motoru varsayılan yapın.
- **📑 Sayfayı 6 Sekmede Canlı Açma & Kıyaslama:** O anki web sayfasını tek tıkla 6 ayrı sekmede 6 farklı motorla açar. Her sekmenin başlığına motor adı ve çeviri süresi kalıcı yazılır (`[⚡ 0.8s | Google] Başlık`) ve sayfa üzerinde kapatılabilir kalıcı HUD sunulur; böylece sekmeler arasında gezinerek motorların başarısını gözünüzle kıyaslayabilirsiniz!
- **🔄 Çift Yönlü Dil Değiştirme (Swap ⇄):** Popup'ta tek tıkla hedef ve kaynak dili tersine çevirerek Türkçe'den İngilizce'ye ya da tersine ışık hızında çeviri yapın.
- **💾 Otomatik Popup Taslak Koruma:** Popup penceresine yazdığınız metinler ve çeviri sonuçları popup kapansa bile kaybolmaz; tarayıcı yeniden başlatılana kadar saklanır ve tek tıkla temizleme (`×`) butonu içerir.
- **🚫 Hariç Tutulan Web Siteleri (Kara Liste / Blacklist):** Çevrilmesini istemediğiniz siteleri (bankacılık, intranet, kod depoları) Ayarlar'dan tek liste halinde belirleyin veya popup'taki "Bu sitede kapat" butonuyla tek tıkla devre dışı bırakın.
- **⚡ Akıllı Belirteçli (Token) Toplu Çeviri & Hızlı Bing Önbelleği:** Uzun sayfalar çevrilirken paragraflar bozulmaz (`<<<HT_SEP_X>>>`); Bing çevirisi 10 dakikalık bellek önbelleği ile hızlandırılmış olup istek sınırlarına takılmaz.
- **🌓 Koyu & Açık Tema:** İlk yüklendiğinde işletim sisteminizin açık/koyu temasını otomatik algılar ve uyum sağlar.
- **🛡️ Sıfır Telemetri & %100 Gizlilik:** Hiçbir geçmiş kaydı tutulmaz veya sunuculara iletilmez.
- **⚡ Ultra Hafif:** Ağır framework'ler içermez, tarayıcınızı asla yavaşlatmaz.
- **🌍 45+ Dil Desteği:** Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, Rusça, Arapça ve çok daha fazlası.
- **🚀 6 Güçlü Çeviri Motoru Desteği:**
  - **Google Translate (Varsayılan):** Işık hızında, kesintisiz ve resmi uzantı uç noktalarıyla en güvenilir motor.
  - **DeepL Translate:** Dünyanın en doğal yapay zeka çeviri motoru (ücretsiz API Key desteğiyle).
  - **Bing / Microsoft Translator:** Microsoft'un küresel kurumsal çeviri ağı.
  - **DuckDuckGo Translate:** Gizlilik odaklı arama ve çeviri motoru.
  - **MyMemory Translator:** Geniş dil hafıza bankası ve insan/makine eşleştirmeli çeviri.
  - **Lingva Translate:** Merkeziyetsiz, ayna sunuculu gizlilik odaklı açık kaynak motor.

---

## 🛠️ Tech Stack & Architecture
- **Standard:** Manifest V3
- **Languages:** Vanilla JavaScript (ESNext), Modern Glassmorphic CSS
- **i18n:** Native Chromium `_locales` directory (`tr`, `en`)

---

## 📜 License
Developed with ❤️ by [HaYTo](https://github.com/HaYToKoRaZ). Licensed under the MIT License.
