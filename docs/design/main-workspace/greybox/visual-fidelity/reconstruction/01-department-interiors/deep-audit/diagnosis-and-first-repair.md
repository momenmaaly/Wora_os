# Department Interiors — تشخيص الفشل والإصلاحات الموجّهة بالدليل

**الحالة: ما زالت NOT ACCEPTED.** التقرير يجمع التشخيص، إصلاح السجادة السابق، جولة Marketing الحالية، وتجربة المكتب التي رُفضت بعد القياس. لا يجيز بدء مرحلة أخرى.

## الخلاصة التنفيذية

- لم أغيّر الكاميرا أو الإسقاط أو بصمات الغرف. مراجعة إسقاط الزوايا ليست قياسًا مستقلًا من الصورة، ولا تبرر تعديلها.
- السجادة المستطيلة في DEPT-01 بقيت كما هي. في هذه الجولة اختير أكبر انزياح مركزي مستقل بعد عزل التباس صندوق مكتب DEPT-01: شاشة `INT-02-DISP-BAR` في Marketing، انحراف مركزها `20.13px` عن الصندوق المقاس.
- أُعيد ضبط موضع الشاشة وأبعادها من صندوق المرجع `70×70px` مع تثبيت `centre_y` والكاميرا. خطأ مركز الإسقاط انخفض إلى `0.17px`، وفروق الأبعاد إلى `+0.19×−0.23px`.
- بعد إصلاح Marketing: MAE القسم `54.788 → 54.342` وSSIM `0.13754 → 0.13909`. على كامل الصورة منذ خط الأساس السابق للسجادة: MAE `54.659 → 54.384` (تحسن تراكمي نحو `0.50%`) وSSIM `0.14456 → 0.14560`. هذا تحسن هندسي/بصري قابل للرصد لكنه **محدود ولا يحقق القبول**.
- محاولة إزالة لوح خشبي مصنف خطأً ضمن صندوق المكتب قللت خطأ هندسة الصندوق، لكنها زادت MAE؛ رُفضت وأُعيد اللوح كما كان. لا تُحسب نجاحًا، وتفاصيلها موثقة أدناه.

## شروط المقارنة وحدود الدليل

المقارنة قبل/بعد تستخدم المرجع نفسه، `1672×941` بكسل، DPR 1، القصوص الكاملة ذاتها، ومنهج MAE RGB وSSIM الرمادي 8×8/stride 4 نفسه. لم يتغير إعداد الكاميرا. بصمة المرجع SHA-256: `6f91ff3d27f1d69d7189b6d1a599088086bb50048d1c0b492e3ebcdb718036a1`. بصمة الرندر النهائي: `927770ed4fbb209caf6bfd507c21cc6f9db53b1e6fe3293da4c9cc1fa322c402`.

MAE/SSIM للـROI يثبتان مقدار اختلاف الصورة، لا سببه. ترتيب L1 الموضعي أدناه يحدد مناطق مرجحة للمساهمة، لكنه ليس segmentation: الصناديق قد تشمل الخلفية وتتداخل، لذا لا تُجمع كأنها حصص مستقلة من الخطأ. الصناديق المشتقة من هندسة الرندر لعناصر بلا `px_box` في المصدر **تشخيصية فقط** وليست هدفًا مرجعيًا مستقلًا. كما أن مقارنة إضاءة/خامة منفصلة تحتاج قياسًا أو عزلًا لا توفره صورة واحدة؛ لذلك وُسمت الأسباب غير القابلة للعزل صراحةً بدل ادعائها كحقائق.

| القسم | MAE قبل | SSIM قبل | MAE بعد | SSIM بعد | التغير |
|---|---:|---:|---:|---:|---|
| DEPT-01 Executive Office | 53.3943 | 0.14712 | 51.6023 | 0.15409 | تحسن محلي |
| DEPT-02 Marketing | 54.7883 | 0.13754 | 54.3422 | 0.13909 | تحسن موضعي بعد ضبط موضع/أبعاد الشاشة |
| DEPT-03 Engineering | 60.3314 | 0.11665 | 60.3314 | 0.11665 | لا تغيير؛ الأسوأ بصريًا |
| DEPT-04 Creative Studio | 55.1973 | 0.12770 | 55.1973 | 0.12770 | لا تغيير |
| DEPT-05 Management | 53.0627 | 0.15893 | 53.0627 | 0.15893 | لا تغيير |
| DEPT-06 Research | 50.0929 | 0.16986 | 50.0929 | 0.16986 | لا تغيير؛ الأفضل نسبيًا وما زال ضعيفًا |
| DEPT-07 QA & Testing | 55.4306 | 0.15648 | 55.4306 | 0.15648 | لا تغيير |
| **الوزني لجميع ROIs** | **54.6585** | **0.14456** | **54.3844** | **0.14560** | MAE −0.2742، SSIM +0.00104 |

الخفض التراكمي في MAE نحو **0.50% فقط**؛ تحسن موجب لكنه لا يبرر القبول. لم تتغير الأقسام الخمسة الأخرى في جولة Marketing. صور DEPT-02 النهائية تخص جولة الإصلاح الحالية؛ بقية صور الأقسام هي بعد إصلاح السجادة السابق.

## مقارنة الصور

**إطار المشهد الكامل:** [Reference](../../../../../reference/wora-main-workspace.png) · [Before render](after-first-evidence-repair/current-full-1672x941.png) · [After render](after-marketing-bar-display-rebuild/current-full-1672x941.png) · [Before 50% Overlay](after-marketing-bar-display-rebuild/full-comparison/before-overlay-50.png) · [After 50% Overlay](after-marketing-bar-display-rebuild/full-comparison/after-overlay-50.png) · [Before Difference](after-marketing-bar-display-rebuild/full-comparison/before-difference.png) · [After Difference](after-marketing-bar-display-rebuild/full-comparison/after-difference.png).

