import { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Search,
  GraduationCap,
  BookOpen,
  Video,
  Wrench,
  Award,
  Globe,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Layers,
  ArrowRight,
  School,
  Clock
} from 'lucide-react';
import { ArchivedResource } from '../types';

interface ArchivedLinksViewProps {
  onOpenInternalTool?: (toolId: string) => void;
  brandTheme?: 'blue' | 'red';
}

export default function ArchivedLinksView({ onOpenInternalTool, brandTheme = 'blue' }: ArchivedLinksViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'exams' | 'academy' | 'books' | 'tools' | 'videos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isBlue = brandTheme === 'blue';

  const resources: ArchivedResource[] = [
    {
      id: 'masar-main',
      title: 'البوابة المركزية لمسار التميز — الفروض والدروس',
      category: 'exams',
      targetAudience: 'الابتدائي • الإعدادي • الثانوي • الباكالوريا',
      description: 'المنصة التعليمية المركزية الشاملة لجميع المراحل المدرسية التونسية. تحتوي على دروس مفصلة، ملخصات، وفروض مراقبة وتأليفية مع الإصلاح الدقيق للثلاثيات 1، 2، و3.',
      url: 'https://masartamayoz.com',
      badge: 'المنصة الأم 🇹🇳',
      features: [
        'فروض مراقبة وفروض تأليفية مفهرسة لجميع المواد',
        'مواضيع امتحانات مع الإصلاح النموذجي وسلم التنقيط',
        'تغطية شاملة لمناهج وزارة التربية التونسية الرسمية'
      ],
      isExternal: true
    },
    {
      id: 'masar-academy',
      title: 'أكاديمية مسار التميز — الحصص التفاعلية وفضاء الأولياء',
      category: 'academy',
      targetAudience: 'التلاميذ وأولياء الأمور • جميع المستويات',
      description: 'المنصة الرقمية المتخصصة في التعليم التفاعلي عن بعد عبر Google Meet مع نخبة من الأساتذة، بالإضافة إلى فضاء متابعة الأولياء لمتابعة نتائج وأداء الأبناء.',
      url: 'https://academy.masartamayoz.com',
      badge: 'حصص مباشرة 💻',
      features: [
        'دروس دعم ومراجعة دورية مباشرة عبر Google Meet',
        'فضاء خاص لأولياء الأمور لمتابعة الحصص والتقييمات',
        'عروض اشتراك سنوية وثلاثية مناسبة للعائلة التونسية'
      ],
      isExternal: true
    },
    {
      id: 'concours-6eme',
      title: 'أرشيف مناظرة الدخول للإعداديات النموذجية (السيزيام 6ème)',
      category: 'exams',
      targetAudience: 'السنة السادسة أساسي • مناظرة السيزيام',
      description: 'أرشيف متكامل لاختبارات مناظرة الالتحاق بالمعاهد النموذجية في الحساب والرياضيات، الإيقاظ العلمي، واللغات مع الإصلاح المفصل والتمارين التأهيلية.',
      url: 'https://masartamayoz.com',
      badge: 'مناظرة وطنية 🌟',
      features: [
        'إصلاح شامل لمناظرات السيزيام للسنوات السابقة',
        'مسائل حسابية وهندسية نموذجية مع استراتيجيات الحل',
        'اختبارات تجريبية ثلاثية تحاكي ظروف المناظرة الرسمية'
      ],
      isExternal: true,
      internalToolId: 'exam-generator'
    },
    {
      id: 'concours-9eme',
      title: 'أرشيف مناظرة شهادة ختم التعليم الأساسي (النوفيام 9ème)',
      category: 'exams',
      targetAudience: 'السنة التاسعة أساسي • مناظرة النوفيام',
      description: 'بنك شامل لمناظرات ختم التعليم الأساسي العام والتقني في الرياضيات، العلوم الفيزيائية، الإنشاء العربي، والفرنسية مع مقاييس الإصلاح الرسمية.',
      url: 'https://masartamayoz.com',
      badge: 'النوفيام تونس 📐',
      features: [
        'مواضيع المناظرة الوطنية الرسمية مع مقاييس الإصلاح',
        'فروض تأليفية نموذجية للثلاثي الأول، الثاني والثالث',
        'ملخصات شاملة لقواعد الجبر والهندسة والفيزياء'
      ],
      isExternal: true,
      internalToolId: 'exam-generator'
    },
    {
      id: 'bac-tunisie',
      title: 'أرشيف امتحانات البكالوريا التونسية (جميع الشعب)',
      category: 'exams',
      targetAudience: 'الرابعة ثانوي • جميع شعب الباكالوريا',
      description: 'أرشيف رسمي لمواضيع الدورة الرئيسية ودورة المراقبة للباكالوريا التونسية: شعب الرياضيات، العلوم التجريبية، العلوم التقنية، الاقتصاد والتصرف، الآداب، والإعلامية.',
      url: 'https://masartamayoz.com',
      badge: 'البكالوريا الرسمية 🎓',
      features: [
        'مواضيع البكالوريا الرسمية لدورات المراقبة والرئيسية',
        'إصلاحات نموذجية معتمدة من متفقدي وزارة التربية',
        'فروض تأليفية تمهيدية مقترحة من المعاهد النموذجية'
      ],
      isExternal: true
    },
    {
      id: 'parallel-books',
      title: 'سلسلة الكتب المدرسية الموازية والملخصات المعمقة',
      category: 'books',
      targetAudience: 'الأساتذة والتلاميذ • جميع الشعب',
      description: 'سلسلة مسار التميز للكتب الموازية التي تضم مئات التمارين التدرجية، بحوثاً علمية ولغوية باللغتين العربية والفرنسية، وأنشطة تطبيقية مساعدة.',
      url: 'https://masartamayoz.com',
      badge: 'كتب وبحوث 📖',
      features: [
        'ملخصات منهجية مبوبة لدروس الرياضيات والعلوم واللغات',
        'تمارين تطبيقية متدرجة من الاستيعاب إلى التميز',
        'كتب مساعدة باللغتين العربية والفرنسية للتحضير المستمر'
      ],
      isExternal: true,
      internalToolId: 'pdf-stamp'
    },
    {
      id: 'smart-tools',
      title: 'منصة أدوات الويب الذكية — أدوات مسار التميز',
      category: 'tools',
      targetAudience: 'الأساتذة • التلاميذ • الأولياء',
      description: 'الأدوات الرقمية السريعة والآمنة 100%: تحويل الصور لـ PDF، ضغط PDF حتى 25 ملفاً، تحويل PDF لصور عالية الدقة، تخصيص وختم الفروض، وأدوات الرياضيات.',
      url: 'https://tools.masartamayoz.com/index.html',
      badge: 'أدوات الويب ⚡',
      features: [
        'معالجة محلية داخل المتصفح بأقصى سرعة وأمان تام',
        'دعم دفعات الملفات الكبيرة (حتى 25 ملفاً في وقت واحد)',
        'تخصيص كامل للفروض المدرسية مع العلامات المائية والأختام'
      ],
      isExternal: false,
      internalToolId: 'pdf-stamp'
    },
    {
      id: 'youtube-channel',
      title: 'قناة مسار التميز الرسمية على YouTube',
      category: 'videos',
      targetAudience: 'تلاميذ التعليم الأساسي والثانوي',
      description: 'مكتبة مرئية غنية بمئات مقاطع الفيديو التعليمية المجانية، شروحات مفصلة للدروس، وحلول نموذجية خطوة بخطوة لأصعب التمارين والامتحانات الوطنية.',
      url: 'https://www.youtube.com/@masartamayoz',
      badge: 'فيديوهات مرئية 📺',
      features: [
        'شروحات صوت وصورة للدروس الصعبة والمفاهيم المعقدة',
        'إصلاح حي وتفاعلي لنماذج فروض المراقبة والتأليفية',
        'نصائح منهجية لكيفية إدارة وقت الامتحان والمناظرة'
      ],
      isExternal: true
    }
  ];

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const filteredResources = resources.filter((res) => {
    const matchesFilter = activeFilter === 'all' || res.category === activeFilter;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir="rtl">
      {/* Top Hero Banner */}
      <div className={`bg-gradient-to-br ${isBlue ? 'from-indigo-700 via-indigo-800 to-sky-900' : 'from-rose-700 via-rose-800 to-red-900'} text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white border border-white/15">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>الدليل المرجعي والأرشيف الشامل لمنظومة مسار التميز</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            بوابة الأرشيف والروابط المعتمدة لمسار التميز
          </h1>

          <p className="text-xs md:text-sm text-slate-100 font-semibold leading-relaxed opacity-95">
            تم تفعيل وتوثيق كافة الروابط الرسمية المؤرشفة التي تم العمل عليها لتسهيل الوصول المباشر والشفاف إلى بنك الفروض والامتحانات، الأكاديمية التفاعلية، الكتب الموازية، وقنوات التدريب المرئي.
          </p>

          {/* Quick Search */}
          <div className="pt-2">
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-white/20 overflow-hidden flex items-center px-4 max-w-xl">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الأرشيف (مثال: سيزيام، باكالوريا، أكاديمية، يوتيوب...)"
                className="w-full bg-transparent border-0 px-3 py-3 text-slate-800 dark:text-white placeholder-slate-400 text-xs font-bold focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-rose-500 hover:underline font-bold cursor-pointer"
                >
                  مسح
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? isBlue ? 'bg-indigo-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            الكل ({resources.length})
          </button>
          <button
            onClick={() => setActiveFilter('exams')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'exams'
                ? isBlue ? 'bg-indigo-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📝 الفروض والمناظرات
          </button>
          <button
            onClick={() => setActiveFilter('academy')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'academy'
                ? isBlue ? 'bg-indigo-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🎓 الأكاديمية والدعم
          </button>
          <button
            onClick={() => setActiveFilter('books')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'books'
                ? isBlue ? 'bg-indigo-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📖 الكتب الموازية
          </button>
          <button
            onClick={() => setActiveFilter('tools')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'tools'
                ? isBlue ? 'bg-indigo-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🛠️ أدوات الويب الذكية
          </button>
          <button
            onClick={() => setActiveFilter('videos')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'videos'
                ? isBlue ? 'bg-indigo-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📺 القناة المرئية
          </button>
        </div>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          تم العثور على {filteredResources.length} رابط معتمد ومفعل
        </span>
      </div>

      {/* Grid of Verified Links & Resources */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
          <p className="font-bold text-slate-600 dark:text-slate-400 text-sm">
            لا توجد روابط تطابق كلمة البحث الحالية "{searchQuery}".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
          >
            إعادة تعيين البحث واستعراض جميع الروابط
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-2xl ${
                      item.category === 'exams'
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : item.category === 'academy'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        : item.category === 'books'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : item.category === 'videos'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                        : 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                    }`}>
                      {item.category === 'exams' && <GraduationCap className="w-5 h-5" />}
                      {item.category === 'academy' && <Award className="w-5 h-5" />}
                      {item.category === 'books' && <BookOpen className="w-5 h-5" />}
                      {item.category === 'videos' && <Video className="w-5 h-5" />}
                      {item.category === 'tools' && <Wrench className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                        الفئة المستهدفة: {item.targetAudience}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  {item.description}
                </p>

                {/* Feature bullets */}
                <div className="bg-slate-50 dark:bg-slate-950/30 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-1.5">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Transparent Link & Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* Transparent URL display pill */}
                <div className="flex items-center justify-between gap-2 p-2 bg-slate-100/80 dark:bg-slate-950/60 rounded-xl text-[11px] font-mono text-slate-600 dark:text-slate-450 border border-slate-200/60 dark:border-slate-800">
                  <span className="truncate max-w-[260px] dir-ltr text-left font-semibold text-slate-700 dark:text-slate-300">
                    {item.url}
                  </span>
                  <button
                    onClick={() => handleCopyLink(item.url, item.id)}
                    className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                    title="نسخ الرابط"
                  >
                    {copiedId === item.id ? (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <Check className="w-3.5 h-3.5" /> تم النسخ!
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <span>زيارة الرابط المعتمد</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {item.internalToolId && onOpenInternalTool && (
                    <button
                      onClick={() => onOpenInternalTool(item.internalToolId!)}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>تشغيل الأداة في المنصة</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assurance banner */}
      <div className="p-5 bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-black text-slate-900 dark:text-white">شفافية وأمان الروابط المعتمدة</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              كافة الروابط المذكورة تتبع النطاقات والمجالات الرسمية لشبكة مسار التميز التونسية ومحمية ببروتوكولات الأمان SSL/TLS.
            </p>
          </div>
        </div>

        <a
          href="https://masartamayoz.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-700 dark:text-indigo-300 font-bold hover:shadow transition-all text-xs flex items-center gap-1.5 flex-shrink-0"
        >
          <span>زيارة مسار التميز الرسمي</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
