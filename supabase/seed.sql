-- =====================================================================
-- PRIME DEALS — demo content. Safe to re-run.
-- After signing up your own admin user, run:
--   update public.profiles set role = 'admin' where id = '<your-auth-uid>';
-- =====================================================================

insert into public.projects (slug, name_en, name_ar, location_en, location_ar, unit_types_en, unit_types_ar, delivery_year, price_from, body_en, body_ar)
values
 ('midtown-sky','Midtown Sky','ميدتاون سكاي','New Cairo','القاهرة الجديدة','Apartments & townhouses','شقق وتاون هاوس',2027,3200000,'A master-planned community with green spines, a retail strip and schools, on payment plans up to eight years.','مجتمع متكامل بمساحات خضراء ومنطقة تجارية ومدارس، مع أنظمة سداد حتى ثماني سنوات.'),
 ('palm-hills-west','Palm Hills West','بالم هيلز ويست','Sheikh Zayed','الشيخ زايد','Villas & twin houses','فيلات وتوين هاوس',2026,4100000,'Low-density villa phases around a central lagoon, delivered fully finished.','مراحل فيلات منخفضة الكثافة حول لاجون مركزي، تُسلّم كاملة التشطيب.'),
 ('sidi-haven','Sidi Haven','سيدي هافن','Ras El Hekma','رأس الحكمة','Chalets & cabins','شاليهات وكابينات',2028,5000000,'Beachfront phases with a private marina and a hotel-operated clubhouse.','مراحل على البحر مباشرة بمارينا خاصة وكلوب هاوس بإدارة فندقية.'),
 ('the-square','The Square','ذا سكوير','Mostakbal City','مدينة المستقبل','Serviced apartments','شقق فندقية',2027,2600000,'Compact serviced units aimed at rental yield, managed by the developer.','وحدات مخدومة صغيرة موجهة للعائد الإيجاري، بإدارة المطور.')
on conflict (slug) do nothing;

insert into public.properties
 (slug,title_en,title_ar,description_en,description_ar,location_en,location_ar,type,listing,price,per_month,bedrooms,bathrooms,area_sqft,lat,lng,amenities_en,amenities_ar,featured)
values
 ('bay-view-house','Bay View House, New Cairo','بيت باي فيو، القاهرة الجديدة','Contemporary 3-bedroom house with stunning New Cairo Bay views.','منزل عصري بثلاث غرف بإطلالة رائعة على بحيرة القاهرة الجديدة.','New Cairo','القاهرة الجديدة','villa','rent',9000,true,3,2,4000,30.0280,31.4980,'{Private pool,Covered parking,24/7 security,Central A/C}','{حمام سباحة خاص,جراج مغطى,أمن ٢٤ ساعة,تكييف مركزي}',true),
 ('palm-court-townhouse','Palm Court Townhouse','تاون هاوس بالم كورت','Corner townhouse with a landscaped garden and roof terrace.','تاون هاوس كورنر بحديقة منسّقة وتراس على السطح.','Sheikh Zayed','الشيخ زايد','townhouse','sale',7250000,false,4,3,3200,30.0190,30.9760,'{Landscaped garden,Covered parking,Health club}','{حديقة منسّقة,جراج مغطى,نادي صحي}',true),
 ('marina-ridge-chalet','Marina Ridge Chalet','شاليه مارينا ريدج','Second-row chalet, fully finished, steps from the marina.','شاليه صف ثاني كامل التشطيب على خطوات من المارينا.','North Coast','الساحل الشمالي','chalet','resale',5400000,false,3,2,1850,31.0500,28.5600,'{Private pool,Beach access,24/7 security}','{حمام سباحة خاص,منفذ للشاطئ,أمن ٢٤ ساعة}',true),
 ('skyline-residence-14b','Skyline Residence 14B','سكاي لاين ريزيدنس 14ب','High-floor apartment with double-height reception.','شقة بدور مرتفع وريسبشن مزدوج الارتفاع.','Fifth Settlement','التجمع الخامس','apartment','sale',4100000,false,2,2,1450,30.0100,31.4300,'{Private lift,Fitted kitchen,Central A/C}','{مصعد خاص,مطبخ مجهز,تكييف مركزي}',false),
 ('garden-walk-apartment','Garden Walk Apartment','شقة جاردن ووك','Ground-floor unit with a private garden, delivered 2027.','وحدة أرضي بحديقة خاصة، تسليم ٢٠٢٧.','Mostakbal City','مدينة المستقبل','apartment','primary',3250000,false,3,2,1620,30.0600,31.6400,'{Landscaped garden,Covered parking}','{حديقة منسّقة,جراج مغطى}',false),
 ('the-ridge-villa','The Ridge Villa','فيلا ذا ريدج','Standalone villa on 900 m² with a basement and pool.','فيلا مستقلة على ٩٠٠ م² ببدروم وحمام سباحة.','New Cairo','القاهرة الجديدة','villa','sale',18500000,false,5,5,6100,30.0330,31.4750,'{Private pool,Private lift,Health club,24/7 security}','{حمام سباحة خاص,مصعد خاص,نادي صحي,أمن ٢٤ ساعة}',false),
 ('zamalek-nile-loft','Zamalek Nile Loft','لوفت النيل بالزمالك','Furnished loft with direct Nile views, minimum one year.','لوفت مفروش بإطلالة نيلية مباشرة، الحد الأدنى سنة.','Zamalek','الزمالك','apartment','rent',22000,true,2,1,1100,30.0600,31.2200,'{Fitted kitchen,Central A/C}','{مطبخ مجهز,تكييف مركزي}',false),
 ('dune-house','Dune House, Ras El Hekma','بيت الكثبان، رأس الحكمة','First-row cabin on the new Ras El Hekma masterplan.','كابينة صف أول في ماستر بلان رأس الحكمة الجديد.','Ras El Hekma','رأس الحكمة','chalet','primary',8900000,false,4,3,2400,31.1300,27.7800,'{Beach access,Private pool}','{منفذ للشاطئ,حمام سباحة خاص}',false),
 ('courtyard-townhouse','Courtyard Townhouse','تاون هاوس كورتيارد','Middle townhouse, fully finished with kitchen and A/C.','تاون هاوس ميدل كامل التشطيب بالمطبخ والتكييف.','Sheikh Zayed','الشيخ زايد','townhouse','resale',6300000,false,4,4,2950,30.0220,30.9800,'{Landscaped garden,Health club}','{حديقة منسّقة,نادي صحي}',false)
