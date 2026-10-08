/**
 * Brand Configuration for أدوات التميز (Tamayoz Tools)
 * Centralized source of truth for branding, metadata, logos, and links.
 */

export interface BrandConfig {
  arabicName: string;
  latinName: string;
  descriptor: string;
  tagline: string;
  parentNetworkName: string;
  footerLine: string;
  logoPath: string;
  domain: string;
  urls: {
    home: string;
    academy: string;
    mainPlatform: string;
    youtube: string;
    contactEmail: string;
  };
  privacyNotice: string;
  getPageTitle: (toolName?: string) => string;
}

export const brand: BrandConfig = {
  arabicName: 'أدوات التميز',
  latinName: 'Tamayoz Tools',
  descriptor: 'منصة أدوات تعليمية مجانية',
  tagline: 'منصة الأدوات المدرسية والجامعية الأسهل والأسرع للتلاميذ والأساتذة والأولياء',
  parentNetworkName: 'مسار التميز',
  footerLine: 'من مسار التميز — أكاديمية الرياضيات عن بُعد',
  logoPath: '/logo.svg',
  domain: 'tools.masartamayoz.com',
  urls: {
    home: 'https://tools.masartamayoz.com',
    academy: 'https://academy.masartamayoz.com',
    mainPlatform: 'https://masartamayoz.com',
    youtube: 'https://www.youtube.com/@masartamayoz',
    contactEmail: 'contact@masartamayoz.com',
  },
  privacyNotice: 'ملفاتك لا تغادر جهازك أبداً — جميع المعالجات تتم بنسبة 100% داخل متصفحك المحلي بأقصى خصوصية وأمان.',
  getPageTitle: (toolName?: string) => {
    if (!toolName) {
      return `${brand.arabicName} | ${brand.descriptor}`;
    }
    return `${toolName} | ${brand.arabicName}`;
  },
};

export default brand;
