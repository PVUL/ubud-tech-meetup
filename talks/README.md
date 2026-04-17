# Talks

`talks` contains slides used for tech talks at Ubud Tech Meetup. Slides are built using [Slidev](https://sli.dev/). If you want to create slides, we recommend using the [Slidev VS Code Extension](https://sli.dev/features/vscode-extension).

## Running the Interactive Selector

We built a [custom interactive TUI](../scripts/select-presentation.ts) (Terminal User Interface), to make it easy to navigate through past talks and create new ones.

### Prerequisites

- [Bun](https://bun.sh/) must be installed on your system.
- Dependencies must be installed: `bun install`.

### Usage

**Always run this command from the project root directory:**

```bash
bun dev
```

## 1. Selection Screen

The selector automatically finds all `.md` files in the `talks/` directory and formats them for the terminal.

```text
Select Presentation (type to search):

❯ [LAST OPENED] Paul Yun - 01 - Vibe Engineering (2026-04-28)

Paul Yun
  01 - Vibe Engineering (2026-04-28)

  [CREATE NEW]
```

- **Fuzzy Search**: Search by presenter, talk title, or even **dates** (e.g., typing `2026` will show all talks from 2026).
- **Last Opened**: The script remembers your last presentation and pins it to the top (this is stored in a `.config.json` file)
- **Navigation**: Use `Up`/`Down` and `Enter` to select.

## 2. Creating a New Talk

Selecting `[CREATE NEW]` starts an automated workflow to set up your slides. 

### Interactive Prompts

```sh
? Presenter Name: Paul Yun
? Talk Title: Building Agentic Workflows
? Add Talk Date? Yes # you can skip this and add later
? Talk Date: Apr 28 2026
```

### Automation Logic

1.  **Smart Numbering**: Automatically assigns the next available number (e.g. `02-talk.md`).
2.  **Sanitization**: Converts titles to kebab-case (e.g. `pauls-amazing-talk`).
3.  **Boilerplate**: Generates a standard Slidev template with frontmatter.

### Skipping the Date
The talk date can be skipped during creation, but it is recommended that date gets added eventually so other members can search for it in the future. You can add it manually in the Markdown file's frontmatter:

```yaml
---
theme: seriph
title: "My Amazing Talk"
date: "2026-04-17" # Add/Edit this line manually
---
```

## 3. Slidev Server

Once selected, the server launches. Save changes to your `.md` files to see them update in real-time.

```text
  ●■▲
  Slidev  v52.14.2

  theme       @slidev/theme-seriph
  css engine  unocss
  entry       /path/to/talks/paul-yun/01-vibe-engineering.md
```

- **Local URL**: `http://localhost:3030`
- **Live Reload**: Editing the `.md` file updates the browser immediately.
- **Presenter Mode**: Access via `http://localhost:3030/presenter`.

For more details, check the [official Slidev documentation](https://sli.dev/guide/syntax).

---

## Tech Stack

- [**Slidev**](https://github.com/slidevjs/slidev): The core framework that powers the presentations themselves.
- [**Enquirer**](https://github.com/enquirer/enquirer): For interactive prompts and input forms.
- [**Date-prompt**](https://github.com/derhuerst/date-prompt): For interactive date picker for selecting talk dates.
- [**Fuzzysort**](https://github.com/farzher/fuzzysort): For fuzzy search across files and dates.
- [**Chalk**](https://github.com/chalk/chalk): For terminal string styling and colors.