on conflict (slug) do nothing;

insert into public.team_members (name_en,name_ar,role_en,role_ar,phone,email,sort_order) values
 ('Arthur Ontho','آرثر أونثو','SALES MANAGER','مدير المبيعات','(+20) 111 955 5867','arthur@primedeals.com',1),
 ('Mona Farouk','منى فاروق','PRIMARY — NEW CAIRO','أولي — القاهرة الجديدة','(+20) 111 955 5868','mona@primedeals.com',2),
 ('Karim Sabry','كريم صبري','RESALE','إعادة البيع','(+20) 111 955 5869','karim@primedeals.com',3),
 ('Laila Hassan','ليلى حسن','NORTH COAST','الساحل الشمالي','(+20) 111 955 5870','laila@primedeals.com',4)
on conflict do nothing;

insert into public.faqs (question_en,question_ar,answer_en,answer_ar,sort_order) values
 ('How do I start the home-buying process with Prime Deals?','كيف أبدأ عملية الشراء مع برايم ديلز؟','It starts with a 20-minute call to set budget, district and payment method. We then send only 3 to 5 matching units.','نبدأ بمكالمة ٢٠ دقيقة نحدد فيها الميزانية والمنطقة وطريقة السداد، ثم نرسل ٣ إلى ٥ وحدات مطابقة فقط.',1),
 ('Do you take commission from the buyer?','هل تأخذون عمولة من المشتري؟','On primary sales the developer pays. On resale we agree the percentage in writing before any viewing.','في المبيعات الأولية العمولة من المطور. في إعادة البيع نتفق على النسبة كتابةً قبل أي معاينة.',2),
 ('Can you help with a mortgage?','تساعدون في التمويل العقاري؟','Yes. We prepare your file and submit it to three banks in parallel so you can compare.','نعم. نجهّز ملفك ونقدّمه لثلاثة بنوك في نفس الوقت للمقارنة.',3),
 ('Are the listed units actually available?','هل الوحدات المعروضة متاحة فعلاً؟','Availability is re-checked every 48 hours, and every unit''s documents are verified before publishing.','نراجع التوافر كل ٤٨ ساعة، وكل وحدة تُراجع أوراقها قبل النشر.',4)