الروابط: **Reference Crop** هو الدليل البصري من المرجع، **Current Render** هو الالتقاط بعد الإصلاح، **50% Overlay** يبيّن الانزياحات/اختلاف الحدود، و**Difference** يوضح مواضع الاختلاف. `after-whiteboard-content/` هو خط الأساس السابق للسجادة؛ `after-first-evidence-repair/` هو Before لجولة الشاشة؛ و`after-marketing-bar-display-rebuild/` هو After الحالي. الأقسام غير المتأثرة في جولة Marketing تطابق الالتقاط السابق.

| القسم | Before Render | After Render | Before Overlay | After Overlay | Before Difference | After Difference |
|---|---|---|---|---|---|---|
| DEPT-01 | [قبل](after-first-evidence-repair/sections/dept-01/current-render.png) | [بعد](after-first-evidence-repair/sections/dept-01/current-render.png) | [قبل](after-first-evidence-repair/sections/dept-01/overlay-50.png) | [بعد](after-first-evidence-repair/sections/dept-01/overlay-50.png) | [قبل](after-first-evidence-repair/sections/dept-01/difference.png) | [بعد](after-first-evidence-repair/sections/dept-01/difference.png) |
| DEPT-02 | [قبل](after-first-evidence-repair/sections/dept-02/current-render.png) | [بعد](after-marketing-bar-display-rebuild/sections/dept-02/current-render.png) | [قبل](after-first-evidence-repair/sections/dept-02/overlay-50.png) | [بعد](after-marketing-bar-display-rebuild/sections/dept-02/overlay-50.png) | [قبل](after-first-evidence-repair/sections/dept-02/difference.png) | [بعد](after-marketing-bar-display-rebuild/sections/dept-02/difference.png) |
| DEPT-03 | [قبل](after-first-evidence-repair/sections/dept-03/current-render.png) | [بعد](after-first-evidence-repair/sections/dept-03/current-render.png) | [قبل](after-first-evidence-repair/sections/dept-03/overlay-50.png) | [بعد](after-first-evidence-repair/sections/dept-03/overlay-50.png) | [قبل](after-first-evidence-repair/sections/dept-03/difference.png) | [بعد](after-first-evidence-repair/sections/dept-03/difference.png) |
| DEPT-04 | [قبل](after-first-evidence-repair/sections/dept-04/current-render.png) | [بعد](after-first-evidence-repair/sections/dept-04/current-render.png) | [قبل](after-first-evidence-repair/sections/dept-04/overlay-50.png) | [بعد](after-first-evidence-repair/sections/dept-04/overlay-50.png) | [قبل](after-first-evidence-repair/sections/dept-04/difference.png) | [بعد](after-first-evidence-repair/sections/dept-04/difference.png) |
| DEPT-05 | [قبل](after-first-evidence-repair/sections/dept-05/current-render.png) | [بعد](after-first-evidence-repair/sections/dept-05/current-render.png) | [قبل](after-first-evidence-repair/sections/dept-05/overlay-50.png) | [بعد](after-first-evidence-repair/sections/dept-05/overlay-50.png) | [قبل](after-first-evidence-repair/sections/dept-05/difference.png) | [بعد](after-first-evidence-repair/sections/dept-05/difference.png) |
| DEPT-06 | [قبل](after-first-evidence-repair/sections/dept-06/current-render.png) | [بعد](after-first-evidence-repair/sections/dept-06/current-render.png) | [قبل](after-first-evidence-repair/sections/dept-06/overlay-50.png) | [بعد](after-first-evidence-repair/sections/dept-06/overlay-50.png) | [قبل](after-first-evidence-repair/sections/dept-06/difference.png) | [بعد](after-first-evidence-repair/sections/dept-06/difference.png) |
| DEPT-07 | [قبل](after-first-evidence-repair/sections/dept-07/current-render.png) | [بعد](after-first-evidence-repair/sections/dept-07/current-render.png) | [قبل](after-first-evidence-repair/sections/dept-07/overlay-50.png) | [بعد](after-first-evidence-repair/sections/dept-07/overlay-50.png) | [قبل](after-first-evidence-repair/sections/dept-07/difference.png) | [بعد](after-first-evidence-repair/sections/dept-07/difference.png) |

### DEPT-01 — Executive Office
![DEPT-01 overlay](after-first-evidence-repair/sections/dept-01/overlay-50.png)
[Reference Crop](after-first-evidence-repair/sections/dept-01/reference-crop.png) · [Current Render](after-first-evidence-repair/sections/dept-01/current-render.png) · [Difference](after-first-evidence-repair/sections/dept-01/difference.png) · [Overlay قبل الإصلاح](after-whiteboard-content/sections/dept-01/overlay-50.png)

### DEPT-02 — Marketing
![DEPT-02 overlay بعد إعادة بناء موضع/أبعاد الشاشة](after-marketing-bar-display-rebuild/sections/dept-02/overlay-50.png)
[Reference Crop](after-marketing-bar-display-rebuild/sections/dept-02/reference-crop.png) · [Current Render](after-marketing-bar-display-rebuild/sections/dept-02/current-render.png) · [Difference](after-marketing-bar-display-rebuild/sections/dept-02/difference.png) · [Before: overlay بعد إصلاح السجادة](after-first-evidence-repair/sections/dept-02/overlay-50.png)

