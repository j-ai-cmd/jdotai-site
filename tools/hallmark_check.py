#!/usr/bin/env python3
"""Hallmark slop-test gates, mechanised.

This is the gate the build is judged by. It is written before the failures are
known and is not to be edited to make the site pass — fix the site instead.
Exits 0 when every implemented gate passes, 1 otherwise.

Covers the 38 gates from hallmark's slop-test.md that are decidable from source.
The 19 judgment gates (templated-feel, motivated decoration, rhythm) are out of
scope by design and are reported separately by a human reviewer.
"""
import re, sys, glob, pathlib, json

ROOT = pathlib.Path(__file__).resolve().parent.parent
FAILS, PASSES = [], []

def gate(n, desc, ok, detail=""):
    (PASSES if ok else FAILS).append((n, desc, detail))

def read(p):
    f = ROOT / p
    return f.read_text() if f.exists() else ""

# every page the site actually serves, including generated article pages
HTML_FILES = ["index.html", "legal/index.html", "blog/index.html", "contact/index.html"] + \
    sorted(str(p.relative_to(ROOT)) for p in (ROOT / "blog").glob("*/index.html"))
html = "".join(read(f) for f in HTML_FILES)
site_css = read("assets/css/site.css")
tokens_css = read("assets/css/tokens.css")
css = tokens_css + "\n" + site_css
js = "".join(read(p) for p in ["assets/js/site.js", "assets/js/enquiry.js"])

def strip_comments(s):
    return re.sub(r'/\*.*?\*/', '', s, flags=re.S)

css_code = strip_comments(css)
site_code = strip_comments(site_css)

# ── colour maths ────────────────────────────────────────────────────────────
def hx(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c*2 for c in h)
    return tuple(int(h[i:i+2], 16)/255 for i in (0, 2, 4))
def _lin(c): return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
def lum(rgb):
    r, g, b = [_lin(c) for c in rgb]; return .2126*r + .7152*g + .0722*b
def contrast(a, b):
    la, lb = lum(hx(a)), lum(hx(b)); hi, lo = max(la, lb), min(la, lb)
    return (hi + .05) / (lo + .05)
def mix(a, b, pct):
    A, B = hx(a), hx(b); p = pct/100
    return '#%02x%02x%02x' % tuple(round((A[i]*p + B[i]*(1-p))*255) for i in range(3))

# ─────────────────────────── typography ─────────────────────────────────────
BANNED_DISPLAY = ['Inter', 'Roboto', 'Open Sans', 'Poppins', 'Lato']
fd = re.search(r'--fd:\s*"([^"]+)"', css_code)
gate(1, "display font is not a default sans",
     bool(fd) and fd.group(1) not in BANNED_DISPLAY,
     f"--fd = {fd.group(1) if fd else 'MISSING'}")

fams = set(re.findall(r'--f[a-z-]+:\s*"([^"]+)"', css_code))
gate(37, "at most 3 font families", len(fams) <= 3, f"{sorted(fams)}")

goog = re.findall(r'fonts\.googleapis\.com/css2\?([^"]+)', html)
declared = set()
for q in goog:
    declared |= {f.split(':')[0].replace('+', ' ') for f in re.findall(r'family=([^&]+)', q)}
gate("37b", "every declared token font is actually loaded", fams <= declared,
     f"tokens={sorted(fams)} loaded={sorted(declared)}")
gate("37c", "no font is loaded but unused", declared <= fams,
     f"loaded-but-unused={sorted(declared - fams)}")

gate(55, "no all-caps display head with line-height < 1.0",
     not re.search(r'text-transform:\s*uppercase[^}]*line-height:\s*0?\.\d', css_code),
     "")

gate(51, "display headers wrap long words",
     'overflow-wrap:anywhere' in css_code.replace(' ', ''),
     "")

# ─────────────────────────── colour ─────────────────────────────────────────
gate(2, "no gradient headline / purple-blue gradient",
     'background-clip:text' not in css_code.replace(' ', '')
     and not re.search(r'linear-gradient[^;]*(purple|#8b5cf6|#6366f1)', css_code, re.I), "")

pure = re.findall(r'#(?:000{1,3}|fff{1,2}|ffffff|000000)\b', site_code, re.I)
gate(7, "no pure #000 / #fff", not pure, f"found {pure}")

stray = re.findall(r'(#[0-9a-fA-F]{3,8}|\brgb\(|\bhsl\(|\boklch\()', site_code)
gate(48, "no colour value outside the token block", not stray, f"found {stray[:6]}")

