#!/usr/bin/env node
/**
 * Runtime Hallmark gates.
 *
 * tools/hallmark_check.py grades source and prerendered HTML. It cannot see
 * anything that only exists once the page is running, and the worst defect of
 * this project's history was exactly that: a React #418 hydration mismatch
 * that discarded the server tree and left the page with no event handlers at
 * all, while the static checker reported 93/93.
 *
 * This file is the other half. It drives a real browser against the built
 * site and asserts the things a reader actually experiences: no console
 * errors, a type scale with real separation once fonts have loaded, section
 * rhythm that varies, alignment that is consistent, no horizontal scroll at
 * four widths, and tap targets big enough to hit.
 *
 * It is a gate, not a linter — it is not to be edited to make the site pass.
 *
 *   node tools/runtime_audit.mjs [--url http://localhost:5199] [--json]
 *
 * Exits 0 when every gate passes, 1 otherwise.
 */
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'

const URL_BASE = (process.argv.find((a) => a.startsWith('--url=')) || '').split('=')[1]
  || 'http://localhost:5199'
const AS_JSON = process.argv.includes('--json')

const PASS = []
const FAIL = []
const gate = (id, desc, ok, detail = '') =>
  (ok ? PASS : FAIL).push({ id, desc, detail })

const WIDTHS = [320, 375, 414, 768, 1440]

// Use whatever Chrome is already on the machine rather than making the gate
// depend on a 150 MB playwright download. CHROME_PATH overrides on CI.
const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

const { existsSync } = await import('node:fs')
const exe = CANDIDATES.find((p) => existsSync(p))
if (!exe) {
  console.error('runtime_audit: no Chrome found. Set CHROME_PATH to a Chrome binary.')
  process.exit(2)
}

// A gate has to be runnable on its own. If nothing is serving the built
// site, start a preview and tear it down at the end, so `node
// tools/runtime_audit.mjs` works from a cold checkout with no setup.
const reachable = async (url) => {
  try {
    const c = new AbortController()
    const t = setTimeout(() => c.abort(), 1500)
    const r = await fetch(url, { signal: c.signal })
    clearTimeout(t)
    return r.ok
  } catch { return false }
}

let server
if (!(await reachable(`${URL_BASE}/`))) {
  const port = new URL(URL_BASE).port || '5199'
  server = spawn('npx', ['vite', 'preview', '--port', port, '--strictPort'],
    { stdio: 'ignore', detached: false })
  for (let i = 0; i < 40 && !(await reachable(`${URL_BASE}/`)); i++) {
    await new Promise((r) => setTimeout(r, 500))
  }
  if (!(await reachable(`${URL_BASE}/`))) {
    server.kill()
    console.error(`runtime_audit: could not serve ${URL_BASE}. Run "npm run build" first.`)
    process.exit(2)
  }
}

const browser = await chromium.launch({ executablePath: exe })