### DEPT-03 — Engineering
![DEPT-03 overlay](after-first-evidence-repair/sections/dept-03/overlay-50.png)
[Reference Crop](after-first-evidence-repair/sections/dept-03/reference-crop.png) · [Current Render](after-first-evidence-repair/sections/dept-03/current-render.png) · [Difference](after-first-evidence-repair/sections/dept-03/difference.png) · [Overlay قبل الإصلاح](after-whiteboard-content/sections/dept-03/overlay-50.png)

### DEPT-04 — Creative Studio
![DEPT-04 overlay](after-first-evidence-repair/sections/dept-04/overlay-50.png)
[Reference Crop](after-first-evidence-repair/sections/dept-04/reference-crop.png) · [Current Render](after-first-evidence-repair/sections/dept-04/current-render.png) · [Difference](after-first-evidence-repair/sections/dept-04/difference.png) · [Overlay قبل الإصلاح](after-whiteboard-content/sections/dept-04/overlay-50.png)

### DEPT-05 — Management
![DEPT-05 overlay](after-first-evidence-repair/sections/dept-05/overlay-50.png)
[Reference Crop](after-first-evidence-repair/sections/dept-05/reference-crop.png) · [Current Render](after-first-evidence-repair/sections/dept-05/current-render.png) · [Difference](after-first-evidence-repair/sections/dept-05/difference.png) · [Overlay قبل الإصلاح](after-whiteboard-content/sections/dept-05/overlay-50.png)

### DEPT-06 — Research
![DEPT-06 overlay](after-first-evidence-repair/sections/dept-06/overlay-50.png)
[Reference Crop](after-first-evidence-repair/sections/dept-06/reference-crop.png) · [Current Render](after-first-evidence-repair/sections/dept-06/current-render.png) · [Difference](after-first-evidence-repair/sections/dept-06/difference.png) · [Overlay قبل الإصلاح](after-whiteboard-content/sections/dept-06/overlay-50.png)

### DEPT-07 — QA & Testing
![DEPT-07 overlay](after-first-evidence-repair/sections/dept-07/overlay-50.png)
[Reference Crop](after-first-evidence-repair/sections/dept-07/reference-crop.png) · [Current Render](after-first-evidence-repair/sections/dept-07/current-render.png) · [Difference](after-first-evidence-repair/sections/dept-07/difference.png) · [Overlay قبل الإصلاح](after-whiteboard-content/sections/dept-07/overlay-50.png)

## أكبر خمسة مساهمين موضعيين بكل قسم

الترتيب هو L1 تنازليًا **داخل الصناديق المرصودة للقسم**. التصنيف يفصل ما تدعمه هندسة الصندوق عن اختلاف الصورة الذي لا يمكن إرجاعه بثقة إلى هندسة أو خامة أو إضاءة منفردة. القيم L1 للمقارنة والترتيب فقط؛ ليست حصصًا قابلة للجمع.

### DEPT-01 — MAE 51.6023، SSIM 0.15409
الدليل: في المرجع جدار خشبي مخدد رأسيًا، سجادة فاتحة مستطيلة، ومكتب عريض منخفض. الرندر الحالي أبسط وأقل خامة/تفاصيل؛ حدود الغرفة/الكاميرا ليست تفسيرًا كافيًا للفجوة.

| # | العنصر — L1 | التشخيص المدعوم |
|---:|---|---|
| 1 | `INT-01-WALNUT` — 3,985,328 | خامة/كثافة تفاصيل مرجحة: المرجع يبيّن ألواحًا/شرائح خشب رأسية؛ الرندر سطح أبسط. الصندوق الحالي مشتق من الرندر لا من صندوق مرجعي، لذا أبعاده ليست إثباتًا هندسيًا مستقلًا. |
| 2 | `INT-01-RUG` — 1,747,732 | خطأ هندسي مثبت وأُصلح جزئيًا: كان قرصًا كبيرًا بدل مستطيل المرجع، وكان مركز المساحة أسفل المرجع بنحو 22.8px. بعد الإصلاح: فرق المركز `(−0.09,+0.22)px` وفروق الأبعاد `( +0.09,−1.52)px`. بقايا L1 الآن ترجّح اختلاف نسيج/نمط/لون أكثر من شكل الصندوق، لكنها غير معزولة عن الخلفية. |
| 3 | `INT-01-DESK` — 1,289,068 | هندسة مثبتة: مركز الإسقاط قريب أفقيًا لكن فرق المركز الرأسي `−10.8px` وفرق الارتفاع `+30.5px`؛ المكتب/ملحقاته أطول إسقاطًا من صندوق المرجع. يلزم فصل المكتب عن الملحقات قبل التعديل. |
| 4 | `INT-WC-01-DESK` — 890,207 | مساهمة بصرية كبيرة من مكتب بلا صندوق مرجعي منفصل؛ تقييمها الحالية تشخيصي فقط. افحص توزيع/شكل مجموعة المكاتب قبل تعديل مواقع فردية. |
| 5 | `SIGN-01` — 756,390 | صندوق قياس اللوحة يحدد المنطقة، لكن L1 لا يفصل أبعاد اللوحة عن كتابة/أيقونة/إضاءة/خامة الوجه. لا يُعاد بناء اللوحة كاملة بناءً على هذا الرقم وحده. |

### DEPT-02 — MAE 54.7883، SSIM 0.13754
الدليل: الصندوق المقاس للـROI منخفض الثقة ومحجوب جزئيًا بلوحة التطبيق؛ لا تعديل للكاميرا/القص. الـshelf والـdisplay موجودان في المرجع وتظهر لهما انحرافات هندسية محددة.

