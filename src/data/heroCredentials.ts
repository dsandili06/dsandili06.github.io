import type { HeroCredential } from "@/types";

/** Primary credentials shown as badges in the Hero, in display order. */
export const HERO_CREDENTIALS: HeroCredential[] = [
  {
    id: "comptia-secplus",
    name: "CompTIA Security+",
    shortName: "Security+",
    logo: "/badges/comptiabadge.png",
    cert: "/certs/comptia-security-plus-sy0-701.webp",
  },
  {
    id: "sal1",
    name: "SAL1",
    shortName: "SAL1",
    logo: "/badges/sal1badge.png",
    cert: "/certs/THM-SAL1-Certificate.png",
  },
  {
    id: "google-cybersecurity",
    name: "Google Cybersecurity",
    shortName: "Google Cybersecurity",
    logo: "/badges/badgegoogle.png",
    cert: "/certs/Google Cybersecurity Certificate.webp",
  },
];

/** Plain-language summary shown under the role line in the Hero. */
export const HERO_SUMMARY =
  "Detecto, investigo y documento incidentes de seguridad: análisis de logs, forense de memoria y red, y respuesta a incidentes.";
