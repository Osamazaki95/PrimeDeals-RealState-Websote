# Prime Deals Brokerage — Next.js 14 · Tailwind · Supabase

موقع عقارات كامل: عربي/إنجليزي، دارك مود، أنميشن سينمائي، داشبورد للتحكم في كل صفحة،
وصفحات وظائف بفورم تقديم ورفع سيرة ذاتية. الألوان والخطوط من ملف الديزاين.

---

## ١. تشغيل سريع

```bash
npm install            # postinstall بيصلّح أسماء مجلدات الـ dynamic routes
cp .env.example .env.local
# املأ مفاتيح Supabase
npm run dev            # http://localhost:3000
```

> مجلدات الـ dynamic routes مرفوعة بأسماء `-slug-` / `-id-` / `-page-` / `-locale-`
> لأن بعض وسائل نقل الملفات مش بتقبل الأقواس. `npm install` بيرجّعها `[slug]` تلقائياً.
> لو نقلت الملفات يدوياً: `npm run setup`

## ٢. Supabase (٥ دقائق)

1. مشروع جديد على [supabase.com](https://supabase.com)
2. **SQL Editor** → شغّل `supabase/schema.sql` ثم `supabase/seed.sql`
3. **Settings → API** → انسخ `URL` و `anon key` و `service_role key` في `.env.local`
4. الباكتات بتتعمل تلقائياً: `media` (عام للصور) و `cvs` (خاص للسير الذاتية)
5. سجّل حسابك من `/en/auth` ثم:
   ```sql
   update public.profiles set role = 'admin' where id = '<your-auth-uid>';
   ```
6. `/dashboard`

| الدور | الصلاحيات |
|---|---|
| `admin` | كل حاجة + المستخدمين والصلاحيات |
| `editor` | المحتوى والصفحات والوظائف والطلبات والـ SEO والترجمات |
| `agent` | العقارات والليدز |
| `user` | المفضلة |

## ٣. هيكل الكود

```
src/
├─ app/
│  ├─ layout.tsx                 الخطوط + الثيم + dir/lang
│  ├─ [locale]/
│  │  ├─ page.tsx                الرئيسية (كل قسم معلّم بتعليق)
│  │  ├─ properties/             القائمة + [slug] تفاصيل العقار + 360°
│  │  ├─ projects/               المشاريع + [slug]
│  │  ├─ careers/                الوظايف + [slug] تفاصيل + فورم تقديم
│  │  ├─ about/ contact/ blog/   + blog/[slug]
│  │  ├─ map/ mortgage/          الخريطة + حاسبة التمويل
│  │  ├─ auth/ account/          الدخول + المفضلة
│  │  └─ [legal]/                privacy · terms
│  ├─ dashboard/                 لوحة التحكم
│  └─ api/                       API لكل صفحة (الجدول تحت)
├─ components/
│  ├─ layout/    Header (glass + dropdowns) · Footer · QuickActions · Toggles
│  ├─ sections/  Hero · SearchBar · StatsBand · CategoryGrid · ProjectBento
│  │             PropertyCard · PropertyGallery(360) · ReviewCard
│  │             LeadForm · ApplicationForm · Pagination · MortgageCalculator
│  ├─ dashboard/ Shell · ResourceManager · Editors · LeadsBoard · ApplicationsBoard
│  └─ ui/        Button · Section · Reveal · Counter · Carousel · SmartImage
├─ lib/
│  ├─ supabase/  client · server · admin · guard
│  ├─ i18n/      config · dictionaries · en.json · ar.json
│  ├─ media.ts   مكتبة الصور — مكان واحد لكل صورة
│  ├─ queries.ts كل قراءات الداتا من السيرفر
│  └─ format.ts  الأسعار والتواريخ و pick(locale)
└─ styles/globals.css   التوكنز (لايت/دارك) + الـ bento والكاروسيل
```

## ٤. الـ API

| Endpoint | Methods | الصفحة |
|---|---|---|
| `/api/properties` · `/[slug]` | GET POST PATCH DELETE | العقارات والتفاصيل |
| `/api/projects` · `/[slug]` | GET POST PATCH DELETE | المشاريع |
| `/api/posts` · `/[slug]` | GET POST PATCH DELETE | المدونة |
| `/api/jobs` · `/[slug]` | GET POST PATCH DELETE | الوظائف |
| `/api/applications` · `/[id]` | GET POST PATCH DELETE | طلبات التوظيف + CV |
| `/api/reviews` · `/[id]` | GET POST PATCH DELETE | آراء العملاء |
| `/api/team` `/faqs` `/offices` | GET POST PATCH DELETE | من نحن · تواصل |
| `/api/pages/[page]` | GET PUT | محتوى أي صفحة (JSON بلغتين) |
| `/api/seo/[page]` | GET PUT | إعدادات SEO |
| `/api/translations` | GET PUT | نصوص الواجهة |
| `/api/leads` · `/[id]` | GET POST PATCH | فورمات التواصل |
| `/api/subscribe` | POST | النيوزليتر |
| `/api/favourites` | GET POST DELETE | المفضلة |
| `/api/users` | GET PATCH | الصلاحيات |
| `/api/upload` | POST | رفع الصور |
| `/api/auth/callback` `/signout` | GET POST | الدخول والخروج |

## ٥. صفحات الوظائف

- `/careers` — كل الوظايف المفتوحة، كل واحدة كارت بيودّي لصفحتها
- `/careers/[slug]` — الوصف الكامل: القسم، المكان، نوع التعاقد، الخبرة، الراتب،
  المسؤوليات، المتطلبات، المزايا، وخطوات التوظيف
- فورم التقديم في نفس الصفحة: الاسم، الإيميل، الموبايل، المدينة، الوظيفة الحالية،
  سنين الخبرة، مدة الإشعار، الراتب المتوقع، لينكد إن، **رفع السيرة الذاتية**
  (PDF/Word حتى ٥ ميجا) و**ملاحظات إضافية**
- السيرة الذاتية بتروح باكت `cvs` الخاص — فريق التوظيف بس اللي بيقدر يفتحها
  من الداشبورد بلينك موقّع صالح ٥ دقائق
- الداشبورد → **Applications**: فلترة بالمرحلة (new → screening → interview → offer)
  وتحميل الـ CV

## ٦. إزاي تعدّل حاجة

| عايز تعدّل | روح فين |
|---|---|
| **لون** | `src/styles/globals.css` — `:root` للّايت و `.dark` للدارك |
| **خط** | `src/app/layout.tsx` — الـ `next/font` في أول الملف |
| **صورة** | `src/lib/media.ts` — أو ارفع من الداشبورد وهي بتغلب الافتراضي |
| **نص واجهة** | `src/lib/i18n/en.json` و `ar.json` — أو الداشبورد ← Translations |
| **نص/صورة صفحة** | الداشبورد ← Page content |
| **قسم في الرئيسية** | `src/app/[locale]/page.tsx` — كل قسم له تعليق `── NAME ──` |
| **وظيفة جديدة** | الداشبورد ← Jobs (كل الحقول بلغتين) |
| **حقل جديد في العقار** | عمود في `schema.sql` + سطر في `dashboard/properties/page.tsx` |
| **الأنميشن** | `tailwind.config.ts` + `components/ui/Reveal.tsx` و `Counter.tsx` |
| **اللغة الافتراضية** | `NEXT_PUBLIC_DEFAULT_LOCALE` في `.env.local` |

## ٧. الأنميشن

- **ظهور بالتدريج عند السكرول** — `<Reveal delay={120}>`
- **عدّادات متحركة** — `<Counter to={86} suffix="+" />` (تبدأ أول ما تظهر في الشاشة)
- **Ken Burns** على كل الهيروهات
- **كاروسيل أفقي** بأسهم — `<Carousel>` للعقارات المميزة وآراء العملاء
- **360° tour** على العقارات اللي عندها `tour_360_url`
- **hover سينمائي** على الكروت بمنحنى `cubic-bezier(.2,.8,.2,1)`
- **شريط تقدّم السكرول** فوق
- كله بيتوقف مع `prefers-reduced-motion`

## ٨. Responsive

كل الصفحات مبنية mobile-first:
- جريدات `auto-fit / minmax` بتلف لوحدها — مفيش عرض ثابت
- الهيدر: نافبار كامل من `xl` وفوق، وتحت كده Sheet بزر قائمة
- البنتو: عمود على الموبايل، ٢×٣ على التابلت، هيرو + ٤ على الديسكتوب
- الخريطة: القائمة فوق والخريطة تحت على الموبايل، جانب لجانب على الديسكتوب
- أزرار وروابط بـ `min-height: 44px` على شاشات اللمس
- الجوتر (padding) ٢٠px على الموبايل و٢٤px من `sm`

## ٩. الرفع على السيرفر

**Vercel**
```bash
vercel        # وحُط متغيّرات البيئة من الداشبورد
```

**Docker / VPS**
```bash
docker compose up -d --build     # بورت 3000، حُط nginx قدامه
```

**Node عادي**
```bash
npm ci && npm run build && npm start
```

> `SUPABASE_SERVICE_ROLE_KEY` سيرفر فقط — متحطّهوش في متغيّر بيبدأ بـ `NEXT_PUBLIC_`.

## ١٠. الصور

الصور الافتراضية من Unsplash عن طريق `src/lib/media.ts`.
أول ما ترفع صور من الداشبورد (عمود `images[]`) بتغلب الافتراضي أوتوماتيك — مفيش كود يتغيّر.
المقاسات المقترحة: عقار 1600×1000 · كوفر مقال 1600×900 · فريق 800×1000 · 360° بانوراما 4000×2000.