| # | العنصر — L1 | التشخيص المدعوم |
|---:|---|---|
| 1 | `SIGN-02` — 1,616,429 | مساهمة اللوحة كبيرة؛ لا تتوفر في التدقيق الحالي مطابقة مستقلة لإطارها الحالي مقابل إطار المرجع أو فصل للوجه/النص/الخامة. سببها هندسة مقابل مظهر غير محسوم. |
| 2 | `INT-02-SHELF` — 1,238,432 | هندسة مثبتة: انحراف المركز `(−13.0,−1.3)px` وحجم `(+4.4,+0.9)px`. تحريك/تضييق محدود قابل للاختبار؛ لا حاجة لإعادة بناء الخزانة كاملة قبل فحص الكتب والخامة. |
| 3 | `INT-02-DISP-BAR` — 904,195 بعد الإصلاح | كان المركز `(+19.5,−5.1)px` والحجم `(+2.5,−3.0)px`؛ عولج المركز والأبعاد في الجولة الحالية. المحتوى/السطوع يبقيان سببًا بصريًا منفصلًا غير مقاس. |
| 4 | `INT-02-PLANT-L` — 730,853 | هندسة مثبتة: الحجم أكبر `(+11.5,+18.3)px` والمركز `(-5.8,-2.5)px`. المرجع يوضح كتلة نبات/أصيص، فيكفي ضبط الكتلة والأصيص قبل إضافة أوراق تفصيلية. |
| 5 | `INT-WC-05-DESK` — 636,264 | صندوق تشخيصي مولد من هندسة الرندر، لا قياس مرجعي للعنصر. المساهمة تدعو لمراجعة صف المكاتب وتباعده، لكنها لا تحدد اتجاه التصحيح وحدها. |

### DEPT-03 — MAE 60.3314، SSIM 0.11665 (أضعف SSIM)
الدليل: المرجع يعرض صفوف مكاتب/روبوتات، شاشات كبيرة، ونباتات ضمن زجاج وإضاءة دافئة؛ الرندر أبسط بوضوح. لا دليل مستقل هنا على أن حدود الغرفة أو الكاميرا هي السبب.

| # | العنصر — L1 | التشخيص المدعوم |
|---:|---|---|
| 1 | `SIGN-03` — 3,187,027 | أكبر صندوق مساهمة منفرد قابل للمقارنة. القياس يثبت اختلاف البكسلات داخل اللوحة، لا يحدد إن كان من طول اللوحة/زاويتها أو الوجه/الرمز/النص/الانعكاس؛ عزل إطار اللوحة شرط قبل إعادة البناء. |
| 2 | `INT-03-DISP-CODE` — 862,657 | هندسة قريبة نسبيًا لكن غير مطابقة: المركز `(+9.3,−6.3)px` والحجم `(+4.6,−0.9)px`. بجانب ذلك محتوى الشاشة وتباينه مختلفان بصريًا؛ لا تُختلق شيفرة صغيرة غير مقروءة. |
| 3 | `INT-WC-19-DESK` — 636,575 | مكتب بلا صندوق مرجعي؛ بصمة الرندر تشخيصية. يثبت اختلاف المنطقة فقط، لا موضعًا/حجمًا مستهدفًا. |
| 4 | `INT-WC-12-DESK` — 600,243 | مثل السابق؛ أولوية قياس صفوف المكاتب/المسافات من المرجع قبل التعديل الفردي. |
| 5 | `INT-WC-17-DESK` — 593,527 | مثل السابق؛ قد يتداخل الصندوق مع الروبوت/الشاشة/الأرضية، فلا تنسب كامل L1 لسطح المكتب. |

### DEPT-04 — MAE 55.1973، SSIM 0.12770
الدليل: للـdisplay art صندوق قياس، وانحرافه الهندسي صغير نسبيًا مقارنة بمساهمته المحلية؛ محتوى/خامة الشاشة مرشح قوي، لا إعادة بناء هندسية كاملة أولًا.

| # | العنصر — L1 | التشخيص المدعوم |
|---:|---|---|
| 1 | `SIGN-04` — 2,595,215 | اختلاف كبير داخل صندوق اللوحة؛ فشل فصل صفيحة اللوحة عن النص/الرمز/الانعكاس يجعل السبب هندسة/مظهر غير محسوم. |
| 2 | `INT-04-DISP-ART` — 1,013,744 | الهندسة قريبة: فرق المركز `(−0.7,+4.1)px` والحجم `(+3.8,−2.3)px`. لا تدعم هذه الأدلة إعادة بناء الحامل؛ الأولوية لمقارنة فن الشاشة/ألوانها وتباينها مع القص المرجعي. |
| 3 | `INT-WC-23-DESK` — 920,411 | صندوق تشخيصي بلا px_box؛ مجموعة المكاتب/الكراسي متباينة عن المرجع، لكن لا يوجد قياس يسمح بتصحيح المكتب الفردي. |
| 4 | `INT-WC-22-DESK` — 847,726 | تشخيصي فقط؛ لا تخلط L1 المكتبي باختلاف الروبوت/الشاشة في الصندوق. |
| 5 | `INT-WC-24-DESK` — 812,785 | تشخيصي فقط؛ أولوية لاحقة لقياس توزيع cluster كامل لا إضافة تفاصيل صغيرة. |

### DEPT-05 — MAE 53.0627، SSIM 0.15893
الدليل: الطاولة الطويلة/شاشات الجدار واضحتان في المرجع. القياس الهندسي للطاولة يكشف انزياحًا رأسيًا كبيرًا رغم تقارب مرساة الأرض؛ لا أنقلها ببساطة على الأرض قبل فهم الفرق بين نقطة الارتكاز والصندوق المسقط.

