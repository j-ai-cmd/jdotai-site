#!/usr/bin/env node
/**
 * Visual regression gate.
 *
 * Captures the page section by section and compares each still against an
 * approved baseline in .shots-baseline/. The other gates assert rules; this
 * one asserts "it still looks like what we signed off", which is the only
 * check that catches a change nobody thought to write a rule for.
 *
 * Comparison is SSIM via ffmpeg, so there is no image dependency to install.
 *
 *   node tools/visual_diff.mjs            # compare against the baseline
 *   node tools/visual_diff.mjs --approve  # adopt the current render as truth
 *
 * A new section with no baseline is reported, not silently accepted — and it
 * fails, because the whole point is that a human approves what ships.
 *
 * Exits 0 when every section matches, 1 otherwise.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readdirSync, existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const run = promisify(execFile)

const SHOTS = '.shots'
const BASE = '.shots-baseline'
const APPROVE = process.argv.includes('--approve')
// Anti-aliasing and video frames move a little between runs; 0.985 is tight
// enough to catch a colour or layout change and loose enough not to cry wolf.
const FLOOR = Number((process.argv.find((a) => a.startsWith('--floor=')) || '=0.985').split('=')[1])

await run('node', ['tools/shoot.mjs', '--clean'])

if (APPROVE) {
  if (existsSync(BASE)) rmSync(BASE, { recursive: true })
  mkdirSync(BASE, { recursive: true })
  for (const f of readdirSync(SHOTS)) copyFileSync(join(SHOTS, f), join(BASE, f))
  console.log(`approved ${readdirSync(BASE).length} stills as the baseline`)
  process.exit(0)
}

if (!existsSync(BASE)) {
  console.error('visual_diff: no baseline. Review the render, then:  node tools/visual_diff.mjs --approve')
  process.exit(2)
}

const ssim = async (a, b) => {
  try {
    const { stderr } = await run('ffmpeg', ['-i', a, '-i', b, '-filter_complex', 'ssim', '-f', 'null', '-'])
    const m = stderr.match(/All:([\d.]+)/)
    return m ? Number(m[1]) : null
  } catch (e) {
    // Different dimensions make ffmpeg refuse outright — that is a real
    // change in the section's size, not a tooling failure.
    return /do not match|Invalid/i.test(String(e.stderr || e)) ? 0 : null
  }
}

const now = readdirSync(SHOTS).filter((f) => f.endsWith('.png'))
const was = readdirSync(BASE).filter((f) => f.endsWith('.png'))

const drifted = []
const added = now.filter((f) => !was.includes(f))
const removed = was.filter((f) => !now.includes(f))

for (const f of now.filter((x) => was.includes(x))) {
  const score = await ssim(join(BASE, f), join(SHOTS, f))
  if (score === null) { drifted.push(`${f} (could not compare)`); continue }
  if (score < FLOOR) drifted.push(`${f} ssim ${score.toFixed(4)} < ${FLOOR}`)
}

const problems = [
  ...drifted.map((d) => `changed: ${d}`),
  ...added.map((a) => `new section, never approved: ${a}`),
  ...removed.map((r) => `section gone: ${r}`),
]

if (problems.length === 0) {
  console.log(`${now.length} sections match the baseline`)
  process.exit(0)
}

for (const p of problems) console.log(`FAIL  ${p}`)
console.log(`\n${now.length - drifted.length - added.length} matched, ${problems.length} to review`)
console.log('If the change is intended:  node tools/visual_diff.mjs --approve')
process.exit(1)
