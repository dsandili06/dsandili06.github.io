export type ProjectScript = {
  name: string;
  desc: string;
  lang?: "py" | "ps1" | "yara" | "sigma";
};

export type ProjectMetric = {
  label: string;
  value: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
  tags?: string[];
  branch?: string;
  license?: string;
  visibility?: string;
  image?: string;
  metrics?: ProjectMetric[];
  scripts?: ProjectScript[];
  modulesLabel?: string;
  highlight?: string;
  inPageHref?: string;
  inPageLabel?: string;
};

export type Investigation = {
  id: string;
  title: string;
  platform: string;
  summary: string;
  categories: string[];
  href: string;
  visual?: {
    src: string;
    alt: string;
    caption: string;
  };
};

export type Course = {
  n: string;
  title: string;
  org: string;
  cert?: string;
  featured?: boolean;
};

export type MockExamDomain = {
  domain: string;
  score: number;
};

export type MockExam = {
  id: string;
  title: string;
  date: string;
  score: number;
  correctQuestions: number;
  totalQuestions: number;
  timeSpent: string;
  image: string;
  domains: MockExamDomain[];
  highlightedDomains?: string[];
  analysis?: string;
  shortLabel?: string;
};

export type Certification = {
  code: string;
  title: string;
  org: string;
  year: string;
  score?: string;
  status: "OBTENIDA" | "EN PREPARACIÓN";
  badge: string;
  href?: string;
  featured?: boolean;
  note?: string;
  logo?: string;
  mockExams?: MockExam[];
  /** Technical exam review shown in the certificate modal, if any. */
  review?: CertificateReviewId;
};

export type AboutTabId = "triage" | "dfir" | "hunting";

/** A focus area tab in the About dossier. */
export type AboutTab = {
  id: AboutTabId;
  label: string;
  title: string;
  description: string;
  highlights: string[];
};

/** A contact channel card in the Contacto section. */
export type ContactChannel = {
  code: string;
  label: string;
  value: string;
  href: string;
  cta: string;
  ariaLabel: string;
  external: boolean;
  icon: "linkedin" | "mail" | "github";
};

export type ContactMetaItem = { k: string; v: string };

/** A credential badge shown in the Hero. `cert` must exist in the certificate catalog. */
export type HeroCredential = {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  cert: string;
};

/** Identifies which exam review a certificate modal renders. */
export type CertificateReviewId = "sal1" | "security-plus";

/** A certificate image that can be opened in the certificate modal. */
export type CertificateEntry = {
  /** Stable, URL-safe id used in the `?cert=` search param. */
  id: string;
  /** Public path of the certificate image or PDF. */
  src: string;
  title: string;
  review?: CertificateReviewId;
};

export type StackGroup = { title: string; items: string[] };