| # | العنصر — L1 | التشخيص المدعوم |
|---:|---|---|
| 1 | `INT-05-TABLE` — 2,875,827 | هندسة الصندوق: فرق المركز `(+1.9,+19.3)px` والحجم `(+6.0,−5.3)px`. مرساة الأرض قريبة من الهدف، لذلك السبب المحتمل تكوين/ارتفاع المجسم أو تعريف صندوق المرجع، لا نقلٌ عشوائي للطاولة. يحتاج تفكيك السطح/الأرجل وقياس منفصل قبل تصحيح الموضع. |
| 2 | `SIGN-05` — 1,878,822 | اختلاف كبير داخل لوحة القسم، لكن مساهمة النص/الشعار/السطح/الخامة غير منفصلة عن الإطار. |
| 3 | `INT-05-DISP-CHART` — 1,693,899 | مركز قريب `(−2.7,+6.2)px` والحجم `(+6.6,+0.5)px`. MAE محلي مرتفع جدًا؛ محتوى/لون الشاشة مرشح أساسي إلى جانب عرضها. لا تُختلق قيم بيانات غير مقروءة. |
| 4 | `INT-05-WALLPANEL` — 668,437 | فرق المركز `(+15.3,+9.5)px` والحجم `(−7.1,+13.5)px`. تصحيح موضع/أبعاد اللوح أسهل من إعادة بنائه؛ يلزم التحقق من أن صندوق المرجع يشمل اللوح وحده. |
| 5 | `INT-05-BOARD` — 518,030 | فرق المركز `(+17.6,+9.9)px` والحجم `(+5.4,−1.2)px`. أولوية إزاحة/مقاس اللوح على إضافة كتابات/رسوم غير واضحة. |

### DEPT-06 — MAE 50.0929، SSIM 0.16986
الدليل: أفضل ROI نسبيًا، لكنه ما زال MAE مرتفعًا. رف الكتب والشاشة المقاسة يقدمان فرص تصحيح هندسي صغيرة وواضحة.

| # | العنصر — L1 | التشخيص المدعوم |
|---:|---|---|
| 1 | `SIGN-06` — 1,412,745 | مساهمة اللوحة كبيرة؛ لا تتوفر مقارنة صندوق إسقاط للوحة/تفكيك للوجه في التقرير الحالي، لذلك سببها الدقيق غير مثبت. |
| 2 | `INT-06-SHELF` — 1,398,288 | فرق المركز `(+8.0,+2.3)px` والحجم `(+2.3,−2.8)px`. تصحيح صغير للموقع/المقاس؛ خامة الكتب وتفاصيلها لا تُستنتج من L1. |
| 3 | `INT-06-DISP-MAP` — 988,065 | فرق المركز `(−15.0,−2.6)px` والحجم `(+2.0,−6.2)px`. حرّك الشاشة على المحور الأفقي المقاس واضبط ارتفاعها؛ محتوى الخريطة واضح على مستوى الألوان/الكتل فقط، لا نصوصها. |
| 4 | `INT-WC-25-DESK` — 863,354 | لا px_box مستقل؛ L1 تشخيصي من صندوق الرندر، لا توجيه كافٍ لموضع هذا المكتب. |
| 5 | `INT-WC-29-DESK` — 787,764 | لا px_box مستقل؛ راجع توزيع cluster كله ومسافاته بدل تحسين قطعة منفردة. |

### DEPT-07 — MAE 55.4306، SSIM 0.15648
الدليل: المرجع يوضح رفوف/خزائن خوادم وشاشة check، بينما الشكل الحالي أكثر تبسيطًا. قياسات الرفوف تدعم إعادة بناء واجهتها المرئية؛ لا حاجة لإعادة الغرفة أو الكاميرا.

| # | العنصر — L1 | التشخيص المدعوم |
|---:|---|---|
| 1 | `SIGN-07` — 1,959,075 | مساهمة لوحة كبيرة، لكن وجهها/حدودها غير معزولة في قياس الهندسة. افصل الصفيحة عن النص/الرمز قبل تعديلها. |
| 2 | `INT-07-RACK-R` — 1,370,848 | هندسة مثبتة: فرق المركز `(+1.6,+4.9)px` والحجم `(+5.2,+15.2)px`. عرض/ارتفاع الصندوق يدعمان تصحيح الأبعاد. كما أن المرجع يظهر واجهة خوادم مقسّمة؛ الرندر الحالي مبسط، ما يرجح إعادة بناء **واجهة الرف فقط** مع حجب أي ملصقات غير مقروءة. |
| 3 | `INT-07-RACK-L` — 1,215,381 | فرق المركز `(+1.3,+5.6)px` والحجم `(+3.3,+5.0)px`. أبعاد قريبة نسبيًا؛ أصلح واجهة الخزانة/التقسيمات قبل نقلها. |
| 4 | `INT-07-DISP-CHECK` — 1,121,822 | فرق المركز `(+9.0,+0.7)px` والحجم `(+3.3,−4.5)px`. تعديل موضع/أبعاد محدود؛ علامة الفحص واضحة، لا داعي لنصوص دقيقة غير مقروءة. |
| 5 | `INT-WC-34-DESK` — 851,586 | صندوق تشخيصي بلا هدف مرجعي مستقل؛ يطلب قياس تباعد مجموعة المكاتب، لا تحريك هذا المكتب منفردًا. |

## فصل الأسباب: ماذا يفسر الأدلة وما لا تفسره

