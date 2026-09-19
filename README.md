# vojmax

Personal portfolio for Victor James, who works as **vojmax**. Astro, static,
deployed to Vercel at [vojmax.dev](https://vojmax.dev).

## Stack

- **Framework**: [Astro 5](https://astro.build/), static output, no SSR
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with design tokens in `global.css`
- **3D**: [three.js](https://threejs.org/) in a React island in the hero
- **Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Host**: [Vercel](https://vercel.com/)

## Quick start

```bash
cd astro-client
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
```

No environment variables. The site has no API routes, no forms and no database,
so it collects nothing.

## Project structure

```text
astro-client/
├── src/
│   ├── components/
│   │   ├── layout/     # Navbar
│   │   ├── sections/   # Hero, Work, Stack, About, Values, Contact, Footer
│   │   └── ui/         # ProjectCard, ProjectCover, SocialLinks, ThreeHero
│   ├── data/
│   │   ├── projects.ts # every case study on the site
│   │   └── site.ts     # name, handle, links, contact
│   ├── layouts/        # BaseLayout.astro
│   ├── pages/          # index, work, work/[slug], about, contact
│   └── styles/         # global.css (design tokens)
└── public/
```

## Adding a project

Everything on `/work` comes from [`src/data/projects.ts`](astro-client/src/data/projects.ts).
Append a `Project` and the card, the case-study page at `/work/<slug>`, the
discipline filters and the counts all follow. No other file needs touching.

Fields worth knowing:

| Field         | Notes                                                    |
| ------------- | -------------------------------------------------------- |
| `status`      | `shipped`, `active` or `building`, drives the card pill   |
| `disciplines` | one or more, drives the `/work` filters                   |
| `hue`         | 0 to 360, seeds the generated cover gradient              |
| `featured`    | `true` puts it on the home page                           |
| `repo`/`demo` | omit either and that button does not render               |
| `notes`       | renders under "Limits & open questions"                   |

### Covers

Project cards automatically use public/projects/<slug>-main.png when the
asset exists. Projects without artwork fall back to the deterministic
typographic cover drawn by ProjectCover.astro.

## Left over from the old brand

The site moved from `pjames` to `vojmax`. Two things still carry the old name:

- `src/data/site.ts`: `behance` still points at `behance.net/pjames-tech`. Every
  other handle is current.
- `public/logo-new.png`: the old wordmark, no longer referenced by any component
  and safe to delete. (`public/profile.png` is still in use by `About.astro`.)

## License

MIT
