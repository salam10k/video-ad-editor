import { languages, type Lang } from '@/site.config';

export function isLang(value: string): value is Lang {
  return (languages as string[]).includes(value);
}

export const dir = (lang: Lang) => (lang === 'ar' ? 'rtl' : 'ltr');
export const otherLang = (lang: Lang): Lang => (lang === 'ar' ? 'en' : 'ar');
export const locale = (lang: Lang) => (lang === 'ar' ? 'ar_SA' : 'en_US');

const dict = {
  ar: {
    home: 'الرئيسية',
    services: 'الخدمات',
    blog: 'المدونة',
    callNow: 'اتصل الآن',
    whatsapp: 'واتساب',
    getQuote: 'اطلب عرض سعر',
    switchLang: 'English',
    servicesTitle: 'خدماتنا',
    servicesIntro: 'اختر الخدمة والمدينة، والباقي علينا.',
    blogTitle: 'المدونة',
    blogIntro: 'مقالات عملية، بلغة بسيطة، وأحياناً بنكتة أو ثنتين.',
    latestPosts: 'آخر المقالات',
    readMore: 'اقرأ المقال',
    allPosts: 'كل المقالات',
    allServices: 'كل الخدمات',
    howItWorks: 'كيف نشتغل',
    steps: [
      { t: 'تتواصل معنا', d: 'اتصال أو واتساب أو النموذج — نرد خلال دقائق.' },
      { t: 'نعطيك خطة وسعر', d: 'نفهم احتياجك ونقول لك التكلفة بوضوح قبل ما نبدأ.' },
      { t: 'ننفّذ ونتابع', d: 'شغل متقن بمواعيد واضحة، ومتابعة بعد التسليم.' },
    ],
    faq: 'أسئلة شائعة',
    formTitle: 'اطلب عرض سعر',
    formName: 'الاسم',
    formPhone: 'رقم الجوال',
    formCity: 'المدينة',
    formMessage: 'وش تحتاج؟',
    formSubmit: 'أرسل الطلب',
    formNote: 'نرد عليك خلال 15 دقيقة في أوقات العمل.',
    ctaTitle: 'جاهز تبدأ؟',
    ctaText: 'كلمنا الحين، ونعطيك خطة وسعر واضح بدون أي التزام.',
    in: 'في',
    otherCities: 'نفس الخدمة في مدن ثانية',
    otherServices: 'خدمات ثانية في',
    relatedPosts: 'مقالات ذات صلة',
    minRead: 'دقائق قراءة',
    updated: 'آخر تحديث',
    photoBy: 'تصوير',
    onPexels: 'على Pexels',
    contact: 'تواصل معنا',
    rights: 'جميع الحقوق محفوظة',
    notFound: 'الصفحة غير موجودة',
    backHome: 'ارجع للرئيسية',
  },
  en: {
    home: 'Home',
    services: 'Services',
    blog: 'Blog',
    callNow: 'Call now',
    whatsapp: 'WhatsApp',
    getQuote: 'Get a quote',
    switchLang: 'العربية',
    servicesTitle: 'Our services',
    servicesIntro: 'Pick the service and the city. We handle the rest.',
    blogTitle: 'Blog',
    blogIntro: 'Practical guides in plain English, with the occasional joke.',
    latestPosts: 'Latest articles',
    readMore: 'Read article',
    allPosts: 'All articles',
    allServices: 'All services',
    howItWorks: 'How it works',
    steps: [
      { t: 'You reach out', d: 'Call, WhatsApp or the form — we reply in minutes.' },
      { t: 'Plan & price', d: 'We understand what you need and give you a clear price before we start.' },
      { t: 'Deliver & follow up', d: 'Quality work on clear deadlines, with follow-up after delivery.' },
    ],
    faq: 'Frequently asked questions',
    formTitle: 'Request a quote',
    formName: 'Name',
    formPhone: 'Phone',
    formCity: 'City',
    formMessage: 'What do you need?',
    formSubmit: 'Send request',
    formNote: 'We reply within 15 minutes during working hours.',
    ctaTitle: 'Ready to start?',
    ctaText: 'Call us now for a clear plan and price, no commitment.',
    in: 'in',
    otherCities: 'Same service in other cities',
    otherServices: 'Other services in',
    relatedPosts: 'Related articles',
    minRead: 'min read',
    updated: 'Updated',
    photoBy: 'Photo by',
    onPexels: 'on Pexels',
    contact: 'Contact',
    rights: 'All rights reserved',
    notFound: 'Page not found',
    backHome: 'Back to home',
  },
} as const;

export function t(lang: Lang) {
  return dict[lang];
}

export function formatDate(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
