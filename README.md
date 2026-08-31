# Poco a Poco

日本語話者向けのスペイン語Speaking MVP。

**Goal:** 5分使うだけでも「昨日より一つ話せる」を作る。

## Learning loop

SCENE / FEEL → MEANING / NOTICE → CHUNK → RETRIEVE → SPEAK → CHANGE → PERSONALIZE → REUSE

## Main areas

- **PATH** — Can-doベースで、次に学ぶ方向を作る
- **PRACTICE** — 学習履歴を使い、思い出す必要がある表現を優先する
- **DISCOVERY** — 文化・音・表現から予定外の発見を作る
- **Japanese support** — Level 1〜4で日本語の足場を段階的に減らす

## MVP rules

MVPでは以下を使いません。

- AI tutor / AI chat
- speech recognition
- pronunciation scoring
- accounts / backend sync

学習状態は `localStorage` の `poco-a-poco-v1` に保存します。

## Run locally

ビルド不要の静的Webアプリです。

```bash
python -m http.server 8000
```

その後 `http://localhost:8000` を開いてください。

## Files

- `index.html` — shell / navigation / support dialog
- `styles.css` — responsive UI
- `app.js` — lessons, learning flow, local state, Smart Random
- `.github/workflows/pages.yml` — GitHub Pages deploy

## QA checklist

- HOME → 今日の5分 → 9 steps → 完了
- 完了後に session / confidence / personal sentence が保存される
- PATH の完了状態が反映される
- PRACTICE に完了済みlessonが出る
- Smart Random が「低自信・経過時間・練習回数」を使う
- Japanese support Level 1〜4 が反映される
- DISCOVERY が表示される
- mobile width でnavigationとlessonが操作できる
- reload後もlocal stateが残る

## Deployment

`main` へのpushで GitHub Actions から GitHub Pages 用artifactを作成・deployします。

Repository: https://github.com/silovar-uk/poco-a-poco
