/**
 * Project catalogue for the portfolio.
 *
 * Every entry is a real repository except the three marked `status: "building"`,
 * which are planned and labelled as such on the site.
 *
 * TODO(victor): fill in `demo` for the projects that are actually deployed.
 * Anything left undefined renders without that link instead of 404-ing.
 */
export const GITHUB_USER = "vojmax-tech";

export type Discipline = "systems" | "product" | "data" | "web" | "design";
export type Status = "shipped" | "active" | "building";

/**
 * Which body of work a project belongs to. `disciplines` is a tag list and a
 * project carries several, so it cannot answer this on its own: Fieldnote is
 * tagged design but is a systems project, and Realty OS is tagged web but is
 * not a brand job. This field says it outright.
 */
export type Group = "brand" | "systems";

export interface Project {
  /** URL segment: /work/<slug>. Also the repo name. */
  slug: string;
  title: string;
  /** One line, shown on the card. */
  tagline: string;
  /** Short label above the title on the card. */
  category: string;
  disciplines: Discipline[];
  /** Which of the two bodies of work this sits in. Groups the work index. */
  group: Group;
  status: Status;
  year: string;
  /** Named technologies, most defining first. Around six reads well. */
  stack: string[];
  /** What I did on it. */
  role: string;
  /** Two or three paragraphs for the case-study page. */
  overview: string[];
  /** Concrete capabilities. Verifiable claims only. */
  highlights: string[];
  /** How it is put together. Optional. */
  architecture?: string;
  /** Limits, tradeoffs, or what is still missing. Optional. */
  notes?: string;
  /** Hue (0-360) seeding the generated cover gradient. */
  hue: number;
  repo?: string;
  demo?: string;
  featured?: boolean;
}

/**
 * Real GitHub repo names, keyed by slug, because several differ from the slug
 * (OctaneDrop lives at OctaneDrop-LAN) and most projects are not public yet.
 *
 * Only slugs listed here render a "Source" button. Anything missing falls back
 * to "Not public yet" on the case-study page, which is better than a link that
 * 404s for visitors. Add a line here as you push each repo.
 */
const REPOS: Record<string, string> = {
  agrosynapse: "AgroSynapse",
  octanedrop: "OctaneDrop-LAN",
  "realty-os": "realty-os",
  "sfo-file-organizer": "sfo-file-organizer",
};

const repo = (slug: string): string | undefined => {
  const name = REPOS[slug];
  return name ? `https://github.com/${GITHUB_USER}/${name}` : undefined;
};

