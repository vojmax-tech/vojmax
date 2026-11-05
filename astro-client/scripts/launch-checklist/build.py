"""
Build the free Launch Checklist PDF.

    python scripts/launch-checklist/build.py

Writes public/downloads/vojmax-launch-checklist.pdf, which the store's
/store/launch-checklist page links to. Run it from astro-client/ after
editing the checklist below, then commit the new PDF.

The pages are laid out in HTML (page.css) and printed to PDF by headless
Chrome, so the text stays live and selectable and the boxes stay vector.
Only the cover artwork (art/cover.jpg, generated in ComfyUI) is an image.
pypdf then sets the document metadata.

Needs Google Chrome (or Edge) and `pip install pypdf`.
"""

from __future__ import annotations

import html
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from pypdf import PdfReader, PdfWriter

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = ROOT / "public" / "downloads" / "vojmax-launch-checklist.pdf"

SITE = "vojmax.invocrea8.com"
EMAIL = "vicmaxjames56@gmail.com"
AUTHOR = "Victor James"
YEAR = "2026"

# ─── Content ─────────────────────────────────────────────────────────────────
# Each section: number, title, one-line intro, then groups of items. A group
# with `strip` renders as a row of labelled boxes (widths, browsers) instead of
# a list.

SECTIONS = [
    {
        "n": "01",
        "title": "Project basics",
        "intro": "Sign-offs first. Nothing else on this list matters if the client is still expecting changes.",
        "groups": [
            {
                "items": [
                    "Final design approved",
                    "Final content approved",
                    "All requested pages are complete",
                    "Navigation structure is finalised",
                    "Logo and brand assets are correct",
                    "Contact information is correct",
                    "Business information is accurate",
                    "Legal pages are present where required",
                    "Client has approved the final version",
                ]
            }
        ],
    },
    {
        "n": "02",
        "title": "Content",
        "intro": "Read every page the way a visitor would. Placeholder copy hides in the places nobody opens: footers, error states, thank-you pages.",
        "groups": [
            {
                "items": [
                    "Page titles are correct",
                    "Headings follow a logical hierarchy",
                    "Body copy has been proofread",
                    "No placeholder text remains",
                    "Images replaced with final assets",
                    "Images are properly cropped",
                    "Images have appropriate alt text",
                    "Buttons have clear labels",
                    "Links point to the correct destinations",
                    "Phone numbers are clickable where appropriate",
                    "Email addresses are correct",
                    "Social media links are correct",
                    "Pricing and service information is accurate",
                    "Copyright information is current",
                ]
            }
        ],
    },
    {
        "n": "03",
        "title": "Responsive design",
        "intro": "Drag the window slowly between sizes, not just to the presets. Layouts tend to break between breakpoints, not on them.",
        "groups": [
            {
                "label": "Check the site at",
                "strip": [
                    ("Mobile", "375 px"),
                    ("Tablet", "768 px"),
                    ("Laptop", "1280 px"),
                    ("Desktop", "1440 px"),
                    ("Large desktop", "1920 px +"),
                ],
            },
            {
                "label": "Then check",
                "items": [
                    "No horizontal scrolling",
                    "Navigation works correctly",
                    "Mobile menu opens, closes and links",
                    "Text remains readable",
                    "Buttons are comfortably tappable",
                    "Images scale correctly",
                    "Sections don't overlap",
                    "Cards and components don't break",
                    "Forms work on mobile",
                    "Spacing remains consistent",
                    "Footer works correctly",
                ],
            },
        ],
    },
    {
        "n": "04",
        "title": "Accessibility",
        "intro": "Put the mouse away and tab through every page. If you can't reach something or can't see where you are, some visitors can't either.",
        "groups": [
            {
                "items": [
                    "Sufficient colour contrast",
                    "Logical heading hierarchy",
                    "Images have useful alt text",
                    "Decorative images are hidden from screen readers",
                    "Keyboard navigation works",
                    "Visible focus states exist",
                    "Form fields have labels",
                    "Buttons are understandable",
                    "Links are descriptive",
                    "Interactive elements work without a mouse",
                    "Text is readable at normal zoom",
                    "No important information relies only on colour",
                ]
            }
        ],
    },
    {
        "n": "05",
        "title": "SEO",
        "intro": "Check what search engines and social apps see: the page source, the sitemap and the preview a shared link makes.",
        "groups": [
            {
                "items": [
                    "Page titles are unique and descriptive",
                    "Meta descriptions are present",
                    "One H1 per page, correctly used",
                    "Heading hierarchy is logical",
                    "URLs are clean",
                    "Canonical URLs configured where needed",
                    "Sitemap exists",
                    "Robots.txt is configured correctly",
                    "Important pages are indexable",
                    "Unwanted pages are not accidentally indexed",
                    "Open Graph metadata is configured",
                    "Social sharing image is configured",
                    "Favicon is present",
                    "Structured data implemented where appropriate",
                ]
            }
        ],
    },
    {
        "n": "06",
        "title": "Performance",
        "intro": "Test on a real phone over mobile data, not only on a fast desktop connection.",
        "groups": [
            {
                "items": [
                    "Images are compressed",
                    "Images use appropriate formats",
                    "Images are appropriately sized",
                    "Fonts are optimised",
                    "Unused assets are removed",
                    "JavaScript is minimised where appropriate",
                    "CSS is optimised",
                    "Third-party scripts are reviewed",
                    "Lazy loading used where appropriate",
                    "Page loading has been tested",
                    "Core Web Vitals have been reviewed",
                    "No obvious performance bottlenecks remain",
                ]
            }
        ],
    },
    {
        "n": "07",
        "title": "Forms & functionality",
        "intro": "Submit every form with real details, then check the inbox that will actually receive them. Test the failures too.",
        "groups": [
            {
                "items": [
                    "Contact forms submit successfully",
                    "Form validation works",
                    "Error messages work",
                    "Success states work",
                    "Email notifications are received",
                    "Auto-replies work where applicable",
                    "Booking systems work",
                    "Search works where applicable",
                    "Filters work where applicable",
                    "Interactive components work",
                    "Buttons perform their intended actions",
                    "No broken interactions remain",
                ]
            }
        ],
    },
    {
        "n": "08",
        "title": "Links & navigation",
        "intro": "Click everything once. Links break quietly, and visitors rarely report them.",
        "groups": [
            {
                "items": [
                    "Every navigation item works",
                    "Internal links work",
                    "External links work",
                    "Footer links work",
                    "Social links work",
                    "No broken links",
                    "404 page exists",
                    "Redirects work",
                    "Old URLs redirect where necessary",
                    "Logo links to the homepage",
                ]
            }
        ],
    },
    {
        "n": "09",
        "title": "Browser & device testing",
        "intro": "Use real devices where you can, with the console open. Emulators are a good start, not the finish.",
        "groups": [
            {
                "label": "Test across",
                "strip": [
                    ("Chrome", "Desktop"),
                    ("Safari", "Desktop"),
                    ("Firefox", "Desktop"),
                    ("Edge", "Desktop"),
                    ("iOS", "Safari"),
                    ("Android", "Chrome"),
                ],
            },
            {
                "label": "Check",
                "items": [
                    "Layout consistency",
                    "Typography",
                    "Animations",
                    "Forms",
                    "Navigation",
                    "Media",
                    "Interactive elements",
                    "Console errors",
                    "Browser-specific issues",
                ],
            },
        ],
    },
    {
        "n": "10",
        "title": "Security & technical",
        "intro": "Assume anything shipped to the browser can be read. Keys, tokens and admin routes belong on the server.",
        "groups": [
            {
                "items": [
                    "HTTPS is active",
                    "Domain is correctly connected",
                    "SSL certificate is valid",
                    "Environment variables are secure",
                    "API keys are not exposed",
                    "Admin credentials are not public",
                    "Debug information is removed",
                    "Dependencies are reviewed",
                    "CMS and admin accounts are secured",
                    "Backups exist where appropriate",
                    "Production is separate from development",
                ]
            }
        ],
    },
    {
        "n": "11",
        "title": "Analytics & tracking",
        "intro": "Trigger each event yourself and watch it arrive in the dashboard. An untested tag is a guess.",
        "groups": [
            {
                "items": [
                    "Analytics installed",
                    "Analytics tracking tested",
                    "Conversion events configured where required",
                    "Contact and lead conversions tracked",
                    "Search Console configured where appropriate",
                    "Cookie and consent requirements reviewed",
                    "Tracking scripts tested",
                ]
            }
        ],
    },
]

