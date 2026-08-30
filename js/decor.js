/**
 * decor.js — 装飾まわりの挙動
 *
 * 背景模様・帯・画像枠はすべて CSS だけで動くので、
 * ここが受け持つのはスクロール連動の演出だけ。
 */

export function initDecor() {
  initReveal();
}

/* ── .reveal をスクロールで浮かび上がらせる ── */
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  // 非対応環境では隠したままにせず、そのまま出す
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target); // 一度出したら監視をやめる
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
  );

  targets.forEach(el => observer.observe(el));
}
