"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: {
          new (
            options: {
              pageLanguage: string;
              layout: string;
              multilanguagePage: boolean;
              autoDisplay: boolean;
            },
            element: string
          ): unknown;
          InlineLayout?: {
            HORIZONTAL?: string;
          };
          prototype?: Record<string, unknown>;
        };
      };
    };
    adminModeChange?: (enabled: boolean) => void;
  }
}

export function GoogleTranslateWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);

         window.googleTranslateElementInit = function () {
       const target = document.getElementById("google_translate_element");
       if (!target) return;

       if (typeof window.google === "undefined" || !window.google.translate || !window.google.translate.TranslateElement) return;

       new window.google.translate.TranslateElement(
         {
          pageLanguage: "en",
           layout: window.google.translate.TranslateElement?.InlineLayout?.HORIZONTAL || 'horizontal',
           multilanguagePage: true,
           autoDisplay: false,
         },
         "google_translate_element"
       );

       setTimeout(() => {
         initializeLanguageMapping();
        startFastFeedbackLoop(); // 💥 고속 피드백 감시 시작!
      }, 800);
    };

    // ====== 1) 언어 전체 매핑 빌더: (코드, 나라(영어), 언어(자국어)) ======
    function buildMaps() {
      // code는 구글 콤보의 값 기준(소문자, 하이픈 포함). base는 code의 접두(지역 제외)
      // [code, countryEn, nativeLang]
      const entries: Array<[string, string, string]> = [
        // A
        ["af", "South Africa", "Afrikaans"],
        ["sq", "Albania", "Shqip"],
        ["am", "Ethiopia", "አማርኛ"],
        ["ar", "Saudi Arabia", "العربية"],
        ["hy", "Armenia", "Հայերեն"],
        ["az", "Azerbaijan", "Azərbaycan dili"],
        // B
        ["eu", "Basque Country", "Euskara"],
        ["be", "Belarus", "Беларуская"],
        ["bn", "Bangladesh", "বাংলা"],
        ["bs", "Bosnia and Herzegovina", "Bosanski"],
        ["bg", "Bulgaria", "Български"],
        // C
        ["ca", "Catalonia", "Català"],
        ["ceb", "Philippines", "Cebuano"],
        ["zh-cn", "China", "中文(简体)"],
        ["zh-tw", "Taiwan", "中文(繁體)"],
        ["zh", "China", "中文"],
        ["co", "Corsica", "Corsu"],
        ["hr", "Croatia", "Hrvatski"],
        ["cs", "Czech Republic", "Čeština"],
        // D
        ["da", "Denmark", "Dansk"],
        ["nl", "Netherlands", "Nederlands"],
        // E
        ["en-us", "USA", "English"],
        ["en-gb", "UK", "English"],
        ["en-au", "Australia", "English"],
        ["en-nz", "New Zealand", "English"],
        ["en-ca", "Canada", "English"],
        ["en", "Australia", "English"], // 요청에 맞춰 기본 en은 Australia로
        ["eo", "—", "Esperanto"],
        ["et", "Estonia", "Eesti"],
        // F
        ["fi", "Finland", "Suomi"],
        ["fr", "France", "Français"],
        ["fy", "Netherlands", "Frysk"],
        // G
        ["gl", "Spain (Galicia)", "Galego"],
        ["ka", "Georgia", "ქართული"],
        ["de", "Germany", "Deutsch"],
        ["el", "Greece", "Ελληνικά"],
        ["gu", "India", "ગુજરાતી"],
        // H
        ["ht", "Haiti", "Kreyòl ayisyen"],
        ["ha", "Nigeria", "Hausa"],
        ["haw", "Hawaii", "ʻŌlelo Hawaiʻi"],
        ["he", "Israel", "עברית"],
        ["hi", "India", "हिन्दी"],
        ["hmn", "—", "Hmoob"],
        ["hu", "Hungary", "Magyar"],
        // I
        ["is", "Iceland", "Íslenska"],
        ["ig", "Nigeria", "Igbo"],
        ["id", "Indonesia", "Bahasa Indonesia"],
        ["ga", "Ireland", "Gaeilge"],
        ["it", "Italy", "Italiano"],
        // J
        ["ja", "Japan", "日本語"],
        ["jv", "Indonesia", "Basa Jawa"],
        // K
        ["kn", "India", "ಕನ್ನಡ"],
        ["kk", "Kazakhstan", "Қазақ тілі"],
        ["km", "Cambodia", "ភាសាខ្មែរ"],
        ["rw", "Rwanda", "Kinyarwanda"],
        ["ko", "Korea", "한국어"],
        ["ku", "Kurdistan", "Kurdî"],
        ["ky", "Kyrgyzstan", "Кыргызча"],
        // L
        ["lo", "Laos", "ລາວ"],
        ["la", "—", "Latina"],
        ["lv", "Latvia", "Latviešu"],
        ["lt", "Lithuania", "Lietuvių"],
        ["lb", "Luxembourg", "Lëtzebuergesch"],
        // M
        ["mk", "North Macedonia", "Македонски"],
        ["mg", "Madagascar", "Malagasy"],
        ["ms", "Malaysia", "Bahasa Melayu"],
        ["ml", "India", "മലയാളം"],
        ["mt", "Malta", "Malti"],
        ["mi", "New Zealand", "Māori"],
        ["mr", "India", "मराठी"],
        ["mn", "Mongolia", "Монгол"],
        ["my", "Myanmar", "မြန်မာစာ"],
        // N
        ["ne", "Nepal", "नेपाली"],
        ["no", "Norway", "Norsk"],
        ["ny", "Malawi", "ChiChewa"],
        // O
        ["or", "India", "ଓଡ଼ିଆ"],
        // P
        ["ps", "Afghanistan", "پښتو"],
        ["fa", "Iran", "فارسی"],
        ["pl", "Poland", "Polski"],
        ["pt-br", "Brazil", "Português (BR)"],
        ["pt", "Portugal", "Português"],
        ["pa", "India", "ਪੰਜਾਬੀ"],
        // R
        ["ro", "Romania", "Română"],
        ["ru", "Russia", "Русский"],
        // S
        ["sm", "Samoa", "Gagana Samoa"],
        ["gd", "Scotland", "Gàidhlig"],
        ["sr", "Serbia", "Српски"],
        ["st", "Lesotho", "Sesotho"],
        ["sn", "Zimbabwe", "Shona"],
        ["sd", "Pakistan", "سنڌي"],
        ["si", "Sri Lanka", "සිංහල"],
        ["sk", "Slovakia", "Slovenčina"],
        ["sl", "Slovenia", "Slovenščina"],
        ["so", "Somalia", "Soomaali"],
        ["es-mx", "Mexico", "Español"],
        ["es", "Spain", "Español"],
        ["su", "Indonesia", "Basa Sunda"],
        ["sw", "Kenya", "Kiswahili"],
        ["sv", "Sweden", "Svenska"],
        // T
        ["tl", "Philippines", "Tagalog"],
        ["tg", "Tajikistan", "Тоҷикӣ"],
        ["ta", "India", "தமிழ்"],
        ["tt", "Tatarstan", "Татар"],
        ["te", "India", "తెలుగు"],
        ["th", "Thailand", "ไทย"],
        ["tr", "Turkey", "Türkçe"],
        ["tk", "Turkmenistan", "Türkmençe"],
        // U
        ["uk", "Ukraine", "Українська"],
        ["ur", "Pakistan", "اردو"],
        ["ug", "Xinjiang", "ئۇيغۇرچە"],
        ["uz", "Uzbekistan", "Oʻzbekcha"],
        // V/W/X/Y/Z
        ["vi", "Vietnam", "Tiếng Việt"],
        ["cy", "Wales", "Cymraeg"],
        ["xh", "South Africa", "isiXhosa"],
        ["yi", "—", "ייִדיש"],
        ["yo", "Nigeria", "Yorùbá"],
        ["zu", "South Africa", "isiZulu"],
      ];

      const countryByLang: Record<string, string> = {};
      const nativeByLang: Record<string, string> = {};

      for (const [code, country, native] of entries) {
        const c = code.toLowerCase();
        countryByLang[c] = country;
        nativeByLang[c] = native;
        const base = c.split("-")[0];
        // base 코드가 비어있으면 채워준다(지역코드 없는 항목 접근용)
        if (!countryByLang[base]) countryByLang[base] = country;
        if (!nativeByLang[base]) nativeByLang[base] = native;
      }

      return { countryByLang, nativeByLang };
    }

    // ====== 2) 콤보 옵션을 "Country - Native"로 일괄 변환 ======
     function updateLanguageOptions() {
       try {
         const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (!combo || !combo.options) return;

        const { countryByLang, nativeByLang } = buildMaps();
        const options = Array.from(combo.options);

        const norm = (v: string) => v.trim().toLowerCase().split("|")[0]; // 'xx' or 'xx-yy'

        options.forEach((option) => {
          if (option.dataset.updated === "true") return;

          const code = norm(option.value);
          const base = code.split("-")[0];

          const country = countryByLang[code] ?? countryByLang[base] ?? base.toUpperCase();
          const native = nativeByLang[code] ?? nativeByLang[base] ?? (option.text.trim() || base);

          option.text = `${country} - ${native}`;
               option.dataset.updated = "true";
        });

        // 원하면 주석 처리 가능
        options.sort((a, b) => a.text.localeCompare(b.text));
        combo.innerHTML = "";
        options.forEach((opt) => combo.appendChild(opt));
      } catch {}
     }

     function hideFeedbackElements() {
       const feedbackSelectors = [
         ".goog-te-balloon-frame",
         ".goog-te-ftab",
         ".goog-te-ftab-float",
         ".goog-tooltip",
         ".goog-tooltip-popup",
         ".goog-te-banner-frame",
         ".goog-te-spinner-pos",
         ".goog-te-menu-frame",
         ".goog-te-menu2",
         ".goog-te-gadget-simple",
         ".goog-te-gadget",
         ".goog-te-combo",
         ".skiptranslate",
         "iframe[src*='translate']",
         ".goog-te-banner-frame-sip",
         ".goog-te-balloon-frame-sip",
         ".goog-te-ftab-sip",
         ".goog-te-ftab-float-sip"
       ];
       feedbackSelectors.forEach((selector) => {
         document.querySelectorAll(selector).forEach((el) => {
           const element = el as HTMLElement;
           element.style.display = "none !important";
           element.style.visibility = "hidden !important";
           element.style.opacity = "0 !important";
           element.style.pointerEvents = "none !important";
           element.style.position = "absolute !important";
           element.style.left = "-9999px !important";
           element.style.top = "-9999px !important";
           element.style.zIndex = "-9999 !important";
         });
       });
     }

    function handleAdminModeChange(enabled: boolean) {
      try {
        const saveDraftSafely = () => {
          try {
            const event = new CustomEvent('memo:save-draft');
            window.dispatchEvent(event);
          } catch {}
        };
        saveDraftSafely();
      } catch {}

      if (enabled) {
        try {
          document.documentElement.setAttribute("translate", "no");
          document.body.setAttribute("translate", "no");

          const elements = document.querySelectorAll(".goog-te-combo, .goog-te-gadget, .skiptranslate, iframe[src*='translate']");
          elements.forEach((el) => {
            const e = el as HTMLElement;
            e.style.display = "none";
            e.style.visibility = "hidden";
            e.style.opacity = "0";
            e.style.pointerEvents = "none";
          });

          if (window.google) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window.google as any).translate = {
              TranslateElement: function () {
                return null;
              },
            };
          }
        } catch {}
      } else {
        try {
          document.documentElement.removeAttribute("translate");
          document.body.removeAttribute("translate");

          const elements = document.querySelectorAll(".goog-te-combo, .goog-te-gadget, .skiptranslate");
          elements.forEach((el) => {
            const e = el as HTMLElement;
            e.style.display = "";
            e.style.visibility = "";
            e.style.opacity = "";
            e.style.pointerEvents = "";
          });

          setTimeout(() => {
            if (typeof window.googleTranslateElementInit === "function") {
              window.googleTranslateElementInit();
            }
          }, 500);
        } catch {}
      }
    }

    window.adminModeChange = handleAdminModeChange;

     function refreshWidget() {
       try {
         const existingElement = document.getElementById("google_translate_element");
         if (existingElement) {
           existingElement.innerHTML = '';
         }
         
         const existingScript = document.querySelector('script[src*="translate.google.com"]');
         if (existingScript) {
           document.head.removeChild(existingScript);
         }
         
         const script = document.createElement("script");
         script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
         script.async = true;
         document.head.appendChild(script);
         
         setTimeout(() => {
           if (typeof window.googleTranslateElementInit === "function") {
             window.googleTranslateElementInit();
           }
         }, 500);
         
      } catch {}
     }

     function initializeLanguageMapping() {
       const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
       if (!combo || combo.options.length < 2) return false;

       updateLanguageOptions();
       hideFeedbackElements();

       combo.removeEventListener("change", handleComboChange);
       combo.addEventListener("change", handleComboChange);

       return true;
     }

    // ✅ 실시간 피드백 감시 루프 (5초마다 재시도)
    let feedbackLoop: number | undefined;
    function startFeedbackLoop() {
      if (feedbackLoop) clearInterval(feedbackLoop);
      feedbackLoop = window.setInterval(() => {
        hideFeedbackElements(); // 기존 함수 호출
      }, 5000); // 5초 간격
    }

    // ✅ 고속 피드백 감시 루프 (1초마다, 초기 로딩용)
    function startFastFeedbackLoop() {
      setTimeout(() => {
        const fastLoop = setInterval(() => {
          hideFeedbackElements();
          // 추가 강력한 피드백 차단
          blockAllTranslationFeedback();
        }, 1000);

        // 10초 후 종료
        setTimeout(() => clearInterval(fastLoop), 10000);
      }, 1000);
    }

    // ✅ 강력한 번역 피드백 차단 함수
    function blockAllTranslationFeedback() {
      // 모든 번역 피드백 요소 강제 숨김
      const allFeedbackElements = document.querySelectorAll([
        ".goog-te-balloon-frame",
        ".goog-te-ftab",
        ".goog-te-ftab-float", 
        ".goog-tooltip",
        ".goog-tooltip-popup",
        ".goog-te-banner-frame",
        ".goog-te-spinner-pos",
        ".goog-te-menu-frame",
        ".goog-te-menu2",
        ".goog-te-gadget-simple",
        ".goog-te-gadget",
        ".goog-te-combo",
        ".skiptranslate",
        "iframe[src*='translate']",
        ".goog-te-banner-frame-sip",
        ".goog-te-balloon-frame-sip",
        ".goog-te-ftab-sip",
        ".goog-te-ftab-float-sip",
        "[class*='goog-te-balloon']",
        "[class*='goog-te-ftab']",
        "[class*='goog-te-tooltip']",
        "[id*='goog-te-balloon']",
        "[id*='goog-te-ftab']",
        "[id*='goog-te-tooltip']"
      ].join(','));

      allFeedbackElements.forEach((element) => {
        const el = element as HTMLElement;
        el.style.display = "none !important";
        el.style.visibility = "hidden !important";
        el.style.opacity = "0 !important";
        el.style.pointerEvents = "none !important";
        el.style.position = "absolute !important";
        el.style.left = "-9999px !important";
        el.style.top = "-9999px !important";
        el.style.zIndex = "-9999 !important";
        el.style.width = "0 !important";
        el.style.height = "0 !important";
        el.style.overflow = "hidden !important";
        el.style.clip = "rect(0, 0, 0, 0) !important";
        el.style.margin = "0 !important";
        el.style.padding = "0 !important";
        el.style.border = "none !important";
        el.style.background = "transparent !important";
      });

      // 번역 위젯 자체는 보호 (헤더에 있는 것만)
      const headerWidget = document.querySelector('.translate-widget-horizontal .goog-te-gadget');
      if (headerWidget) {
        const el = headerWidget as HTMLElement;
        el.style.display = "flex !important";
        el.style.visibility = "visible !important";
        el.style.opacity = "1 !important";
        el.style.pointerEvents = "auto !important";
        el.style.position = "static !important";
        el.style.left = "auto !important";
        el.style.top = "auto !important";
        el.style.zIndex = "auto !important";
        el.style.width = "auto !important";
        el.style.height = "auto !important";
        el.style.overflow = "visible !important";
        el.style.clip = "auto !important";
      }
    }

    // ✅ 번역 피드백 DOM 전담 감시자
    function watchTranslationFeedback() {
      const feedbackObserver = new MutationObserver(() => {
        hideFeedbackElements();
      });

      feedbackObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return feedbackObserver;
    }

     function handlePageRefresh() {
       sessionStorage.setItem('widget-needs-refresh', 'true');
     }

     function checkAndRefreshWidget() {
       const needsRefresh = sessionStorage.getItem('widget-needs-refresh');
       if (needsRefresh === 'true') {
         sessionStorage.removeItem('widget-needs-refresh');
         setTimeout(() => {
           refreshWidget();
         }, 1000);
       }
     }

     // 위젯 완전 비활성화 함수 (전역 스코프로 이동)
     function hideTranslateWidget() {
       const el = document.getElementById("google_translate_element");
       if (el) {
         el.style.display = "none";
         el.style.opacity = "0";
         el.style.pointerEvents = "none";
         el.style.visibility = "hidden";
         el.style.position = "absolute";
         el.style.left = "-9999px";
         el.style.top = "-9999px";
         el.style.zIndex = "-9999";
         // 완전 비활성화를 위한 추가 속성
         el.style.width = "0";
         el.style.height = "0";
         el.style.overflow = "hidden";
         el.style.clipPath = "inset(50%)";
         el.style.margin = "0";
         el.style.padding = "0";
         el.style.border = "none";
         el.style.background = "transparent";
         // DOM에서 완전히 제거하지는 않지만 기능 차단
         el.innerHTML = "";
       }
       
       // 모든 Google Translate 관련 요소들 완전 비활성화
       const googleElements = document.querySelectorAll([
         ".goog-te-gadget",
         ".goog-te-gadget-simple", 
         ".goog-te-combo",
         ".goog-te-menu-frame",
         ".goog-te-menu2",
         ".goog-te-menu-value",
         ".goog-te-gadget img",
         ".goog-te-gadget a"
       ].join(','));
       
       googleElements.forEach((element) => {
         const el = element as HTMLElement;
         el.style.display = "none";
         el.style.visibility = "hidden";
         el.style.opacity = "0";
         el.style.pointerEvents = "none";
         el.style.position = "absolute";
         el.style.left = "-9999px";
         el.style.top = "-9999px";
         el.style.zIndex = "-9999";
         el.style.width = "0";
         el.style.height = "0";
         el.style.overflow = "hidden";
         el.style.clipPath = "inset(50%)";
         el.style.margin = "0";
         el.style.padding = "0";
         el.style.border = "none";
         el.style.background = "transparent";
         // 이벤트 리스너 제거
         el.onclick = null;
         el.onchange = null;
         el.onmouseenter = null;
         el.onmouseleave = null;
         // 속성 제거
         el.removeAttribute("onclick");
         el.removeAttribute("onchange");
         el.removeAttribute("onmouseenter");
         el.removeAttribute("onmouseleave");
       });
       
       // Google Translate API 기능 차단
       if (window.google?.translate) {
         try {
           // 번역 기능을 무력화 - 생성자 함수로 정의
           window.google.translate.TranslateElement = function DisabledTranslateElement(
             options: { pageLanguage: string; layout: string; multilanguagePage: boolean; autoDisplay: boolean },
             element: string
           ) {
             return null;
           } as typeof window.google.translate.TranslateElement;
           // 기존 번역 인스턴스 제거
           if (window.google.translate.TranslateElement?.prototype) {
             window.google.translate.TranslateElement.prototype = {};
           }
         } catch {
           // 에러 무시
         }
       }
       
       // 위젯 숨김 후 환생 버튼 표시
       showReviveButton();
     }

     // 환생 버튼 표시 함수 (헤더 내부에 표시)
     function showReviveButton() {
       const container = document.getElementById("translate-revive-button-container");
       if (container) {
         container.classList.remove("hidden");
       }
     }

     function handleComboChange() {
       const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
       const selectedLang = combo?.value;
       
       // 선택한 언어를 sessionStorage에 저장
       if (selectedLang) {
         sessionStorage.setItem("gptx:selectedLang", selectedLang);
         sessionStorage.setItem("gptx:translate:muted", "true");
       }

       setTimeout(() => {
         updateLanguageOptions();
         hideFeedbackElements();
         
         // 번역 후 위젯 즉시 숨김
         setTimeout(() => {
           hideTranslateWidget();
         }, 800);
       }, 100);
     }

     const observer = new MutationObserver(() => {
       if (initializeLanguageMapping()) {
         observer.disconnect();
        startFeedbackLoop(); // 💥 실시간 피드백 감시 시작!
        
        // 위젯이 다시 나타나면 자동으로 숨김
        const isMuted = sessionStorage.getItem("gptx:translate:muted");
        if (isMuted === "true") {
          setTimeout(() => {
            hideTranslateWidget();
          }, 1000);
        }
       }
       
       // 지속적으로 위젯 숨김 감시
       const isMuted = sessionStorage.getItem("gptx:translate:muted");
       if (isMuted === "true") {
         const translateElement = document.getElementById("google_translate_element");
         if (translateElement && translateElement.style.display !== "none") {
           hideTranslateWidget();
         }
       }
     });

     window.addEventListener('beforeunload', handlePageRefresh);
     
    // ✅ 번역 피드백 DOM 전담 감시자 변수
    let feedbackObserver: MutationObserver | null = null;

     // 저장된 언어 자동 재적용 함수
     function autoReapplyTranslation() {
       const savedLang = sessionStorage.getItem("gptx:selectedLang");
       const isMuted = sessionStorage.getItem("gptx:translate:muted");
       
       if (savedLang && isMuted === "true") {
         const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
         
         if (combo && combo.options.length > 1) {
           setTimeout(() => {
             combo.value = savedLang;
             combo.dispatchEvent(new Event("change"));
             
             // 재적용 후 다시 위젯 숨김
             setTimeout(() => {
               hideTranslateWidget();
               hideFeedbackElements();
             }, 1500);
           }, 1200);
         }
       }
     }

     window.addEventListener("load", () => {
       checkAndRefreshWidget();
       
       // 저장된 언어 자동 재적용
       setTimeout(() => {
         autoReapplyTranslation();
       }, 2000);
       
       observer.observe(document.body, {
         childList: true,
         subtree: true
       });

      // ✅ 번역 피드백 DOM 감시 시작
      feedbackObserver = watchTranslationFeedback();
     });

     function addRefreshButton() {
       const refreshButton = document.createElement('button');
       refreshButton.textContent = '🔄';
       refreshButton.title = 'Google Translate 위젯 새로고침';
       refreshButton.style.cssText = `
         position: fixed;
         top: 10px;
         right: 10px;
         z-index: 10000;
         background: #4285f4;
         color: white;
         border: none;
         border-radius: 50%;
         width: 40px;
         height: 40px;
         cursor: pointer;
         font-size: 16px;
         box-shadow: 0 2px 10px rgba(0,0,0,0.2);
       `;
       
       refreshButton.addEventListener('click', () => {
         refreshWidget();
       });
       
       document.body.appendChild(refreshButton);
     }

     if (process.env.NODE_ENV === 'development') {
       setTimeout(addRefreshButton, 2000);
     }

    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) document.head.removeChild(existingScript);
      observer.disconnect();
      window.removeEventListener('beforeunload', handlePageRefresh);
      const refreshButton = document.querySelector('button[title="Google Translate 위젯 새로고침"]');
      if (refreshButton) {
        document.body.removeChild(refreshButton);
      }
      // 실시간 피드백 감시 루프 정리
      if (feedbackLoop) clearInterval(feedbackLoop);
      // 번역 피드백 DOM 전담 감시자 정리
      if (feedbackObserver) {
        feedbackObserver.disconnect();
      }
    };
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="translate-widget-horizontal flex-shrink-0"
      suppressHydrationWarning={true}
    />
  );
}