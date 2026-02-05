const STORAGE_KEY = 'gb-lang';
let translations = {};
let current = localStorage.getItem(STORAGE_KEY) || 'es';

function getNested(obj, key) {
    return key.split('.').reduce((o, k) => (o && o[k] != null) ? o[k] : null, obj);
}

export async function initI18n(defaultLang) {
    current = defaultLang || current;
    await loadLocale(current);
}

export async function loadLocale(lang) {
    try {
        const res = await fetch(`src/locales/${lang}.json`);
        if (!res.ok) throw new Error('no locale');
        translations = await res.json();
        current = lang;
        try { document.documentElement.lang = lang; } catch(e) {}
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations();
    } catch (e) {
        console.warn('i18n: failed to load', lang, e);
    }
}

export function t(key, fallback) {
    const v = getNested(translations, key);
    return v == null ? (fallback != null ? fallback : key) : v;
}

function applyTranslations() {
    // data-i18n -> textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const val = t(key, '');
        if (val != null) el.textContent = val;
    });

    // data-i18n-placeholder -> placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        const val = t(key, '');
        if (val != null) el.placeholder = val;
    });

    // data-i18n-attr -> attr1:key1;attr2:key2
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        const raw = el.dataset.i18nAttr; // e.g. "aria-label:theme.toggle,title:theme.title"
        raw.split(',').forEach(pair => {
            const [attr, k] = pair.split(':').map(s => s && s.trim());
            if (!attr || !k) return;
            const val = t(k, '');
            if (val != null) el.setAttribute(attr, val);
        });
    });
}

export function getLocale() { return current; }

export function setLocale(lang) { return loadLocale(lang); }

// Expose simple API on window for other modules
window.i18n = { t, setLocale, getLocale, loadLocale };
