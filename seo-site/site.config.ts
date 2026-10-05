// ============================================================================
// THE ONE FILE TO EDIT FOR YOUR BUSINESS.
// Everything below is a DEMO (a fictional plumbing company, like the video).
// Replace names, phone, cities and services with your own — any business works:
// clinic, salon, cleaning, real estate, lawyer, gym, car repair, agency...
// ============================================================================

export type Lang = 'ar' | 'en';
export type Localized = Record<Lang, string>;

export const languages: Lang[] = ['ar', 'en'];
export const defaultLang: Lang = 'ar';

export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.vercel.app').replace(/\/$/, ''),

  business: {
    name: { ar: 'سبّاك الحي', en: 'Neighborhood Plumbing' } as Localized,
    tagline: {
      ar: 'سبّاك يوصلك بسرعة، ويشرح لك المشكلة بلغة تفهمها',
      en: 'A plumber who shows up fast and explains the problem in plain words',
    } as Localized,
    // schema.org type: Plumber, Dentist, HairSalon, LegalService, HomeAndConstructionBusiness, LocalBusiness...
    schemaType: 'Plumber',
    phone: '+966500000000',
    whatsapp: '966500000000', // digits only, used for wa.me links
    email: 'hello@example.com',
    address: {
      street: { ar: 'طريق الملك فهد', en: 'King Fahd Road' } as Localized,
      city: { ar: 'الرياض', en: 'Riyadh' } as Localized,
      region: { ar: 'منطقة الرياض', en: 'Riyadh Province' } as Localized,
      postalCode: '12211',
      country: 'SA',
    },
    geo: { lat: 24.7136, lng: 46.6753 },
    openingHours: 'Mo-Su 00:00-23:59',
    priceRange: '$$',
    foundingYear: 2015,
    // Short proof points shown on the homepage & service pages. Keep them TRUE.
    stats: [
      { value: '10+', label: { ar: 'سنوات خبرة', en: 'years in business' } },
      { value: '60', label: { ar: 'دقيقة متوسط الوصول', en: 'min average arrival' } },
      { value: '24/7', label: { ar: 'طوارئ على مدار الساعة', en: 'emergency service' } },
    ],
    sameAs: [] as string[], // Google Business Profile, Instagram, X, LinkedIn URLs
  },

  // "The zipper": services x cities. A service page = one service + one city.
  // Only create pages where there is real search demand (see /service skill).
  services: [
    {
      key: 'emergency-plumbing',
      name: { ar: 'سباكة طوارئ', en: 'Emergency plumbing' } as Localized,
      blurb: {
        ar: 'تسريب في نص الليل؟ نوصلك خلال ساعة.',
        en: 'Leak at 2 a.m.? We are there within the hour.',
      } as Localized,
    },
    {
      key: 'drain-cleaning',
      name: { ar: 'تسليك مجاري', en: 'Drain cleaning' } as Localized,
      blurb: {
        ar: 'تسليك بدون تكسير، وبدون مواد تأكل مواسيرك.',
        en: 'No smashing tiles, no chemicals that eat your pipes.',
      } as Localized,
    },
    {
      key: 'water-heater-repair',
      name: { ar: 'صيانة سخانات', en: 'Water heater repair' } as Localized,
      blurb: {
        ar: 'ماء بارد الصبح؟ نصلحه أو نقول لك بصراحة إنه انتهى.',
        en: 'Cold shower? We fix it — or honestly tell you it is done.',
      } as Localized,
    },
    {
      key: 'leak-detection',
      name: { ar: 'كشف تسربات', en: 'Leak detection' } as Localized,
      blurb: {
        ar: 'نلقى التسريب بالأجهزة قبل ما نلمس جدار.',
        en: 'We find the leak with sensors before touching a wall.',
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
