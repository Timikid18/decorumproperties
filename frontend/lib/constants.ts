// Brand & business defaults for DECORUM HOMES & PROPERTIES.
// These are fallbacks only — the live values come from the backend
// (site_settings API) so the owner can edit them without touching code.

export const BUSINESS = {
  name: "DECORUM HOMES & PROPERTIES",
  shortName: "DECORUM",
  slogan: "We make buying and selling simple.",
  address:
    "Accord Estate, FUNAAB, Abeokuta Road, Abeokuta, Ogun State, Nigeria.",
  phones: ["07066527982", "09039744172"],
  whatsappNumbers: ["07066527982", "09039744172"],
  email: "decorumproperties.ng@gmail.com",
} as const;

export const PRIMARY_WHATSAPP = BUSINESS.whatsappNumbers[0];
export const PRIMARY_PHONE = BUSINESS.phones[0];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Shop", href: "/shop" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Sell To Us", href: "/sell-to-us" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const APP_NAME = "DECORUM HOMES & PROPERTIES";

export const WHATSAPP_INTRO_MESSAGE =
  `Hello ${BUSINESS.name}, I would like to make an enquiry.`;