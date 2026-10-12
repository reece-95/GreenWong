(() => {
    'use strict';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    /* ======================================================================
       i18n
       ====================================================================== */

    const STORAGE_KEY = 'greenwong-lang';
    const dict = window.GW_TRANSLATIONS || { en: {}, zh: {} };

    // data 属性 → 要写入的位置（'text' 表示元素文字）
    const BINDINGS = [
        ['data-i18n', 'text'],
        ['data-i18n-placeholder', 'placeholder'],
        ['data-i18n-aria-label', 'aria-label'],
        ['data-i18n-title', 'title']
    ];

    // 启动时从 HTML 读出英文原文，英文只维护在 HTML 一处
    const bindings = [];
    const english = { ...dict.en };
    for (const [dataAttr, target] of BINDINGS) {
        for (const el of $$(`[${dataAttr}]`)) {
            const key = el.getAttribute(dataAttr);
            const original = target === 'text' ? el.textContent.trim() : el.getAttribute(target);
            if (!(key in english)) english[key] = original;
            bindings.push({ el, key, target });
        }
    }

    const warned = new Set();
    let currentLang = 'en';

    function t(key, params = {}) {
        let text = currentLang === 'zh' ? dict.zh[key] : english[key];
        if (text === undefined) {
            if (!warned.has(key)) {
                console.warn(`[i18n] Missing "${currentLang}" text for "${key}"`);
                warned.add(key);
            }
            text = english[key] ?? key;
        }
        return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? params[name] : match));
    }

    const langToggle = $('#langToggle');

    function setLang(lang, { save = true } = {}) {
        currentLang = lang === 'zh' ? 'zh' : 'en';
        document.documentElement.lang = currentLang === 'zh' ? 'zh-Hans' : 'en';

        for (const { el, key, target } of bindings) {
            if (target === 'text') el.textContent = t(key);
            else el.setAttribute(target, t(key));
        }

        // 按钮显示“要切换到的语言”
        langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';
        langToggle.lang = currentLang === 'zh' ? 'en' : 'zh-Hans';
        langToggle.setAttribute('aria-label', t('lang_toggle_label'));

        if (save) {
            try { localStorage.setItem(STORAGE_KEY, currentLang); } catch { /* 隐私模式等情况下不可用，忽略 */ }
        }
        document.dispatchEvent(new CustomEvent('langchange'));
    }

    function initialLang() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'en' || saved === 'zh') return saved;
        } catch { /* ignore */ }
        // 第一次来：浏览器是中文就显示中文
        return (navigator.languages || [navigator.language]).some(l => /^zh\b/i.test(l || '')) ? 'zh' : 'en';
    }

    langToggle.addEventListener('click', () => setLang(currentLang === 'en' ? 'zh' : 'en'));

    /* ======================================================================
       Mobile menu
       ====================================================================== */

    const menuToggle = $('#menuToggle');
    const navLinks = $('#navLinks');
    const desktop = window.matchMedia('(min-width: 769px)');

    function setMenu(open) {
        navLinks.classList.toggle('is-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', t(open ? 'menu_close' : 'menu_open'));
        $('use', menuToggle).setAttribute('href', open ? '#i-close' : '#i-menu');
    }
    const menuIsOpen = () => menuToggle.getAttribute('aria-expanded') === 'true';

    menuToggle.addEventListener('click', () => setMenu(!menuIsOpen()));
    navLinks.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menuIsOpen()) {
            setMenu(false);
            menuToggle.focus();
        }
    });
    document.addEventListener('click', e => {
        if (menuIsOpen() && !e.target.closest('.site-header')) setMenu(false);
    });
    desktop.addEventListener('change', () => setMenu(false));
    document.addEventListener('langchange', () => setMenu(menuIsOpen()));

    /* ======================================================================
       Testimonial carousel
       ====================================================================== */

    const carousel = $('#carousel');
    const slides = $$('.carousel-slide', carousel);
    const dotsContainer = $('#carouselDots');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const AUTOPLAY_MS = 6000;

    let slideIndex = 0;
    let timer = null;
    let paused = false;

    const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot';
        dot.addEventListener('click', () => {
            showSlide(i);
            startAutoplay(); // 手动切换后重新计时，不会刚点完就被翻走
        });
        dotsContainer.append(dot);
        return dot;
    });

    function showSlide(n) {
        slideIndex = (n + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            const active = i === slideIndex;
            slide.classList.toggle('is-active', active);
            slide.setAttribute('aria-hidden', String(!active));
        });
        dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === slideIndex)));
    }

    function labelDots() {
        dots.forEach((dot, i) => dot.setAttribute('aria-label', t('testi_dot', { n: i + 1, total: slides.length })));
    }

    function stopAutoplay() {
        clearInterval(timer);
        timer = null;
    }

    function startAutoplay() {
        stopAutoplay();
        // 用户开了“减少动态效果”、鼠标停在上面、或页面在后台时不自动翻页
        if (slides.length < 2 || paused || reducedMotion.matches || document.hidden) return;
        timer = setInterval(() => showSlide(slideIndex + 1), AUTOPLAY_MS);
    }

    const pause = () => { paused = true; stopAutoplay(); };
    const resume = () => { paused = false; startAutoplay(); };

    for (const el of [carousel, dotsContainer]) {
        el.addEventListener('mouseenter', pause);
        el.addEventListener('mouseleave', resume);
    }
    dotsContainer.addEventListener('focusin', pause);
    dotsContainer.addEventListener('focusout', resume);
    document.addEventListener('visibilitychange', startAutoplay);
    reducedMotion.addEventListener('change', startAutoplay);
    document.addEventListener('langchange', labelDots);

    /* ======================================================================
       Booking form
       ====================================================================== */

    const form = $('#bookingForm');
    const formStatus = $('#formStatus');
    const dateInput = $('#f-date');

    // 不能选今天以前的日期（按本地时区）
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateInput.min = today.toISOString().slice(0, 10);

    let statusKey = null;
    function showStatus(key) {
        statusKey = key;
        formStatus.textContent = t(key);
        formStatus.hidden = false;
    }
    document.addEventListener('langchange', () => { if (statusKey) formStatus.textContent = t(statusKey); });
    form.addEventListener('input', () => { formStatus.hidden = true; statusKey = null; });

    form.addEventListener('submit', e => {
        e.preventDefault();
        // TODO: 这里仍是演示，数据没有发出去。接 Formspree 时改成：
        //   const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        //   成功才显示 form_success，失败显示错误提示。
        showStatus('form_success');
        form.reset();
    });

    /* ======================================================================
       Misc
       ====================================================================== */

    $('#year').textContent = String(new Date().getFullYear());

    /* ======================================================================
       Start
       ====================================================================== */

    setLang(initialLang(), { save: false });
    showSlide(0);
    startAutoplay();
})();
