export type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
};

export type Investigation = {
  id: string;
  title: string;
  platform: string;
  summary: string;
  categories: string[];
  href: string;
};

export type Course = { n: string; title: string; org: string; cert?: string };

export type Certification = {
  code: string;
  title: string;
  org: string;
  year: string;
  score?: string;
  status: "OBTENIDA" | "EN PREPARACIÓN";
  badge: string;
  href?: string;
};

export type StackGroup = { title: string; items: string[] };
