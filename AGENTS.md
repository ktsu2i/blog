# CLAUDE.md

## Project Overview

ktsu2i.dev — Kaito Tsutsui の個人ブログ＆ポートフォリオサイト。
3つのソース（ローカルMDX、Zenn、Bengo4）の記事を統合表示する。

- **URL**: https://ktsu2i.dev
- **Framework**: Astro 7 + React 19 (Islands Architecture)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Package Manager**: pnpm

## Commands

```bash
pnpm dev            # 開発サーバー起動 (port 3000)
pnpm build          # ビルド（prebuild で bengo4 記事を自動フェッチ。CI は prebuild を飛ばして astro build を直接実行）
pnpm preview        # ビルド結果のプレビュー
pnpm fetch:bengo4   # Bengo4 Creators Blog から記事を手動フェッチ
pnpm test           # Vitest でテスト実行
pnpm test:coverage  # カバレッジ計測（src/**/*.{ts,tsx} で 100% 必須、components/ui は除外）
pnpm test:vrt       # Playwright で VRT（要 Docker。ブラウザは公式イメージ内で動かし OS 差を排除）
pnpm test:vrt:update # VRT のベースライン（tests/vrt/__screenshots__/）を更新
pnpm test:a11y      # Playwright + axe-core で a11y テスト（WCAG 2.2 AA、VRT と同じ Docker ブラウザ・4 プロジェクトで実行）
pnpm test:lighthouse # Lighthouse CI（ビルド後に dist を配信して計測、設定と Performance Budget は lighthouserc.json）
pnpm lint           # Oxlint（type-aware）で lint
pnpm typecheck      # astro check で .astro を含む型チェック（CI で実行）
pnpm format         # Oxfmt で整形（.astro は Oxfmt 未対応のため Prettier）
pnpm format:check   # 整形チェック（CI で実行）
pnpm knip           # 未使用ファイル・export・依存の検出（CI で実行、設定は knip.json）
pnpm exec lefthook run pre-commit --all-files  # pre-commit フックを全ファイルに実行
jactionlint         # ワークフローの lint（actionlint のフォーク、aqua で導入: aqua i -l）
ghalint run         # ワークフローのセキュリティポリシーチェック（aqua で導入）
gh actions-lock --no-narrow  # Action の SHA を変えたら .github/workflows/actions.lock を更新（--no-narrow を付けないと SHA ピンがタグに書き換わる。CI は --verify）
```

## Project Structure

```
src/
├── content/posts/
│   ├── ja/              # ローカル記事（日本語、MDX）
│   └── en/              # ローカル記事（英語、MDX）。同じファイル名で ja と対応
├── components/
│   ├── layout/          # Header, Footer, MobileNav, ThemeToggle, LanguageToggle
│   ├── pages/           # ページ本体（HomePage, BlogPage, BlogPostPage, AboutPage, TalksPage）
│   ├── post/            # PostCard, PostFilter, PostNav（記事末尾の前後記事・一覧へ戻るリンク）
│   ├── TalkCard.astro
│   └── ui/              # shadcn/ui コンポーネント
├── data/
│   ├── career.ts        # 経歴データ
│   ├── talks.ts         # 登壇データ
│   ├── zenn.ts          # Zenn 記事（手動管理）
│   ├── external.ts      # その他の外部記事（手動管理）
│   └── generated/       # 自動生成ファイル（gitignore 対象、prebuild で生成）
│       └── bengo4.json  # fetch-bengo4 スクリプトで生成
├── i18n/
│   ├── config.ts        # Locale 型、Translations 型、useTranslations / getLocalePath など
│   ├── ja.ts            # 日本語の翻訳テーブル
│   └── en.ts            # 英語の翻訳テーブル
├── layouts/
│   └── BaseLayout.astro # 共通レイアウト（meta, OG, hreflang, JSON-LD）
├── lib/
│   ├── feed.ts          # 全ソース統合（listAllPosts）
│   ├── posts.ts         # ローカル記事の読み込み
│   ├── zenn.ts          # Zenn 記事の読み込み
│   ├── external.ts      # 外部記事（bengo4.json + data/external.ts）の読み込み
│   ├── theme.ts         # ThemeToggle のクライアントスクリプト（html.dark の切り替えと保存）
│   ├── types.ts         # 型定義（Post, PostSource, Talk, CareerEntry 等）
│   ├── mobile-nav.ts    # MobileNav のクライアントスクリプト（<dialog> の開閉）
│   ├── og.ts            # OG 画像生成ユーティリティ
│   ├── og-route.ts      # OG 画像ルートの共通処理（ja / en の [slug].png.ts と site.png.ts から呼ぶ）
│   ├── post-filter.ts   # PostFilter のクライアントスクリプト（ソース別の表示切り替え）
│   ├── remark-mermaid.ts # mermaid コードブロックをビルド時に SVG 化する remark プラグイン
│   ├── remark-x-embed.ts # X の投稿 URL を oEmbed で埋め込む remark プラグイン
│   ├── rss.ts           # RSS フィード生成（ja / en の feed.xml.ts から呼ぶ）
│   └── utils.ts         # 汎用ユーティリティ（cn、日付降順の比較関数 compareByDateDesc、JST 固定の日付表示 formatDate / toDateAttr）
├── pages/
│   ├── index.astro      # トップページ（最新4件を2列グリッド表示）
│   ├── blog/            # ブログ一覧・個別記事ページ
│   ├── about.astro      # About ページ（経歴タイムライン）
│   ├── talks.astro      # 登壇一覧
│   ├── 404.astro
│   ├── feed.xml.ts      # RSS フィード（ローカル記事のみ）
│   ├── og/              # OG 画像の動的生成（Satori + Sharp）: [slug].png.ts, site.png.ts
│   └── en/              # 英語版ルート（/en/...）。中身は components/pages/ を呼ぶだけ
├── scripts/
│   └── fetch-bengo4.ts  # Bengo4 RSS フェッチスクリプト
├── styles/globals.css   # グローバルスタイル
└── content.config.ts    # Astro Content Collections スキーマ定義（postsJa, postsEn）
```