fam_decl = re.findall(r'font-family:\s*(?!var\()([^;}]+)', site_code)
gate("48b", "no font-family bypasses a token", not fam_decl, f"found {fam_decl[:4]}")

# contrast — resolve the token system in both themes
def theme(paper, ink, wine):
    return dict(paper=paper, ink=ink, wine=wine,
                body=mix(ink, paper, 78), muted=mix(ink, paper, 62),
                on_ink=mix(paper, ink, 72), rule=mix(ink, paper, 18))

def grab(block, name):
    m = re.search(rf'--{name}:\s*(#[0-9a-fA-F]{{3,8}})', block)
    return m.group(1) if m else None

root_block = tokens_css.split(':root{')[1].split('}')[0] if ':root{' in tokens_css else tokens_css
dark_m = re.search(r':root\[data-theme="dark"\]\{(.*?)\}', tokens_css, re.S)

light = theme(grab(root_block, 'paper'), grab(root_block, 'ink'), grab(root_block, 'wine'))
themes = [("light", light)]

# A single-theme page is a legitimate choice, but only when it is deliberate:
# it must then paint its own ground rather than inherit the reader's.
if dark_m:
    themes.append(("dark", theme(grab(dark_m.group(1), 'paper'),
                                 grab(dark_m.group(1), 'ink'),
                                 grab(dark_m.group(1), 'wine'))))
else:
    gate("theme", "single-theme page paints its own background",
         re.search(r'body\{[^}]*background:var\(--paper\)', site_code.replace(' ', '').replace('\n', '')) is not None,
         "no dark palette declared, so body must set --paper explicitly")

for label, t in themes:
    if not all([t['paper'], t['ink'], t['wine']]):
        gate(40, f"{label} theme tokens resolve", False, "missing paper/ink/wine"); continue
    checks = {
        "body text": (contrast(t['body'], t['paper']), 4.5),
        "muted text": (contrast(t['muted'], t['paper']), 4.5),
        "button label on wine": (contrast(t['paper'], t['wine']), 4.5),
        "prose on ink band": (contrast(t['on_ink'], t['ink']), 4.5),
        "focus ring on paper": (contrast(t['wine'], t['paper']), 3.0),
    }
    for what, (val, need) in checks.items():
        gate(f"40/{label}", f"{what} >= {need}:1", val >= need, f"{val:.2f}:1")

# ─────────────────────────── layout / responsive ────────────────────────────
flat = css_code.replace(' ', '').replace('\n', '')
gate(34, "overflow-x:clip on html AND body",
     re.search(r'html,body\{[^}]*overflow-x:clip', flat) is not None, "")

img_tracks = re.findall(r'grid-template-columns:[^;}]*\b1fr\b[^;}]*', css_code)
bare = [t for t in img_tracks if 'minmax(0' not in t and 'repeat(' not in t]
gate(50, "no bare 1fr on image-bearing tracks", not bare, f"{bare[:3]}")

stickies = re.findall(r'([.#][\w-]+)\s*\{[^}]*position:\s*sticky[^}]*top:\s*0', css_code)
gate(56, "no two sticky-at-top:0 elements", len(stickies) <= 1, f"{stickies}")

nowrap = 'white-space:nowrap' in flat
gate(49, "clickable text cannot wrap", nowrap, "buttons/nav declare nowrap")

measures = [int(m) for m in re.findall(r'max-width:\s*(\d+)ch', css_code)]
bad_measure = [m for m in measures if not (45 <= m <= 75)]
gate(25, "prose measures inside 45-75ch", not bad_measure, f"outside: {bad_measure}")

# ─────────────────────────── motion / interaction ───────────────────────────
gate(10, "no transition-all",
     not re.search(r'transition:\s*all\b', css_code)
     and not re.search(r'transition:\s*[\d.]+m?s\s*(?:var|cubic|ease|linear)?[;}]', css_code), "")

gate(11, "no uniform hover-scale", not re.search(r':hover[^}]*scale\(1\.0[5-9]', css_code), "")

bounce = re.findall(r'cubic-bezier\([^)]*?,\s*1\.[1-9]', css_code)
gate(12, "no overshoot easing on UI", not bounce, f"{bounce}")

anim_layout = re.findall(r'transition:[^;}]*\b(width|height|top|left|margin|padding)\b', css_code)
gate(14, "not animating layout properties", not anim_layout, f"{set(anim_layout)}")

