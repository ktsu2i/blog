---
name: create-pr
description: Create a GitHub pull request with Conventional Commits prefix and structured description in English
---

Create a GitHub pull request. The title MUST use a Conventional Commits prefix and all text MUST be in English.

## Steps

1. Run the following commands in parallel to understand the current state:
   - `git status` to check for uncommitted changes
   - `git branch --show-current` to get the current branch name
   - `git log --oneline main..HEAD` to see all commits on this branch
   - `git diff main...HEAD --stat` to see a summary of all changed files
2. If there are uncommitted changes, ask the user whether to commit them first (using the `/commit` skill) or proceed without them.
3. Push the branch to the remote if it hasn't been pushed yet (`git push -u origin <branch>`).
4. Compose the PR title and body following the format below.
5. Create the PR using `gh pr create` with a HEREDOC for the body.
6. Return the PR URL to the user.

## PR Title Format

```
<type>: <short summary in imperative mood>
```

Use the same type prefixes as Conventional Commits:

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

### Title Rules

- English, imperative mood, lowercase (except proper nouns), no trailing period.
- Under 70 characters.

## PR Body Format

The body MUST follow this structure:

```markdown
## Summary

<1-3 bullet points describing WHAT changed and WHY at a high level>

## Details

<More detailed explanation of the changes. Describe the approach, key decisions, and anything reviewers should pay attention to. Use bullet points or paragraphs as appropriate.>

## Test Plan

- [ ] <Steps to verify the changes work correctly>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Body Rules

- **Summary**: Brief, scannable overview. Focus on the "what" and "why", not the "how".
- **Details**: Provide enough context for a reviewer to understand the changes without reading every line of code. Mention trade-offs, alternative approaches considered, or migration notes if relevant.
- **Test Plan**: Actionable checklist of verification steps. Include manual testing steps, relevant commands, or URLs to check.
