export const SECTIONS = [
  {
    id: "about",
    number: "01",
    navLabel: "About",
    title: "Sobre Mí",
    description: "Perfil profesional, trayectoria en Blue Team y enfoque operacional",
  },
  {
    id: "formacion",
    number: "02",
    navLabel: "Certs",
    title: "Certificaciones",
    description: "Credenciales verificadas de TryHackMe, Google, Fortinet y CompTIA",
  },
  {
    id: "proyectos",
    number: "03",
    navLabel: "Proyectos",
    title: "Proyectos & Repositorios",
    description: "Artifakt Labs, BlueTeam-Scripts y herramientas defensivas",
  },
  {
    id: "investigaciones",
    number: "04",
    navLabel: "Labs",
    title: "Labs & Investigaciones DFIR",
    description: "15 writeups técnicos de CyberDefenders con análisis forense",
  },
  {
    id: "stack",
    number: "05",
    navLabel: "Stack",
    title: "Arsenal & Stack Tecnológico",
    description: "SIEM, EDR, análisis de memoria, network forensics y scripting",
  },
  {
    id: "cursos",
    number: "06",
    navLabel: "Cursos",
    title: "Cursos & Especializaciones",
    description: "Formación continua en Cisco, Palo Alto Networks, Infosec y Dojo",
  },
  {
    id: "contacto",
    number: "07",
    navLabel: "Contacto",
    title: "Canales de Contacto",
    description: "Contacto directo, redes profesionales y clave pública",
  },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
