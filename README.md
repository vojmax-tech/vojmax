# vojmax

Personal portfolio for Victor James, who works as **vojmax**. Astro, static,
deployed to Vercel at [vojmax.dev](https://vojmax.vercel.app).

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

No environment variables. The site has no API routes and no database, so it
collects nothing. The one form, the release list on VOJMAX object pages, hands
a pre-written email to the visitor's mail app unless `STORE.interestEndpoint`
in `src/data/site.ts` points it at a hosted form service.

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

## Store

`/store` and `/store/<slug>` come from [`src/data/products.ts`](astro-client/src/data/products.ts),
the same way `/work` comes from `projects.ts`. The site never takes payment
itself: each product's `checkout` field points at a hosted checkout page
(Stripe Payment Link, Lemon Squeezy, Gumroad, Paystack), which handles the card,
the receipt and the file delivery.

- No `checkout` and the product shows as "Coming soon" with an "Ask about it" email link.
- `price: 0` renders as "Free".
- Covers load from `public/store/<slug>-main.png` when that file exists, and fall back to the generated cover.

The three products in the file now are placeholders. Replace them before
linking the store anywhere.

### VOJMAX objects

Products I design and release under the VOJMAX label (FRAME 01 first) set
`layout: "object"`, plus `label` ("VOJMAX"), `model` ("FRAME-01") and `type`.
They get their own catalogue card at the top of `/store` and a full object
page instead of the standard product page. Components live in
[`src/components/store/object/`](astro-client/src/components/store/object/).

- The page is a dark "world" in both themes; its tokens are `.vx-world` in `global.css`.
- Every section renders only from fields the product has. Specs, contents and
  lead time stay off the page until they exist in `products.ts`.
- `gallery` lists the image slots in order. Add `src` and `alt` to a slot and
  the placeholder becomes the photo; the layout does not change.
- No `checkout` means "Coming soon" and a release-list form; set `checkout`
  and it becomes a buy button.
- Each object's drawing is registered in `drawings.ts` (FRAME 01: `FrameDrawing.astro`,
  BOOK 01, the colouring book: `BookDrawing.astro`).
- FRAME 01 is a wall object, not eyewear. Its artwork (`FrameDrawing.astro`) is a
  concept visualisation, not a render of a sample, and is labelled that way on
  the page and on the exported posters. Gallery slots without `src` show line
  drawings captioned "Photograph to come".

### Object covers

`/store/covers/<slug>/poster` (1600 x 1000), `/store/covers/<slug>/portrait`
(1080 x 1350) and `/store/covers/<slug>/plate` (1600 x 1000, the object with
no big type, for category images) render the covers at export size. They are unlinked and
noindex. To re-export after changing the product (the price is on the cover):

```bash
npm run build && npm run preview   # then, in another terminal:
npx playwright screenshot --viewport-size=1600,1000 --wait-for-timeout=2500   http://localhost:4321/store/covers/frame-01/poster/ public/store/frame-01-main.png
npx playwright screenshot --viewport-size=1080,1350 --wait-for-timeout=2500   http://localhost:4321/store/covers/frame-01/portrait/ public/store/frame-01-portrait.png
npx playwright screenshot --viewport-size=1600,1000 --wait-for-timeout=2500   http://localhost:4321/store/covers/frame-01/plate/ public/store/frame-01-plate.png
```

Swap `frame-01` for `book-01` (or any object's slug) to export its covers.

`frame-01-main.png` is the object page's social preview; `frame-01-plate.png`
is the Frames / Objects category image.

## Left over from the old brand

The site moved from `pjames` to `vojmax`. Two things still carry the old name:

- `src/data/site.ts`: `behance` still points at `behance.net/pjames-tech`. Every
  other handle is current.
- `public/logo-new.png`: the old wordmark, no longer referenced by any component
  and safe to delete. (`public/profile.png` is still in use by `About.astro`.)

## License

MIT
