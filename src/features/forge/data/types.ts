// Shared types for all forge data files

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  readonly bodyClass: string;
}

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export interface NavBrand {
  readonly text: string;
  readonly accent: string;
  readonly href: string;
}

export interface NavCta {
  readonly label: string;
  readonly href: string;
}

export interface NavContent {
  readonly links: readonly NavLink[];
  readonly cta: NavCta;
}

export interface HeroCtaItem {
  readonly label: string;
  readonly href: string;
}

export interface HeroCta {
  readonly primary: HeroCtaItem;
  readonly secondary: HeroCtaItem;
}

export interface HeroTitle {
  readonly line1: string;
  readonly line2: string;
}

export interface HeroContent {
  readonly eyebrow: string;
  readonly title: HeroTitle;
  readonly description: string;
  readonly cta: HeroCta;
}

export interface AboutStat {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
}

export interface AboutContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface Service {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly features: readonly string[];
}

export interface ServicesHeader {
  readonly eyebrow: string;
  readonly title: string;
}

export interface TechItem {
  readonly name: string;
  readonly color: string;
  readonly glow: string;
}

export interface TechnologiesHeader {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
}

export interface TechBottomStat {
  readonly value: string;
  readonly label: string;
}

export interface CaseStudy {
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly metrics: readonly string[];
  readonly color: string;
}

export interface CaseStudiesHeader {
  readonly eyebrow: string;
  readonly title: string;
}

export interface ProcessStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface ProcessHeader {
  readonly eyebrow: string;
  readonly title: string;
}

export interface Stat {
  readonly id: string;
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
}

export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  readonly author: string;
  readonly role: string;
  readonly company: string;
  readonly rating: number;
}

export interface TestimonialsHeader {
  readonly eyebrow: string;
  readonly title: string;
  readonly titleAccent: string;
}

export interface CtaItem {
  readonly label: string;
  readonly href: string;
}

export interface CtaButtons {
  readonly primary: CtaItem;
  readonly secondary: CtaItem;
}

export interface CtaTitle {
  readonly line1: string;
  readonly accent: string;
}

export interface CtaForm {
  readonly heading: string;
  readonly fallback: string;
  readonly successMessage: string;
  readonly errorMessage: string;
  readonly subject: string;
}

export interface CtaContent {
  readonly title: CtaTitle;
  readonly description: string;
  readonly cta: CtaButtons;
  readonly form: CtaForm;
}

export interface FooterLink {
  readonly label: string;
  readonly href: string;
}

export interface FooterBrand {
  readonly text: string;
  readonly accent: string;
  readonly href: string;
  readonly tagline: string;
}

export interface FooterLinks {
  readonly [category: string]: readonly FooterLink[];
}