1. **الهندسة/التوزيع (أقوى أدلة قابلة للإصلاح الآن):** خطأ شكل/مركز السجادة كان مثبتًا، وأُصلح. فروق مواقع/أحجام أرفف وشاشات محددة موثقة بالأرقام أعلاه. للطاولة التنفيذية والطاولة الطويلة انحراف إسقاط هندسي، لكن يلزم فصل أجزاء المجسم قبل التصحيح. تتكرر صناديق مكاتب كبيرة في الأقسام 2–7، إلا أن غياب `px_box` يعني أن القياس الحالي غير كافٍ لنقلها أو تحجيمها بثقة.
2. **الخامات/التفاصيل والمحتوى (فجوة مرئية كبيرة):** جدار Executive الخشبي، الشاشات/المخططات، واجهة رفوف QA، وتفاصيل النباتات والأثاث أقل تمثيلًا من المرجع. الأرقام المحلية تحدد أين نبحث؛ لا تعطي وحدها مكوّن اللون أو الملمس الذي ينبغي تغييره. النصوص الدقيقة والبيانات الصغيرة غير مدعومة وتظل عامة.
3. **الإضاءة/الانعكاسات:** المرجع يظهر إضاءة دافئة ولمعات وانعكاسات زجاج أكثر حضورًا؛ الرندر الحالي أبسط وأقل تباينًا/ملمسًا. لا توجد في هذه المقارنة قياسات منفصلة للضوء والخامة والانعكاس، لذلك لم أغيّر إعداد إضاءة شاملًا. تجربة لمعان الأرضية السابقة لم تحقق تحسنًا كافيًا ولا تبرر تعميم تعديل خامات.
4. **الكاميرا/بصمات الغرف:** لا دليل مستقل يبرر تغييرهما. لا تعديل عليهما.

## إعادة بناء كاملة أم تصحيح محدود؟

- **أُعيد بناؤه/ضُبط هندسيًا:** `INT-01-RUG` (قرص → مستطيل ومركز مضبوط)، ثم شاشة `INT-02-DISP-BAR` (الموضع والحجم أعيدا مواءمتهما مع صندوق المرجع). لا تفاصيل تجميلية جديدة أضيفت.
- **مرشح إعادة بناء سطح/واجهة، وليس نقلًا للعنصر كله:** سطح الجدار الخشبي في DEPT-01؛ وواجهة رفوف الخوادم في DEPT-07. السمات العامة ظاهرة في المرجع، لكن لا تُقدّر أعداد شقوق/ملصقات دقيقة بلا قياس.
- **تصحيحات موضع/أبعاد متبقية:** رف DEPT-02، شاشة DEPT-03، النبات المقاس في DEPT-02، ألواح/سبورة DEPT-05، رف DEPT-06، ورفا DEPT-07؛ القياسات المحددة أعلاه هي أهداف الإصلاح.
- **لا قرار إعادة بناء قبل فصل السبب:** لوحات الأقسام السبعة، محتويات معظم الشاشات، الطاولة التنفيذية وطاولة الاجتماع، وصفوف المكاتب غير المقاسة. قد يكون اختلاف البكسلات وجهًا/مادة/ضوءًا أو هندسة مختلطة.

## ترتيب التنفيذ التالي حسب مقدار مساهمة الخطأ المرصود

الترتيب التالي يستخدم L1 للصناديق ذات مرجع معلوم حيث أمكن. `INT-01-WALNUT` أعلى خامًا (3,985,328) لكنه **صندوق من إسقاط الرندر فقط**، فلا يوضع في أعلى أولوية هندسية حتى يُقاس حدّه من المرجع. بعد استبعاد هذا التشخيص غير المستقل، الترتيب العملي هو:

| أولوية | العنصر | L1 محلي | سبب الموضع في الخطة |
|---:|---|---:|---|
| 1 | `SIGN-03` | 3,187,027 | أكبر منطقة مرجعية منفردة؛ اعزل plate/face/text قبل تقرير نوع البناء. |
| 2 | `INT-05-TABLE` | 2,875,827 | ثاني أكبر صندوق مرجعي؛ فرق مركز رأسي 19.3px يتطلب تحليل مكونات قبل إزاحة عشوائية. |
| 3 | `SIGN-04` | 2,595,215 | مساهمة كبيرة؛ افصل شكل اللوحة عن سطحها/محتواها. |
| 4 | `SIGN-07` | 1,959,075 | يليها مباشرة، مع مقارنة الإطار والوجه منفصلين. |
| 5 | `SIGN-05` | 1,878,822 | مساهمة لوحة قوية؛ التحقق من الوجه أولًا. |
| 6 | `INT-01-RUG` — **أُصلح** | 1,796,854 قبل الإصلاح | سبب الشكل/المركز كان مباشرًا ومسنودًا هندسيًا؛ L1 انخفض إلى 1,747,732. |
| 7 | `INT-05-DISP-CHART` | 1,693,899 | هندسته قريبة نسبيًا لكن MAE محلي مرتفع؛ راجع محتوى/لون العرض. |
| 8 | `SIGN-02` | 1,616,429 | منطقة كبيرة غير معزولة بين الإطار والوجه. |
| 9 | `SIGN-06` | 1,412,745 | مثل السابق. |
| 10 | `INT-06-SHELF` | 1,398,288 | خطأ هندسي محدود وقابل للتصحيح. |
| 11 | `INT-07-RACK-R` | 1,370,848 | صندوق أكبر من المرجع، وواجهة الرف تحتاج إعادة تركيب مرئية. |
| 12 | `INT-01-DESK` | 1,289,068 | فرق الصندوق الظاهر كان ملوّثًا بلوح خشبي 1.56m المصنف ضمن المكتب؛ فُحصت الإزالة ثم رُفضت بصريًا وأُعيدت. |
| 13 | `INT-02-SHELF` | 1,238,432 | انحراف أفقي مقاس؛ تصحيح موضع/عرض. |
| 14 | `INT-07-RACK-L` | 1,215,381 | تصحيح شكل واجهة محدود. |
| 15 | `INT-07-DISP-CHECK` | 1,121,822 | تصحيح إزاحة/مقاس مع إبقاء المحتوى العام. |
| 16 | `INT-02-DISP-BAR` — **ضُبط** | 904,195 | L1 انخفض من 963,568؛ فرق مركز الصندوق انخفض من 20.13 إلى 0.17px، وأبعاده اقتربت من المقاس المرجعي. |

