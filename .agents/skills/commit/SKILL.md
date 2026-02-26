---
name: commit
description: Create a git commit following Conventional Commits format in English
---

Create a git commit using the Conventional Commits specification. All commit messages MUST be written in English.

## Steps

1. Run `git status` and `git diff --staged` (and `git diff` for unstaged changes) to understand what has changed.
2. If there are unstaged changes but no staged changes, stage the relevant files (prefer specific file names over `git add .`).
3. Review `git log --oneline -5` to maintain consistency with prior commits.
4. Compose a commit message following the format below.
5. Commit with the message using a HEREDOC.
6. Run `git status` after committing to confirm success.

## Commit Message Format

```
<type>: <short summary in imperative mood>
```

### Types

| Type       | When to use                                      |
|------------|--------------------------------------------------|
| `feat`     | A new feature                                    |
| `fix`      | A bug fix                                        |
| `docs`     | Documentation only changes                       |
| `style`    | Formatting, missing semicolons, etc. (no logic)  |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvement                          |
| `test`     | Adding or updating tests                         |
| `chore`    | Build process, dependencies, CI, tooling         |

### Rules

- The summary MUST be in English, imperative mood, lowercase, and without a trailing period.
- Keep the summary under 72 characters.
- If more context is needed, add a blank line after the summary followed by a body paragraph (also in English).
- Always append the co-author trailer:

```
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```
