/**
 * Store catalogue.
 *
 * The site is static and collects nothing, so the store never takes payment
 * itself. Each product points `checkout` at a hosted checkout page (a Stripe
 * Payment Link, Lemon Squeezy, Gumroad, Paystack or similar). The provider
 * handles the card, the receipt and the file delivery.
 *
 * Free files skip checkout: `download` points at the file in public/ and the
 * product page links straight to it.
 *
 * A product with neither renders as "Coming soon" with a link to ask
 * about it, instead of a buy button that goes nowhere.
 *
 * Two kinds live here. Physical products are objects I design and make
 * (VOJMAX frames and books; frames are wall objects, not eyewear) or pick out
 * and ship. Sourced ones, like the IEMs, are only stocked once enough people
 * ask, so they collect interest instead of showing a dead buy button. VOJMAX
 * objects without `checkout` are coming soon and take sign-ups for release. Digital products (templates,
 * kits, guides) are files. The kind follows from the category, so a product
 * only ever sets `category`.
 *
 * Each physical category has its own page (/store/iems) that explains the
 * product type, with its pros and cons, and lists every product in it. Those
 * pages are described by `physicalCategories` below.
 *
 * TODO(victor): every entry below is a placeholder. Swap in real products,
 * prices, specs and checkout links before linking the store anywhere.
 */

export type ProductCategory = "iems" | "frames" | "books" | "templates" | "brand" | "guides";

export type ProductKind = "physical" | "digital";

export interface ProductSpec {
  label: string;
  value: string;
}

/**
 * One image slot on an object page's gallery. A slot without `src` renders as
 * a labelled placeholder, so real photography drops in later by adding a path
 * and alt text here, with no layout change.
 */
export interface GallerySlot {
  label: string;
  /** Picks the placeholder drawing. "cover" shows the object's cover artwork. */
  view: "cover" | "detail" | "side" | "surface" | "environment";
  /** Path under public/, e.g. "/store/frame-01-detail.jpg". */
  src?: string;
  alt?: string;
}

/** Short editorial section on an object page. */
export interface ProductStory {
  title: string;
  paragraphs: string[];
  /** Short lines set as a numbered typographic list beside the text. */
  principles?: string[];
}

export interface Product {
  /**
   * URL segment. Physical products live under their category
   * (/store/iems/<slug>), digital ones at /store/<slug>. Also the cover
   * filename in public/store/.
   */
  slug: string;
  title: string;
  /** One line, shown on the card. */
  tagline: string;
  category: ProductCategory;
  /**
   * Maker of a product I resell, e.g. "KZ". Omit for things I design myself.
   * Shown next to the category so it is always clear whose product it is.
   */
  brand?: string;
  /** Units of `currency`, cents allowed (49.99). 0 renders as "Free". */
  price: number;
  /** ISO 4217 code. Defaults to USD. */
  currency?: string;
  /** What the buyer actually receives, e.g. "Astro project + Figma file" or "Made to order". */
  format: string;
  /** Two or three paragraphs for the product page. */
  description: string[];
  /** Concrete contents of the download. Verifiable claims only. */
  includes: string[];
  /** Who it is for, shown in the sidebar. Optional. */
  audience?: string;
  /** Physical products: measurable details shown as a spec table. */
  specs?: ProductSpec[];
  /** Physical products: how long before it ships, e.g. "Ships in 3 to 4 weeks". */
  leadTime?: string;
  /** Hue (0-360) seeding the generated cover gradient. */
  hue: number;
  /** Hosted checkout URL. Omit and the product shows as coming soon. */
  checkout?: string;
  /**
   * Free products only: path of the file under public/, e.g.
   * "/downloads/vojmax-launch-checklist.pdf". The product page's main button
   * downloads it directly, no checkout.
   */
  download?: string;
  /** Caption under the product page cover, e.g. when the image is illustrative. */
  coverNote?: string;
  /** Live preview or demo. Optional. */
  preview?: string;
  featured?: boolean;
  /**
   * Design label an object is released under, e.g. "VOJMAX". Set only for
   * things I design; `title` is then the model name ("FRAME 01").
   */
  label?: string;
  /** Technical model designation, e.g. "FRAME-01". */
  model?: string;
  /**
   * "object" gives the product the full object page and catalogue card
   * (components/store/object/) instead of the standard product page.
   */
  layout?: "standard" | "object";
  /** Shown under the price, e.g. when the price is not final. */
  priceNote?: string;
  /** Object pages: what the object is, for the details table, e.g. "Wall object". */
  type?: string;
  story?: ProductStory;
  gallery?: GallerySlot[];
  /** Object pages: alt text for the concept artwork, describing what it shows. */
  artLabel?: string;
  /** Object pages: which view the artwork shows, e.g. "Top view". Defaults to "Front view". */
  artView?: string;
}

