# 金子 真理 ポートフォリオ

ゲームプログラマー志望・金子真理のポートフォリオサイト。

## 技術スタック

- HTML5 / CSS3（カスタムプロパティ） / Vanilla JavaScript (ES2020+)
- データ管理: JSON（works.json, i18n/*.json）
- ホスティング: GitHub Pages

## ローカル確認

`file://` では `fetch()` が動作しないため、HTTPサーバー経由で確認してください。
依存パッケージなしで動く静的サーバーを同梱しています。

```bash
node tools/dev-server.mjs
```

→ http://localhost:8080

## ディレクトリ構成

```
├── index.html        トップページ
├── works.html        作品ギャラリー
├── 404.html          エラーページ
├── css/
│   ├── tokens.css    デザイントークン（金地 #F8CC37 ＋ 黒インク）
│   ├── base.css      リセット
│   ├── layout.css    ヘッダー / フッター / セクション土台
│   ├── components.css ボタン / カード / モーダル
│   ├── sections.css  各セクション
│   ├── decor.css     装飾（流れる模様・帯・画像差し込み枠）
│   ├── works.css     works.html 専用
│   └── utilities.css
├── js/               nav.js, decor.js
├── data/             works.json, i18n/
├── assets/           画像・PDF等
└── tools/            dev-server.mjs（ローカル確認用）
```

## デザインの決まりごと

背景は金地 `#F8CC37`、刷り色は黒インク `#17130A`（コントラスト 12.07:1）、
差し色は深紅 `#8A2013`（金地に対して 5.96:1）。文字色・枠線はすべて
`css/tokens.css` のトークン経由で参照する。

| 用途 | トークン | 値 |
| --- | --- | --- |
| 背景（基本 / 濃い / 最も濃い） | `--gold-400` / `--gold-500` / `--gold-600` | `#F8CC37` / `#F2C222` / `#E7B41A` |
| カード面 | `--cream` | `#FFFBEE` |
| 本文・枠線・影 | `--ink-900` | `#17130A` |
| 差し色 | `--color-accent` | `#8A2013` |

枠線は `--border-hard`（2px インク）、影は色を持たないハードシャドウ
（`--shadow-md` ほか）で「版ズレ印刷」の質感に寄せている。

## 画面構成

ページは `.shell` = サイドバー ＋ 本文カラム の2枚構成。

```html
<div class="shell">
  <aside class="sidebar"> ... </aside>          <!-- 1024px 以上でのみ表示 -->
  <div class="shell__main">
    <header class="site-header"> ... </header>  <!-- 1024px 未満でのみ表示 -->
    <main id="main"> ... </main>
    <footer class="site-footer"> ... </footer>
  </div>
</div>
```

- **1024px 以上**: 左にインクのサイドバーが常駐する（`position: sticky` で貼り付く）。ヘッダーは消える
- **1024px 未満**: サイドバーが消え、ヘッダー＋ハンバーガー／ドロワーに切り替わる
- 現在地は `.sidebar__link.is-active` が金のブロックに反転して示す。
  `js/nav.js` のスクロールスパイが `.sidebar__link, .drawer__nav-link` に `is-active` を付ける
- **サイドバーを右に置きたいときは、`css/layout.css` の `.shell` の
  `flex-direction` を `row-reverse` にするだけ**

## 装飾のしくみ（css/decor.css）

### 流れる背景模様

セクションに `has-pattern` を付け、中に `.pattern` を1枚置く。
`.container` は自動的に模様より前面に出る。

```html
<section class="section has-pattern">
  <div class="pattern pattern--stripe pattern--faint pattern--fade" aria-hidden="true"></div>
  <div class="container"> ... </div>
</section>
```

| 模様 | 動き |
| --- | --- |
| `pattern--stripe` | 斜めストライプが横に流れる |
| `pattern--dots` | ドットが斜めに流れる |
| `pattern--grid` | 方眼が斜めに流れる |
| `pattern--checker` | 市松が斜めに流れる |
| `pattern--scan` | 走査線が下に流れる |
| `pattern--rays` | 集中線がゆっくり回る |
| `pattern--grain` | 紙目（静止・質感用に重ねる） |

濃さは `pattern--faint` / `--bold` / `--ink`、速さは `pattern--slow` / `--fast`、
`pattern--still` で停止。縁をぼかすなら `pattern--fade`（上下）か
`pattern--vignette`（中央）。個別調整は `style="--pattern-tile: 40px; --pattern-speed: 30s"`。

模様は `transform` で動かしている（`background-position` だと毎フレーム
塗り直しになるため）。`prefers-reduced-motion` の環境では静止した模様として残る。

### 画像の差し込み枠

枠だけ置けばハッチ模様とラベルのプレースホルダーが出る。
`.frame__img` を入れるとプレースホルダーは自動的に消える。

```html
<figure class="frame frame--16x9 frame--pop" data-label="DeathBombing">
  <img class="frame__img" src="assets/images/works/deathbombing/hero.jpg" alt="">
</figure>
```

- 比率: `frame--16x9` / `--4x3` / `--21x9` / `--3x4` / `--1x1` / `--free`
- 見た目: `frame--pop`（ハードシャドウ） / `--ring`（二重枠） / `--round`（丸） / `--soft`（控えめ）
- 動き: `frame--zoom`（ホバーで拡大）
- 用途別: `banner-slot`（セクション用の横長） / `icon-slot`（リンクアイコン用の小さな正方形）

現在この枠が置いてあるのは、ヘッダーのロゴマーク・プロフィール写真・
Works セクションのバナーの3か所。増やすときは上と同じ書き方で置く。

### スクロールする帯

`.tape-band` で囲むのを忘れないこと（傾けた帯が横スクロールを生むため）。
中身は同じ並びをちょうど2回置く。

```html
<div class="tape-band">
  <div class="tape tape--tilt" aria-hidden="true">
    <div class="tape__track">
      <div class="tape__group"> <span class="tape__item">...</span> </div>
      <div class="tape__group"> <span class="tape__item">...</span> </div>
    </div>
  </div>
</div>
```

### その他

`.eyebrow` `.rule` `.stamp` `.marker` `.pop`、
スクロールで浮かび上がる `.reveal`（`js/decor.js` が `.is-in` を付ける）。

## 未実装

`js/` にあるのは `nav.js`（ヘッダー・ドロワー・スクロールスパイ）と
`decor.js`（スクロール演出）のみ。以下は HTML の受け皿だけある状態:

- 作品カードの描画（`#featured-works` / `#works-gallery` がスピナーのまま）
- 作品詳細の表示、スクリーンショットのスライドショー
- 技術・年度フィルタ、ソート
- JA / EN 切り替え（`data-i18n` を差し替える処理）
