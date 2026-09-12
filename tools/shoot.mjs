#!/usr/bin/env node
/**
 * Capture the built site as section stills.
 *
 *   node tools/shoot.mjs [--url=…] [--out=.shots] [--width=1440]
 *
 * Used two ways: by a human (or an agent) to actually look at what shipped,
 * and by tools/visual_diff.mjs as the capture half of the baseline check.
 * Starts its own preview server if nothing is serving.
 */
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `=${d}`).split('=')[1] || d
const URL_BASE = arg('url', 'http://localhost:5199')
const OUT = arg('out', '.shots')
const WIDTH = Number(arg('width', '1440'))
const CLEAN = process.argv.includes('--clean')

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
].filter(Boolean).find((p) => existsSync(p))
if (!CHROME) { console.error('shoot: no Chrome found (set CHROME_PATH)'); process.exit(2) }

const reachable = async (u) => {
  try {
    const c = new AbortController(); const t = setTimeout(() => c.abort(), 1500)
    const r = await fetch(u, { signal: c.signal }); clearTimeout(t); return r.ok
  } catch { return false }
}

let server
if (!(await reachable(`${URL_BASE}/`))) {
  const port = new URL(URL_BASE).port || '5199'
  server = spawn('npx', ['vite', 'preview', '--port', port, '--strictPort'], { stdio: 'ignore' })
  for (let i = 0; i < 40 && !(await reachable(`${URL_BASE}/`)); i++) await new Promise((r) => setTimeout(r, 500))
  if (!(await reachable(`${URL_BASE}/`))) { server.kill(); console.error('shoot: could not serve; run npm run build'); process.exit(2) }
}

if (CLEAN && existsSync(OUT)) rmSync(OUT, { recursive: true })
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 } })

const shots = []
try {
  await page.goto(`${URL_BASE}/`, { waitUntil: 'networkidle', timeout: 45_000 })
  await page.evaluate(() => document.fonts?.ready)

  // Settle everything that is normally revealed by scrolling, and stop the
  // marquee, so two runs of the same commit produce identical pixels.
  // Pausing an animation freezes it wherever it happened to be, which made
  // the marquee differ by ~2% SSIM between two runs of the same commit.
  // Cancelling it instead puts every looping element back at frame zero.
  await page.addStyleTag({ content: `
    *,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
    [data-rise]{opacity:1!important;transform:none!important}
    .marq__row{transform:none!important}
  ` })
  await page.evaluate(() => {
    document.querySelectorAll('[data-rise]').forEach((e) => e.classList.add('shown'))
    document.querySelectorAll('.stage').forEach((e) => e.classList.add('live'))
  })

  // Walk the page so lazy blocks mount and videos reach a decodable frame.
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(180)
  }
  await page.waitForTimeout(2500)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)

  const targets = await page.evaluate(() => {
    const named = []
    document.querySelectorAll('main > section, main > div.marq, .film').forEach((el, i) => {
      const head = el.querySelector('h1,h2')
      const label = (head?.textContent || el.className || `block-${i}`)
        .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 34)
      named.push({ label: `${String(i).padStart(2, '0')}-${label || 'block'}` })
    })
    return named
  })

  const els = await page.$$('main > section, main > div.marq, .film')
  for (let i = 0; i < els.length; i++) {
    const file = `${OUT}/${targets[i].label}.png`
    try {
      await els[i].scrollIntoViewIfNeeded()
      await page.waitForTimeout(250)
      await els[i].screenshot({ path: file })
      shots.push(file)
    } catch { /* a sticky/zero-height block can refuse; skip it */ }
  }
} finally {
  await browser.close()
  server?.kill()
}

console.log(shots.join('\n'))
console.log(`\n${shots.length} stills -> ${OUT}/`)