**لم أبدأ بهذه القائمة من رقم L1 الأعلى آليًا وحده:** اللوحات والطاولة وغيرها تتضمن بكسلات وجه/خامة وخلفية ولا تثبت أن تعديلها الهندسي سيحسن المشهد. اختيرت السجادة كأول إصلاح لأن شكل المرجع (مستطيل) وشكل المجسم (دائري) وانحراف صندوقه قابلة للتحقق مباشرة، وبذلك يقل خطر تعديل عنصر صحيح لمجرد ارتفاع L1. بقية القائمة ترتيب التحقق والتنفيذ، لا تفويضًا لتغيير عناصر متعددة دون قياس قبل/بعد لكل مجموعة.

## الجولة الحالية — تشخيص العنصر وإصلاحه

### اختيار العنصر

بعد إصلاح السجادة، أكبر فرق هندسي ظاهر في تقرير DEPT-01 كان `INT-01-DESK`: فرق الارتفاع الإسقاطي `+30.48px`. عزلت جميع primitives الحاملة لـ`refId=INT-01-DESK` قبل تقرير إعادة البناء: العنصر `D-8` هو لوح walnut بارتفاع `1.56m`، وليس جزءًا من المكتب، لكنه كان محسوبًا ضمن صندوقه. لذلك كان أكبر فرق المكتب **انحرافًا في تجميع/إسناد هندسة العناصر**، لا دليلًا كافيًا على أن المكتب نفسه أكبر من المرجع.

جربت إزالة اللوح مرة واحدة: صندوق المكتب صار `133.05×40.96px` مقابل المرجع `132×44px`، لكن مساهمة L1 للمكتب زادت `1,289,068 → 1,400,360`، وMAE قسم Executive زاد `51.602 → 53.032`، والوزني زاد `54.452 → 54.617`. ارتفع SSIM قليلًا، لكنه لم يعوّض تراجع MAE. لا يمكن من صندوق المكتب المختلط فصل أثر اللوح عن سطح المكتب/الروبوت/الحجب؛ لذلك لا أعتبر تحسن صندوق الإسقاط نجاحًا بصريًا. التجربة **مرفوضة** وأُعيد اللوح إلى حالته السابقة حفاظًا على إصلاح السجادة. صورها: [Before overlay](after-first-evidence-repair/sections/dept-01/overlay-50.png) · [After failed attempt overlay](after-executive-desk-rebuild/sections/dept-01/overlay-50.png) · [After failed attempt Difference](after-executive-desk-rebuild/sections/dept-01/difference.png).

بعد فصل هذا الالتباس، كان أكبر انحرافين مركزيين موثقين متقاربين جدًا: `INT-05-BOARD` نحو `20.19px` و`INT-02-DISP-BAR` نحو `20.13px`. اخترت شاشة Marketing لهذه الجولة لأن مساهمتها المحلية قبل الإصلاح أكبر (`963,568` مقابل `518,030` L1) مع صندوق قياس مباشر `70×70px`؛ لذا فهي أعلى أثرًا بصريًا ضمن هذا التعادل الهندسي. تصنيفها **موضع/توزيع** أساسًا، مع فرق أبعاد أصغر (`+2.54×−2.97px`)؛ لا اختلاف عدد عناصر أو اتجاه مثبت، ولا حاجة لإضافة تفاصيل للشاشة.

### إعادة بناء تكوين الشاشة المقاس

ثُبّت `centre_y=0.854` ولم يتغير yaw. أُعيد حساب `floor_xz` من مركز الصندوق المقاس `[520,240]` على المستوى عند ذلك الارتفاع باستخدام HOME camera نفسها، ثم لُوئمت الأبعاد حتى تطابق صندوق الإسقاط:

| القياس | قبل جولة الشاشة | بعد الجولة | الهدف المقاس |
|---|---:|---:|---:|
| موضع مركز صندوق الإسقاط | انحراف `( +19.47,−5.13 )px`؛ مقدار `20.13px` | `(−0.14,−0.10)px`; مقدار `0.17px` | `(0,0)px` |
| أبعاد الصندوق | `72.54×67.03px` | `70.19×69.77px` | `70×70px` |
| L1 داخل صندوق الشاشة | `963,568` | `904,195` | — |
| MAE داخل صندوق الشاشة | `65.549` | `61.510` | — |
| SSIM المحلي | `0.11180` | `0.07020` | لا يضمنه تطابق الحدود؛ محتوى الشاشة ما زال غير مطابق بنيويًا |
| MAE / SSIM قسم Marketing | `54.7883 / 0.13754` | `54.3422 / 0.13909` | تحسن محدود |

`floor_xz` انتقل من `[-14.844,−2.454]` إلى `[-14.959,−1.923]`؛ حجم الكتالوج عُدّل من `[1.708,0.427,1.708]` إلى `[1.641,0.427,1.780]`. هذه إعادة مواءمة تكوين عنصر واحد (مركز + أبعاد)، لا تجميل أو إضافة عناصر. اتجاه الشاشة لم يُعدّل لعدم وجود اتجاه مرجعي رقمي مستقل.

![Before / After overlay لشاشة Marketing](after-marketing-bar-display-rebuild/sections/dept-02/overlay-50.png)
[Before overlay بعد إصلاح السجادة](after-first-evidence-repair/sections/dept-02/overlay-50.png) · [After overlay](after-marketing-bar-display-rebuild/sections/dept-02/overlay-50.png) · [After Difference](after-marketing-bar-display-rebuild/sections/dept-02/difference.png) · [Reference crop](after-marketing-bar-display-rebuild/sections/dept-02/reference-crop.png) · [Current render](after-marketing-bar-display-rebuild/sections/dept-02/current-render.png) · [قياسات وهندسة الشاشة بعد](after-marketing-bar-display-rebuild/audit.json)

