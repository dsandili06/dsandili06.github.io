import type { Certification } from "@/types";

export const CERTIFICATIONS: Certification[] = [
  {
    code: "SAL1",
    title: "SAL1 (Security Analyst L1)",
    org: "TryHackMe",
    year: "19/03/2026",
    score: "948 / 1000",
    status: "OBTENIDA",
    badge: "CERTIFIED",
    href: "/certs/THM-SAL1-Certificate.png",
    logo: "/badges/sal1badge.png",
  },
  {
    code: "GOOGLE",
    title: "Google Cybersecurity",
    org: "Google",
    year: "15/08/2026",
    status: "OBTENIDA",
    badge: "CERTIFIED",
    href: "/certs/Google Cybersecurity Certificate.webp",
    logo: "/badges/badgegoogle.png",
  },
  {
    code: "SY0-701",
    title: "CompTIA Security+",
    org: "CompTIA",
    year: "2026",
    status: "EN PREPARACIÓN",
    badge: "EN PREPARACIÓN",
    note: "Objetivo para el Q3 de 2026",
    logo: "/badges/comptiabadge.png",
  },
];
