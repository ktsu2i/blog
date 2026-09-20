# AI レビューと自動 approve

`.github/workflows/review.yml` は、pull request を AI にレビューさせ、
**二重のゲートを両方通過したときだけ** `github-actions[bot]` に approve させる。

```
pull_request
├── gate   : jevgate が「AI 承認に任せてよい変更か」を判定 (ALLOW / HUMAN REVIEW REQUIRED)
├── review : Gemini CLI が差分をレビューし、指摘を PR コメントに投稿
└── approve: gate が ALLOW かつ review が blocking なし のときだけ approve
```

- **gate** は [ktsu2i/jevgate](https://github.com/ktsu2i/jevgate) を `main` からビルドして
  `--base <PR の base SHA> --head <PR の head SHA> --format json` で実行する。
  終了コード 0 が ALLOW、1 が人間レビュー必須、2 が評価失敗。1 と 2 は CI の失敗ではなく
  「自動 approve しない」という判断として扱うので、ジョブは緑のままになる。
- **review** は Gemini CLI に差分を読ませ、`.review/result.json`
  （`verdict` / `summary` / `findings`）を書かせる。結果は PR に 1 件のコメントとして投稿され、
  同じ PR では以後そのコメントが更新される。`severity: blocking` が 1 件でもあれば
  `verdict` が `approve` でも `request_changes` に倒す。
- **approve** は `gh pr review --approve` を `GITHUB_TOKEN` で実行する。
  同じ commit に対する二重 approve は事前チェックで防いでいる。

レビューが失敗した場合（無料枠のレート制限、JSON を書けなかった等）は `verdict=error` となり、
approve は行われずコメントだけが残る。fork からの PR と draft PR は対象外（secrets が使えないため）。

## 必要な設定

### Secrets

| 名前 | 用途 |
| --- | --- |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) の API キー。無料枠で動く。 |
| `JEV_API_KEY` | jevgate が使う [Jev API](https://docs.typesafe.ai/api) のキー。 |
| `JEVGATE_TOKEN` | `ktsu2i/jevgate` を clone するための読み取り専用トークン（contents: read の fine-grained PAT）。jevgate が public になったら不要。 |

### Variables（任意）

| 名前 | 用途 |
| --- | --- |
| `GEMINI_MODEL` | 使うモデル ID。未設定なら Gemini CLI の既定モデル。既定モデルが無料枠から外れた場合はここで無料枠のモデルを指定する。 |

### リポジトリ設定

- **Settings → Actions → General → Workflow permissions** の
  **Allow GitHub Actions to create and approve pull requests** を有効にする。
  これが無効だと approve ステップが `Resource not accessible by integration` で落ちる。
- ブランチ保護で approve を必須にする場合は、あわせて
  **Dismiss stale pull request approvals when new commits are pushed** を有効にすること。
  これが無いと、approve 後に push された commit が古い approve のまま merge できてしまう。
- `Require review from Code Owners` を有効にすると bot の approve では条件を満たせない。

## 無料枠について

- GitHub Models（`models: read` による無料推論）は 2026-07-30 に廃止済みで、
  GitHub 内で完結する無料 LLM の選択肢は現在ない。
- Gemini API の無料枠は Flash 系モデルのみで、1 日あたりのリクエスト数に上限がある。
  個人ブログの PR 数なら十分だが、上限に当たった日は `verdict=error` になり自動 approve されない。
- Claude Code Action に切り替える場合は `review` ジョブの `uses` を
  `anthropics/claude-code-action@v1` に差し替え、`CLAUDE_CODE_OAUTH_TOKEN`
  （Claude Pro/Max のサブスクリプションで `claude setup-token` から発行）を渡す。
  `.review/result.json` を書かせる prompt はそのまま使える。

## jevgate が release されたら

いまは private リポジトリを clone して `go build` している。
jevgate が public になりリリースが出たら、`gate` ジョブの Go ビルド 3 ステップを
リリースアーカイブのダウンロードに置き換えられる（`JEVGATE_TOKEN` も不要になる）。
