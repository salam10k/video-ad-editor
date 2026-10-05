// ============================================================================
// THE ONE FILE TO EDIT FOR YOUR BUSINESS.
// Everything below is a GENERAL PLACEHOLDER. Run /setup in Claude Code to fill it in
// by answering a few questions, or edit it by hand. Any business works:
// clinic, salon, cleaning, real estate, lawyer, gym, car repair, agency, restaurant...
// ============================================================================

export type Lang = 'ar' | 'en';
export type Localized = Record<Lang, string>;

export const languages: Lang[] = ['ar', 'en'];
export const defaultLang: Lang = 'ar';

export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.vercel.app').replace(/\/$/, ''),

  business: {
    name: { ar: 'اسم نشاطك', en: 'Your Business' } as Localized,
    tagline: {
      ar: 'خدمة احترافية، بسعر واضح، ورد سريع',
      en: 'Professional service, clear pricing, fast replies',
    } as Localized,
    // schema.org type: LocalBusiness, ProfessionalService, Dentist, HairSalon, LegalService, Restaurant, Plumber...
    schemaType: 'LocalBusiness',
    phone: '+966500000000',
    whatsapp: '966500000000', // digits only, used for wa.me links
    email: 'hello@example.com',
    address: {
      street: { ar: 'اسم الشارع', en: 'Street name' } as Localized,
      city: { ar: 'الرياض', en: 'Riyadh' } as Localized,
      region: { ar: 'منطقة الرياض', en: 'Riyadh Province' } as Localized,
      postalCode: '12211',
      country: 'SA',
    },
    geo: { lat: 24.7136, lng: 46.6753 },
    openingHours: 'Su-Th 09:00-21:00',
    priceRange: '$$',
    foundingYear: 2020,
    // Short proof points shown on the homepage & service pages. Replace with TRUE numbers.
    stats: [
      { value: '5+', label: { ar: 'سنوات خبرة', en: 'years of experience' } },
      { value: '100+', label: { ar: 'عميل راضي', en: 'happy clients' } },
      { value: '24h', label: { ar: 'نرد خلال يوم', en: 'reply time' } },
    ],
    sameAs: [] as string[], // Google Business Profile, Instagram, X, LinkedIn URLs
  },

  // "The zipper": services x cities. A service page = one service + one city.
  // Only create pages where there is real search demand (see /service skill).
  services: [
    {
      key: 'consulting',
      name: { ar: 'استشارات', en: 'Consulting' } as Localized,
      blurb: {
        ar: 'نسمع منك، ونعطيك خطة واضحة قبل أي التزام.',
        en: 'We listen first, then give you a clear plan before any commitment.',
      } as Localized,
    },
    {
      key: 'project-delivery',
      name: { ar: 'تنفيذ المشاريع', en: 'Project delivery' } as Localized,
      blurb: {
        ar: 'تنفيذ كامل من البداية للتسليم، بمواعيد مكتوبة.',
        en: 'End-to-end delivery with written deadlines.',
      } as Localized,
    },
    {
      key: 'maintenance-support',
      name: { ar: 'الصيانة والدعم', en: 'Maintenance & support' } as Localized,
      blurb: {
        ar: 'نكون معك بعد التسليم، مو بس قبله.',
        en: 'We stay with you after delivery, not just before it.',
      } as Localized,
    },
    {
      key: 'training',
      name: { ar: 'التدريب', en: 'Training' } as Localized,
      blurb: {
        ar: 'نعلّم فريقك يشتغل بنفسه بثقة.',
        en: 'We teach your team to run it confidently on their own.',
      } as Localized,
    },
  ],

  cities: [
    { key: 'riyadh', name: { ar: 'الرياض', en: 'Riyadh' } as Localized },
    { key: 'jeddah', name: { ar: 'جدة', en: 'Jeddah' } as Localized },
    { key: 'dammam', name: { ar: 'الدمام', en: 'Dammam' } as Localized },
  ],

  // Lead form: paste a form endpoint (Formspree, Make.com / Zapier / n8n webhook, Basin...).
  // Empty = the form is replaced by WhatsApp + call buttons.
  leadFormEndpoint: '',

  // Google Search Console "HTML tag" verification: paste only the content="..." value.
  googleSiteVerification: '',

  // Google Analytics 4 measurement ID, e.g. G-XXXXXXX. Empty = no analytics script.
  gaId: '',
};

export function serviceByKey(key: string) {
  return site.services.find((s) => s.key === key);
}

export function cityByKey(key: string) {
  return site.cities.find((c) => c.key === key);
}
