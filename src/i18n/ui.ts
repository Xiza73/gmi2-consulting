import type { LocaleMap } from './config';

interface UiStrings {
  readonly copyright: string;
  readonly languageLabel: string;
  readonly switchLanguage: string;
  readonly notFoundTitle: string;
  readonly notFoundDescription: string;
  readonly backHome: string;
  readonly contactName: string;
  readonly contactEmail: string;
  readonly contactCompany: string;
  readonly contactMessage: string;
  readonly contactSend: string;
  readonly detectionBannerMessage: string;
  readonly detectionBannerSwitch: string;
  readonly detectionBannerDismiss: string;
}

export const UI: LocaleMap<UiStrings> = {
  es: {
    copyright: 'Todos los derechos reservados.',
    languageLabel: 'ES',
    switchLanguage: 'English',
    notFoundTitle: 'Pagina no encontrada',
    notFoundDescription: 'La pagina que buscas no existe o fue movida.',
    backHome: 'Volver al inicio',
    contactName: 'Nombre',
    contactEmail: 'Email',
    contactCompany: 'Empresa',
    contactMessage: 'Mensaje',
    contactSend: 'Enviar',
    detectionBannerMessage: 'Version en español disponible',
    detectionBannerSwitch: 'Cambiar',
    detectionBannerDismiss: '✕',
  },
  en: {
    copyright: 'All rights reserved.',
    languageLabel: 'EN',
    switchLanguage: 'Español',
    notFoundTitle: 'Page not found',
    notFoundDescription: 'The page you are looking for does not exist or has been moved.',
    backHome: 'Back to home',
    contactName: 'Name',
    contactEmail: 'Email',
    contactCompany: 'Company',
    contactMessage: 'Message',
    contactSend: 'Send',
    detectionBannerMessage: 'English version available',
    detectionBannerSwitch: 'Switch',
    detectionBannerDismiss: '✕',
  },
};
