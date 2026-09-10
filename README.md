# jdotai.com

React + Vite, prerendered to static HTML at build time. Five route shapes, 30
blog posts, no server.

```
index.html              Vite entry — the shell only
src/routes/             Home · Legal (donna) · Blog · Post · Contact · NotFound
src/components/         Pill · Frame · Footer · DemoVideo · ConnectionMap · EnquiryForm · PostCards
src/content/posts/      30 article bodies, extracted from the pre-React build
src/content/posts.json  post metadata (title, date, category, excerpt)
src/styles/             tokens.css (three colours, three families) + site.css
src/lib/                effects.ts (scroll behaviours) · seo.ts · posts.ts · routeMeta.ts
scripts/prerender.mjs   renders every route to real HTML, writes the sitemap
public/assets/video/    donna demos + posters + the homepage loop
public/legacy/          the pre-React static site, kept viewable at /legacy/
tools/hallmark_check.py 90 mechanised Hallmark gates
```

## Why prerendered, not a plain SPA

The site this replaced shipped a complete HTML file per URL. A normal Vite SPA
would hand crawlers an empty `<div id="root">` — a straight regression on a site
whose whole point is 30 SEO posts. So `npm run build` runs three passes: the
client bundle, an SSR bundle, then `scripts/prerender.mjs`, which renders each
route with `react-dom/server` and writes it to disk. The client hydrates.

Two traps, both guarded:

- `React.lazy` resolves asynchronously and `renderToString` is synchronous, so a
  split route's *first* render returns its Suspense fallback. The prerenderer
  awaits every importer (`src/routes/registry.ts`) **and** does one discarded
  render pass before the real one.
- If a fallback still leaks through, the build **throws**. It will not ship 30
  blank posts quietly.

## Design system

Three colours, and every neutral is mixed from them — no raw greys.

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#FBFAF8` | ground |
| `--ink` | `#171412` | text, dark bands |
| `--wine` | `#6E2434` | the single accent |

Three families: **Libre Franklin** (display), **Lora** (body), and **Fraunces**
for the donna wordmark only — two slots at most, never body copy.

Single theme by choice. Because there is no second palette to fall back on,
every surface and text colour is painted explicitly.

Tailwind is wired to these tokens and introduces no colour of its own;
`corePlugins.preflight` is off because `site.css` already carries a complete
reset. Adding a colour anywhere outside `tokens.css` breaks the system — and
fails gate 48.

Structure is Hallmark's Narrative Workflow: the page is a real three-stage
sequence, which is why the numerals are allowed to exist. There are no eyebrows,
kickers, or uppercase micro-labels anywhere, by design.

## The gate

```bash
npm run build && npm run lint:hallmark
```

90 mechanised gates, graded against the **prerendered output** in `dist/` — what
actually ships — plus the authored CSS in `src/styles/`. The build is a
precondition; the checker exits non-zero if `dist/` is missing.

It is not to be edited to make the site pass. Fix the site instead. The two
exceptions on record, both genuine checker bugs rather than site defects:

- **Gate 25** measured *every* `max-width:Nch`, including headings, and failed
  the build for display type held to 14–20ch — which is correct typography, not
  a defect. It now measures prose selectors only, and heading measures get their
  own ceiling (gate 25b, 28ch).
- **Gate 43** ran against every page concatenated into one string, so a
  `<footer>` in one file could pair with a nav word in the next and a `</footer>
  ` two files later. It now runs per page.

`clean-css` also learned to read JSX `className="..."`, since markup no longer
lives in `class="..."` strings in source.

## The old site

Preserved at **`/legacy/`** — the complete pre-React build, self-contained, with
its internal paths rewritten. Both versions share `/assets/video/`, so the demos
are not duplicated. It carries `X-Robots-Tag: noindex` and is `Disallow`ed in
`robots.txt`; `tools/hallmark_check.py` skips it.

`git checkout main` is the other copy.

## Local

```bash
npm install
npm run dev
```

```bash
npm run build && npm run preview
```

## Status

**The copy is draft.** Structure and design are settled; wording is not.
Nothing here has been signed off.

Known gaps:

- No real client name or case study anywhere
- No metrics beyond what is provably true (5 PMS platforms, 3 assistants,
  2-week setup, 24-hour reply). Do not add invented ones. This is also why the
  donna page carries a connection *diagram* rather than a chart — 5 / 3 / 2 / 24
  are counts, not a dataset, and charting them would be fake precision.
- "Who this is for" is a guess and needs rewriting
- The FAQ has four entries and needs the objections that actually come up on
  calls — security and data residency are almost certainly missing
- The demo videos are still in the previous brand palette (warm cream + rose),
  not `--paper` + `--wine`. Re-recording them is the highest-value visual fix.

## Deploying

Vercel, `outputDirectory: dist`.

Vercel refuses a deployment whose HEAD commit has an author email it cannot
match to the GitHub account. Commits must be signed with an address verified
on `j-ai-cmd`:

```bash
git config user.email "297267163+j-ai-cmd@users.noreply.github.com"
```

That is GitHub's own noreply address for `j-ai-cmd`, so it is bound to the
account by construction and cannot fail the check.

Two addresses that do **not** work, both tried:

- `jai@jdotai.com` — the address on the site, not verified on any GitHub account
- `dhingrajai04@gmail.com` — belongs to a different account (`dhingrajai04-del`)