export const categoryLabels: Record<ProductCategory, string> = {
  iems: "IEMs",
  frames: "Frames / Objects",
  books: "Books",
  templates: "Site templates",
  brand: "Brand kits",
  guides: "Guides",
};

export const categoryKind: Record<ProductCategory, ProductKind> = {
  iems: "physical",
  frames: "physical",
  books: "physical",
  templates: "digital",
  brand: "digital",
  guides: "digital",
};

export const kindLabels: Record<ProductKind, string> = {
  physical: "Products",
  digital: "Digital",
};

export const kindOf = (product: Product): ProductKind => categoryKind[product.category];

export const productHref = (product: Product): string =>
  kindOf(product) === "physical"
    ? `/store/${product.category}/${product.slug}`
    : `/store/${product.slug}`;

export interface CategoryInfo {
  category: ProductCategory;
  title: string;
  /** One line, shown on the store's category card. */
  tagline: string;
  /** Paragraphs explaining the product type, shown on the category page. */
  intro: string[];
  /** Honest advantages and disadvantages of the product type. Optional. */
  pros?: string[];
  cons?: string[];
  /** Cover image in public/store/, e.g. "iems-main.png". Falls back to a gradient. */
  image?: string;
  imageNote?: string;
  hue: number;
}

/** Physical categories, in the order they appear on the store page. */
export const physicalCategories: CategoryInfo[] = [
  {
    category: "iems",
    title: "IEMs",
    tagline:
      "In-ear monitors: the earphones musicians wear on stage, now cheap enough for everyday listening.",
    intro: [
      "IEMs, short for in-ear monitors, started as the earpieces performers wear on stage to hear themselves over the crowd. They sit deeper in the ear than ordinary earbuds, seal the ear canal like an earplug and usually loop the cable over the ear so they stay put.",
      "A few years ago a good pair cost hundreds of dollars. Brands like KZ changed that, and a solid pair now costs less than most wireless earbuds. These are the pairs I'd recommend. I don't make them; I pick them and I stock the ones enough people ask for.",
    ],
    pros: [
      "They block outside noise just by sealing your ear, so you can listen at a lower, safer volume.",
      "More detail and clarity for the money than almost any other kind of earphone.",
      "Detachable cables on most pairs, so a broken cable is a cheap fix instead of a new pair.",
      "The over-ear cable keeps them in place while you walk, train or perform.",
      "Wired, so there's no battery to charge and no lag when you watch videos or play games.",
    ],
    cons: [
      "The sound depends on the fit. With the wrong tip size the bass goes thin, so expect to try a few sizes.",
      "Most are wired. Many phones have no headphone jack, so you may need a USB-C adapter.",
      "They block so much noise that they're not safe on the road, on a bike or anywhere you need to hear traffic.",
      "Deep-fitting tips can feel tiring in the ear over long sessions, and they need cleaning often.",
      "Many budget pairs come without a microphone or volume controls on the cable.",
    ],
    image: "iems-main.png",
    hue: 170,
  },
  {
    category: "frames",
    title: "Frames / Objects",
    tagline: "Wall objects from VOJMAX, built from the visual language of creative software.",
    intro: [
      "Frames are objects for the wall. Each one takes a piece of digital creative culture, the canvas, the tool, the grid, and builds it for a physical room.",
      "I design and make them myself, and release them one at a time under VOJMAX.",
    ],
    image: "frame-01-plate.png",
    imageNote: "VOJMAX FRAME 01, concept visualisation. Photography to come.",
    hue: 38,
  },
  {
    category: "books",
    title: "Books",
    tagline: "Printed pages from VOJMAX, drawn in the visual language of creative software.",
    intro: [
      "Books are the paper side of VOJMAX. The same canvases, tools and grids as the wall objects, printed as pages you work into by hand.",
      "Like everything from the label, I design and make each one myself.",
    ],
    image: "book-01-plate.png",
    imageNote: "VOJMAX BOOK 01, concept visualisation. Photography to come.",
    hue: 24,
  },
];

export const categoryInfo = (category: ProductCategory): CategoryInfo | undefined =>
  physicalCategories.find((c) => c.category === category);

/** "VOJMAX FRAME 01" for labelled objects, the plain title otherwise. */
export const fullName = (product: Product): string =>
  product.label ? `${product.label} ${product.title}` : product.title;

/**
 * Where a product stands. VOJMAX objects I make are coming soon until they
 * have checkout. Sourced physical products without checkout are only stocked
 * once enough people ask, so they are gauging interest.
 */
export const productStatus = (product: Product): string =>
  product.checkout || product.download
    ? "Available"
    : kindOf(product) === "physical" && !product.label
      ? "Gauging interest"
      : "Coming soon";

