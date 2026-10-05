<div dir="rtl">

# موقع SEO بالعربي والإنقليزي — يكتب ويتصدّر قوقل بـ Claude Code

تطبيق كامل للطريقة اللي شرحها الفيديو
**Claude Code SEO Masterclass**:
مقالات بالجملة للكلمات المعلوماتية، وصفحات خدمات (خدمة × مدينة) للكلمات اللي تجيب فلوس، وكل شي مؤتمت بأوامر.

يشتغل لأي نشاط تجاري: سباكة، عيادة، صالون، تنظيف، عقار، محاماة، ورشة، وكالة... البيانات كلها في ملف واحد.

## وش فيه؟

| الجزء من الفيديو | وين تلقاه هنا |
|---|---|
| بناء الموقع (رئيسية + فهرس مدونة + فهرس خدمات) | `app/` — موقع ثابت بالكامل (SSG)، عربي RTL وإنقليزي |
| ملف `CLAUDE.md` اللي يدرّب Claude | `CLAUDE.md` |
| البحث عن كلمات رابحة (KD ≤ 30، بحث ≥ 100، نية معلوماتية) | `/keyword-research` + `npm run next-keyword` |
| مقال + كلستر كلمات + صور Pexels | `/blog` + `npm run pexels` |
| صوتك، نكتك، آراءك، أرقامك، قصصك | `references/` + `/voice` |
| "اسرق" شكل أول 3 نتائج في قوقل | `npm run analyze-serp` |
| صفحات الخدمات (السحّاب: خدمة × مدينة) بنفس تصميم الرئيسية | `/service` |
| On-page SEO (أكثر من 80 إشارة) | `seo/on-page-checklist.md` + فحص تلقائي `npm run check-seo` |
| Technical SEO: sitemap و robots و Lighthouse 100 | `/tech-seo` + `npm run lighthouse` |
| تحويل كل شي لسكل واحد `/blog` | `.claude/skills/` |
| النشر بهدوء (بدون قفزات تلفت نظر قوقل) | `npm run cadence` |
| Off-page SEO بالطرق الآمنة فقط | `seo/off-page.md` |
| GitHub + Vercel + Search Console + Google Business | `docs/DEPLOY.md` + `/publish` |

## ابدأ في 5 خطوات

**1. افتح هالمجلد في Claude Code** (مهم: افتح مجلد `seo-site` نفسه، عشان السكلات تشتغل):

<div dir="ltr">

```bash
cd seo-site
npm install
cp .env.example .env     # حط مفتاح Pexels المجاني
```

</div>

**2. عدّل بيانات نشاطك** في `site.config.ts`: الاسم، الجوال، العنوان، الخدمات، المدن. (الموجود الحين مثال وهمي لشركة سباكة.)

**3. علّم Claude صوتك:** اكتب `/voice` والصق 3 إلى 5 بوستات أو رسايل كتبتها أنت.

**4. لقّ كلماتك:** اكتب `/keyword-research` (يستخدم Semrush إذا كان موصول، أو صدّر CSV منه وحطه في `data/`).

**5. اكتب وانشر:**

<div dir="ltr">

```
/blog        → مقال كامل بالعربي والإنقليزي
/service     → صفحة خدمة × مدينة
/tech-seo    → Lighthouse 100
/publish     → GitHub → Vercel → Search Console
```

</div>

تقدر تجدول `/blog` يشتغل كل يوم الصبح، وسكربت `cadence` يمنعه ينشر أكثر من اللازم.

## الأوامر

<div dir="ltr">

```bash
npm run dev            # معاينة: http://localhost:3000/ar/
npm run build          # بناء الموقع الثابت في out/
npm run check-seo      # فحص On-page لكل الصفحات
npm run next-keyword   # الكلمة الجاية للمقال (-- --type service لصفحات الخدمات)
npm run pexels -- "query" slug 3
npm run analyze-serp -- url1 url2 url3
npm run cadence        # تقدر تنشر اليوم؟
npm run lighthouse     # تقييم Lighthouse بعد البناء
```

</div>

## ملاحظات مهمة

- المحتوى والأرقام في `content/` و `data/` **أمثلة تجريبية**. احذفها أو استبدلها قبل النشر.
- Claude ما يستخدم إلا الأرقام والقصص المكتوبة في `references/stats.md` و `references/stories.md`. ما يخترع شي.
- لا تنشر مئات الصفحات مرة وحدة، ولا تشتري باك لينكات رخيصة. التفاصيل في `seo/off-page.md`.

</div>
