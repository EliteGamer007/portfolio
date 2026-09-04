# portfolio-von-sanjeev.tech

Personal site for Sanjeev Srinivas — a horizontal rail of panels on the front page,
with server-rendered case studies behind it.

```bash
npm install
npm run dev
```

## Layout

```
app/
  page.tsx              the rail (server component, revalidates hourly)
  work/[slug]/          one case study per project, prerendered
  resume/               HTML résumé + print stylesheet; PDF in /public
  api/dns/              DNS delegation inspector
  opengraph-image.tsx   generated social cards (also per case study)
components/
  rail/                 Rail + panel components
  diagrams/             hand-authored architecture SVGs
  ui/                   modal, command palette, DNS checker, GitHub activity
lib/
  config.ts             identity and links — single source of truth
  projects.ts           project content, notes, diagram keys
  github.ts             live GitHub stats, degrades to null on failure
```

## Notes

**The rail.** Horizontal CSS scroll-snap, not scroll hijacking — momentum, trackpads,
touch and the scrollbar all behave natively. A vertical wheel is translated to
horizontal movement only when the panel under the cursor has nothing left to scroll
itself. Programmatic jumps are tweened by hand rather than with `behavior: "smooth"`,
which snapping cancels across multiple snap points and which some environments ignore
entirely.

**Nothing on the page is fabricated.** The activity chart is real GitHub push data; if
the API is unavailable the widget disappears rather than inventing numbers.

**CSS layering matters here.** Base element styles live in `@layer base` and component
classes in `@layer components`, so Tailwind utilities can still override them. An
unlayered rule beats every layered utility regardless of specificity.

## Optional environment

| Variable | Effect |
| --- | --- |
| `GITHUB_TOKEN` | Raises the GitHub API rate limit. Works fine without it — unauthenticated requests are cached for an hour. |

## Adding a project

Add an entry to `lib/projects.ts`. The rail panel, case-study route, OG image, sitemap
entry and command-palette entry all follow from it. Set `diagram` only if there is a
matching SVG in `components/diagrams/Diagrams.tsx`.

## Still to do

- Demo videos for the project panels
- A photo for the hero