## Content Sources

### 1. ローカル記事

- `src/content/posts/ja/` / `src/content/posts/en/` に MDX ファイルを作成（ファイル名 `YYYYMMDD-slug.mdx`、slug は日付部分を除いたもの）
- 記事は必ず ja / en の両方を書く。同じファイル名・同じ `draft` 値で揃っていないと `src/content/posts.test.ts` が落ちる（書きかけは両方 `draft: true` にしておく）
- Frontmatter: `title`(必須), `date`(必須、`YYYY-MM-DD` 形式で検証), `description`(任意、未設定・空なら本文先頭から自動生成), `draft`(任意), `ogTitle`(任意)
- OG 画像は `/og/[slug].png`（英語は `/en/og/[slug].png`）で自動生成される

### 2. Zenn 記事

- `src/data/zenn.ts` にエントリを手動追加
- Post 型に合わせて `source: POST_SOURCES.ZENN`（値は `"Zenn"`）を指定

### 3. 外部記事（Bengo4 ほか）

- `pnpm fetch:bengo4` で RSS（https://creators.bengo4.com/feed）から著者 `ktsu2i` の記事を自動取得
- `src/data/generated/bengo4.json` に出力
- `pnpm build` 時に prebuild フックで自動実行される
- それ以外の外部記事は `src/data/external.ts` に手動追加
- どちらも `source: POST_SOURCES.EXTERNAL`（値は `"External"`）

## i18n

- 対応ロケールは `ja`（デフォルト、プレフィックスなし）と `en`（`/en/` プレフィックス）
- UI 文言は `src/i18n/{ja,en}.ts` に置き、コンポーネントへの直書きはしない。キーを追加したら `Translations` 型にも追加する
- React アイランドには翻訳テーブルを渡さず、Astro 側で解決した文字列を props で渡す
- ロケールを受け取る props は `string` ではなく `Locale` 型にする

## Key Architecture Decisions

- **Islands Architecture**: クライアントで動く React アイランドはない。ThemeToggle・PostFilter・MobileNav は Astro コンポーネント + 素の `<script>`（ロジックは `src/lib/theme.ts` / `src/lib/post-filter.ts` / `src/lib/mobile-nav.ts`）。MobileNav はネイティブの `<dialog>`（`showModal()`）で、Esc・フォーカス制御はブラウザ任せ、背景スクロールのロックは `globals.css` の `html:has(dialog:modal)`。React は shadcn/ui などの SSR にだけ使い、新しいインタラクションも素の JS で書けるなら React にしない
- **Content Collections**: Astro の Content Collections + Zod でローカル記事のスキーマを検証
- **統一 Post 型**: 3ソースを `Post` インターフェースで統一し、`listAllPosts()` で日付降順にマージ
- **Markdown 処理**: remark-gfm → remark-mermaid（` ```mermaid ` を beautiful-mermaid でビルド時にインライン SVG 化。色はサイトの CSS 変数を参照するのでダークモードにも追従。対応は flowchart / state / sequence / class / ER / xychart のみで、未対応・構文エラーはビルドを失敗させる）→ remark-x-embed（単独行の X 投稿 URL を oEmbed 埋め込みに変換、失敗時はリンクカードにフォールバック）→ remark-link-card-plus → rehype-slug、シンタックスハイライトは Astro 組み込みの Shiki（github-dark）
- **テスト配置**: 実装の隣に `*.test.ts(x)` を置く。`src/pages/` 配下は Astro がルートとして扱うため `src/pages/__tests__/` に置く（`_` 始まりは除外される）。共通 setup とモックは `tests/`。VRT は `tests/vrt/`（ホームの記事一覧は記事追加で変わるためマスク）、a11y テストは `tests/a11y/`
- **Lighthouse CI / Performance Budget**: `lighthouserc.json` で主要ページを計測。a11y・SEO は 100 点、best-practices は 95 点、リソースサイズ（`resource-summary:*`）の budget を超えると CI が落ちる。Performance スコアと Core Web Vitals は計測ブレが大きいため warn のみ。talks の Speaker Deck はサムネイルを表示し、クリック時に iframe を読み込む facade パターンにしているため全ページ共通の budget で計測する。レポートは CI の artifact（`lighthouse-report`）に保存
- **Git フック**: lefthook（`lefthook.yaml`）。`pnpm install` 時に自動でフックが入り、pre-commit でステージ済みファイルに oxlint / oxfmt / Prettier を実行し、整形結果は自動で再ステージする
- **末尾スラッシュ**: `trailingSlash: "always"`。内部リンクは必ず `/` で終わらせる（`getLocalePath("/blog/", locale)` のように呼び出し側で付ける）。付け忘れると本番では Workers Assets の 307 リダイレクトが挟まり、dev / preview では 404 になる
- **YAML の拡張子**: `.yml` は禁止で、`.yaml` に統一する（lefthook の `forbid-yml` ジョブでチェック）
- **画像ドメイン許可**: `res.cloudinary.com`, `cdn.image.st-hatena.com`, `tech.pepabo.com`（記事カードの OG 画像）, `files.speakerdeck.com`（登壇スライドのサムネイル）。PostCard / TalkCard は `astro:assets` の `<Image>` でビルド時に WebP 化して自サイトから配信するので、外部記事の OG 画像のドメインは追加が必要（未登録だと原寸のまま外部から読み込む）。ローカル記事の `/og/*.png` はエンドポイントの出力なので変換されない