export const projects: Project[] = [
  // Engineering and product
  {
    slug: "aegis-defense",
    title: "Aegis Defense",
    tagline:
      "Edge computer-vision threat detection that keeps recording when the network drops.",
    category: "Computer Vision",
    disciplines: ["systems", "product"],
    group: "systems",
    status: "active",
    year: "2026",
    stack: ["Python", "YOLOv8", "ONNX Runtime", "ZeroMQ", "React 19", "SQLite"],
    role: "Designed the edge and dashboard split, wrote the Python detection core and the React monitoring UI.",
    overview: [
      "Aegis Defense watches a camera feed for people, classifies what it sees as intrusion, perimeter breach or anomaly, and pushes events to a dashboard in real time.",
      "Most of the design work went into what happens when things fail. Physical security software that stops recording the moment a network link flaps is worse than useless, so the edge core keeps working alone. When the dashboard disconnects it writes events to a local SQLite store, encrypted at rest with AES-256, and replays them once the link returns.",
    ],
    highlights: [
      "YOLOv8 inference through ONNX Runtime, so the model runs on CPU-only edge hardware",
      "ZeroMQ publisher decouples detection from delivery, so the detector never blocks on a slow consumer",
      "Fail-safe local logging with AES-256 encryption at rest",
      "React 19 dashboard with a live threat map and alert panel over WebSocket",
    ],
    architecture:
      "Two processes that know very little about each other. The Python edge core runs detection and publishes events on a ZeroMQ socket. The React dashboard subscribes over a WebSocket bridge. Because the transport is a pub/sub socket rather than a request and response API, the detector has no opinion about whether anyone is listening, so the offline path came for free.",
    hue: 12,
    repo: repo("aegis-defense"),
    featured: true,
  },
  {
    slug: "agrosynapse",
    title: "AgroSynapse",
    tagline:
      "Agricultural data pipeline that audits a dataset, explains it, and forecasts next season's yield.",
    category: "Data & ML",
    disciplines: ["data", "product"],
    group: "systems",
    status: "shipped",
    year: "2026",
    stack: ["Python", "Streamlit", "scikit-learn", "pandas", "FAOSTAT"],
    role: "Built the cleaning pipeline, the statistics layer, the model and the Streamlit interface.",
    overview: [
      "AgroSynapse takes the work an analyst does with an unfamiliar agricultural CSV and makes it repeatable. It checks the file for blank cells, duplicates, impossible values, numbers stored as text and inconsistent labels, then scores it out of 100. It compares crops and countries with 95% confidence intervals, fits trends over time, and writes the findings out as plain sentences.",
      "It ships with a runnable demo dataset: a 25,305-row panel covering 54 African countries, 23 crops and the years 1990 to 2024, assembled from FAOSTAT and World Bank sources. Both analysis pages also work on any CSV a visitor uploads.",
      "The forecasting pipeline is leakage-aware. The model is scored only on years it never saw during training.",
    ],
    highlights: [
      "R² 0.977 with a mean absolute error of 470 kg/ha on 2018 to 2024 holdout years",
      "Beats a carry-forward benchmark by roughly a third",
      "Data-quality scoring across seven classes of defect",
      "Group comparison with 95% confidence intervals and significance-tested trends",
    ],
    notes:
      "The demo data is national, so it describes countries rather than individual farms. A falling national trend can also reflect FAOSTAT revisions or expansion onto poorer land, which this data cannot separate. The upload path accepts farm-level data for work that needs it.",
    hue: 96,
    repo: repo("agrosynapse"),
    featured: true,
  },
  {
    slug: "realty-os",
    title: "RealtyOS",
    tagline:
      "Real-estate lead platform: multi-step qualification, an AI assistant, and a client self-service portal.",
    category: "Full-Stack",
    disciplines: ["product", "web"],
    group: "systems",
    status: "shipped",
    year: "2026",
    stack: ["Next.js 16", "TypeScript", "Prisma", "Supabase", "OpenAI", "Framer Motion"],
    role: "Full-stack build covering the data model, qualification pipeline, admin dashboard and portal.",
    overview: [
      "RealtyOS captures property enquiries through a multi-step form that asks for budget, location, property type and timeline, scores the result, and routes it.",
      "A floating assistant called Sloane guides visitors through the site and answers questions. Agents get a real-time lead feed with qualification detail and appointment tracking. Leads get a portal where they can check their own status and booking links instead of emailing to ask.",
    ],
    highlights: [
      "Multi-step property search form capturing budget, location, type and timeline",
      "AI-assisted lead scoring and qualification pipeline",
      "Admin dashboard with a live lead feed and manual entry",
      "Client portal for self-service status checks",
      "Light and dark themes with a persisted preference",
    ],
    architecture:
      "Next.js App Router with Prisma against Postgres via Supabase, bcrypt-backed auth, and zod validating every boundary. The qualification step calls OpenAI but falls back to the rule-based score if the call fails.",
    hue: 224,
    repo: repo("realty-os"),
    demo: "https://realty-os.vercel.app",
    featured: true,
  },
  {
    slug: "octanedrop",
    title: "OctaneDrop",
    tagline: "LAN-first file transfer with no cloud in the path, being ported to Rust.",
    category: "Networking",
    disciplines: ["systems"],
    group: "systems",
    status: "active",
    year: "2025",
    stack: ["Python", "FastAPI", "Rust", "UDP", "TCP"],
    role: "Built the Python implementation and the Windows build pipeline, and am leading the Rust port.",
    overview: [
      "OctaneDrop moves files between machines on the same network without a cloud service in the middle. Peers find each other by UDP broadcast and transfer directly over TCP.",
      "The Python app is the stable one today: a FastAPI service with a browser UI, password-protected, with progress reporting, session tracking and cancellation. A Rust workspace is in progress and will become the shipping implementation.",
    ],
    highlights: [
      "UDP peer discovery with direct TCP transfer, so there is no relay and no account",
      "Password-protected access with an authenticated API",
      "Transfer progress, session tracking and mid-transfer cancellation",
      "Windows executable build pipeline",
    ],
    notes:
      "The Rust implementation is partial. Until it reaches parity the Python app in `python/` is the one to run. The migration plan lives in RUST_MIGRATION.md.",
    hue: 44,
    repo: repo("octanedrop"),
    featured: true,
  },
  {
    slug: "sfo-file-organizer",
    title: "SFO File Organizer",
    tagline:
      "Python desktop utility that sorts a folder by rules, on a schedule, and can flatten it back.",
    category: "Desktop Tool",
    disciplines: ["systems"],
    group: "systems",
    status: "shipped",
    year: "2025",
    stack: ["Python", "PyInstaller", "Windows"],
    role: "Built the classifier, the desktop UI and the packaged installer.",
    overview: [
      "SFO sorts files into categorised folders. Keyword rules take priority, with extension matching as the fallback, which covers the long tail of development file types that generic organisers miss.",
      "The desktop UI is dark-themed and covers the whole workflow: scheduling a daily run, watching a folder in real time, and flattening a directory back when you want the organisation undone. It ships as a packaged Windows executable, so the target machine does not need Python installed.",
    ],
    highlights: [
      "Rule-based classification with extension-based fallback",
      "Dry-run mode that previews every move before touching a file",
      "Flatten mode that undoes organisation, scoped to folders the tool created",
      "Scheduling and real-time watch mode",
      "Packaged as a Windows executable with an installer",
    ],
    hue: 32,
    repo: repo("sfo-file-organizer"),
  },

  // Web, brand and interaction
  {
    slug: "invocrea8",
    title: "Invocrea8",
    tagline:
      "My studio site, running on Astro and Workers, with a build step that generates its own cover art.",
    category: "Studio",
    disciplines: ["web", "design", "systems"],
    group: "brand",
    status: "shipped",
    year: "2026",
    stack: ["Astro", "Cloudflare Workers", "MDX", "Tailwind", "OpenAI"],
    role: "Brand, type system, site design, build and the automated audit suite.",
    overview: [
      "Invocrea8 is the studio the demo storefronts below were built for. The site itself is the most automated thing I run. One command writes a new post and generates its cover art, and the build generates icons, missing covers, compressed WebPs and OG share cards before Astro ever runs.",
      "It also carries its own quality gate. An audit suite checks accessibility, DOM nesting, class usage, SEO, motion preferences and unused CSS, and can diff two builds against each other.",
    ],
    highlights: [
      "Brand and type system designed from scratch, carried through every page",
      "Single-command authoring that writes the post and generates its cover in one step",
      "Build-time generation of icons, cover art, WebPs and OG cards",
      "Six-check audit suite covering accessibility, SEO, motion and CSS weight",
      "Deployed to Cloudflare Workers",
    ],
    hue: 280,
    repo: repo("invocrea8"),
    demo: "https://invocrea8.com",
    featured: true,
  },
  {
    slug: "ember",
    title: "Ember",
    tagline:
      "Restaurant storefront with three live systems and a working menu admin, on zero client framework.",
    category: "Interactive Demo",
    disciplines: ["web", "design"],
    group: "brand",
    status: "shipped",
    year: "2026",
    stack: ["Astro", "Cloudflare D1", "Cloudflare R2", "TypeScript", "Tailwind"],
    role: "Brand, type system, interaction design and the full build including the admin.",
    overview: [
      "Ember is a demo storefront for a fictional Houston West-African fire kitchen, built to show what a conversion site plus messaging automation looks like for a restaurant doing menu, bookings and delivery.",
      "The other demos carry one interactive centrepiece each. Ember ships three: a live order builder with a floating cart and one-tap WhatsApp or SMS checkout, a reservation widget with realistic slot availability, and an animated delivery tracker that plays on scroll.",
      "Behind them is a real admin, a password-protected editor for the whole menu, with photo upload to R2 and everything server-rendered from D1, so edits go live for every visitor without a rebuild.",
    ],
    highlights: [
      "Three independent interactive systems in vanilla TypeScript with no client framework",
      "Menu admin backed by Cloudflare D1 with R2 image upload capped at 2 MB",
      "Server-rendered from the database, so edits are live with no redeploy",
      "Custom display face, hand-drawn accents and a consistent in-house SVG icon set",
    ],
    hue: 8,
    repo: repo("ember"),
    demo: "https://ember.invocrea8.com",
    featured: true,
  },
  {
    slug: "the-aster-house",
    title: "The Aster House",
    tagline:
      "Luxury coastal hotel site with a complete booking flow that runs entirely in the browser.",
    category: "Interactive Demo",
    disciplines: ["web", "design"],
    group: "brand",
    status: "shipped",
    year: "2026",
    stack: ["React", "Vite", "JavaScript"],
    role: "Art direction, interface design and build.",
    overview: [
      "A luxury coastal hotel website built as a demonstration piece. The reservation flow is fully working software that runs entirely client-side. No server is contacted, no email is sent and no card is charged.",
      "That disclosure is not buried. It appears in the footer, inside the booking flow itself, and in the page's structured data. A convincing fake booking engine that does not say it is fake is a liability rather than a portfolio piece.",
    ],
    highlights: [
      "Complete multi-step reservation flow with live availability logic",
      "Fictional-property disclosure in the footer, the flow and the structured data",
      "Generated icon and OG-image pipeline",
    ],
    hue: 190,
    repo: repo("the-aster-house"),
    demo: "https://the-aster-house.vercel.app",
  },
  {
    slug: "the-cut-room",
    title: "The Cut Room",
    tagline:
      "Grooming studio demo whose centrepiece plays out a full booking conversation on click.",
    category: "Interactive Demo",
    disciplines: ["web", "design"],
    group: "brand",
    status: "shipped",
    year: "2025",
    stack: ["Astro 5", "Tailwind", "TypeScript"],
    role: "Brand direction, interaction design and build.",
    overview: [
      "A demo storefront for a fictional Lagos men's grooming studio, built to show what inbox automation looks like for a service business.",
      "The centrepiece is a side-by-side WhatsApp-style chat and owner dashboard. Click it and the whole booking flow plays out. The auto-reply fires, the customer picks a slot, the lead gets tagged Hot and Booked, and the dashboard updates in real time. It takes about fifteen seconds to watch and saves a paragraph of explaining.",
    ],
    highlights: [
      "Scripted live demo of an end-to-end booking, with chat and dashboard in sync",
      "Cormorant Garamond, Manrope and JetBrains Mono as a three-voice type system",
      "Zero JavaScript shipped except the demo script itself",
    ],
    hue: 160,
    repo: repo("the-cut-room"),
    demo: "https://the-cut-room.invocrea8.com",
  },
  {
    slug: "kingsway-detail",
    title: "Kingsway Detail",
    tagline:
      "Auto-detailing demo built around a live quote builder that hands off to WhatsApp.",
    category: "Interactive Demo",
    disciplines: ["web", "design"],
    group: "brand",
    status: "shipped",
    year: "2025",
    stack: ["Astro", "Tailwind", "TypeScript"],
    role: "Brand, interaction design and build.",
    overview: [
      "A demo for a fictional Lagos mobile premium auto-detailing service, aimed at the question a high-ticket service business has to answer early: what will this actually cost me?",
      "The visitor picks vehicle, tier and add-ons, the price updates live, and a single tap fires a WhatsApp message containing the complete quote. Because the customer builds the quote, the first message the business receives is already qualified.",
    ],
    highlights: [
      "Live-updating quote builder across vehicle, tier and add-on dimensions",
      "One-tap handoff to WhatsApp with the full quote pre-composed",
    ],
    hue: 210,
    repo: repo("kingsway-detail"),
    demo: "https://kingsway-detail.invocrea8.com",
  },
  {
    slug: "brightpoint-electrical",
    title: "Brightpoint Electrical",
    tagline:
      "Electrician demo that triages the visitor's symptom and routes emergencies differently.",
    category: "Interactive Demo",
    disciplines: ["web", "design"],
    group: "brand",
    status: "shipped",
    year: "2025",
    stack: ["Astro", "Tailwind", "TypeScript"],
    role: "Brand, triage logic and build.",
    overview: [
      "A demo for a fictional Lagos residential electrician, built around a real routing problem. A flickering light and an electric shock should not land in the same inbox.",
      "The visitor picks the symptom that matches their problem. The page returns a likely cause and immediate safety advice, then routes accordingly: a pre-filled WhatsApp message for routine work, or a phone-call CTA with safety-first guidance for anything dangerous.",
    ],
    highlights: [
      "Symptom triage mapping visitor-visible signs to likely causes",
      "Safety-first routing that separates emergencies from routine bookings",
    ],
    hue: 50,
    repo: repo("brightpoint-electrical"),
    demo: "https://brightpoint-electrical.invocrea8.com",
  },
  {
    slug: "bolt-and-burn",
    title: "Bolt & Burn",
    tagline:
      "Metalwork studio demo answering the question every trade prospect has: what does it cost before you visit?",
    category: "Interactive Demo",
    disciplines: ["web", "design"],
    group: "brand",
    status: "shipped",
    year: "2025",
    stack: ["Astro", "Tailwind", "TypeScript", "Cloudflare"],
    role: "Brand, interaction design and build.",
    overview: [
      "A demo storefront for a fictional Sheffield bespoke metalwork and fabrication studio, built around the question every UK trade business has to answer for an architectural-spec prospect: can I trust your price before you turn up to measure?",
    ],
    highlights: [
      "Pre-visit pricing confidence as the organising idea of the page",
      "Deployed to Cloudflare with a documented demo-subdomain map",
    ],
    hue: 20,
    repo: repo("bolt-and-burn"),
    demo: "https://bolt-and-burn.invocrea8.com",
  },
  {
    slug: "linden-coaching",
    title: "Linden Coaching",
    tagline:
      "Executive coaching page built around self-qualification: am I a fit, or are we both wasting time?",
    category: "Interactive Demo",
    disciplines: ["web", "design"],
    group: "brand",
    status: "shipped",
    year: "2025",
    stack: ["Astro", "Tailwind", "TypeScript"],
    role: "Positioning, interaction design and build.",
    overview: [
      "A single-page demo for a fictional London executive coaching practice serving first-time VPs and directors at scaling tech companies.",
      "It is built around a question a high-trust premium service has to answer honestly: am I actually a fit for this? Letting the wrong prospect disqualify themselves early is worth more than one extra booked call.",
    ],
    highlights: [
      "Self-qualification flow that filters rather than funnels",
      "Single-page structure with no navigation to get lost in",
    ],
    hue: 172,
    repo: repo("linden-coaching"),
    demo: "https://linden-coaching.invocrea8.com",
  },

  // In progress
  {
    slug: "kiln",
    title: "Kiln",
    tagline:
      "A CLI that reads a repository and drafts its portfolio case study, including this site's.",
    category: "Developer Tool",
    disciplines: ["systems", "data"],
    group: "systems",
    status: "building",
    year: "2026",
    stack: ["TypeScript", "Node", "Claude API", "Playwright"],
    role: "Designing and building it now.",
    overview: [
      "Writing a case study per repository by hand does not scale, and the entries drift out of date the moment the code changes. Kiln points at a repository, reads the README, the package manifest and the directory shape, and drafts the entry: stack, tagline, highlights, and a notes section covering the limits.",
      "It also screenshots the running app with Playwright, so projects stop shipping with generated covers instead of real interfaces.",
      "The output target is the same `projects.ts` schema this site already uses. That makes the portfolio a build artefact of the repositories it describes rather than a document that silently falls behind them.",
    ],
    highlights: [
      "Repo introspection across README, manifests, lockfiles and directory shape",
      "Playwright capture of the running app for real cover images",
      "Emits the exact schema this site consumes",
      "Diffs against the existing entry, so updates are reviewable rather than overwritten",
    ],
    notes:
      "Planned, not built. The constraint I care about is that it must never invent a metric. Anything it cannot source from the repo gets left blank for a human to fill.",
    hue: 300,
  },
  {
    slug: "tethr",
    title: "Tethr",
    tagline:
      "Clipboard and file continuity across your devices, over the LAN, with no account.",
    category: "Networking",
    disciplines: ["systems"],
    group: "systems",
    status: "building",
    year: "2026",
    stack: ["Rust", "Tauri", "UDP", "TCP", "Kotlin"],
    role: "Designing it on top of OctaneDrop's discovery and transfer core.",
    overview: [
      "OctaneDrop already solved the hard part: peers finding each other on a local network and moving bytes directly, with no relay and no account. Tethr is what that core is worth once it becomes a library rather than a single app.",
      "Copy on the laptop, paste on the phone. Drag a file onto a desktop tray icon and pick a device. Same discovery protocol, same direct transfer, and no cloud clipboard reading everything you copy.",
    ],
    highlights: [
      "Shares OctaneDrop's Rust discovery and transfer crates",
      "Desktop tray app via Tauri, Android client in Kotlin",
      "Clipboard sync that never leaves the local network",
      "End-to-end encryption with device pairing instead of accounts",
    ],
    notes:
      "Planned. Blocked on the OctaneDrop Rust port reaching parity, since there is no point building on a core that is still being written.",
    hue: 240,
  },
  {
    slug: "fieldnote",
    title: "Fieldnote",
    tagline:
      "Offline-first crop advisory that puts AgroSynapse's model on a low-end Android phone.",
    category: "Data & ML",
    disciplines: ["data", "product", "design"],
    group: "systems",
    status: "building",
    year: "2026",
    stack: ["Astro", "PWA", "IndexedDB", "ONNX Runtime Web", "Python"],
    role: "Designing the offline architecture and the field-usable interface.",
    overview: [
      "AgroSynapse's model runs in a Streamlit dashboard, on a laptop, over a network connection. The farms it forecasts are largely none of those things, so the people it describes cannot reach it.",
      "Fieldnote is the other end of that pipeline. A PWA that installs on a cheap Android phone, holds its data in IndexedDB, runs a quantised model locally through ONNX Runtime Web, and syncs only when there is signal.",
      "The design problem is the bigger one. A yield forecast with a confidence interval has to become something an extension officer can act on in a field, in sunlight, on a five-inch screen.",
    ],
    highlights: [
      "Fully functional offline, with inference running on-device rather than on a server",
      "Quantised model small enough to ship inside the app shell",
      "Sync on signal rather than sync on open",
      "Interface designed for sunlight, one hand and intermittent attention",
    ],
    notes:
      "Planned. The open question is whether national-level training data can say anything useful at farm level. It may need a farm-level dataset before it is worth shipping.",
    hue: 120,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const disciplineLabels: Record<Discipline, string> = {
  systems: "Systems",
  product: "Product",
  data: "Data & ML",
  web: "Web",
  design: "Design",
};

/** Heading and one-line note for each group, in the order the work page shows them. */
export const groupMeta: { id: Group; label: string; note: string }[] = [
  {
    id: "brand",
    label: "Brand and build",
    note: "Eight service businesses, each taken from nothing to a live site. Brand direction, interface, and the build, all mine.",
  },
  {
    id: "systems",
    label: "Systems and tooling",
    note: "Where the harder engineering lives. Edge inference, offline-first networking, desktop tooling.",
  },
];

export const statusLabels: Record<Status, string> = {
  shipped: "Shipped",
  active: "Active",
  building: "In progress",
};