on conflict do nothing;

insert into public.jobs (title_en,title_ar,meta_en,meta_ar,body_en,body_ar) values
 ('Property advisor — New Cairo','مستشار عقاري — القاهرة الجديدة','Full time · New Cairo','دوام كامل · القاهرة الجديدة','Tiered commission and a warm client base.','عمولة تصاعدية وقاعدة عملاء جاهزة.'),
 ('Digital marketing specialist','أخصائي تسويق رقمي','Full time · Fifth Settlement','دوام كامل · التجمع الخامس','Own paid campaigns and lead content.','إدارة الحملات المدفوعة ومحتوى الليدز.'),
 ('Coast sales manager','مدير مبيعات الساحل','Full time · North Coast','دوام كامل · الساحل الشمالي','Lead a seasonal team of six advisors.','قيادة فريق موسمي من ستة مستشارين.'),
 ('Client service coordinator','منسق خدمة عملاء','Full time · Sheikh Zayed','دوام كامل · الشيخ زايد','Follow files from signature to handover.','متابعة الملفات من التوقيع للتسليم.')
on conflict do nothing;

insert into public.offices (name_en,name_ar,address_en,address_ar,phone,lat,lng) values
 ('Head office','المكتب الرئيسي','90 North St, Fifth Settlement, Cairo','٩٠ شارع الشمال، التجمع الخامس، القاهرة','(+20) 111 955 5867',30.0090,31.4270),
 ('Coast office','مكتب الساحل','Sidi Abdelrahman, North Coast','سيدي عبد الرحمن، الساحل الشمالي','(+20) 111 955 5871',30.9600,28.7300)
on conflict do nothing;

insert into public.posts (slug,title_en,title_ar,excerpt_en,excerpt_ar,body_en,body_ar) values
 ('navigating-luxury-market','Navigating the luxury real estate market','التعامل مع سوق العقارات الفاخرة','What to ask before signing, and who actually pays which fee.','ما يجب أن تسأل عنه قبل التوقيع، ومن يدفع الرسوم فعلاً.','Start by fixing the real ceiling after fees and maintenance, then compare only three units in the same district.','ابدأ بتحديد الميزانية القصوى الحقيقية بعد الرسوم والصيانة، ثم قارن ثلاث وحدات فقط في نفس المنطقة.'),
 ('payment-plans-compared','Payment plans: compare before you sign','أنظمة السداد: قارن قبل التوقيع','Longer plans are not always cheaper. Here is the arithmetic.','الأنظمة الأطول ليست دائماً أرخص. هذه هي الحسبة.','Discount the instalments to present value before you decide which plan is cheaper.','اخصم الأقساط للقيمة الحالية قبل ما تقرر أي نظام أرخص.'),
 ('new-cairo-vs-sheikh-zayed','New Cairo vs Sheikh Zayed in 2026','القاهرة الجديدة مقابل الشيخ زايد','Price per metre, delivery risk and resale depth compared.','مقارنة سعر المتر ومخاطر التسليم وعمق إعادة البيع.','Two very different resale markets behind similar headline prices.','سوقان مختلفان تماماً لإعادة البيع وراء أسعار معلنة متشابهة.'),
 ('handover-contract-checklist','What to check in a handover contract','ما تراجعه في عقد التسليم','Eleven clauses that decide what happens if delivery slips.','أحد عشر بنداً تحدد ما يحدث إذا تأخر التسليم.','Focus on the delay penalty, the area tolerance and the maintenance deposit.','ركّز على غرامة التأخير وسماحية المساحة ووديعة الصيانة.'),
 ('north-coast-rental-play','The North Coast as a rental play','الساحل الشمالي كاستثمار إيجاري','Season length, management fees and realistic occupancy.','طول الموسم ورسوم الإدارة ونسبة الإشغال الواقعية.','A 90-day season changes the maths completely versus a year-round rental.','موسم ٩٠ يوماً يغيّر الحسبة تماماً مقارنة بإيجار طول السنة.'),
 ('how-banks-appraise','How banks appraise your unit','كيف يُقيّم البنك وحدتك','Why the bank''s number differs from the contract price.','لماذا يختلف رقم البنك عن سعر التعاقد.','Appraisers price the finished, comparable, registered unit — not your payment plan.','المُقيّم يسعّر الوحدة المنتهية المسجلة المقارنة — لا نظام سدادك.')