try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  /* ── console + page errors ────────────────────────────────────────────── */
  const consoleErrors = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('pageerror', (e) => consoleErrors.push(String(e)))

  const resp = await page.goto(`${URL_BASE}/`, { waitUntil: 'networkidle', timeout: 45_000 })
  gate('rt-200', 'home responds 200', resp?.status() === 200, `status ${resp?.status()}`)

  // Let fonts settle and entrance observers fire before measuring anything.
  await page.evaluate(() => document.fonts?.ready)
  await page.evaluate(() => {
    document.querySelectorAll('[data-rise]').forEach((e) => e.classList.add('shown'))
  })
  await page.waitForTimeout(1200)

  gate('rt-console', 'no console or page errors', consoleErrors.length === 0,
    consoleErrors.slice(0, 2).join(' | ').slice(0, 220))

  // Hydration specifically: React logs #418/#423 and blanks the tree.
  const hydration = consoleErrors.filter((e) => /Minified React error #(418|423|425)|Hydration/i.test(e))
  gate('rt-hydration', 'page hydrated without mismatch', hydration.length === 0,
    hydration[0]?.slice(0, 180) ?? '')

  /* ── the page is actually interactive ─────────────────────────────────── */
  const interactive = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button, [role="button"], a[href^="#"]')]
    return { count: btns.length }
  })
  gate('rt-interactive', 'page has interactive controls', interactive.count >= 3,
    `${interactive.count} controls`)

  /* ── type scale: measured after fonts load, per surface ───────────────── */
  const type = await page.evaluate(() => {
    const px = (v) => parseFloat(v)
    const surfaces = []
    for (const sel of ['.rig > div', '.steps > div', '.card', '.head']) {
      for (const el of document.querySelectorAll(sel)) {
        const h = el.querySelector('h1,h2,h3,h4')
        const p = el.querySelector('p, dd, .card-meta')
        if (!h || !p) continue
        const hs = getComputedStyle(h), ps = getComputedStyle(p)
        surfaces.push({
          sel,
          h: px(hs.fontSize), hw: +hs.fontWeight,
          p: px(ps.fontSize), pw: +ps.fontWeight,
          hf: hs.fontFamily.split(',')[0], pf: ps.fontFamily.split(',')[0],
        })
      }
    }
    const roots = ['h1', 'h2'].map((t) => {
      const e = document.querySelector(`main ${t}`)
      return e ? { t, size: px(getComputedStyle(e).fontSize) } : null
    }).filter(Boolean)
    return { surfaces, roots, body: px(getComputedStyle(document.body).fontSize) }
  })

  // A heading must out-rank its own body copy. Size alone is not enough —
  // a different family or a heavy weight carries it too — but one of the
  // three has to be doing real work.
  const weakPairs = type.surfaces.filter((s) => {
    const sizeGap = s.h - s.p
    const familyDiffers = s.hf !== s.pf
    const weightGap = s.hw - s.pw
    return sizeGap < 3 && !familyDiffers && weightGap < 200
  })
  gate('rt-hierarchy', 'every heading out-ranks its own body copy', weakPairs.length === 0,
    weakPairs.slice(0, 2).map((s) => `${s.sel} ${s.h}/${s.p}px same-family`).join(' | '))

  // The top of the scale must actually descend.
  const [h1, h2] = [type.roots.find((r) => r.t === 'h1'), type.roots.find((r) => r.t === 'h2')]
  if (h1 && h2) {
    gate('rt-scale-step', 'h1 is at least 1.4x h2', h1.size >= h2.size * 1.4,
      `h1 ${h1.size} / h2 ${h2.size}`)
  }

  /* ── section rhythm ───────────────────────────────────────────────────── */
  const rhythm = await page.evaluate(() => {
    const secs = [...document.querySelectorAll('main > section')]
    const pads = secs.map((s) => getComputedStyle(s).paddingTop)
    return { pads, distinct: [...new Set(pads)].length, n: secs.length }
  })
  gate('rt-rhythm', 'sections do not all share one padding',
    rhythm.n < 4 || rhythm.distinct >= 3,
    `${rhythm.distinct} distinct across ${rhythm.n} sections`)

  /* ── alignment consistency ────────────────────────────────────────────── */
  const align = await page.evaluate(() => {
    const els = [...document.querySelectorAll('main section, main h1, main h2, main p')]
    const tally = {}
    els.forEach((e) => {
      const a = getComputedStyle(e).textAlign
      tally[a] = (tally[a] || 0) + 1
    })
    return tally
  })
  const centred = align.center || 0
  const ranged = (align.start || 0) + (align.left || 0)
  gate('rt-align', 'page does not flip between centred and ranged without reason',
    centred === 0 || ranged === 0 || centred / (centred + ranged) <= 0.35,
    `${centred} centred vs ${ranged} ranged`)

  /* ── responsive: no horizontal scroll at any width ────────────────────── */
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 })
    await page.waitForTimeout(350)
    const r = await page.evaluate(() => {
      const d = document.documentElement
      return { client: d.clientWidth, scroll: d.scrollWidth }
    })
    gate(`rt-overflow-${w}`, `no horizontal scroll at ${w}px`, r.scroll <= r.client + 1,
      `scrollWidth ${r.scroll} vs ${r.client}`)
  }

  /* ── tap targets on the smallest phone ────────────────────────────────── */
  await page.setViewportSize({ width: 375, height: 812 })
  await page.waitForTimeout(400)
  const taps = await page.evaluate(() => {
    const small = []
    for (const el of document.querySelectorAll('a[href], button')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue          // hidden
      if (el.closest('.prose, .marq')) continue               // inline prose, marquee
      if (r.height < 32) small.push(`${el.tagName.toLowerCase()}:${(el.textContent || '').trim().slice(0, 18)} ${Math.round(r.height)}px`)
    }
    return small
  })
  gate('rt-tap', 'tap targets are at least 32px tall', taps.length === 0,
    taps.slice(0, 3).join(' | '))

  /* ── rendered contrast of real text against its real background ───────── */
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.waitForTimeout(300)
  const contrast = await page.evaluate(() => {
    const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number)
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
      return (x + 0.05) / (y + 0.05)
    }
    const bgOf = (el) => {
      let n = el
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor
        const p = parse(bg)
        if (p.length === 3 && !/rgba\(0, 0, 0, 0\)/.test(bg)) return p
        n = n.parentElement
      }
      return [255, 255, 255]
    }
    const bad = []
    const nodes = [...document.querySelectorAll('main p, main h1, main h2, main h3, main h4, main span, main a')]
      .filter((e) => (e.textContent || '').trim().length > 2 && e.offsetParent !== null)
      .slice(0, 220)
    for (const el of nodes) {
      const cs = getComputedStyle(el)
      const size = parseFloat(cs.fontSize)
      const weight = +cs.fontWeight
      const large = size >= 24 || (size >= 18.66 && weight >= 700)
      const need = large ? 3 : 4.5
      const r = ratio(parse(cs.color), bgOf(el))
      if (r < need) bad.push(`${el.tagName.toLowerCase()} ${size}px ${r.toFixed(2)}:1 <${need}`)
    }
    return [...new Set(bad)]
  })
  gate('rt-contrast', 'rendered text meets WCAG AA against its real background',
    contrast.length === 0, contrast.slice(0, 3).join(' | '))

  /* ── bordered components actually paint their border ──────────────────── */
  // Disabling Tailwind preflight drops its `border-style: solid` reset, after
  // which every `border` utility computes to a 1px border that draws nothing.
  // It is invisible to source analysis and to a screenshot diff of a dark
  // band, so it is asserted here.
  // Checked in both directions, because the two halves of the reset fail in
  // opposite ways: without border-style nothing paints, and without
  // border-width:0 everything paints a 3px box.
  const borders = await page.evaluate(() => {
    const silent = []
    const shouting = []
    for (const el of document.querySelectorAll('button, input, select, textarea, [class*="border"]')) {
      const cs = getComputedStyle(el)
      const cls = String(el.className)
      if (/(^|\s)border(\s|-)/.test(cls) && cs.borderTopStyle === 'none') {
        silent.push(`${el.tagName.toLowerCase()}.${cls.split(' ')[0]}`)
      }
    }
    // Nothing on the page wants a border thicker than 2px.
    for (const el of document.querySelectorAll('main *, header *, footer *')) {
      const w = parseFloat(getComputedStyle(el).borderTopWidth)
      if (w >= 3) shouting.push(`${el.tagName.toLowerCase()} ${w}px`)
    }
    return { silent: [...new Set(silent)].slice(0, 3), shouting: [...new Set(shouting)].slice(0, 3) }
  })
  gate('rt-borders', 'bordered components paint exactly the border they ask for',
    borders.silent.length === 0 && borders.shouting.length === 0,
    [...borders.silent.map((s) => `silent ${s}`), ...borders.shouting.map((s) => `3px+ ${s}`)].join(' | '))

  /* ── no UA default styling leaking through ───────────────────────────── */
  // Tailwind's preflight is disabled in this project, and the utilities
  // assume parts of it exist. Every one of these shipped at some point and
  // none was visible to source analysis: grey `buttonface` behind the FAQ
  // rows, ink-black dividers from a colourless `border-b`, and form controls
  // falling back to the UA's system font.
  const ua = await page.evaluate(() => {
    const OS_GREY = /rgb\(2[0-9][0-9], 2[0-9][0-9], 2[0-9][0-9]\)/
    const out = { buttons: [], fonts: [], borders: [] }
    for (const el of document.querySelectorAll('button')) {
      const cs = getComputedStyle(el)
      // A deliberate light fill is fine; the UA default is exactly #EFEFEF
      // and always paired with a default border-image.
      if (cs.backgroundColor === 'rgb(239, 239, 239)' && !String(el.className).includes('bg-')) {
        out.buttons.push(String(el.className).split(' ')[0] || el.textContent?.trim().slice(0, 16))
      }
      void OS_GREY
    }
    const pageFont = getComputedStyle(document.body).fontFamily.split(',')[0]
    for (const el of document.querySelectorAll('input, select, textarea, button')) {
      const f = getComputedStyle(el).fontFamily.split(',')[0]
      if (/system-ui|-apple-system|BlinkMac|Arial/i.test(f) && f !== pageFont) {
        out.fonts.push(`${el.tagName.toLowerCase()} ${f}`)
      }
    }
    return { buttons: [...new Set(out.buttons)].slice(0, 3), fonts: [...new Set(out.fonts)].slice(0, 3) }
  })
  gate('rt-ua-button', 'no browser-default button chrome showing', ua.buttons.length === 0,
    ua.buttons.join(' | '))
  gate('rt-ua-font', 'form controls inherit the page font', ua.fonts.length === 0,
    ua.fonts.join(' | '))

  /* ── the interactive set actually mounted ─────────────────────────────── */
  await page.goto(`${URL_BASE}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    const t = document.querySelector('#rig')
    if (t) window.scrollTo(0, t.offsetTop + 200)
  })
  await page.waitForTimeout(3500)
  const mounted = await page.evaluate(() => ({
    charts: document.querySelectorAll('.rig .recharts-responsive-container').length,
    panels: document.querySelectorAll('.rig > div').length,
  }))
  gate('rt-charts', 'the instrument grid mounts its charts',
    mounted.panels === 0 || mounted.charts >= Math.min(4, mounted.panels),
    `${mounted.charts} charts in ${mounted.panels} panels`)

  await ctx.close()
} finally {
  await browser.close()
  server?.kill()
}

const total = PASS.length + FAIL.length
if (AS_JSON) {
  console.log(JSON.stringify({ pass: PASS.length, fail: FAIL.length, total, failures: FAIL }, null, 1))
} else {
  for (const f of FAIL) console.log(`FAIL  ${f.id}: ${f.desc}${f.detail ? `  [${f.detail}]` : ''}`)
  console.log(`\n${PASS.length} passed, ${FAIL.length} failed (${total} runtime gates)`)
}
process.exit(FAIL.length === 0 ? 0 : 1)
