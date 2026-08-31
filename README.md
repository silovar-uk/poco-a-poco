# Poco a Poco

日本語を足場に、5分ずつスペイン語を「思い出す → 声に出す → 自分の話へ変える」ための、build-freeな学習Webアプリです。

## Product structure

- **HOME** — 今日の5分
- **PATH** — Can-do順に進む
- **PRACTICE** — Smart Randomで復習
- **DISCOVERY** — 言葉・文化・音への寄り道
- **LESSON** — SCENE → MEANING → CHUNK → RETRIEVE → SPEAK → CHANGE → PERSONALIZE → REUSE → DONE

## Internal structure

現在の実装は責務を次の層へ分離しています。

```text
data/       learning content
domain/     pure learning/progress logic
state/      ephemeral lesson session state
storage/    versioned local persistence + migration
app.js      UI orchestration
design.js   explicit Living Spanish design contract
```

詳細は [`ARCHITECTURE.md`](./ARCHITECTURE.md) を参照してください。

## Storage

既存互換のため保存キーは `poco-a-poco-v1` を維持しています。

現在のpayloadには `schemaVersion: 1` を持たせ、旧unversioned stateを自動migrationします。壊れたJSONは可能な場合timestamp付きbackupを残してからfallbackします。

現時点ではデータ量が小さいためIndexedDBへは移行せず、Storage Adapterだけを分離しています。

## Tests

依存追加なしで実行できます。

```bash
npm test
```

主な対象:

- app/design syntax
- lesson data validation
- storage migration / corruption fallback
- practice priority
- streak / next lesson
- lesson session contract
- design layer dependency contract

`main` へのpushでも `.github/workflows/test.yml` が実行されます。

## Development principles

- Simple now, replaceable later.
- UIからlearning logicを分離する。
- DomainからDOM / localStorageへ依存しない。
- Living Spanishの表示契約をリファクタで壊さない。
- React / backend / DB / AIなどは、現在の具体的な問題を解決しない限り追加しない。

## Deployment

Canonical sourceは `main`、GitHub Pagesの公開branchは `gh-pages` です。

基本フロー:

```text
main
→ Internal foundation tests
→ gh-pagesへfast-forward
→ GitHub Pages build/deploy
→ production smoke check
```

公開URL:

https://silovar-uk.github.io/poco-a-poco/
