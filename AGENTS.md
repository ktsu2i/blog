# AGENTS.md

ktsu2i.dev — Kaito Tsutsui's personal blog and portfolio (https://ktsu2i.dev). It merges posts from three sources (local MDX, Zenn, Bengo4) into one feed.

Stack: Astro 7 + React 19, Tailwind CSS v4 + shadcn/ui, pnpm, deployed to Cloudflare Workers.

## Commands

```bash
pnpm dev               # Dev server on port 3000
pnpm build             # Build; the prebuild hook fetches Bengo4 posts first (CI skips it and runs `astro build`)
pnpm preview           # Serve the build output
pnpm fetch:bengo4      # Fetch Bengo4 posts manually
pnpm test              # Vitest
pnpm test:coverage     # 100% coverage required on src/**/*.{ts,tsx}, excluding components/ui
pnpm lint              # Oxlint (type-aware)
pnpm typecheck         # astro check, covers .astro files
pnpm format            # Oxfmt; .astro files go through Prettier since Oxfmt does not support them
pnpm format:check
pnpm knip              # Unused files, exports and dependencies (config: knip.json)
pnpm test:vrt          # Playwright VRT; needs Docker (browser runs in the official image)
pnpm test:vrt:update   # Update baselines in tests/vrt/__screenshots__/
pnpm test:a11y         # Playwright + axe-core, WCAG 2.2 AA, same Docker browser and 4 projects as VRT
pnpm test:lighthouse   # Lighthouse CI against a fresh build (config and budgets: lighthouserc.json)
jactionlint            # Lint workflows (actionlint fork, installed via aqua: `aqua i -l`)
ghalint run            # Workflow security policy check (installed via aqua)
gh actions-lock --no-narrow  # Regenerate .github/workflows/actions.lock after changing an action SHA
```

Before finishing a change, run `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm knip` and `pnpm test:coverage`; CI runs all of them. Run the Playwright suites too when UI changes.

## Conventions

- Code comments are in English and terse: one or two lines stating only the non-obvious constraint.
- Commits and PR titles/bodies are in English and follow Conventional Commits. Use the `commit` and `create-pr` skills.
- Tests sit next to the implementation as `*.test.ts(x)`. Tests for `src/pages/` go in `src/pages/__tests__/`, because Astro treats every other file there as a route (`_`-prefixed paths are ignored). Shared setup and mocks live in `tests/`, VRT in `tests/vrt/` and a11y tests in `tests/a11y/`.
- Use the `.yaml` extension, never `.yml` (enforced by the `forbid-yml` lefthook job).
- Dependencies are pinned to exact versions (`savePrefix: ""`). pnpm 11 ignores `.npmrc`, so pnpm settings go in `pnpm-workspace.yaml`.
- Git hooks are managed by lefthook and installed on `pnpm install`. Pre-commit runs oxlint, oxfmt and Prettier on staged files and re-stages the fixes.

### GitHub Actions

- Set root `permissions: {}` and grant permissions per job. Give every job a `name:`.
- Pin actions to commit SHAs with a `# vX.Y.Z` comment; write no other comments.
- After changing a SHA, run `gh actions-lock --no-narrow`. Without `--no-narrow` it rewrites SHA pins into tags. CI runs `gh actions-lock --verify`.

## Architecture

- **No client-side React.** ThemeToggle, PostFilter and MobileNav are Astro components with plain `<script>` tags; their logic lives in `src/lib/theme.ts`, `src/lib/post-filter.ts` and `src/lib/mobile-nav.ts`. React is only used for SSR of shadcn/ui components. Write new interactions in plain JS unless React is truly needed.
- **MobileNav** is a native `<dialog>` opened with `showModal()`. The browser handles Esc and focus; background scroll is locked by `html:has(dialog:modal)` in `src/styles/globals.css`.
- **Unified `Post` type** (`src/lib/types.ts`): every source maps to `Post`, and `listAllPosts()` in `src/lib/feed.ts` merges them newest first.
- **Page bodies** live in `src/components/pages/`. Route files under `src/pages/` and `src/pages/en/` only render them with a locale.
- **Markdown pipeline**: remark-gfm → remark-mermaid → remark-x-embed → remark-link-card-plus → rehype-slug. Syntax highlighting is Astro's built-in Shiki (github-dark).
  - `src/lib/remark-mermaid.ts` renders ` ```mermaid ` blocks to inline SVG at build time with beautiful-mermaid. Colors use the site's CSS variables, so dark mode works. Only flowchart, state, sequence, class, ER and xychart are supported; anything else, or a syntax error, fails the build.
  - `src/lib/remark-x-embed.ts` turns a standalone X post URL into an oEmbed embed and falls back to a link card on failure.
- **OG images** are generated with Satori + Sharp in `src/pages/og/` (shared logic in `src/lib/og-route.ts`).
- **RSS** (`feed.xml`) includes local posts only.

## Content sources

### Local posts

- MDX files in `src/content/posts/ja/` and `src/content/posts/en/`, named `YYYYMMDD-slug.mdx`. The slug is the part after the date.
- Every post must exist in both languages with the same file name and the same `draft` value, or `src/content/posts.test.ts` fails. Mark unfinished posts `draft: true` in both.
- Frontmatter: `title` (required), `date` (required, `YYYY-MM-DD`), `description` (optional; generated from the body when missing or empty), `draft` (optional), `ogTitle` (optional). The schema is in `src/content.config.ts`.
- OG images are served at `/og/[slug].png` and `/en/og/[slug].png`.

### Zenn posts

Add entries to `src/data/zenn.ts` by hand with `source: POST_SOURCES.ZENN`.

### External posts (Bengo4 and others)

- `pnpm fetch:bengo4` reads https://creators.bengo4.com/feed, keeps posts by author `ktsu2i`, and writes `src/data/generated/bengo4.json` (gitignored).
- Other external posts are added to `src/data/external.ts` by hand.
- Both use `source: POST_SOURCES.EXTERNAL`.

## i18n

- Locales: `ja` (default, no prefix) and `en` (`/en/` prefix).
- UI strings live in `src/i18n/ja.ts` and `src/i18n/en.ts`; never hardcode them in components. Add new keys to the `Translations` type in `src/i18n/config.ts` too.
- Resolve strings in Astro and pass them to React components as props; do not pass translation tables.
- Type locale props as `Locale`, not `string`.

## Gotchas

- **Trailing slashes**: `trailingSlash: "always"`. Every internal link must end with `/`, e.g. `getLocalePath("/blog/", locale)`. A missing slash causes a 307 redirect from Workers Assets in production and a 404 in dev and preview.
- **Dates** are formatted in JST via `formatDate` / `toDateAttr` in `src/lib/utils.ts`; do not format dates with the host time zone.
- **Remote images**: PostCard and TalkCard use `<Image>` from `astro:assets`, which converts images to WebP at build time and serves them from this site. That only happens for allowed domains: `res.cloudinary.com`, `cdn.image.st-hatena.com`, `tech.pepabo.com` and `files.speakerdeck.com`. Add the domain in `astro.config.mjs` when an external post uses a new OG image host; otherwise the original is loaded from the remote host. Local `/og/*.png` images are endpoint output and are not converted.
- **VRT** masks the home page post list, since it changes whenever a post is added.
- **Lighthouse CI** requires 100 for accessibility and SEO, 95 for best practices, and fails on `resource-summary:*` budgets. Performance and Core Web Vitals only warn because they are noisy. Talk slides use a facade (thumbnail first, iframe on click) so the talks page fits the shared budget. Reports are saved as the `lighthouse-report` CI artifact.
