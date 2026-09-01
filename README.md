# jdotai.com

Two static pages. No framework, no build step, no dependencies.

```
index.html          home — jdotai, the company
legal/index.html    donna — the legal product
assets/css/         tokens.css (three colours, two families) + site.css
assets/js/          stages.js (scroll activation) + enquiry.js (form)
assets/video/       donna demo recordings
```

## Design system

Three colours, and every neutral is mixed from them — no raw greys.

| Token | Light | Role |
| --- | --- | --- |
| `--paper` | `#FBFAF8` | ground |
| `--ink` | `#171412` | text, dark bands |
| `--wine` | `#6E2434` | the single accent |

Two families: **Space Grotesk** (display) and **Inter** (body). Both loaded, both used.

Dark theme is defined at token level only. Adding a colour anywhere outside
`tokens.css` breaks the system — put it in the token block and reference it.

Structure is Hallmark's Narrative Workflow: the page is a real three-stage
sequence, which is why the numerals are allowed to exist. There are no eyebrows,
kickers, or uppercase micro-labels anywhere, by design.

## Local

```bash
npx serve .
```

## Deploy

Vercel, no configuration needed — it's static. `vercel.json` only sets clean
URLs and long-lived caching on `/assets`.

## Status

**The copy is draft.** Structure and design are settled; wording is not.
Nothing here has been signed off.

Known gaps:

- No real client name or case study anywhere
- No metrics beyond what is provably true (5 PMS platforms, 3 assistants,
  2-week setup, 24-hour reply). Do not add invented ones.
- "Who this is for" is a guess and needs rewriting
- The FAQ has four entries and needs the objections that actually come up on
  calls — security and data residency are almost certainly missing