on conflict (slug) do nothing;

insert into public.seo_meta (page,title_en,title_ar,description_en,description_ar) values
 ('home','Prime Deals Brokerage — Property in New Cairo & the North Coast','برايم ديلز — عقارات القاهرة الجديدة والساحل الشمالي','Licensed brokerage for primary sales, resale and rentals across Greater Cairo and the North Coast.','وساطة عقارية مرخّصة للمبيعات الأولية وإعادة البيع والإيجار في القاهرة الكبرى والساحل الشمالي.'),
 ('properties','All properties — Prime Deals','كل العقارات — برايم ديلز','Filter verified listings by location, type, budget and bedrooms.','فلتر عقارات موثّقة بالموقع والنوع والميزانية وعدد الغرف.'),
 ('projects','Projects & compounds — Prime Deals','المشاريع والكومباوندات — برايم ديلز','Master-planned communities we sell directly from the developer.','مجتمعات متكاملة نبيعها مباشرة من المطور.'),
 ('about','About Prime Deals','من نحن — برايم ديلز','Eight years of brokerage built on documentation and negotiation.','ثماني سنوات من الوساطة المبنية على التوثيق والتفاوض.'),
 ('contact','Contact Prime Deals','تواصل مع برايم ديلز','Two offices, open Saturday to Thursday. We reply within one business day.','مكتبان مفتوحان من السبت للخميس. نرد خلال يوم عمل واحد.'),
 ('blog','News & guides — Prime Deals','أخبار وأدلة — برايم ديلز','Prices, payment plans and delivery timelines explained.','شرح الأسعار وأنظمة السداد ومواعيد التسليم.')
on conflict (page) do nothing;

-- Editable page blocks: the dashboard "Page content" tab writes here.
insert into public.page_sections (page,key,content_en,content_ar,sort_order) values
 ('home','hero','{"kicker":"PRIME DEALS BROKERAGE","title":"A team dedicated to your projects","sub":"We match families and investors with the right address in New Cairo, Sheikh Zayed and the North Coast.","image":""}','{"kicker":"برايم ديلز للوساطة العقارية","title":"فريق مخصص لمشروعك","sub":"نوصّل العائلات والمستثمرين للعنوان الصح في القاهرة الجديدة والشيخ زايد والساحل الشمالي.","image":""}',1),
 ('home','stats','{"items":[{"value":"86 +","label":"Projects completed"},{"value":"86 %","label":"Satisfied customers"},{"value":"8","label":"Years'' experience"},{"value":"8 M","label":"Turnover in 2025"}]}','{"items":[{"value":"٨٦+","label":"مشروع منجز"},{"value":"٨٦٪","label":"عملاء راضون"},{"value":"٨","label":"سنوات خبرة"},{"value":"٨ م","label":"مبيعات ٢٠٢٥"}]}',2),
 ('home','values','{"items":[{"title":"Integrity","body":"We show the unit as it is, flaws included, before the viewing."},{"title":"Client-centric","body":"One advisor follows your file from first call to handover."},{"title":"Transparency","body":"Every fee and commission written down before anything is signed."},{"title":"Expertise","body":"Eight years of handover contracts and hard negotiations."}]}','{"items":[{"title":"النزاهة","body":"نعرض الوحدة زي ما هي، بكل عيوبها، قبل المعاينة."},{"title":"العميل أولاً","body":"مستشار واحد يتابع ملفك من أول مكالمة للتسليم."},{"title":"الشفافية","body":"كل رسم وعمولة مكتوب قبل أي توقيع."},{"title":"الخبرة","body":"ثماني سنوات من عقود التسليم والتفاوض."}]}',3),
 ('about','journey','{"title":"Our journey: building dreams in real estate","body":"Prime Deals started in 2018 with two advisors and one office in New Cairo. Today the team handles primary sales for eight developers and a resale portfolio across Greater Cairo and the North Coast."}','{"title":"رحلتنا: نبني أحلاماً في العقارات","body":"بدأت برايم ديلز في 2018 بمستشارين ومكتب واحد في القاهرة الجديدة. اليوم الفريق يدير المبيعات الأولية لثمانية مطورين ومحفظة إعادة بيع في القاهرة الكبرى والساحل."}',1),
 ('contact','intro','{"title":"Contact us","sub":"Send a message and we reply within one business day."}','{"title":"تواصل معنا","sub":"ابعت رسالتك ونرد خلال يوم عمل واحد."}',1)
