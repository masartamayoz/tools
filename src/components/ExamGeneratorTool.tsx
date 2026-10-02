import { useState, useRef } from 'react';
import { Sparkles, Printer, Download, Eye, FileSpreadsheet, Check, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

interface ExamSubject {
  id: string;
  name: string;
  levels: {
    id: string;
    name: string;
    exercises: {
      title: string;
      question: string;
      points: number;
    }[];
  }[];
}

export default function ExamGeneratorTool() {
  const [schoolName, setSchoolName] = useState('مدرسة التميز والإبداع الابتدائية النموذجية');
  const [teacherName, setTeacherName] = useState('أستاذ(ة) المادة الأقدم');
  const [trimester, setTrimester] = useState('الأول (الثلاثي الأول)');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [selectedLevel, setSelectedLevel] = useState('p6');
  const [showGradingTable, setShowGradingTable] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [generatedExam, setGeneratedExam] = useState<any | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // High-fidelity Tunisian school syllabus database
  const syllabusData: Record<string, ExamSubject> = {
    math: {
      id: 'math',
      name: 'الرياضيات والمنطق',
      levels: [
        {
          id: 'p1',
          name: 'السنة الأولى من التعليم الابتدائي',
          exercises: [
            {
              title: 'التمرين الأول: قيس الأطوال والمقارنة',
              question: 'لاحظ المشاهد المعروضة ثم رتب الشجيرات التالية من الأقصر إلى الأطول باستخدام الأرقام (1، 2، 3):',
              points: 5,
            },
            {
              title: 'التمرين الثاني: الأعداد والعد والحساب الفردي',
              question: 'احسب عدد الكرات في كل مجموعة ثم ضع علامة (>) أو (<) أو (=) للمقارنة الدقيقة في الحيز الشاغر:',
              points: 5,
            },
            {
              title: 'التمرين الثالث: التدريب على التركيب العددي وصيغ الجمع',
              question: 'أكمل ملء الفراغات حسب المثال التوضيحي باللوحة:  5 + ... = 9  |  4 + 2 = ...  |  3 + ... = 6',
              points: 10,
            },
          ],
        },
        {
          id: 'p4',
          name: 'السنة الرابعة من التعليم الابتدائي',
          exercises: [
            {
              title: 'التمرين الأول: الحساب وتكوين الأعداد ذات 5 أرقام',
              question: 'اكتب الأعداد بالصيغة الرقمية أو الحرفية المكملة: \n- خمسة وعشرون ألفاً ومائتان وعشرة: ....................\n- 47854: .................................................',
              points: 6,
            },
            {
              title: 'التمرين الثاني: وضعية إدماجية (التصرف في الأموال والمكسب من الإنتاج)',
              question: 'اشترى فلاح كيس شعير بـ 42 ديناراً وكمية من النخالة بـ 18 ديناراً. إذا كان يملك ورقة نقدية من فئة 100 دينار، فكم بقي له من ماله؟',
              points: 8,
            },
            {
              title: 'التمرين الثالث: الهندسة والزوايا والأشكال الأساسية',
              question: 'ارسم قطعة مستقيم [أ ب] طولها 6 سم، ثم حدد منتصفها النقطة (م) وارسم خطاً عمودياً يمر منها لتشكيل زاوية قائمة تماماً.',
              points: 6,
            },
          ],
        },
        {
          id: 'p6',
          name: 'السنة السادسة (مناظرة السيزيام)',
          exercises: [
            {
              title: 'التمرين الأول: القواسم المشتركة والخطوط الإحصائية والمنطق',
              question: 'ابحث عن مجموعة القواسم المشتركة للعددين 36 و 48 ثم استخرج القاسم المشترك الأكبر (ق.م.أ) لتسوية قطع البناء المتبقية:',
              points: 5,
            },
            {
              title: 'التمرين الثاني: المسائل الهندسية وحساب المساحات المركبة (المحيط، الارتفاع)',
              question: 'ملك فلاح حقلاً مستطيل الشكل يبلغ طوله 120 متراً وعرضه يساوي ثلثي (2/3) طوله. احسب تكلفة تسييج الحقل إذا كان ثمن المتر الواحد من السلك الواقي 4.5 ديناراً مع ترك باب طوله 3 أمتار.',
              points: 8,
            },
            {
              title: 'التمرين الثالث: الحجم وصيغ الخزانات ومعدلات المنسوب المتفاوتة',
              question: 'خزان ماء على شكل أسطوانة قائمة مساحة قاعدتها 12.5 متر مربع وعمق الخزان 3 أمتار. احسب حجم الخزان، وثم منسوب ملئه باللتر إذا ملئ لنصف سعته الكروية.',
              points: 7,
            },
          ],
        },
      ],
    },
    science: {
      id: 'science',
      name: 'الإيقاظ العلمي والعلوم الدقيقة',
      levels: [
        {
          id: 'p4',
          name: 'السنة الرابعة من التعليم الابتدائي',
          exercises: [
            {
              title: 'التمرين الأول: حالات المادة وتغيراتها الفلكية الطبيعية',
              question: 'اختر الحالة المناسبة (صلب، سائل، غاز) لكل مادة مما يلي: \n- بخار الماء المتصاعد: ....................\n- الثلج المستقر بالقمة: ....................\n- الحليب الطازج بالقدح: ....................',
              points: 6,
            },
            {
              title: 'التمرين الثاني: مصادر الغذاء وعلاقات التوازن الحياتي الحيواني وتركيبة الوجبة',
              question: 'صنف الحيوانات التالية حسب نظامها الغذائي (عاشب، لاحم، كليش) في الجدول: الأسد، الأرنب، الدب، الصقر، البقرة الثقيلة.',
              points: 7,
            },
            {
              title: 'التمرين الثالث: التكاثر ونمو النباتات والأوراق الخضراء',
              question: 'رتب المراحل الطبيعية لنمو نبات الفاصوليا بداية من البذرة المصممة باتجاه النبتة المثمرة (من 1 إلى 4):',
              points: 7,
            },
          ],
        },
        {
          id: 'p6',
          name: 'السنة السادسة (مناظرة السيزيام)',
          exercises: [
            {
              title: 'التمرين الأول: الجهاز العصبي ووظائف الحواس في الاستشعار والتواصل',
              question: 'عرف المكونات الثلاثة الأساسية للقوس الانعكاسي (الحس، الحركة، التلقي) موضحاً مكان معالجة السيالة العصبية الصادرة والواردة:',
              points: 6,
            },
            {
              title: 'التمرين الثاني: خصائص الهواء والضغط والترابط الجزيئي والجاذبية',
              question: 'أجرى مخبري تجربة نكس قارورة مقلوبة في ماء مغلي ومثلج. اشرح كيف يتغير حجم الهواء المسجون ووجه استخلاصاً لظاهرتي التمدد والتقلص الجوي.',
              points: 7,
            },
            {
              title: 'التمرين الثالث: التلوث البيئي وعناصر حماية النظم المائية والبرمائية في تونس',
              question: 'اقترح ثلاثة حلول بيئية مستقرة ومتوازنة للحد من ملوحة المياه الجوفية وتلوث الآبار الزراعية بمحافظة القيروان والجنوب التونسي.',
              points: 7,
            },
          ],
        },
      ],
    },
    arabic: {
      id: 'arabic',
      name: 'قواعد اللغة العربية والإعراب',
      levels: [
        {
          id: 'p4',
          name: 'السنة الرابعة من التعليم الابتدائي',
          exercises: [
            {
              title: 'التمرين الأول: التمييز بين أقسام الكلمة (اسم، فعل، حرف)',
              question: 'استخرج من الجملة التالية كلاً من الأسماء والأفعال والحروف في الخانات: "اجتهد التلميذ المجتهد في مراجعة دروسه بنشاط."',
              points: 6,
            },
            {
              title: 'التمرين الثاني: تصريف الأفعال مع ضمائر المتكلم والغائب',
              question: 'صرف الفعل (كَتَبَ) في الماضي والمضارع مع الضمائر المذكورة: \n- أنا: الماضي ................ | المضارع ................\n- هما: الماضي ................ | المضارع ................',
              points: 8,
            },
            {
              title: 'التمرين الثالث: الجملة الاسمية والخبر التوضيحي والمبتدأ المرفوع',
              question: 'عين المبتدأ والخبر في الجمل التالية واشرح حركة إعراب آخرهما بالضمة: \n- المعلمُ مخلصٌ في العطاء.\n- العلمُ نورٌ للجميع.',
              points: 6,
            },
          ],
        },
        {
          id: 'p6',
          name: 'السنة السادسة (مناظرة السيزيام)',
          exercises: [
            {
              title: 'التمرين الأول: النواسخ الفعلية والحرفية ( كان وأخواتها / إن وأخواتها )',
              question: 'ادخل ناسخاً فعلياً مرة وناسخاً حرفياً مرة أخرى على الجملة التالية مع ضبط شكل أواخر الكلمات تماماً بمد الصرف: "الامتحانُ سهلٌ جداً وميسر."',
              points: 6,
            },
            {
              title: 'التمرين الثاني: الإعراب والتشكيل اللغوي التفصيلي',
              question: 'أعرب الكلمات المسطرة في الجملة الواردة إعراباً كاملاً ومفصلاً: "يحترمُ المواطنونَ القانونَ خدمةً للبلاد والوطن."',
              points: 8,
            },
            {
              title: 'التمرين الثالث: الهمزات والإنتاج الإملائي والخط الصرفي',
              question: 'فسر سبب كتابة الهمزة في الأفعال والأسماء التالية بالتفصيل: \n- سُؤال: ....................\n- بِئْر: ....................\n- لُؤْلُؤْ: ....................',
              points: 6,
            },
          ],
        },
      ],
    },
  };

  const handleGenerate = () => {
    const subjectData = syllabusData[selectedSubject];
    if (!subjectData) return;

    const levelData = subjectData.levels.find((l) => l.id === selectedLevel);
    if (!levelData) {
      // Fallback if that level isn't explicitly there
      const fallbackLevel = subjectData.levels[0];
      setGeneratedExam({
        schoolName,
        teacherName,
        trimester,
        subjectName: subjectData.name,
        levelName: fallbackLevel.name,
        exercises: fallbackLevel.exercises,
      });
    } else {
      setGeneratedExam({
        schoolName,
        teacherName,
        trimester,
        subjectName: subjectData.name,
        levelName: levelData.name,
        exercises: levelData.exercises,
      });
    }

    setPreviewMode(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateExercise = (idx: number, field: 'title' | 'question' | 'points', value: any) => {
    if (!generatedExam) return;
    const copy = [...generatedExam.exercises];
    copy[idx] = {
      ...copy[idx],
      [field]: field === 'points' ? (parseInt(value, 10) || 0) : value,
    };
    setGeneratedExam({ ...generatedExam, exercises: copy });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📝 مولّد ومنشئ الفروض والاختبارات المدرسية تونس
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            أنشئ فوراً فروض مراقبة وتأليف نموذجية حسب موضوع ومقترح التدريس المدرسي الرسمي تونس لتطبعها للتلاميذ وتدير صفك!
          </p>
        </div>
      </div>

      {!previewMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Options side */}
          <div className="space-y-5 bg-slate-50/50 dark:bg-slate-950/10 p-6 rounded-2xl border border-slate-150 dark:border-slate-850">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm pb-2 border-b border-slate-200 dark:border-slate-800">
              ⚙️ خيارات ومواصفات الفرض النموذجي
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">اسم المؤسسة التعليمية / المدرسة:</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">اسم المعلم / الأستاذ:</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">الثلاثي الدراسي:</label>
                  <select
                    value={trimester}
                    onChange={(e) => setTrimester(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="الأول (الثلاثي الأول)">الاول (الثلاثي الأول)</option>
                    <option value="الثاني (الثلاثي الثاني)">الثاني (الثلاثي الثاني)</option>
                    <option value="الثالث (الثلاثي الثالث)">الثالث (الثلاثي الثالث)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">المادة والمحتوى:</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      if (e.target.value === 'math') setSelectedLevel('p6');
                      else setSelectedLevel('p4');
                    }}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="math">الرياضيات والمنطق الحسابي</option>
                    <option value="science">الإيقاظ العلمي والعلوم الدقيقة</option>
                    <option value="arabic">قواعد اللغة العربية والإعراب البناء</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">المستوى الدراسي المستهدف:</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    {selectedSubject === 'math' && (
                      <option value="p1">السنة الأولى من التعليم الأساسي</option>
                    )}
                    <option value="p4">السنة الرابعة من التعليم الأساسي</option>
                    <option value="p6">السنة السادسة (السيزيام مناظرة)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="branding_logo_box"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="w-4.5 h-4.5 text-indigo-600 rounded bg-slate-100 border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="branding_logo_box" className="text-xs font-bold text-slate-755 dark:text-slate-300 cursor-pointer">
                  تضمين الشعار والختم البصري الرسمي (أدوات مسار) برأس الاختبار للطباعة
                </label>
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="grading_tbl_box"
                  checked={showGradingTable}
                  onChange={(e) => setShowGradingTable(e.target.checked)}
                  className="w-4.5 h-4.5 text-indigo-600 rounded bg-slate-100 border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="grading_tbl_box" className="text-xs font-bold text-slate-755 dark:text-slate-300 cursor-pointer">
                  تضمين جدول معايير التقييم والعدد المسند (/20) بالرأس
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-none text-white font-black rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer text-xs"
            >
              قم بتوليد وتفصيل الفرض النموذجي الآن ✨
            </button>
          </div>

          {/* Prompt/Instruction layout */}
          <div className="flex flex-col justify-center items-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-4">
              <FileSpreadsheet className="h-10 w-10" />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">منصة الفروض والامتحانات تونس</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
              تساعدك الأداة على إنشاء بنوك أسئلة نموذجية فورية مع احترام التقسيم المدرسي التونسي وهيكلة الصفحة بشكل فائق الجاهزية للطباعة العائلية أو المدرسية.
            </p>
          </div>
        </div>
      ) : (
        /* Preview printable paper layout */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-100/80 dark:bg-slate-800/60 p-3 rounded-2xl">
            <button
              onClick={() => setPreviewMode(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              ← رجوع وتغيير الخيارات
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5" />
              طباعة أو حفظ كملف PDF
            </button>
          </div>

          {/* Assessment Paper Body */}
          <div
            ref={printAreaRef}
            className="bg-white text-slate-900 p-8 sm:p-12 border border-slate-300 rounded-xl shadow-md max-w-4xl mx-auto font-sans text-right"
            dir="rtl"
          >
            {/* School details / header row */}
            <div className="grid grid-cols-3 gap-4 border-b-2 border-slate-900 pb-6 mb-6">
              <div className="text-right text-xs space-y-1.5">
                <p className="font-extrabold">{generatedExam.schoolName}</p>
                <p className="text-slate-600">المعلم(ة): {generatedExam.teacherName}</p>
                <p className="text-slate-600">الثلاثي: {generatedExam.trimester}</p>
              </div>

              <div className="text-center space-y-1">
                {showLogo && (
                  <div className="flex justify-center mb-1 bg-slate-50 border border-slate-100 rounded-xl py-1 px-3 w-max mx-auto">
                    <Logo variant="blue" size="sm" showText={false} animate={false} />
                  </div>
                )}
                <span className="text-xs bg-slate-100 font-bold px-3 py-1 rounded-full text-slate-800 uppercase tracking-widest block w-max mx-auto border border-slate-300">
                  جمهورية تونسية
                </span>
                <p className="text-xl font-black mt-2">اختبار تقييمي</p>
                <p className="text-xs text-indigo-700 font-bold">{generatedExam.subjectName}</p>
              </div>

              <div className="text-left text-xs space-y-1">
                <p className="font-bold">المستوى: {generatedExam.levelName}</p>
                <p className="text-slate-500">التاريخ: ...............................</p>
              </div>
            </div>

            {/* Student metadata row */}
            <div className="border border-slate-900 p-3 bg-slate-50/50 rounded-lg flex justify-between text-xs font-bold mb-6">
              <span>الاسم واللقب: .....................................................................</span>
              <span>القسم: .....................</span>
              <span>الرقم: ..........</span>
            </div>

            {/* Optional assessment grading metrics block */}
            {showGradingTable && (
              <div className="mb-8 border border-slate-900 rounded-lg overflow-hidden">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-100 border-b border-slate-900 font-bold">
                    <tr>
                      <th className="p-2 border-l border-slate-900">المعايير المعتمدة</th>
                      <th className="p-2 border-l border-slate-900">م ك 1</th>
                      <th className="p-2 border-l border-slate-900">م ك 2</th>
                      <th className="p-2 border-l border-slate-900">م ك 3</th>
                      <th className="p-2 border-l border-slate-900">م أ</th>
                      <th className="p-2 font-black">العدد النهائي</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-300 text-slate-500">
                      <td className="p-2 border-l border-slate-900 text-right font-medium">الدرجة المقدرة</td>
                      <td className="p-2 border-l border-slate-900">... / 5</td>
                      <td className="p-2 border-l border-slate-900">... / 5</td>
                      <td className="p-2 border-l border-slate-900">... / 5</td>
                      <td className="p-2 border-l border-slate-900">... / 5</td>
                      <td className="p-2 rowspan-2 text-slate-900 font-bold text-sm">
                        ................ / 20
                      </td>
                    </tr>
                    <tr className="text-slate-500 bg-slate-50/50">
                      <td className="p-2 border-l border-slate-900 text-right">ملاحظة المعلم(ة)</td>
                      <td colspan="4" className="p-2 border-l border-slate-900 text-slate-400 text-right italic px-4">
                        ..............................................................................................................................
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Exercises List rendering with dynamic inline edits */}
            <div className="space-y-8">
              <div className="print:hidden p-3 bg-indigo-50/55 dark:bg-slate-800/80 rounded-xl border border-indigo-100 dark:border-slate-800 text-right text-xs text-indigo-800 dark:text-indigo-400 font-bold mb-4 flex items-center gap-1.5 shadow-sm">
                <span>💡 <strong>ملاحظة للأستاذ:</strong> يمكنك تعديل نص التمارين والأسئلة ودرجة النقاط مباشرة من هذه الورقة قبل الطباعة للحصول على تخصيص كامل!</span>
              </div>

              {generatedExam.exercises.map((ex: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-300 pb-1.5">
                    <input
                      type="text"
                      value={ex.title}
                      onChange={(e) => handleUpdateExercise(idx, 'title', e.target.value)}
                      className="w-4/5 text-sm font-extrabold text-indigo-950 bg-transparent border-0 border-b border-transparent hover:border-indigo-400 focus:border-indigo-500 focus:bg-slate-50 px-1 py-0.5 rounded outline-none transition-all print:border-none print:p-0 print:bg-transparent"
                    />
                    <div className="flex items-center gap-1 bg-slate-100/60 border border-slate-200 px-2 py-0.5 rounded-full print:border-none print:bg-transparent print:p-0">
                      <span className="text-[10px] text-slate-400 font-semibold print:hidden">النقاط:</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={ex.points}
                        onChange={(e) => handleUpdateExercise(idx, 'points', e.target.value)}
                        className="w-7 text-center text-xs font-bold text-slate-700 bg-transparent border-none p-0 outline-none focus:ring-0"
                      />
                      <span className="text-xs font-bold text-slate-500">ن</span>
                    </div>
                  </div>
                  
                  <textarea
                    rows={2}
                    value={ex.question}
                    onChange={(e) => handleUpdateExercise(idx, 'question', e.target.value)}
                    className="w-full text-sm leading-relaxed text-slate-800 bg-transparent border-0 border-b border-transparent hover:border-indigo-400 focus:border-indigo-500 focus:bg-slate-50 px-1 py-1 rounded outline-none transition-all resize-y select-all print:border-none print:p-0 print:bg-transparent print:resize-none overflow-hidden"
                  />

                  {/* Dotted areas for response */}
                  <div className="space-y-4 pt-2">
                    <p className="text-slate-300 font-mono text-xs select-none">
                      ..........................................................................................................................................................................................
                    </p>
                    <p className="text-slate-300 font-mono text-xs select-none">
                      ..........................................................................................................................................................................................
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cute footer message */}
            <div className="mt-14 pt-6 border-t border-slate-300 text-center text-xs text-slate-400 space-y-1">
              <p>🍀 بالتوفيق والنجاح الدائم لمستقبل تونس الزاهر 🍀</p>
              <p className="text-[10px] text-slate-300 font-mono">توليد تلقائي احترافي عبر منصة أدوات التميز (شبكة مسار التميز التعليمية)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
