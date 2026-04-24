/**
 * nav.js — ヘッダー・ドロワー・スクロールスパイ
 */

export function initNav() {
  initScrolledHeader();
  initDrawer();
  initScrollSpy();
}

/* ── ヘッダースクロール検知 ── */
function initScrolledHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 0);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── ドロワー（ハンバーガーメニュー） ── */
function initDrawer() {
  const hamburger = document.querySelector('.hamburger');
  const drawer    = document.getElementById('drawer');
  const overlay   = document.getElementById('drawer-overlay');
  const closeBtn  = drawer?.querySelector('.drawer__close');

  if (!hamburger || !drawer) return;

  // フォーカス可能な要素を取得（フォーカストラップ用）
  const getFocusable = () =>
    [...drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')].filter(
      el => !el.disabled && el.offsetParent !== null
    );

  const open = () => {
    drawer.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // 最初のフォーカス可能要素（閉じるボタン）へ
    requestAnimationFrame(() => closeBtn?.focus());
  };

  const close = () => {
    drawer.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  };

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('is-open') ? close() : open();
  });

  overlay?.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);

  // Esc で閉じる
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });

  // Tab フォーカストラップ
  drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // ドロワー内リンクをクリックしたら閉じる
  drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
}

/* ── スクロールスパイ ── */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.site-nav__link');

  if (!sections.length || !navLinks.length) return;

  const activate = id => {
    navLinks.forEach(link => {
      const href = link.getAttribute('href') ?? '';
      const match = href === `#${id}` || href.endsWith(`#${id}`);
      link.classList.toggle('is-active', match);
      if (match) link.setAttribute('aria-current', 'true');
      else        link.removeAttribute('aria-current');
    });
  };

  // 現在 viewport 内にあるセクションを保持（callback は差分のみ受け取るため）
  const visible = new Set();

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target);
        else                      visible.delete(entry.target);
      });
      if (!visible.size) return;
      // 画面上で最も上にあるセクションをアクティブ化
      const topmost = [...visible].sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      )[0];
      activate(topmost.id);
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach(s => observer.observe(s));
}