### قبل/بعد للمشهد كاملًا

المقارنة الأساسية هي بعد إصلاح السجادة مباشرةً مقابل آخر رندر بعد إصلاح شاشة Marketing؛ أما الأرقام التراكمية فتبدأ من `after-whiteboard-content` قبل إصلاح السجادة.

| النطاق | قبل جولة الشاشة MAE / SSIM | بعد MAE / SSIM | التغير |
|---|---:|---:|---:|
| DEPT-01 | 51.6023 / 0.15409 | 51.6023 / 0.15409 | ثابت |
| DEPT-02 | 54.7883 / 0.13754 | 54.3422 / 0.13909 | MAE −0.4460، SSIM +0.00155 |
| DEPT-03 إلى DEPT-07 | كما في قياس السجادة | لم تتغير | ثابتة |
| weighted all ROIs | 54.4521 / 0.145361 | 54.3844 / 0.145596 | MAE −0.06769، SSIM +0.000235 |
| تراكمي من خط الأساس قبل السجادة | 54.6585 / 0.144558 | 54.3844 / 0.145596 | MAE −0.2742 (−0.50%)، SSIM +0.001038 |

النتيجة مواتية في MAE وSSIM لقسم Marketing، والحدود الهندسية للشاشة متقاربة الآن. لكن L1/SSIM المحلي للشاشة يبينان أن المحتوى نفسه لم يطابق بنية المرجع بعد، والتحسن الموزون صغير. هذا **تحسن تراكمي حقيقي لكنه محدود**، لا قبول للمرحلة. الصور الكاملة لكل قسم محفوظة تحت `after-marketing-bar-display-rebuild/sections/`؛ لم تتغير بقية الأقسام.

### تجربة منفصلة على رف Marketing — مرفوضة

بعد قياس الشاشة، اختبرت مجموعة مستقلة لتقريب `INT-02-SHELF` من صندوقه: انحراف مركزه `13.08px` وأبعاده `82.39×95.94px` مقابل `78×95px`. بعد تحريك/تضييق الرف صار انحراف المركز `0.02px` والأبعاد `78.35×95.85px`، لكن L1 المحلي ارتفع `1,238,432 → 1,282,211`، وMAE الرف `55.71 → 57.68`، وMAE قسم Marketing `54.342 → 54.583`، والوزني `54.384 → 54.421` مع SSIM أقل. **تحسن الحدود الهندسية وحده لم يحسن تشابه الصورة**؛ أُعيدت إحداثيات الرف وعرضه إلى ما قبل التجربة. لا تُحسب هذه المجموعة نجاحًا. صورها محفوظة في `after-marketing-shelf-position-rebuild/`: [Before overlay](after-marketing-bar-display-rebuild/sections/dept-02/overlay-50.png) · [After failed shelf overlay](after-marketing-shelf-position-rebuild/sections/dept-02/overlay-50.png) · [After failed shelf Difference](after-marketing-shelf-position-rebuild/sections/dept-02/difference.png).

## سجل إصلاح الدفعة الأولى ونتيجتها

- `INT-01-RUG`: استبدال cylinder دائري بـbox مستطيل باستخدام عرض الكتالوج وعمق النسبة المقاسة الموجودة أصلًا؛ لم أضف زخرفة أو عناصر جديدة.
- صححت `floor_xz` من `[-7.870, -6.849]` إلى `[-8.747, -7.726]`. الإحداثيات الجديدة هي حل إسقاط مركز الصندوق المرجعي `(870,277.5)` على مستوى الأرض عبر HOME camera غير المتغيرة. لا تغيير للكاميرا أو footprint.
- هندسة السجادة: ارتفاع الإسقاط `78.74 → 43.48px` مقابل المرجع `45px`؛ انحراف المركز `(0.03,22.79) → (−0.09,0.22)px`. MAE داخل صندوقها `73.945 → 71.923` وSSIM `0.07847 → 0.09238`. L1 انخفض `1,796,854 → 1,747,732`، بينما بقي اختلاف خامة/نمط محتمل.
- قسم DEPT-01 تحسن `−1.792` MAE و`+0.00697` SSIM؛ الأقسام الستة الأخرى لم تتغير. إجمالي الصورة تحسن محدود فقط، لذا لا أدعي نجاحًا بصريًا شاملًا.
- الصور: [Overlay قبل](after-whiteboard-content/sections/dept-01/overlay-50.png) · [Overlay بعد](after-first-evidence-repair/sections/dept-01/overlay-50.png) · [Difference بعد](after-first-evidence-repair/sections/dept-01/difference.png) · [بيانات الهندسة والقياس بعد](after-first-evidence-repair/audit.json).

## التحقق والحكم

نجح `npm run validate`: 97 اختبارًا، وفحص TypeScript، وبناء الإنتاج وفحصه. كما اكتمل تدقيق Playwright بلا أخطاء متصفح. هذه نتائج سلامة تنفيذ فقط ولا تغير قرار القبول البصري.

**القرار: NOT ACCEPTED — Department Interiors تظل مفتوحة.** لم يُنشأ commit، ولم يحدث Push أو Merge أو Deploy. لم ألمس تغييرات الحزمة/الواجهة أو الملفات غير المرتبطة في شجرة العمل. الأولوية التالية هي عزل صندوق `SIGN-03` (أعلى L1 مرجعي متبقٍ) ثم تشخيص طاولة DEPT-05، كل مجموعة في جولة مستقلة بقياس كامل قبل/بعد.
