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
    org: "Google",
    cert: "/certs/Coursera - Foundations of Cybersecurity.webp",
  },
  {
    n: "11",
    title: "Play It Safe: Manage Security Risks",
    org: "Google",
    cert: "/certs/Coursera Play It Safe Manage Security Risks.webp",
  },
  {
    n: "12",
    title: "Connect and Protect: Networks and Network Security",
    org: "Google",
    cert: "/certs/Coursera Connect and Protect Networks and Network.webp",
  },
  {
    n: "13",
    title: "Tools of the Trade: Linux and SQL",
    org: "Google",
    cert: "/certs/Coursera Tools of the Trade Linux and SQL.webp",
  },
  {
    n: "14",
    title: "Assets, Threats, and Vulnerabilities",
    org: "Google",
    cert: "/certs/Coursera Assets, Threats, and Vulnerabilities.webp",
  },
  {
    n: "15",
    title: "Sound the Alarm: Detection and Response",
    org: "Google",
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
    org: "Google",
    cert: "/certs/Coursera - Automate Cybersecurity Tasks with Python.webp",
  },
  {
    n: "20",
    title: "Put It to Work: Prepare for Cybersecurity Jobs",
    org: "Google",
    cert: "/certs/Coursera - Put It to Work Prepare for Cybersecurity Jobs.webp",
  },
  {
    n: "21",
    title: "Accelerate Your Job Search with AI",
    org: "Google",
    cert: "/certs/Coursera - Accelerate Your Job Search with AI.webp",
  },
  {
    n: "22",
    title: "Google Cybersecurity Professional Certificate",
    org: "Google",
    cert: "/certs/Google Cybersecurity Certificate.webp",
  },
];

export const COURSE_GROUPS = COURSES.reduce<{ org: string; courses: Course[] }[]>(
  (groups, course) => {
    const group = groups.find((item) => item.org === course.org);
    if (group) {
      group.courses.push(course);
    } else {
      groups.push({ org: course.org, courses: [course] });
    }
    return groups;
  },
  [],
);
