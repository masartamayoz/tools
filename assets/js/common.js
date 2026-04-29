/**
 * common.js — مسار
 * ملف JavaScript مشترك لجميع صفحات الموقع
 * يُربط من: assets/js/common.js
 */

/* ══════════════════════════════════════════════════
   1. تبديل السمة (Dark / Light Mode)
   ══════════════════════════════════════════════════ */
(function initTheme() {
    const html   = document.documentElement;
    const btn    = document.getElementById('themeToggle');
    const stored = localStorage.getItem('theme') || 'light';

    html.setAttribute('data-theme', stored);
    if (btn) btn.textContent = stored === 'dark' ? '☀️' : '🌙';

    if (btn) {
        btn.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            btn.textContent = next === 'dark' ? '☀️' : '🌙';
            localStorage.setItem('theme', next);
        });
    }
})();


/* ══════════════════════════════════════════════════
   2. تمييز رابط الصفحة الحالية في Navbar
   ══════════════════════════════════════════════════ */
(function highlightNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav .links a').forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === current) link.classList.add('active');
    });
})();


/* ══════════════════════════════════════════════════
   3. تصفية بطاقات الأدوات (للصفحات التي تحتوي .cat-btn)
   ══════════════════════════════════════════════════ */
(function initCategoryFilter() {
    const catBtns = document.querySelectorAll('.cat-btn');
    const cards   = document.querySelectorAll('.card[data-category]');
    if (!catBtns.length || !cards.length) return;

    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const sel = btn.dataset.category;
            cards.forEach(card => {
                card.style.display =
                    (sel === 'all' || card.dataset.category === sel) ? '' : 'none';
            });
        });
    });
})();


/* ══════════════════════════════════════════════════
   4. نموذج التواصل — التحقق والإرسال
   ══════════════════════════════════════════════════ */
(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name    = form.querySelector('#name')?.value.trim();
        const email   = form.querySelector('#email')?.value.trim();
        const message = form.querySelector('#message')?.value.trim();
        const status  = document.getElementById('formStatus');

        // التحقق البسيط
        if (!name || !email || !message) {
            showFormStatus(status, '⚠️ الرجاء ملء جميع الحقول المطلوبة.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showFormStatus(status, '⚠️ البريد الإلكتروني غير صحيح.', 'error');
            return;
        }

        // محاكاة الإرسال (يُستبدل بـ API حقيقي لاحقاً)
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'جاري الإرسال...';

        setTimeout(() => {
            showFormStatus(status, '✅ تم إرسال رسالتك بنجاح! سنرد عليك قريباً.', 'success');
            form.reset();
            btn.disabled = false;
            btn.textContent = 'إرسال الرسالة';
        }, 1200);
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormStatus(el, msg, type) {
        if (!el) return;
        el.textContent = msg;
        el.className = 'form-status form-status--' + type;
        el.style.display = 'block';
    }
})();


/* ══════════════════════════════════════════════════
   5. تمرير سلس للأقسام (Smooth Scroll)
   ══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


/* ══════════════════════════════════════════════════
   6. تحميل كسول للصور (Lazy Loading Polyfill)
   ══════════════════════════════════════════════════ */
(function lazyImages() {
    if ('loading' in HTMLImageElement.prototype) return; // مدعوم أصلاً
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });
    imgs.forEach(img => observer.observe(img));
})();


/* ══════════════════════════════════════════════════
   7. تحديد سنة حقوق النشر تلقائياً
   ══════════════════════════════════════════════════ */
(function updateYear() {
    const el = document.getElementById('copyrightYear');
    if (el) el.textContent = new Date().getFullYear();
})();