on conflict (page,key) do nothing;

-- ---------------------------- reviews --------------------------------
insert into public.reviews (name_en,name_ar,role_en,role_ar,quote_en,quote_ar,rating,sort_order) values
 ('Noha Abdelrahman','نهى عبد الرحمن','Buyer — New Cairo','مشترية — القاهرة الجديدة','They showed me three units, not thirty, and every one matched the brief. They listed the flaws before the viewing — that is what earned the trust.','ورّوني تلات وحدات بس، وكل واحدة فيهم كانت مطابقة للي طلبته. قالولي على عيوب الوحدة قبل المعاينة، وده اللي خلاني أثق فيهم',5,1),
 ('Ahmed Shukry','أحمد شكري','Investor — North Coast','مستثمر — الساحل الشمالي','They read every page of the resale contract and found a debt I did not know about. That saved me a real problem before signing.','راجعوا كل ورقة في عقد إعادة البيع ولقوا مديونية مكنتش أعرفها. وفروا عليّ مشكلة كبيرة قبل التوقيع',5,2),
 ('Mai El Gindy','مي الجندي','Buyer — Sheikh Zayed','مشترية — الشيخ زايد','They filed with three banks in parallel and compared the offers in actual numbers. First time anyone walked me through the arithmetic honestly.','قدّموا ملفي لتلات بنوك في نفس الوقت وقارنوا لي العروض بالأرقام. أول مرة حد يشرح لي الحسبة بصراحة',5,3),
 ('Tarek Mansour','طارق منصور','Buyer — Mostakbal City','مشتري — مدينة المستقبل','I was chasing a launch price that did not exist. My advisor talked me out of it and found a resale unit 12% cheaper.','كنت بجري ورا سعر إطلاق مش موجود. المستشار قنعني أسيبه ولاقى لي وحدة إعادة بيع أرخص ١٢٪',5,4)
on conflict do nothing;

-- ------------------- jobs: full postings -----------------------------
update public.jobs set
  slug = 'property-advisor-new-cairo',
  department_en = 'Sales', department_ar = 'المبيعات',
  location_en = 'New Cairo, Egypt', location_ar = 'القاهرة الجديدة، مصر',
  employment_type = 'full_time',
  experience_en = '2–5 years in Egyptian real estate', experience_ar = 'من سنتين لخمس سنين في العقارات المصرية',
  salary_en = 'Base + tiered commission', salary_ar = 'أساسي + عمولة تصاعدية',
  responsibilities_en = array['Own a district portfolio from first call to handover','Qualify inbound leads within one business day','Run viewings and prepare comparison sheets for the client','Verify unit documents with the developer before any offer','Keep the CRM current so the file survives your holiday'],
  responsibilities_ar = array['إدارة محفظة منطقة كاملة من أول مكالمة للتسليم','تصفية الليدز الواردة خلال يوم عمل واحد','عمل المعاينات وتجهيز جداول المقارنة للعميل','مراجعة أوراق الوحدة مع المطور قبل أي عرض','تحديث الـ CRM باستمرار علشان الملف يكمل في غيابك'],
  requirements_en = array['Fluent Arabic and working English','Own car and valid licence','Comfortable saying no to a bad-fit unit','Real knowledge of New Cairo compounds and payment plans'],
  requirements_ar = array['عربي ممتاز وإنجليزي شغل','عربية خاصة ورخصة سارية','تقدر تقول لأ للوحدة الغلط','معرفة حقيقية بكومباوندات القاهرة الجديدة وأنظمة السداد'],
  benefits_en = array['Warm lead base — no cold calling quota','Medical insurance after three months','Developer training and site trips','Uncapped commission'],
  benefits_ar = array['قاعدة عملاء جاهزة — مفيش تارجت كولد كول','تأمين طبي بعد تلات شهور','تدريب من المطورين وزيارات مواقع','عمولة بدون سقف']
where title_en = 'Property advisor — New Cairo';

