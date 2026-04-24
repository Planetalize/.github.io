# 金子 真理 ポートフォリオ

ゲームプログラマー志望・金子真理のポートフォリオサイト。

## 技術スタック

- HTML5 / CSS3（カスタムプロパティ） / Vanilla JavaScript (ES2020+)
- データ管理: JSON（works.json, i18n/*.json）
- ホスティング: GitHub Pages

## ローカル確認

`file://` では `fetch()` が動作しないため、HTTPサーバー経由で確認してください。

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## ディレクトリ構成

```
├── index.html        トップページ
├── works.html        作品ギャラリー
├── 404.html          エラーページ
├── css/              スタイルシート
├── js/               JavaScript
├── data/             works.json, i18n/
└── assets/           画像・PDF等
```
