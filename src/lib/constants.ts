export const COLORS = {
  bg: "#05070B",
  pink: "#FF2EA6",
  blue: "#27B8FF",
  purple: "#7B3EFF",
  gold: "#C8A96A",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "דף הבית" },
  { href: "/catalog", label: "מוצרים" },
  { href: "/promotions", label: "מבצעים" },
  { href: "/club", label: "מועדון לקוחות" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
] as const;

export const LEGAL_LINKS = [
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/terms", label: "תקנון" },
  { href: "/shipping-returns", label: "משלוחים והחזרות" },
  { href: "/cookies", label: "עוגיות" },
] as const;

export const LEGAL_UPDATED = "6 ביולי 2026";

export const BENEFITS = [
  {
    icon: "truck",
    title: "משלוח מהיר",
    subtitle: "2-5 ימי עסקים",
  },
  {
    icon: "shield",
    title: "מוצרים מקוריים",
    subtitle: "100% איכות",
  },
  {
    icon: "headset",
    title: "שירות VIP",
    subtitle: "24/7",
  },
  {
    icon: "credit-card",
    title: "תשלום מאובטח",
    subtitle: "SSL מלא",
  },
] as const;

export const CATEGORIES = [
  { id: "tobacco", label: "טבק", color: "pink" as const, href: "/catalog?cat=tobacco" },
  { id: "liquids", label: "נוזלים", color: "blue" as const, href: "/catalog?cat=liquids" },
  { id: "vapes", label: "סיגריות אלקטרוניות", color: "pink" as const, href: "/catalog?cat=vapes" },
  { id: "accessories", label: "אביזרים", color: "blue" as const, href: "/catalog?cat=accessories" },
  { id: "coals", label: "פחמים", color: "pink" as const, href: "/catalog?cat=coals" },
  { id: "filters", label: "פילטרים", color: "blue" as const, href: "/catalog?cat=filters" },
  { id: "rolling", label: "גלגול", color: "pink" as const, href: "/catalog?cat=rolling" },
  { id: "pipes", label: "מקטרות", color: "blue" as const, href: "/catalog?cat=pipes" },
  { id: "bongs", label: "באנגים", color: "pink" as const, href: "/catalog?cat=bongs" },
] as const;

export const POPULAR_PRODUCTS = [
  {
    id: "1",
    name: "Al Fakher Tobacco",
    nameHe: "טבק Al Fakher",
    price: 85,
    image: "/products/al-fakher.svg",
    brand: "Al Fakher",
  },
  {
    id: "2",
    name: "Starbuzz Tobacco",
    nameHe: "טבק Starbuzz",
    price: 95,
    image: "/products/starbuzz.svg",
    brand: "Starbuzz",
  },
  {
    id: "3",
    name: "Adalya Tobacco",
    nameHe: "טבק Adalya",
    price: 75,
    image: "/products/adalya.svg",
    brand: "Adalya",
  },
  {
    id: "4",
    name: "IVG E-Liquid",
    nameHe: "נוזל IVG",
    price: 60,
    image: "/products/ivg.svg",
    brand: "IVG",
  },
  {
    id: "5",
    name: "RAW Rolling Papers",
    nameHe: "ניירות RAW",
    price: 55,
    image: "/products/raw.svg",
    brand: "RAW",
  },
] as const;

export const BRANDS = [
  "RAW",
  "Starbuzz",
  "Al Fakher",
  "Adalya",
  "Fumari",
  "IVG",
  "Vaporesso",
  "GeekVape",
  "SMOK",
] as const;