FINAL = {
    "n": "12",
    "title": "Final pre-launch",
    "intro": "The last pass on launch day. Everything here has been checked once already. This is the confirmation, in one place.",
    "items": [
        "Client has approved the final website",
        "Final backup completed",
        "Production environment checked",
        "Domain confirmed",
        "SSL confirmed",
        "Forms tested",
        "Analytics tested",
        "SEO basics checked",
        "Mobile version checked",
        "Desktop version checked",
        "Final links checked",
        "No placeholder content remains",
        "No major console errors",
        "Final deployment completed",
    ],
}

POST = {
    "n": "13",
    "title": "Post-launch",
    "intro": "The first week after launch. Real visitors find what testing missed, so check again once they arrive.",
    "items": [
        "Homepage tested after deployment",
        "Forms tested again",
        "Analytics receiving data",
        "Search indexing checked",
        "Broken links checked",
        "Mobile version checked",
        "Client has received access",
        "Client has received handover information",
        "Backup confirmed",
        "Any launch issues documented",
        "Follow-up scheduled",
    ],
}

# Which sections share a page. Keeps each section whole on one page.
SPREADS = [["01", "02"], ["03", "04"], ["05", "06"], ["07", "08"], ["09", "10"]]

# ─── Markup helpers ──────────────────────────────────────────────────────────

