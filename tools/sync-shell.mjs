/**
 * sync-shell.mjs — 全ページ共通の枠（サイドバー・ドロワー・ヘッダー）を揃える
 *
 * 各ページの HTML には下のようなマーカーが入っている:
 *
 *   <!-- SHELL:SIDEBAR:START -->  ...  <!-- SHELL:SIDEBAR:END -->
 *
 * SOURCE（既定は index.html）のマーカー内をそのまま他のページへ複製し、
 * 現在地のハイライト（is-active / aria-current）だけページごとに付け直す。
 *
 * ナビを増やしたり減らしたりしたら index.html だけ直して、これを実行する:
 *
 *   node tools/sync-shell.mjs
 *   node tools/sync-shell.mjs --check   （差分があれば異常終了。書き換えない）
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = 'index.html';
const PAGES = [
  'index.html',
  'about.html',
  'works.html',
  'chara.html',
  'note.html',
  'contact.html',
  'other.html',
];
const BLOCKS = ['DRAWER', 'SIDEBAR', 'HEADER'];

const checkOnly = process.argv.includes('--check');

const read = (file) =>
  fs.readFileSync(path.join(ROOT, file), 'utf8').split('\r\n').join('\n');

/** マーカーで囲まれた中身を取り出す */
function getBlock(html, name, file) {
  const start = `<!-- SHELL:${name}:START -->`;
  const end = `<!-- SHELL:${name}:END -->`;
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  if (a < 0 || b < 0 || b < a) {
    throw new Error(`${file}: SHELL:${name} のマーカーが見つからない`);
  }
  return html.slice(a + start.length, b);
}

/** マーカーで囲まれた中身を差し替える */
function setBlock(html, name, content) {
  const start = `<!-- SHELL:${name}:START -->`;
  const end = `<!-- SHELL:${name}:END -->`;
  const a = html.indexOf(start) + start.length;
  const b = html.indexOf(end);
  return html.slice(0, a) + content + html.slice(b);
}

/**
 * 現在地のハイライトを張り直す。
 * いったん全部外してから、そのページ自身へのリンクにだけ付ける。
 */
function markCurrent(block, file) {
  const cleaned = block
    .replace(/ is-active/g, '')
    .replace(/ aria-current="page"/g, '');

  // href="about.html" のように、そのページを指しているリンクを探す
  return cleaned.replace(
    new RegExp(`(<a class="(sidebar__link|drawer__nav-link))(" href="${file}")`, 'g'),
    '$1 is-active$3 aria-current="page"'
  );
}

const source = read(SOURCE);
const blocks = Object.fromEntries(
  BLOCKS.map(name => [name, getBlock(source, name, SOURCE)])
);

let changed = 0;

for (const file of PAGES) {
  const before = read(file);
  let after = before;

  for (const name of BLOCKS) {
    const content = name === 'HEADER'
      ? blocks[name]                     // ヘッダーにはナビが無いのでそのまま
      : markCurrent(blocks[name], file);
    after = setBlock(after, name, content);
  }

  if (after === before) {
    console.log(`   同じ  ${file}`);
    continue;
  }

  changed++;
  if (checkOnly) {
    console.error(`✗ ずれている  ${file}`);
  } else {
    fs.writeFileSync(
      path.join(ROOT, file),
      after.split('\n').join('\r\n'),
      'utf8'
    );
    console.log(`✓ 更新    ${file}`);
  }
}

if (checkOnly && changed) {
  console.error(`\n${changed} ファイルが ${SOURCE} とずれています。node tools/sync-shell.mjs を実行してください。`);
  process.exit(1);
}

console.log(`\n${changed === 0 ? 'すべて同期済み' : `${changed} ファイル更新`}`);
