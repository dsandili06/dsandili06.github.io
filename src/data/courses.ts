import type { Course } from "@/types";

export const COURSES: Course[] = [
  {
    n: "01",
    title: "Networking Basics",
    org: "Cisco",
    cert: "/certs/Networking_Basics_certificate_CISCO.webp",
  },
  {
    n: "02",
    title: "Introduction to Cybersecurity",
    org: "Cisco",
    cert: "/certs/_certificate_introduction_to_cybersecurity_CISCO.webp",
  },
  {
    n: "03",
    title: "Network Security Fundamentals",
    org: "Palo Alto Networks",
    cert: "/certs/Palo Alto Networks Course Certificate of Completion - Network Security Fundamentals.webp",
  },
  {
    n: "04",
    title: "Pre Security",
    org: "TryHackMe",
    cert: "/certs/THM-PRESECURITY.webp",
  },
  {
    n: "05",
    title: "Cyber Security 101",
    org: "TryHackMe",
    cert: "/certs/THM-Cyber-Security-101.webp",
  },
  {
    n: "06",
    title: "SOC L1 Path",
    org: "TryHackMe",
    cert: "/certs/THM-SOC L1 PATH.webp",
  },
  {
    n: "07",
    title: "SOC L1 BOOTCAMP",
    org: "DOJO COMMUNITY",
    cert: "/certs/Captura de pantalla 2026-07-30 124141.webp",
  },
  {
    n: "08",
    title: "CompTIA Security+ (SY0-701) Cert Prep",
    org: "LinkedIn Learning",
    cert: "/certs/CertificateOfCompletion_CompTIA Security SY0701 Cert Prep by Infosec.webp",
  },
  {
    n: "09",
    title: "Cyber Incident Response and Digital Forensics",
    org: "LinkedIn Learning",
    cert: "/certs/CertificateOfCompletion_Learning Cyber Incident Response and Digital Forensics.webp",
  },
  {
    n: "10",
    title: "Foundations of Cybersecurity",
    org: "Coursera/Google",
    cert: "/certs/Coursera - Foundations of Cybersecurity.webp",
  },
  {
    n: "11",
    title: "Play It Safe: Manage Security Risks",
    org: "Coursera/Google",
    cert: "/certs/Coursera Play It Safe Manage Security Risks.webp",
  },
  {
    n: "12",
    title: "Connect and Protect: Networks and Network Security",
    org: "Coursera/Google",
    cert: "/certs/Coursera Connect and Protect Networks and Network.webp",
  },
  {
    n: "13",
    title: "Tools of the Trade: Linux and SQL",
    org: "Coursera/Google",
    cert: "/certs/Coursera Tools of the Trade Linux and SQL.webp",
  },
  {
    n: "14",
    title: "Assets, Threats, and Vulnerabilities",
    org: "Coursera/Google",
    cert: "/certs/Coursera Assets, Threats, and Vulnerabilities.webp",
  },
  {
    n: "15",
    title: "Sound the Alarm: Detection and Response",
    org: "Coursera/Google",
    cert: "/certs/Coursera - Sound the Alarm Detection and Response.webp",
  },
  {
    n: "16",
    title: "Fundamentos en Blue Team: Ciberinteligencia, Forense y Respuesta",
    org: "Academia de Capacitación en Ciberseguridad",
    cert: "/certs/Certificado_de_Aprobacion -  ACAD DE CIBERSEGURIDAD.webp",
  },
  {
    n: "17",
    title: "NSE 1 Network Security Associate",
    org: "Fortinet",
    cert: "/certs/Fortinet NSE 1 Certified in Cybersecurity.webp",
  },
  {
    n: "18",
    title: "NSE 2 Network Security Associate",
    org: "Fortinet",
    cert: "/certs/Fortinet NSE 2 Certified in Cybersecurity.webp",
  },
  {
    n: "19",
    title: "Automate Cybersecurity Tasks with Python",
    org: "Coursera/Google",
    cert: "/certs/Coursera - Automate Cybersecurity Tasks with Python.webp",
  },
  {
    n: "20",
    title: "Put It to Work: Prepare for Cybersecurity Jobs",
    org: "Coursera/Google",
    cert: "/certs/Coursera - Put It to Work Prepare for Cybersecurity Jobs.webp",
  },
  {
    n: "21",
    title: "Accelerate Your Job Search with AI",
    org: "Coursera/Google",
    cert: "/certs/Coursera - Accelerate Your Job Search with AI.webp",
  },
];

