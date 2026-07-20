// Single source of truth for all SEO metadata.
//
// This module is intentionally framework- and DOM-free so it can be imported by
// BOTH sides of the app:
//   - the client (App.tsx) — to update <title>/meta on client-side navigation.
//   - the build-time prerenderer (scripts/prerender.mjs) — to bake real <head>
//     tags + JSON-LD into the static HTML that non-JS crawlers/recruiter tools read.
// Keeping the logic here means the two can never drift.

import type { Note } from "./types";

export const SITE_URL = "https://www.haidertoha.site";
export const AUTHOR_NAME = "Haider Toha";
export const AUTHOR_TAGLINE = "Founding Engineer at Zymbly (YC W26)";
export const TWITTER_HANDLE = "@HaiderToha";

// folder id -> human label, used in <title>, breadcrumbs and the site index.
export const FOLDER_LABELS: Record<string, string> = {
  all: "All Notes",
  profile: "Profile",
  blog: "Writing",
  projects: "Projects",
  finds: "Finds",
  reflections: "Reflections",
};

export interface PageMeta {
  title: string;
  description: string;
  ogDescription?: string; // if set, used for og:description / twitter:description instead of description
  path: string; // canonical path, always the note's real folder (never "all")
  ogType: "profile" | "article" | "website";
  publishedTime?: string;
}

export const absUrl = (path: string): string =>
  SITE_URL + (path.startsWith("/") ? path : `/${path}`);

// Flatten the markdown-ish note body down to clean prose for meta descriptions.
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/\$\$[\s\S]*?\$\$/g, " ") // block math
    .replace(/\$[^$\n]*\$/g, " ") // inline math
    .replace(/[#>*_`~|]/g, " ") // markdown punctuation
    .replace(/\s*•\s*/g, " ") // bullet dots
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(s: string, n = 158): string {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

// A few pages read better with a hand-written description than an auto-truncation.
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  "about-me":
    "About Haider Toha — founding engineer at Zymbly (YC W26) in London. Full-stack across TypeScript, Python, React, FastAPI and Postgres, with a background in aeronautics (Imperial College London) and past roles at Goldman Sachs and SAMMY Labs.",
  experience:
    "Haider Toha's experience — founding engineer at Zymbly (YC W26), founding engineer at SAMMY Labs (YC W25), analyst and software engineering intern at Goldman Sachs, and an MEng in Aeronautics.",
};

export function homeMeta(): PageMeta {
  return {
    title: AUTHOR_NAME,
    description:
      "Haider Toha — founding engineer at Zymbly (YC W26) in London. Full-stack engineer across TypeScript, Python, React, FastAPI and Postgres, with an MEng in Aeronautics from Imperial College London and past roles at Goldman Sachs and SAMMY Labs. Writing on systems, machine learning and infrastructure.",
    ogDescription: "", // no description in share previews — just the name
    path: "/",
    ogType: "profile",
  };
}

const FOLDER_DESCRIPTIONS: Record<string, string> = {
  all: "Every note by Haider Toha — writing, projects, profile and reflections in one place.",
  profile:
    "Haider Toha — founding engineer at Zymbly (YC W26), London. Background, experience, current focus and the stack he builds on.",
  blog: "Writing by Haider Toha on systems, machine learning, infrastructure and the things he's thinking through.",
  projects:
    "Projects by Haider Toha — from a parallel Navier-Stokes solver to a real-time global sentiment engine and an FPL analyser.",
  finds: "Things Haider Toha keeps coming back to — books, videos, food, places and sporting moments.",
  reflections: "Open questions and changes of mind — Haider Toha thinking in the margins.",
};

export function folderMeta(folderId: string): PageMeta {
  const label = FOLDER_LABELS[folderId] ?? folderId;
  return {
    title: `${label} — ${AUTHOR_NAME}`,
    description:
      FOLDER_DESCRIPTIONS[folderId] ?? `${label} by ${AUTHOR_NAME}.`,
    path: `/${folderId}`,
    ogType: "website",
  };
}

export function noteMeta(note: Note): PageMeta {
  const isBlog = note.folder === "blog";
  return {
    title: `${note.title} — ${AUTHOR_NAME}`,
    description:
      DESCRIPTION_OVERRIDES[note.slug] ?? truncate(stripMarkdown(note.content)),
    path: `/${note.folder}/${note.slug}`,
    ogType: isBlog ? "article" : "website",
    publishedTime: note.created_at,
  };
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD). Objects only — the caller serialises them.
// ---------------------------------------------------------------------------

export function personJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Haider Toha",
    alternateName: ["Mohammed Haider Toha", "Mohammed Haider"],
    givenName: "Haider",
    familyName: "Toha",
    url: `${SITE_URL}/`,
    jobTitle: "Founding Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Zymbly",
      description: "Y Combinator (W26)",
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Imperial College London",
        url: "https://www.imperial.ac.uk/",
      },
    ],
    homeLocation: { "@type": "Place", name: "London, United Kingdom" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressRegion: "England",
      addressCountry: "GB",
    },
    email: "mailto:mohammedhaidertoha@gmail.com",
    knowsAbout: [
      "Software Engineering",
      "Full-Stack Development",
      "Backend Engineering",
      "Machine Learning",
      "DevOps",
      "Data Engineering",
      "High Performance Computing",
      "Distributed Systems",
      "Python",
      "TypeScript",
      "React",
      "FastAPI",
      "PostgreSQL",
      "Go",
      "Aeronautical Engineering",
    ],
    knowsLanguage: ["English", "Bengali"],
    sameAs: [
      "https://www.linkedin.com/in/haidertoha",
      "https://github.com/haider-toha",
      "https://x.com/HaiderToha",
    ],
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: AUTHOR_NAME,
    alternateName: "Haider Toha — Notes",
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
  };
}

export function profilePageJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: `${SITE_URL}/`,
    mainEntity: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
  };
}

export function articleJsonLd(note: Note): Record<string, unknown> {
  const url = absUrl(`/${note.folder}/${note.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": note.folder === "blog" ? "BlogPosting" : "WebPage",
    "@id": `${url}#article`,
    headline: note.title,
    name: note.title,
    description: noteMeta(note).description,
    url,
    mainEntityOfPage: url,
    datePublished: note.created_at,
    dateModified: note.created_at,
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
  };
}

export function breadcrumbJsonLd(
  crumbs: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}