e = html.escape
BY_N = {s["n"]: s for s in SECTIONS}

TICK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.4 6.3l2.4 2.4 4.8-5.2"/></svg>'


def wordmark() -> str:
    return '<span class="wm">VOJMAX<i>.</i></span>'


def page(num: int, total: int, crumb: str, body: str, cls: str = "") -> str:
    return f"""
<section class="page {cls}">
  <header class="run-head">
    {wordmark()}
    <span class="crumb">{crumb}</span>
  </header>
  <div class="content">{body}</div>
  <footer class="run-foot">
    <span>Launch Checklist<i class="sep"></i>{SITE}</span>
    <span class="folio">{num:02d} <em>/ {total:02d}</em></span>
  </footer>
</section>"""


def items_grid(items: list[str], cols: int = 2) -> str:
    rows = -(-len(items) // cols)
    cells = "".join(
        f'<li><span class="box"></span><span class="t">{e(t)}</span></li>' for t in items
    )
    return f'<ul class="items cols-{cols}" style="--rows:{rows}">{cells}</ul>'


def strip(entries: list[tuple[str, str]]) -> str:
    cells = "".join(
        f'<li><span class="box"></span><span class="s-label">{e(a)}</span><span class="s-note">{e(b)}</span></li>'
        for a, b in entries
    )
    return f'<ul class="strip" style="--n:{len(entries)}">{cells}</ul>'


def section_head(s: dict) -> str:
    return f"""
<div class="sec-head">
  <span class="sec-n">{s['n']}</span>
  <div>
    <h2>{e(s['title'])}</h2>
    <p class="intro">{e(s['intro'])}</p>
  </div>
</div>"""


def section(s: dict) -> str:
    parts = [section_head(s)]
    for g in s["groups"]:
        if g.get("label"):
            parts.append(f'<p class="group-label">{e(g["label"])}</p>')
        parts.append(strip(g["strip"]) if "strip" in g else items_grid(g["items"]))
    return f'<div class="section" id="s{s["n"]}">{"".join(parts)}</div>'


def write_lines(n: int, cls: str = "") -> str:
    return f'<div class="lines {cls}">' + '<span></span>' * n + "</div>"


def fill(label: str = "Notes") -> str:
    return f'<div class="fill"><span class="f-label">{e(label)}</span><div class="fill-lines"></div></div>'


def field(label: str) -> str:
    return f'<div class="field"><span class="f-label">{e(label)}</span><span class="f-line"></span></div>'


def count_checks() -> int:
    n = 0
    for s in SECTIONS:
        for g in s["groups"]:
            n += len(g.get("items", g.get("strip", [])))
    return n + len(FINAL["items"]) + len(POST["items"])


# ─── Pages ───────────────────────────────────────────────────────────────────


def cover() -> str:
    return f"""
<section class="page cover">
  <div class="cover-art"><img src="art/cover.jpg" alt=""></div>
  <div class="cover-top">
    {wordmark()}
    <span>Free resource<i class="sep"></i>{YEAR}</span>
  </div>
  <div class="cover-body">
    <p class="eyebrow">Website launch &amp; handover</p>
    <h1>Launch<br>Checklist</h1>
    <p class="cover-sub">The pre-launch and post-launch checks I run before handing a website over to a client.</p>
    <div class="cover-meta">
      <div class="byline">{wordmark()}<span>{AUTHOR}</span></div>
      <dl>
        <div><dt>Sections</dt><dd>13</dd></div>
        <div><dt>Checks</dt><dd>{count_checks()}</dd></div>
        <div><dt>Format</dt><dd>A4, print or screen</dd></div>
      </dl>
    </div>
  </div>
</section>"""


def contents(page_of: dict[str, int]) -> str:
    rows = []
    for s in SECTIONS + [FINAL, POST]:
        rows.append(
            f'<li><a href="#s{s["n"]}"><span class="c-n">{s["n"]}</span><span class="c-t">{e(s["title"])}</span><span class="c-p">{page_of[s["n"]]:02d}</span></a></li>'
        )
    rows.append(
        f'<li><a href="#notes"><span class="c-n">&nbsp;</span><span class="c-t">Handover notes</span><span class="c-p">{page_of["notes"]:02d}</span></a></li>'
    )
    return '<ol class="toc">' + "".join(rows) + "</ol>"


def how_to(page_of: dict[str, int]) -> str:
    return f"""
<p class="eyebrow dark">Before you start</p>
<h1 class="page-title">How to use this checklist</h1>
<p class="lead">This is the list I work through before a website goes live and gets handed over. It covers the things that are easy to miss at the end of a project, when everyone is ready to launch and nobody wants to test the footer links again.</p>

<ol class="steps">
  <li><span class="step-n">1</span><h3>Work through it in order</h3><p>Content and design come first, technical checks after, launch day last. Problems get more expensive the later they're found.</p></li>
  <li><span class="step-n">2</span><h3>Tick it, or mark it N/A</h3><p>Not every item applies to every site. Strike through what doesn't, so an empty box always means &ldquo;not checked yet&rdquo;.</p></li>
  <li><span class="step-n">3</span><h3>Sign it off</h3><p>Page {page_of['12']:02d} is the launch record. Fill it in, keep it with the project files and share a copy with the client.</p></li>
</ol>

<div class="legend">
  <span><span class="box"></span>Not checked yet</span>
  <span><span class="box done">{TICK}</span>Done</span>
  <span><span class="box na"></span>Not applicable</span>
</div>

<div class="split">
  <div class="card">
    <h2 class="card-title">Project details</h2>
    {field("Project")}
    {field("Client")}
    {field("Website address")}
    {field("Platform / hosting")}
    {field("Target launch date")}
    {field("Checked by")}
  </div>
  <div>
    <h2 class="card-title plain">Contents</h2>
    {contents(page_of)}
  </div>
</div>"""


def issues_log(rows: int) -> str:
    body = "".join(
        f'<tr><td class="num">{i:02d}</td><td></td><td></td><td></td><td class="ok"><span class="box"></span></td></tr>'
        for i in range(1, rows + 1)
    )
    return f"""
<div class="section">
  <div class="sec-head">
    <span class="sec-n">&nbsp;</span>
    <div>
      <h2>Issues log</h2>
      <p class="intro">Anything that fails a check goes here, with who is fixing it. Tick it off when it's fixed and checked again.</p>
    </div>
  </div>
  <table class="log">
    <thead><tr><th class="num">#</th><th>Issue</th><th class="w-area">Page / area</th><th class="w-owner">Owner</th><th class="ok">Fixed</th></tr></thead>
    <tbody>{body}</tbody>
  </table>
</div>"""


def final_page() -> str:
    s = FINAL
    return f"""
<div class="section final" id="s12">
  {section_head(s)}
  {items_grid(s['items'])}
</div>
<div class="record">
  <div class="record-head">
    <span class="eyebrow">Launch record</span>
    <span class="record-note">Complete on launch day. Keep a copy with the project files.</span>
  </div>
  <div class="record-grid">
    {field("Project")}
    {field("Client")}
    {field("Launch date")}
    {field("Final checked by")}
    <div class="field wide">{field("Open items / notes")}</div>
  </div>
  <div class="status">
    <span class="f-label">Status</span>
    <span class="status-opt"><span class="box lg"></span>Ready to launch</span>
    <span class="status-opt"><span class="box lg"></span>Needs revision</span>
  </div>
</div>"""


def post_page() -> str:
    s = POST
    days = ["Day 1", "Day 3", "Day 7"]
    rows = "".join(
        f'<tr><td class="day">{d}</td><td></td><td></td><td></td></tr>' for d in days
    )
    return f"""
<div class="section" id="s13">
  {section_head(s)}
  {items_grid(s['items'])}
</div>
<div class="section">
  <div class="sec-head">
    <span class="sec-n">&nbsp;</span>
    <div>
      <h2>First-week check-ins</h2>
      <p class="intro">Three short check-ins after launch. Fill in the date as you go.</p>
    </div>
  </div>
  <table class="log checkins">
    <thead><tr><th class="w-day">When</th><th class="w-date">Date</th><th class="w-owner">Checked by</th><th>Notes</th></tr></thead>
    <tbody>{rows}</tbody>
  </table>
</div>
{fill()}"""


def notes_page() -> str:
    follow = "".join('<li><span class="box"></span><span class="f-line"></span></li>' for _ in range(5))
    return f"""
<p class="eyebrow dark" id="notes">For the client file</p>
<h1 class="page-title">Handover notes</h1>

<div class="notes-block">
  <h2 class="notes-title">Client notes</h2>
  {write_lines(6)}
</div>
<div class="notes-block">
  <h2 class="notes-title">Follow-up items</h2>
  <ul class="follow">{follow}</ul>
</div>
<div class="notes-block fill">
  <h2 class="notes-title">Post-launch notes</h2>
  <div class="fill-lines"></div>
</div>"""


def back_cover() -> str:
    return f"""
<section class="page back">
  <div class="back-body">
    <span class="back-line"></span>
    {wordmark()}
    <h2>Launching a website soon?</h2>
    <p>I design and build brands and websites for service businesses, from the name and the logo through to the deployed site. If you'd like help getting yours ready for launch, get in touch.</p>
    <dl class="back-contact">
      <div><dt>Website</dt><dd><a href="https://{SITE}">{SITE}</a></dd></div>
      <div><dt>Email</dt><dd><a href="mailto:{EMAIL}">{EMAIL}</a></dd></div>
    </dl>
  </div>
  <p class="back-legal">&copy; {YEAR} {AUTHOR} / VOJMAX. Free to use and share. Please don't resell it.</p>
</section>"""


def build_html() -> str:
    # Page numbers, in order: cover, how-to, spreads, 11 + log, 12, 13, notes, back.
    page_of: dict[str, int] = {}
    n = 3
    for spread in SPREADS:
        for sn in spread:
            page_of[sn] = n
        n += 1
    page_of["11"] = n; n += 1
    page_of["12"] = n; n += 1
    page_of["13"] = n; n += 1
    page_of["notes"] = n; n += 1
    total = n  # back cover

    pages = [cover(), page(2, total, "Before you start", how_to(page_of), "howto")]
    for spread in SPREADS:
        secs = [BY_N[sn] for sn in spread]
        crumb = '<i class="sep"></i>'.join(f"<b>{s['n']}</b> {e(s['title'])}" for s in secs)
        pages.append(page(page_of[spread[0]], total, crumb, "".join(section(s) for s in secs) + fill()))
    s11 = BY_N["11"]
    pages.append(page(page_of["11"], total, f"<b>11</b> {e(s11['title'])}", section(s11) + issues_log(9) + fill()))
    pages.append(page(page_of["12"], total, f"<b>12</b> {FINAL['title']}", final_page()))
    pages.append(page(page_of["13"], total, f"<b>13</b> {POST['title']}", post_page()))
    pages.append(page(page_of["notes"], total, "Handover notes", notes_page(), "notes"))
    pages.append(back_cover())

    css = (HERE / "page.css").read_text(encoding="utf-8")
    return f"""<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<title>Vojmax Launch Checklist</title>
<style>{css}</style></head>
<body>{''.join(pages)}
<script>
  document.fonts.ready.then(() => {{
    // Rule as many whole 10 mm lines as each notes area holds.
    const line = 10 * 96 / 25.4;
    document.querySelectorAll('.fill-lines').forEach((el) => {{
      const n = Math.floor(el.clientHeight / line);
      if (n < 2 && !el.closest('.notes-block')) {{ el.closest('.fill').remove(); return; }}
      el.innerHTML = '<span></span>'.repeat(n);
    }});
    // Flag any page whose content runs past its box.
    const bad = [...document.querySelectorAll('.page')].map((p, i) => {{
      const c = p.querySelector('.content');
      return c && c.scrollHeight > c.clientHeight + 1 ? (i + 1) + ':' + (c.scrollHeight - c.clientHeight) : null;
    }}).filter(Boolean);
    document.body.dataset.overflow = bad.join(',') || 'none';
  }});
</script>
</body></html>"""


# ─── Print ───────────────────────────────────────────────────────────────────


def find_chrome() -> str:
    for c in [
        os.environ.get("CHROME", ""),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        shutil.which("google-chrome") or "",
        shutil.which("chromium") or "",
    ]:
        if c and Path(c).exists():
            return c
    sys.exit("Chrome not found. Set CHROME to its path.")


def main() -> None:
    chrome = find_chrome()
    src = HERE / "_checklist.html"
    src.write_text(build_html(), encoding="utf-8")
    flags = ["--headless=new", "--disable-gpu", "--no-first-run", "--allow-file-access-from-files"]
    url = src.as_uri()

    dom = subprocess.run(
        [chrome, *flags, "--virtual-time-budget=8000", "--dump-dom", url],
        capture_output=True, text=True, encoding="utf-8",
    ).stdout
    marker = 'data-overflow="'
    overflow = dom.split(marker, 1)[1].split('"', 1)[0] if marker in dom else "unknown"
    print(f"Overflowing pages (page:px): {overflow}")

    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / "raw.pdf"
        subprocess.run(
            [chrome, *flags, "--no-pdf-header-footer", "--virtual-time-budget=8000",
             f"--print-to-pdf={raw}", url],
            check=True, capture_output=True,
        )
        writer = PdfWriter(clone_from=PdfReader(raw))
        writer.add_metadata({
            "/Title": "Vojmax Launch Checklist",
            "/Author": "Victor James / Vojmax",
            "/Subject": "Website launch and handover checklist",
            "/Keywords": "website launch, checklist, QA, handover, SEO, accessibility, performance",
            "/Creator": "vojmax.invocrea8.com",
        })
        writer.compress_identical_objects()
        OUT.parent.mkdir(parents=True, exist_ok=True)
        with OUT.open("wb") as f:
            writer.write(f)

    if "--keep-html" not in sys.argv:
        src.unlink()
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} KB)")
    if overflow not in ("none",):
        sys.exit("Some pages overflow. Fix the layout before shipping.")


if __name__ == "__main__":
    main()
