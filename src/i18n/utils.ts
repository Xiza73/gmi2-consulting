import { defaultLocale, locales } from './config';
import type { Locale } from './config';

export function getCurrentLocale(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  if (locales.includes(first as Locale) && first !== defaultLocale) {
    return first as Locale;
  }
  return defaultLocale;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return path;
  }
  return `/en${path}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  if (locale === 'es') return 'en';
  return 'es';
}