update public.jobs set
  slug = 'digital-marketing-specialist',
  department_en = 'Marketing', department_ar = 'التسويق',
  location_en = 'Fifth Settlement, Cairo', location_ar = 'التجمع الخامس، القاهرة',
  experience_en = '3+ years in performance marketing', experience_ar = 'أكثر من ٣ سنين في التسويق بالأداء',
  salary_en = 'Competitive, reviewed twice a year', salary_ar = 'تنافسي، مراجعة مرتين في السنة',
  responsibilities_en = array['Own Meta and Google campaigns end to end','Build landing pages with the design team','Report cost per qualified lead weekly','Run creative tests against a real hypothesis'],
  responsibilities_ar = array['إدارة حملات ميتا وجوجل من الألف للياء','بناء لاندنج بيدجز مع فريق الديزاين','تقرير أسبوعي لتكلفة الليد المؤهل','تشغيل تستات كرييتف على فرضية حقيقية'],
  requirements_en = array['Hands-on Meta Ads and Google Ads','Comfortable in GA4 and a spreadsheet','Arabic copy sense for the local market'],
  requirements_ar = array['خبرة عملية في Meta Ads و Google Ads','إجادة GA4 والشيتات','حس كوبي عربي للسوق المحلي'],
  benefits_en = array['Real budget ownership','Hybrid, two days remote','Annual training budget'],
  benefits_ar = array['مسؤولية ميزانية حقيقية','هايبرد، يومين من البيت','ميزانية تدريب سنوية']
where title_en = 'Digital marketing specialist';

update public.jobs set
  slug = 'coast-sales-manager',
  department_en = 'Sales', department_ar = 'المبيعات',
  location_en = 'North Coast (seasonal base)', location_ar = 'الساحل الشمالي (مقر موسمي)',
  experience_en = '5+ years, 2 leading a team', experience_ar = 'أكثر من ٥ سنين، منهم سنتين قيادة فريق',
  salary_en = 'Base + team override', salary_ar = 'أساسي + نسبة على الفريق',
  responsibilities_en = array['Lead a seasonal team of six advisors','Set the weekly viewing and follow-up rhythm','Own developer relationships on the coast','Close escalated files personally'],
  responsibilities_ar = array['قيادة فريق موسمي من ستة مستشارين','ضبط إيقاع المعاينات والمتابعة الأسبوعي','إدارة علاقات المطورين في الساحل','إقفال الملفات الصعبة شخصياً'],
  requirements_en = array['Proven coast resale and primary experience','Willing to be based on the coast in season','Calm under a compressed 90-day season'],
  requirements_ar = array['خبرة مثبتة في الساحل أولي وإعادة بيع','استعداد للإقامة في الساحل خلال الموسم','هدوء تحت ضغط موسم ٩٠ يوم'],
  benefits_en = array['Accommodation during the season','Team override on every closed file','Winter based in Cairo'],
  benefits_ar = array['إقامة خلال الموسم','نسبة على كل ملف يقفله الفريق','الشتاء من مقر القاهرة']
where title_en = 'Coast sales manager';

update public.jobs set
  slug = 'client-service-coordinator',
  department_en = 'Client service', department_ar = 'خدمة العملاء',
  location_en = 'Sheikh Zayed, Giza', location_ar = 'الشيخ زايد، الجيزة',
  experience_en = '1–3 years in coordination or admin', experience_ar = 'من سنة لتلاتة في التنسيق أو الإدارة',
  salary_en = 'Fixed salary + annual bonus', salary_ar = 'راتب ثابت + بونص سنوي',
  responsibilities_en = array['Follow every file from signature to handover','Chase developer paperwork so the client does not have to','Book viewings and confirm them the day before','Escalate anything at risk of slipping'],
  responsibilities_ar = array['متابعة كل ملف من التوقيع للتسليم','تحصيل أوراق المطور بدل العميل','حجز المعاينات وتأكيدها باليوم اللي قبلها','تصعيد أي حاجة معرّضة للتأخير'],
  requirements_en = array['Organised to the point of being annoying about it','Clear written Arabic and English','Patience with developer call centres'],
  requirements_ar = array['منظّم لدرجة مزعجة','كتابة واضحة بالعربي والإنجليزي','صبر على كول سنترات المطورين'],
  benefits_en = array['Predictable hours','Medical insurance','Clear path into an advisor role'],
  benefits_ar = array['ساعات عمل ثابتة','تأمين طبي','مسار واضح لوظيفة مستشار']
where title_en = 'Client service coordinator';

-- 360 tours on two demo listings
update public.properties
set tour_360_url = 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2400&q=72'
where slug in ('bay-view-house','the-ridge-villa','marina-ridge-chalet');
