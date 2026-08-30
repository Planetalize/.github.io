# 金子 真理 ポートフォリオ

ゲームプログラマー志望・金子真理のポートフォリオサイト。

## 技術スタック

- HTML5 / CSS3（カスタムプロパティ） / Vanilla JavaScript (ES2020+)
- データ管理: JSON（works.json, i18n/*.json）
- ホスティング: GitHub Pages
- ビルド不要。HTML をそのまま編集して push すれば公開される

## ローカル確認

`file://` では `fetch()` が動作しないため、HTTPサーバー経由で確認してください。
依存パッケージなしで動く静的サーバーを同梱しています。

```bash
node tools/dev-server.mjs
```

→ http://localhost:8080

## ディレクトリ構成

```
├── index.html        TOP
├── about.html        ABOUT（プロフィール＋スキル）
├── works.html        WORKS（カテゴリタブ付きの作品一覧）
├── chara.html        CHARA（自作キャラ紹介）
├── note.html         NOTE（制作ノート・技術記事）
├── contact.html      CONTACT
├── other.html        OTHER（ミニゲーム・雑多なリンク）
├── 404.html
├── css/
│   ├── tokens.css    デザイントークン（金地 #F8CC37 ＋ 黒インク）
│   ├── base.css      リセット
│   ├── layout.css    シェル / サイドバー / シート
│   ├── components.css ボタン / カード / モーダル
│   ├── sections.css  各ページの中身
│   ├── decor.css     装飾（流れる模様・画像差し込み枠）
│   ├── works.css     WORKS ページ専用
│   └── utilities.css
├── js/               nav.js, decor.js
├── data/             works.json, i18n/
├── assets/           画像・PDF等
└── tools/
    ├── dev-server.mjs   ローカル確認用サーバー
    └── sync-shell.mjs   全ページ共通の枠を揃える
```

## デザインの決まりごと

背景は金地 `#F8CC37`、刷り色は黒インク `#17130A`（コントラスト 12.07:1）、
差し色は深紅 `#8A2013`（金地に対して 5.96:1）。文字色・枠線はすべて
`css/tokens.css` のトークン経由で参照する。

| 用途 | トークン | 値 |
| --- | --- | --- |
| 背景（基本 / 濃い / 最も濃い） | `--gold-400` / `--gold-500` / `--gold-600` | `#F8CC37` / `#F2C222` / `#E7B41A` |
| シート・カード面 | `--cream` | `#FFFBEE` |
| 本文・枠線・影 | `--ink-900` | `#17130A` |
| 差し色 | `--color-accent` | `#8A2013` |

枠線は `--border-hard`（2px インク）、影は色を持たないハードシャドウ
（`--shadow-md` ほか）で「版ズレ印刷」の質感に寄せている。

## 画面構成

**ページ全体はスクロールしない。** 金地の枠の中にサイドバーとクリームの
シートが並び、中身が多いページは**シートの内側だけ**がスクロールする。

```html
<div class="shell">
  <aside class="sidebar"> ... </aside>          <!-- 1024px 以上でのみ表示 -->
  <header class="site-header"> ... </header>    <!-- 1024px 未満でのみ表示 -->
  <main class="sheet" id="main">
    <header class="sheet__head">
      <h1 class="page-title">TOP</h1>           <!-- 「」は CSS が付ける -->
    </header>
    <div class="sheet__body"> ... </div>        <!-- ここだけスクロールする -->
  </main>
</div>
```

- **1024px 以上**: 左に金地のサイドバー。ナビは黒く塗った札で、現在地だけ
  クリームに反転してシートと呼応する
- **1024px 未満**: サイドバーが消え、ヘッダー＋ハンバーガー／ドロワーに切り替わる
- 縦に中央寄せしたいページ（TOP / CONTACT）は `sheet__body--center` を付ける
- **サイドバーを右に置きたいときは、`css/layout.css` の `.shell` の
  `flex-direction` を `row-reverse` にするだけ**

### 共通の枠を直すとき

サイドバー・ドロワー・ヘッダーは全ページに同じものが埋め込んである
（JS 無しでも表示され、検索エンジンにも拾われるように）。マーカーで
囲んであるので、**`index.html` だけ直して同期スクリプトを流す**。

```bash
node tools/sync-shell.mjs
```

現在地のハイライトはスクリプトがページごとに付け直す。
`--check` を付けるとズレの検出だけ行う（書き換えない）。

## 装飾のしくみ（css/decor.css）

### 流れる背景模様

要素に `has-pattern` を付け、中に `.pattern` を1枚置く。

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
- 用途別: `banner-slot`（横長） / `icon-slot`（小さな正方形）

いま枠が置いてあるのは、ヘッダーとサイドバーのロゴマーク、ABOUT の
プロフィール写真、CHARA の3枠、OTHER の2枠。

### その他

`.eyebrow` `.rule` `.stamp` `.marker` `.pop`、スクロールする帯 `.tape`
（`.tape-band` で囲むこと）、浮かび上がる `.reveal`（`js/decor.js` が
`.is-in` を付ける。監視対象は `.sheet__body`）。

## works.json

作品1件の形。`category` が WORKS ページのタブに対応する。

| キー | 値 |
| --- | --- |
| `category` | `game` / `illust` / `tool`（タブの `data-category` と一致させる） |
| `teamType` | `solo` / `team` |
| `thumbnail` | カードのサムネイル画像パス |
| `screenshots` | 詳細で並べる画像パスの配列 |

## 未実装

`js/` にあるのは `nav.js`（ドロワー）と `decor.js`（スクロール演出）のみ。
以下は HTML の受け皿だけある状態:

- 作品カードの描画（`#works-gallery` がスピナーのまま）
- カテゴリタブ（`.tab`）とフィルタ・ソートの動作
- 作品詳細（**モーダルではなくページ遷移で作る**）
  - モーダルの HTML は全ページから外した。
    ただし `css/components.css` の `.modal__*` と `.slideshow` は
    詳細ページのスクリーンショット表示にそのまま流用できるので残してある
- JA / EN 切り替え（`data-i18n` を差し替える処理）

## 未用意のアセット

参照だけしていて実体がないもの。

```
assets/resume.pdf                履歴書
assets/images/ogp.jpg            OGP画像
assets/images/thumbs/guild.jpg   作品サムネイル
apple-touch-icon.png
```
