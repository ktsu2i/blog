# CLAUDE.md

## Project Overview

ktsu2i.dev — Kaito Tsutsui の個人ブログ＆ポートフォリオサイト。
3つのソース（ローカルMDX、Zenn、Bengo4）の記事を統合表示する。

- **URL**: https://ktsu2i.dev
- **Framework**: Astro 5 + React 19 (Islands Architecture)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Package Manager**: pnpm

## Commands

```bash
pnpm dev            # 開発サーバー起動 (port 3000)
pnpm build          # ビルド（prebuild で bengo4 記事を自動フェッチ）
pnpm preview        # ビルド結果のプレビュー
pnpm fetch:bengo4   # Bengo4 Creators Blog から記事を手動フェッチ
```

## Project Structure

```
src/
├── content/posts/       # ローカル記事（MDX）
├── components/
│   ├── layout/          # Header, Footer, MobileNav, ThemeToggle
│   ├── post/            # PostCard, PostFilter
│   └── ui/              # shadcn/ui コンポーネント
├── data/
│   ├── career.ts        # 経歴データ
│   ├── talks.ts         # 登壇データ
│   ├── zenn.ts          # Zenn 記事（手動管理）
│   └── generated/       # 自動生成ファイル（git 管理対象）
│       └── bengo4.json  # fetch-bengo4 スクリプトで生成
├── lib/
│   ├── feed.ts          # 全ソース統合（listAllPosts）
│   ├── posts.ts         # ローカル記事の読み込み
│   ├── zenn.ts          # Zenn 記事の読み込み
│   ├── bengo4.ts        # Bengo4 記事の読み込み
│   ├── types.ts         # 型定義（Post, PostSource, Talk, CareerEntry 等）
│   ├── og.ts            # OG 画像生成ユーティリティ
│   └── utils.ts         # 汎用ユーティリティ
├── pages/
│   ├── index.astro      # トップページ（最新4件を2列グリッド表示）
│   ├── blog/            # ブログ一覧・個別記事ページ
│   ├── about.astro      # About ページ（経歴タイムライン）
│   ├── talks.astro      # 登壇一覧
│   ├── feed.xml.ts      # RSS フィード（ローカル記事のみ）
│   └── og/[slug].png.ts # OG 画像の動的生成（Satori + Sharp）
├── scripts/
│   └── fetch-bengo4.ts  # Bengo4 RSS フェッチスクリプト
├── styles/globals.css   # グローバルスタイル
└── content.config.ts    # Astro Content Collections スキーマ定義
```

## Content Sources

### 1. ローカル記事
- `src/content/posts/` に MDX ファイルを作成
- Frontmatter: `title`(必須), `date`(必須), `tags`(必須), `description`(必須), `draft`(任意), `ogTitle`(任意)
- OG 画像は `/og/[slug].png` で自動生成される

### 2. Zenn 記事
- `src/data/zenn.ts` にエントリを手動追加
- Post 型に合わせて `source: "zenn"` を指定

### 3. Bengo4 記事
- `pnpm fetch:bengo4` で RSS（https://creators.bengo4.com/feed）から著者 `ktsu2i` の記事を自動取得
- `src/data/generated/bengo4.json` に出力
- `pnpm build` 時に prebuild フックで自動実行される

## Key Architecture Decisions

- **Islands Architecture**: インタラクティブな UI（PostFilter, ThemeToggle, MobileNav）のみ React、それ以外は Astro コンポーネント
- **Content Collections**: Astro の Content Collections + Zod でローカル記事のスキーマを検証
- **統一 Post 型**: 3ソースを `Post` インターフェースで統一し、`listAllPosts()` で日付降順にマージ
- **Markdown 処理**: remark-gfm → rehype-slug → rehype-pretty-code (theme: one-dark-pro)
- **画像ドメイン許可**: `res.cloudinary.com`, `cdn.image.st-hatena.com`