gate(15, "focus ring does not transition in",
     not re.search(r':focus-visible[^}]*transition', css_code), "")

gate(27, "reduced-motion fallback exists",
     'prefers-reduced-motion' in css_code, "")

# gate 26 — interactive elements need focus-visible + active + disabled
gate("26a", ":focus-visible defined", ':focus-visible' in css_code, "")
gate("26b", ":active defined", ':active' in css_code, "")
gate("26c", "disabled state defined",
     '[disabled]' in css_code or ':disabled' in css_code, "")

# ─────────────────────────── structure ──────────────────────────────────────
gate(20, "Hallmark stamp present at top of CSS",
     site_css.lstrip().startswith('/* Hallmark'), "")
gate("20b", "exactly one stamp", css.count('Hallmark · macrostructure') == 1,
     f"count={css.count('Hallmark · macrostructure')}")

gate(3, "no 3-equal-column feature grid",
     not re.search(r'grid-template-columns:\s*repeat\(3,\s*(minmax\(0,)?1fr', css_code), "")

gate(5, "no thick coloured side-stripe cards",
     not re.search(r'border-left:\s*[3-9]px|border-left:\s*[2-9]px solid var\(--wine', css_code), "")

# gate 54 — eyebrow beside heading (multi-column wrapper containing label+heading)
eyebrow_words = re.findall(r'class="[^"]*(eyebrow|kicker|label)[^"]*"', html)
gate(54, "no eyebrow/kicker elements at all", not eyebrow_words, f"{set(eyebrow_words)}")

upper = re.findall(r'text-transform:\s*uppercase', css_code)
gate("54b", "no uppercase micro-labels", not upper, f"count={len(upper)}")

# gate 9 — sections must not share one rhythm
widths = set(re.findall(r'--w-[a-z]+:\s*([\d.]+rem)', tokens_css))
pads = set(re.findall(r'--pad-[a-z]+:\s*([^;]+);', tokens_css))
gate(9, "sections do not share one width/padding",
     len(widths) >= 3 and len(pads) >= 3, f"widths={len(widths)} pads={len(pads)}")

# gate 42/43 — nav + footer must not be the AI default
gate(42, "nav is not the AI default (4-5 links + button)",
     len(re.findall(r'<nav[^>]*>.*?</nav>', html, re.S)) > 0
     and max([len(re.findall(r'<a ', n)) for n in re.findall(r'<nav[^>]*>(.*?)</nav>', html, re.S)] or [0]) <= 3,
     "")
gate(43, "footer is not 4 link columns + social row",
     not re.search(r'<footer.*?(Product|Company|Resources|Legal).*?</footer>', html, re.S), "")

# ─────────────────────────── content honesty ────────────────────────────────
gate(19, "no placeholder names / startup clichés",
     not re.search(r'\b(Jane Doe|John Smith|Acme|Nexus|Lorem ipsum)\b', html, re.I), "")

ALLOWED_NUMBERS = {'5', '3', '2', '24', '2026'}
figures = re.findall(r'data-to="(\d+)"', html)
gate(46, "every counted figure is a supplied real value",
     all(f in ALLOWED_NUMBERS for f in figures), f"figures={figures}")

claims = re.findall(r'\b\d+\s*(?:×|x)\s*faster|\b\d+%\s*(?:faster|more|increase)|\b\d{3,}\+\s*(?:teams|firms|users)', html, re.I)
gate("46b", "no invented quantitative claims", not claims, f"{claims}")

# ─────────────────────────── media / a11y ───────────────────────────────────
videos = re.findall(r'<video[^>]*>', html)
gate(28, "no autoplay video; no lazy LCP",
     not any('autoplay' in v for v in videos)
     and 'loading="lazy"' not in html.split('</header>')[0], f"{len(videos)} videos")

svgs = re.findall(r'<svg(?![^>]*(aria-hidden|aria-label|role))[^>]*>', html)
gate(33, "decorative svg has aria-hidden or label", not svgs, f"{len(svgs)} unlabelled")

gate(30, "no emoji as feature icon",
     not re.search(r'[\U0001F300-\U0001FAFF✨⚡✅]', html), "")

gate(36, "flex rows mixing heights declare align-items:center",
     css_code.count('align-items:center') >= 2, "")

gate("a11y-lang", "html has lang attribute",
     all('<html lang=' in read(f) for f in HTML_FILES), "")