/** Labelled objects with their own page and catalogue card. */
export const isObject = (product: Product): boolean => product.layout === "object";

/** "KZ · IEMs" for resold products, just "IEMs" for my own. */
export const productMeta = (product: Product): string =>
  product.brand
    ? `${product.brand} · ${categoryLabels[product.category]}`
    : categoryLabels[product.category];

export const formatPrice = ({ price, currency = "USD" }: Product): string =>
  price === 0
    ? "Free"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        // "₦16,500", not "NGN 16,500".
        currencyDisplay: "narrowSymbol",
        maximumFractionDigits: price % 1 === 0 ? 0 : 2,
      }).format(price);

export const products: Product[] = [
  {
    slug: "kz-edx-pro",
    title: "KZ EDX Pro",
    tagline:
      "Budget in-ear monitors that punch above their price: clear, a little bass-forward, with a cable you can swap. I'll stock them if enough people want a pair.",
    category: "iems",
    brand: "KZ",
    // Assumes about $11 landed cost per pair (roughly the ₦16,500 retail
    // price). $19 leaves about $8, or 40%, before payment fees.
    // TODO(victor): re-check once you have a real bulk quote.
    price: 19,
    format: "In-ear monitors by KZ, universal fit",
    description: [
      "I didn't make these. The EDX Pro is a KZ model I'd recommend to anyone who wants better sound than stock earbuds without spending much: a big dynamic driver, a solid fit and a detachable cable, so a broken cable doesn't mean a new pair.",
      "I'm not holding stock yet. If enough people ask, I'll buy a batch and sell them here. Tap \"I want one\" to be counted and to hear first when they land.",
    ],
    includes: [
      "One pair of KZ EDX Pro IEMs",
      "Detachable 2-pin cable, 3.5 mm",
      "Three sizes of silicone tips",
    ],
    specs: [
      { label: "Driver", value: "1 x dynamic, 10 mm" },
      { label: "Impedance", value: "25 Ω" },
      { label: "Sensitivity", value: "112 dB" },
      { label: "Frequency range", value: "20 Hz to 40 kHz" },
      { label: "Connector", value: "0.75 mm 2-pin" },
      { label: "Fit", value: "Universal, over-ear cable" },
    ],
    leadTime: "Not in stock yet. I'll order a batch once there's enough interest.",
    audience: "Anyone after their first proper pair of IEMs on a small budget.",
    // TODO(victor): swap for a real photo once a batch arrives, then drop the note.
    coverNote: "Generated image. The real pair has a different shell and the KZ mark.",
    hue: 170,
    featured: true,
  },
  {
    // Only what is decided so far. Add dimensions, materials, edition and
    // lead time here once they are real; the object page shows nothing it is
    // not given.
    slug: "frame-01",
    label: "VOJMAX",
    title: "FRAME 01",
    model: "FRAME-01",
    layout: "object",
    tagline:
      "A wall object built from the visual language of creative software: the canvas, the tools and the grid, taken off the screen.",
    category: "frames",
    type: "Wall object",
    price: 140,
    priceNote: "Concept price. It may change before release.",
    format: "Physical wall object",
    description: [
      "FRAME 01 is a physical design object built from the visual language of digital creative tools.",
      "It translates the canvas, the interface and the geometry of creative software into an object made for a wall. A light canvas sits at the centre, with the tools, panels and grid built around it.",
    ],
    includes: [],
    story: {
      title: "Digital → Physical",
      paragraphs: [
        "Most creative work starts on a screen. A blank canvas in the middle, tools down one side, panels down the other, a grid underneath everything. Designers spend years inside that arrangement, until it feels less like software and more like a room they work in.",
        "FRAME 01 asks what happens when that room becomes the object. The canvas keeps its place at the centre. The tool rail, the panel and the grid are rebuilt around it as structure, so the interface is no longer where the work happens. It is the work.",
        "It is the first object from VOJMAX, a label for physical things that come out of screens, software and the culture around them.",
      ],
      principles: ["The canvas at the centre", "Tools as structure", "The grid, made visible", "Built for a wall"],
    },
    // TODO(victor): add src and alt to each slot as the photos come in.
    gallery: [
      { label: "Object", view: "cover" },
      { label: "Detail", view: "detail" },
      { label: "Side", view: "side" },
      { label: "Surface", view: "surface" },
      { label: "Environment", view: "environment" },
    ],
    artLabel:
      "Concept visualisation of VOJMAX FRAME 01, a wall object seen from the front: a deep frame with soft corners whose face is laid out like creative software, with a tool rail on the left, a panel on the right and a light canvas at the centre holding an orange circle and a selected dark shape.",
    hue: 24,
    featured: true,
  },
  {
    // A placeholder like FRAME 01: format and price are assumptions.
    // TODO(victor): confirm printed vs PDF, the price, then add page count,
    // size and paper once they are decided.
    slug: "book-01",
    label: "VOJMAX",
    title: "BOOK 01",
    model: "BOOK-01",
    layout: "object",
    tagline:
      "A colouring book drawn from the tools of creative software: canvases, grids, cursors and shapes, left as line art for you to fill.",
    category: "books",
    type: "Colouring book",
    price: 24,
    priceNote: "Concept price. It may change before release.",
    format: "Printed colouring book",
    description: [
      "BOOK 01 is a colouring book built from the same visual language as FRAME 01.",
      "Every page is a piece of a digital creative environment drawn as clean line art: tool rails, artboards, selections, layers. Colouring it in turns the fill tool back into a pencil.",
    ],
    includes: [],
    story: {
      title: "Fill tool → Pencil",
      paragraphs: [
        "On a screen, colour arrives in one click. Pick a swatch, press the fill tool, and the shape is done.",
        "BOOK 01 slows that down. The shapes still come from creative software, the circle, the rounded rectangle, the cursor, the grid, but the fill happens by hand, one stroke at a time, on paper.",
        "It is the second object from VOJMAX, a label for physical things that come out of screens, software and the culture around them.",
      ],
      principles: ["Interfaces as line art", "Colour by hand", "The grid, on paper", "Made to be filled"],
    },
    // TODO(victor): add src and alt to each slot as the photos come in.
    gallery: [
      { label: "Book", view: "cover" },
      { label: "Spread", view: "surface" },
      { label: "Line art", view: "detail" },
    ],
    artLabel:
      "Concept visualisation of VOJMAX BOOK 01, a colouring book lying open: the left page shows a creative-software interface in line art with its orange circle already coloured in, the right page shows six tool icons in circles, one half filled with orange pencil hatching.",
    artView: "Top view",
    hue: 24,
    featured: true,
  },
  {
    slug: "service-site-starter",
    title: "Service Site Starter",
    tagline:
      "The Astro setup behind my service business sites: pages, sections and tokens, ready to rebrand.",
    category: "templates",
    price: 49.99,
    format: "Astro project + Figma file",
    description: [
      "Most service businesses need the same five pages: home, services, about, work and contact. This is the starter I use for them, with the structure already decided so the time goes into the brand instead of the scaffolding.",
      "Colours, type and spacing live in one tokens file. Change them there and the whole site follows, in light and dark mode.",
    ],
    includes: [
      "Astro 5 project with Tailwind CSS v4",
      "Five page templates and twelve section components",
      "Design tokens for colour, type and spacing, with light and dark themes",
      "Matching Figma file with the same components",
      "Deploy notes for Vercel and Netlify",
    ],
    audience: "Designers and developers building sites for local businesses.",
    hue: 24,
    featured: true,
  },
  {
    slug: "brand-starter-kit",
    title: "Brand Starter Kit",
    tagline:
      "A Figma kit for naming, type pairing and a first identity, in the order I do it for clients.",
    category: "brand",
    price: 29.99,
    format: "Figma file + PDF worksheet",
    description: [
      "Before any interface there is a name, a wordmark and a palette. This kit walks through them in the order I use with clients, so each decision has something to stand on.",
      "It is a working file, not a mood board. Every page ends with a decision to write down.",
    ],
    includes: [
      "Naming worksheet with the questions I ask clients",
      "Wordmark and type pairing pages",
      "Palette builder with contrast checks",
      "Brand sheet template to hand over at the end",
    ],
    audience: "Founders and freelancers starting a brand from nothing.",
    hue: 280,
  },
  {
    slug: "launch-checklist",
    title: "Launch Checklist",
    tagline:
      "Everything I check before a client website goes live, from content and responsive testing to SEO, performance, accessibility and forms. A free, printable PDF.",
    category: "guides",
    price: 0,
    format: "PDF, 12 A4 pages",
    description: [
      "The list I run through before handing a website over to a client. It covers the things that are easy to miss at the end of a project: content, responsive layouts, accessibility, SEO, performance, forms, links, browsers, security and analytics.",
      "It ends with a launch-day sign-off and a first-week check after go-live, so the handover is on paper, not just in someone's memory. Tick it on screen or print it and work through it with a pen.",
    ],
    includes: [
      "157 checks in 13 sections, from project basics to post-launch",
      "Launch record to sign off on launch day",
      "Issues log and first-week check-ins",
      "Handover notes page for the client file",
      "A4, readable on screen and made to print",
    ],
    audience: "Freelancers, designers and developers launching sites for clients, and founders checking their own.",
    download: "/downloads/vojmax-launch-checklist.pdf",
    hue: 24,
  },
];