export type InstitutionMeta = {
  id: string;
  name: string;
  shortName: string;
  code: string;
  badge?: string;
  domain: string;
  description: string;
};

export const INSTITUTIONS: Record<string, InstitutionMeta> = {
  "Coursera/Google": {
    id: "coursera-google",
    name: "Coursera/Google",
    shortName: "Coursera/Google",
    code: "COUR",
    badge: "/badges/coursera.png",
    domain: "Ciberseguridad & Cloud",
    description:
      "Certificado Profesional Google Cybersecurity y especializaciones defensivas en Coursera.",
  },
  TryHackMe: {
    id: "tryhackme",
    name: "TryHackMe",
    shortName: "TryHackMe",
    code: "THM",
    badge: "/badges/tryhackme.png",
    domain: "Labs Prácticos & SOC L1",
    description:
      "Rutas técnicas de entrenamiento defensivo, análisis de telemetría y fundamentos tácticos.",
  },
  Cisco: {
    id: "cisco",
    name: "Cisco",
    shortName: "Cisco",
    code: "CSCO",
    badge: "/badges/cisco.webp",
    domain: "Redes & Arquitectura Defensiva",
    description:
      "Fundamentos de redes defensivas, topologías, protocolos IP y principios de telecomunicaciones.",
  },
  Fortinet: {
    id: "fortinet",
    name: "Fortinet",
    shortName: "Fortinet",
    code: "FTNT",
    badge: "/badges/fortinet.png",
    domain: "Seguridad Perimetral & Amenazas",
    description:
      "Certificaciones NSE 1 y 2 en vectores de amenazas contemporáneas y seguridad corporativa.",
  },
  "Palo Alto Networks": {
    id: "palo-alto",
    name: "Palo Alto Networks",
    shortName: "Palo Alto",
    code: "PANW",
    badge: "/badges/palo-alto.png",
    domain: "Perímetro & Firewalls NGFW",
    description:
      "Conceptos fundamentales de seguridad en red, firewalls de próxima generación y prevención de intrusiones.",
  },
  "LinkedIn Learning": {
    id: "linkedin",
    name: "LinkedIn Learning",
    shortName: "LinkedIn Learning",
    code: "LKDN",
    badge: "/badges/linkedin-learning.png",
    domain: "DFIR & Formación Especializada",
    description:
      "Preparación especializada para CompTIA Security+ y protocolos forenses de respuesta a incidentes.",
  },
  "DOJO COMMUNITY": {
    id: "dojo",
    name: "DOJO COMMUNITY",
    shortName: "Dojo Community",
    code: "DOJO",
    badge: "/badges/dojo.png",
    domain: "Operaciones SOC & Triage",
    description:
      "Bootcamp intensivo de operaciones Blue Team, monitorización de alertas y análisis en SOC L1.",
  },
  "Academia de Capacitación en Ciberseguridad": {
    id: "acad-ciberseguridad",
    name: "Academia de Capacitación en Ciberseguridad",
    shortName: "Acad. Ciberseguridad",
    code: "ACAD",
    badge: "/badges/ciber.png",
    domain: "Blue Team, Intel & Forense",
    description:
      "Especialización técnica en operaciones defensivas, análisis forense digital y ciberinteligencia.",
  },
};

export const INSTITUTION_ORDER: string[] = [
  "Coursera/Google",
  "TryHackMe",
  "Cisco",
  "Fortinet",
  "Palo Alto Networks",
  "LinkedIn Learning",
  "DOJO COMMUNITY",
  "Academia de Capacitación en Ciberseguridad",
];

export type CourseGroup = {
  org: string;
  courses: Course[];
  meta?: InstitutionMeta;
};

export const COURSE_GROUPS: CourseGroup[] = (() => {
  const groups: CourseGroup[] = INSTITUTION_ORDER.map((orgName) => ({
    org: orgName,
    courses: COURSES.filter((c) => c.org === orgName),
    meta: INSTITUTIONS[orgName],
  })).filter((group) => group.courses.length > 0);

  // Fallback to preserve any orgs not explicitly in INSTITUTION_ORDER
  const handledOrgs = new Set(INSTITUTION_ORDER);
  const remainingOrgs = Array.from(new Set(COURSES.map((c) => c.org))).filter(
    (org) => !handledOrgs.has(org),
  );
  for (const org of remainingOrgs) {
    groups.push({
      org,
      courses: COURSES.filter((c) => c.org === org),
      meta: INSTITUTIONS[org],
    });
  }

  return groups;
})();