gate("a11y-skip", "skip link present",
     all('class="skip"' in read(f) for f in HTML_FILES), "")

# ─────────────────────────── html validity ──────────────────────────────────
from html.parser import HTMLParser
VOID = {'meta','link','br','hr','img','input','source','area','base','col','embed','param','track','wbr'}
class V(HTMLParser):
    def __init__(s): super().__init__(); s.stack=[]; s.err=[]
    def handle_starttag(s,t,a):
        if t not in VOID: s.stack.append(t)
    def handle_endtag(s,t):
        if t in VOID: return
        if not s.stack: s.err.append(f"stray </{t}>"); return
        top = s.stack.pop()
        if top != t: s.err.append(f"</{t}> closes <{top}>")
for f in HTML_FILES:
    v = V(); v.feed(read(f))
    gate("html", f"{f} is well-formed", not v.err and not v.stack,
         f"{v.err[:3]}{v.stack[:3]}")

# ─────────────────────────── dead code ──────────────────────────────────────
defined_tokens = set(re.findall(r'^\s*(--[\w-]+):', tokens_css, re.M))
used_tokens = set(re.findall(r'var\((--[\w-]+)', css))
gate("clean-tokens", "no unused tokens", not (defined_tokens - used_tokens),
     f"{sorted(defined_tokens - used_tokens)}")

defined_cls = set(re.findall(r'\.([a-zA-Z][\w-]*)', site_code))
used_cls = set()
for u in re.findall(r'class="([^"]+)"', html): used_cls.update(u.split())
used_cls |= set(re.findall(r"classList\.(?:add|toggle)\('([\w-]+)'", js))
used_cls |= set(re.findall(r"className\s*=\s*'([\w-]+)'", js))
used_cls |= set(re.findall(r"'([\w-]+ [\w-]+)'", js))
used_cls |= {c for chunk in re.findall(r"className\s*=\s*([^;]+);", js)
             for c in re.findall(r"'\s*([\w-]+)\s*'", chunk)}
used_cls |= {'js'}
dead_cls = sorted(c for c in defined_cls - used_cls if not c.endswith('css'))
gate("clean-css", "no dead CSS classes", not dead_cls, f"{dead_cls}")

# ─────────────────────────── stylesheet integrity ───────────────────────────
# Two regressions shipped from hand-edited CSS: a regex deleted six rule blocks,
# and a sed left a dangling declaration with no selector. Neither was visible to
# any other gate, because a broken stylesheet still parses — the browser simply
# drops what it cannot read. These check the structure itself.
def brace_scan(name, text):
    blanked = re.sub(r'/\*.*?\*/', lambda m: re.sub(r'[^\n]', '', m.group(0)), text, flags=re.S)
    depth, orphans = 0, []
    for i, line in enumerate(blanked.split('\n'), 1):
        for ch in line:
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth < 0:
                    orphans.append(i); depth = 0
    gate(f"css/{name}", "braces balance", depth == 0 and not orphans,
         f"unclosed={depth} orphan_lines={orphans[:4]}")

brace_scan("site", site_css)
brace_scan("tokens", tokens_css)

# a declaration sitting outside any rule is dropped silently by the browser
for name, text in (("site", site_css), ("tokens", tokens_css)):
    blanked = re.sub(r'/\*.*?\*/', lambda m: re.sub(r'[^\n]', '', m.group(0)), text, flags=re.S)
    depth, stray = 0, []
    for i, line in enumerate(blanked.split('\n'), 1):
        stripped = line.strip()
        # a selector can look like a declaration (body::before, a:hover), so a
        # real stray must not open a rule and must terminate like a declaration
        looks_decl = (re.match(r'^[a-z-]+\s*:', stripped)
                      and '{' not in stripped
                      and stripped.endswith((';', '}'))
                      and not stripped.startswith('--'))
        if depth == 0 and looks_decl:
            stray.append(i)
        depth += line.count('{') - line.count('}')
        depth = max(depth, 0)
    gate(f"css/{name}", "no declaration outside a rule", not stray, f"lines={stray[:4]}")

# ─────────────────────────── report ─────────────────────────────────────────
if __name__ == '__main__':
    for n, d, det in FAILS:
        print(f"FAIL  gate {n}: {d}" + (f"  [{det}]" if det else ""))
    print(f"\n{len(PASSES)} passed, {len(FAILS)} failed "
          f"({len(PASSES)+len(FAILS)} mechanised gates)")
    sys.exit(1 if FAILS else 0)
