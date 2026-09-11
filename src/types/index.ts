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
};

export type Course = { n: string; title: string; org: string; cert?: string };

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
};

export type StackGroup = { title: string; items: string[] };
