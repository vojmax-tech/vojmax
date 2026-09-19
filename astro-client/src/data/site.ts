/**
 * Single source of truth for identity and links.
 *
 * TODO(victor): Behance is still the old `pjames-tech` account. Everything else
 * is current.
 */
export const SITE = {
  /** Handle, used as the wordmark. */
  handle: "vojmax",
  /** Legal name, used in About, the footer and structured data. */
  name: "Victor James",
  role: "Designer and developer",
  location: "Ibadan, Nigeria",
  timezone: "Africa/Lagos",
  url: "https://vojmax.dev",
  description:
    "Victor James (vojmax), designer and developer in Ibadan. I do the brand, the interface and the code for the same project, so nothing gets lost in the handoff.",
} as const;

export const CONTACT = {
  email: "vicmaxjames56@gmail.com",
  github: "https://github.com/vojmax-tech",
  x: "https://x.com/vojmax",
  linkedin: "https://www.linkedin.com/in/vojmax/",
  behance: "https://www.behance.net/pjames-tech",
  instagram: "https://www.instagram.com/vojmax/",
  whatsapp: "https://wa.me/2347033302085",
  phone: "+234 703 330 2085",
} as const;
