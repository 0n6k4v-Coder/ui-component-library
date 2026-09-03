/* ============================================================
   01. STATE
   ============================================================ */

const STORAGE_KEYS = Object.freeze({
  language: "navbar.language",
  theme: "navbar.theme"
});

const TRANSLATIONS = Object.freeze({
  en: Object.freeze({ logo: "Logo", menu1: "Menu 1", menu2: "Menu 2", menu3: "Menu 3" }),
  th: Object.freeze({ logo: "โลโก้", menu1: "เมนู 1", menu2: "เมนู 2", menu3: "เมนู 3" })
});

/* ============================================================
   02. DOM REFERENCES
   ============================================================ */

const dom = Object.freeze({
  root: document.documentElement,
  translatedNodes: document.querySelectorAll("[data-i18n]"),
  languageOptions: document.querySelectorAll("[data-lang]"),
  languageTrigger: document.querySelector("[data-language-trigger]"),
  languageMenu: document.querySelector("[data-language-menu]"),
  mobileLanguageTrigger: document.querySelector("[data-mobile-language-trigger]"),
  mobileLanguageMenu: document.querySelector("[data-mobile-language-menu]"),
  themeTriggers: document.querySelectorAll("[data-theme-trigger]"),
  mobileMenu: document.querySelector("[data-mobile-menu]"),
  mobileMenuLinks: document.querySelectorAll("[data-mobile-menu-link]")
});

/* ============================================================
   03. STORAGE
   ============================================================ */

function readStorage(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Restricted Preview environments may block storage. */
  }
}

/* ============================================================
   04. LANGUAGE SERVICE
   ============================================================ */

function closeDesktopLanguageMenu() {
  if (dom.languageMenu && typeof dom.languageMenu.hidePopover === "function") {
    try {
      dom.languageMenu.hidePopover();
    } catch {
      dom.languageMenu.classList.remove("is-open");
    }
  } else {
    dom.languageMenu?.classList.remove("is-open");
  }

  dom.languageTrigger?.setAttribute("aria-expanded", "false");
}

function closeMobileLanguageMenu() {
  dom.mobileLanguageMenu?.classList.remove("is-open");
  dom.mobileLanguageTrigger?.setAttribute("aria-expanded", "false");
}

function closeAllLanguageMenus() {
  closeDesktopLanguageMenu();
  closeMobileLanguageMenu();
}

function setLanguage(language) {
  const activeLanguage = TRANSLATIONS[language] ? language : "en";
  const dictionary = TRANSLATIONS[activeLanguage];

  dom.translatedNodes.forEach(node => {
    const value = dictionary[node.dataset.i18n];
    if (value !== undefined) node.textContent = value;
  });

  dom.languageOptions.forEach(option => {
    option.setAttribute("aria-current", String(option.dataset.lang === activeLanguage));
  });

  dom.root.lang = activeLanguage === "th" ? "th" : "en";
  writeStorage(STORAGE_KEYS.language, activeLanguage);
  closeAllLanguageMenus();
}

/* ============================================================
   05. NATIVE POPOVER
   ============================================================ */

const hasNativePopover =
  typeof HTMLElement.prototype.showPopover === "function" &&
  typeof HTMLElement.prototype.hidePopover === "function";

if (!hasNativePopover) {
  dom.root.classList.add("no-popover");
}

/* ============================================================
   06. DESKTOP LANGUAGE FALLBACK
   ============================================================ */

if (!hasNativePopover && dom.languageTrigger && dom.languageMenu) {
  dom.languageTrigger.removeAttribute("popovertarget");
  dom.languageTrigger.removeAttribute("popovertargetaction");

  dom.languageTrigger.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = dom.languageMenu.classList.contains("is-open");
    closeAllLanguageMenus();

    if (!isOpen) {
      dom.languageMenu.classList.add("is-open");
      dom.languageTrigger.setAttribute("aria-expanded", "true");
    }
  });

  document.addEventListener("click", event => {
    const clickedMenu = dom.languageMenu.contains(event.target);
    const clickedTrigger = dom.languageTrigger.contains(event.target);

    if (!clickedMenu && !clickedTrigger) closeDesktopLanguageMenu();
  });
}

/* ============================================================
   07. MOBILE LANGUAGE
   ============================================================ */

dom.mobileLanguageTrigger?.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();

  const isOpen = dom.mobileLanguageMenu.classList.contains("is-open");
  closeDesktopLanguageMenu();

  if (isOpen) {
    closeMobileLanguageMenu();
    return;
  }

  dom.mobileLanguageMenu.classList.add("is-open");
  dom.mobileLanguageTrigger.setAttribute("aria-expanded", "true");
});

document.addEventListener("pointerdown", event => {
  if (!dom.mobileLanguageMenu?.classList.contains("is-open")) return;

  const clickedMenu = dom.mobileLanguageMenu.contains(event.target);
  const clickedTrigger = dom.mobileLanguageTrigger?.contains(event.target);

  if (!clickedMenu && !clickedTrigger) closeMobileLanguageMenu();
});

/* ============================================================
   08. THEME SERVICE
   ============================================================ */

function setTheme(isDark) {
  const theme = isDark ? "dark" : "light";

  dom.root.dataset.theme = theme;
  dom.root.style.colorScheme = theme;

  const nextLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  dom.themeTriggers.forEach(trigger => {
    trigger.setAttribute("aria-label", nextLabel);
    trigger.setAttribute("title", nextLabel);
  });

  writeStorage(STORAGE_KEYS.theme, theme);
}

function toggleTheme() {
  const isDark = dom.root.dataset.theme === "dark";
  setTheme(!isDark);
}

/* ============================================================
   09. LANGUAGE EVENTS
   ============================================================ */

dom.languageOptions.forEach(option => {
  option.addEventListener("click", event => {
    event.stopPropagation();
    setLanguage(option.dataset.lang);
  });
});

/* ============================================================
   10. THEME EVENTS
   ============================================================ */

dom.themeTriggers.forEach(trigger => {
  trigger.addEventListener("click", toggleTheme);
});

/* ============================================================
   11. MOBILE MENU EVENTS
   ============================================================ */

dom.mobileMenuLinks.forEach(link => {
  link.addEventListener("click", () => {
    closeMobileLanguageMenu();

    if (typeof dom.mobileMenu?.hidePopover === "function") {
      try {
        dom.mobileMenu.hidePopover();
      } catch {
        dom.mobileMenu.classList.remove("is-open");
      }
    }
  });
});

/* ============================================================
   12. MOBILE MENU STATE
   ============================================================ */

if (hasNativePopover) {
  dom.mobileMenu?.addEventListener("toggle", event => {
    if (event.newState === "closed") closeMobileLanguageMenu();
  });
}

/* ============================================================
   13. INITIALIZATION
   ============================================================ */

function initializeApp() {
  const savedLanguage = readStorage(STORAGE_KEYS.language, "en");
  const savedTheme = readStorage(STORAGE_KEYS.theme, "light");

  setLanguage(savedLanguage);
  setTheme(savedTheme === "dark");
}

initializeApp();
