دليل النشر إلى Cloudflare (Pages / Wrangler)

هذا الملف يشرح طريقتين لنشر الموقع على Cloudflare: Cloudflare Pages عبر الربط بالمستودع، أو استخدام أداة `wrangler` للنشر اليدوي.

ملاحظة أولية
- المشروع يستخدم Next.js (App Router). إذا كنت تعتمد على SSR/Edge، فاستخدم Cloudflare Pages مع دعم Next.js أو استخدم تحويل (adapter) مخصص. للتوزيع الثابت البسيط يمكن استخدام `next export` فقط إذا لم تكن تعتمد على أي وظائف سيرڤر.

1) النشر عبر Cloudflare Pages (موصى به إذا تريد CI من Git)
- على Cloudflare Dashboard > Pages > Create a project
- اربط المستودع (GitHub/GitLab/Bitbucket)
- اختر الفرع (مثلاً `main`)
- Build command: `npm run build`
- Framework preset: `Next.js`
- Output directory: اترك فارغاً (Cloudflare Pages سيتعرف تلقائياً على إعداد Next.js)
- إعداد المتغيرات البيئية: (إن وُجدت)
- انشر وسيقوم Cloudflare ببناء الموقع تلقائياً عند كل دفع `git push`.

2) النشر اليدوي باستخدام Wrangler (Pages / Pages Functions)
- تثبيت Wrangler:

```bash
npm install -g wrangler
# أو
npm install --save-dev wrangler
```

- تسجيل الدخول:

```bash
npx wrangler login
```

- تهيئة ملف `wrangler.toml` (قالب مرفق في هذا المشروع): عدّل `account_id` و`project` وفق حسابك.

- Build ثم نشر:

```bash
npm run build
npx wrangler pages deploy ./ --branch=main --project-name=premium-restaurant
```

ملاحظات مهمة
- إذا كنت تستخدم خدمة Worker/Edge (SSR) أو App Router مع وظائف سيرڤر، فتأكد من أن Cloudflare Pages يتم تهيئته لدعم Next.js server-side features أو استخدم adapter مناسب.
- تحقّق من أن `public/sw.js` لا يتداخل مع استضافة Cloudflare. قد تحتاج لتعديل قواعد التسجيل إذا كنت تستخدم Service Worker.

أمثلة ملفات
- قمت بإضافة ملف `wrangler.toml.template` في الجذر — انسخه إلى `wrangler.toml` وادمج `account_id` و`project` و`compatibility_date`.

المساعدة التالية
- هل تريد أن أقوم بإنشاء ملف `wrangler.toml` مُعد بالفعل بقيم افتراضية؟ أو تفضل أن أدرج هنا خطوات ربط المشروع بمشروع Cloudflare Pages عبر واجهة الويب؟
