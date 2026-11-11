import { CONTACT } from "@/data/site";
import type { ContactChannel, ContactMetaItem } from "@/types";

/** Contact channels shown in the Contacto section, in display order. */
export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    code: "01",
    label: "LinkedIn",
    value: "/in/santiagodsandili",
    href: CONTACT.linkedin,
    cta: "CONECTAR →",
    ariaLabel: "Conectar con Santiago en LinkedIn (abre en pestaña nueva)",
    external: true,
    icon: "linkedin",
  },
  {
    code: "02",
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    cta: "ENVIAR EMAIL →",
    ariaLabel: `Enviar correo a ${CONTACT.email}`,
    external: false,
    icon: "mail",
  },
  {
    code: "03",
    label: "GitHub",
    value: "github.com/dsandili06",
    href: CONTACT.github,
    cta: "VER PERFIL →",
    ariaLabel: "Ver perfil y repositorios de Santiago en GitHub (abre en pestaña nueva)",
    external: true,
    icon: "github",
  },
];

/** Availability facts shown next to the contact channels. */
export const CONTACT_META: ContactMetaItem[] = [
  { k: "UBICACIÓN", v: "Tucumán, Argentina" },
  { k: "MODALIDAD", v: "Remoto / Híbrido" },
  { k: "RESPUESTA", v: "< 24 horas" },
];
