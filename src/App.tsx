import { useState } from 'react';
import { CategoryId, Tool } from './types';
import { Navbar } from './components/Navbar';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import Logo from './components/Logo';

// Subtools
import ImageToPdfTool from './components/ImageToPdfTool';
import CompressImageTool from './components/CompressImageTool';
import MergeSplitPdfTool from './components/MergeSplitPdfTool';
import PdfToImagesTool from './components/PdfToImagesTool';
import CompressPdfTool from './components/CompressPdfTool';
import MathTools from './components/MathTools';
import ExamGeneratorTool from './components/ExamGeneratorTool';
import PdfStampTool from './components/PdfStampTool';
import ResizeImageTool from './components/ResizeImageTool';
import RemoveBgTool from './components/RemoveBgTool';

import {
  FileText,
  Minimize2,
  Layers,
  Scissors,
  FileImage,
  BookOpen,
  GraduationCap,
  Sparkles,
  Scale,
  User,
  Search,
  ArrowRight,
  Info,
  ShieldAlert,
  MapPin,
  Mail,
  Instagram,
  Heart,
  Paintbrush,
  Stamp,
  ExternalLink,
  BookMarked,
  Video,
  Award
} from 'lucide-react';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<CategoryId>('all');
  const [view, setView] = useState<'home' | 'about'>('home');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [brandTheme, setBrandTheme] = useState<'blue' | 'red'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('brand_theme') as 'blue' | 'red') || 'blue';
    }
    return 'blue';
  });

  const handleSetBrandTheme = (theme: 'blue' | 'red') => {
    setBrandTheme(theme);
    localStorage.setItem('brand_theme', theme);
  };

  const isBlue = brandTheme === 'blue';
  
  // Theme styling helpers that automatically adapt the UI style cleanly!
  const themeAccent = isBlue ? 'sky' : 'rose';
  const themeColor = isBlue ? 'indigo' : 'rose';
  
  // Custom theme mappings for specific classes
  const styles = {
    bgGradient: isBlue 
      ? 'from-sky-600 via-indigo-600 to-indigo-800 dark:from-sky-950/40 dark:via-indigo-950/20 dark:to-slate-950' 
      : 'from-rose-600 via-rose-700 to-red-800 dark:from-rose-950/40 dark:via-rose-950/20 dark:to-slate-950',
    bannerBadge: isBlue ? 'bg-white/10 dark:bg-sky-950/50' : 'bg-white/10 dark:bg-rose-950/50',
    primaryText: isBlue ? 'text-indigo-600 dark:text-sky-400' : 'text-rose-655 dark:text-rose-400',
    hoverText: isBlue ? 'hover:text-indigo-600 dark:hover:text-sky-400' : 'hover:text-rose-600 dark:hover:text-rose-400',
    hoverBorder: isBlue ? 'hover:border-sky-500/80 dark:hover:border-sky-450' : 'hover:border-rose-500/80 dark:hover:border-rose-450',
    iconBgActive: isBlue ? 'group-hover:bg-indigo-600' : 'group-hover:bg-rose-600',
    iconBgLight: isBlue ? 'bg-indigo-50 dark:bg-sky-950/30' : 'bg-rose-50 dark:bg-rose-950/30',
    categoryActiveBg: isBlue ? 'bg-white dark:bg-sky-950 text-indigo-600 dark:text-sky-450 shadow-sm' : 'bg-white dark:bg-rose-950 text-rose-600 dark:text-rose-450 shadow-sm',
    badgeBg: isBlue ? 'bg-slate-100 dark:bg-slate-850 text-indigo-755 dark:text-sky-305 px-2.5 py-1 rounded-full font-black border border-slate-200/60 dark:border-sky-900/60' : 'bg-slate-100 dark:bg-slate-850 text-rose-755 dark:text-rose-305 px-2.5 py-1 rounded-full font-black border border-slate-200/60 dark:border-rose-900/60',
  };

  const toolCatalog: Tool[] = [
    {
      id: 'image-to-pdf',
      title: 'تحويل الصور إلى PDF',
      description: 'حوّل صور الواجبات أو الكراسات والمستندات إلى ملف PDF احترافي مع إمكانية ترتيب الصفحات بسهولة تامة.',
      category: 'pdf',
      icon: 'FileText',
      badge: 'الأكثر شعبية 🔥',
    },
    {
      id: 'compress-image',
      title: 'ضغط ومعالجة الصور',
      description: 'قلل من حجم صور الفروض المنزلية دون فقدان الجودة لتمر في منصات التدريس بأقل سعة إنترنت.',
      category: 'image',
      icon: 'Minimize2',
      badge: 'موفّر المساحة ⚡',
    },
    {
      id: 'merge-pdf',
      title: 'دمج وتقسيم ملفات PDF',
      description: 'ادمج عدة كراسات أو فصليّات في مستند موحد، أو قسّم واقتطع الفصول المحددة بدقة تامة.',
      category: 'pdf',
      icon: 'Layers',
      badge: 'تنظيم المستندات 📁',
    },
    {
      id: 'compress-pdf',
      title: 'ضغط وتصغير حجم PDF',
      description: 'صغّر حجم مستنداتك المدرسية على 3 مستويات مع دعم حتى 25 ملفاً دفعة واحدة وحساب الحجم والنسبة فوراً.',
      category: 'pdf',
      icon: 'Minimize2',
      badge: 'دفعة 25 ملف ⚡',
    },
    {
      id: 'pdf-to-images',
      title: 'تحويل PDF إلى صور JPG/PNG',
      description: 'حوّل صفحات ملفات الـ PDF أو الامتحانات إلى صور مستقلة عالية الدقة مع دعم حتى 25 ملفاً دفعة واحدة.',
      category: 'pdf',
      icon: 'FileImage',
      badge: 'دفعة 25 ملف 🖼️',
    },
    {
      id: 'math-tools',
      title: 'أدوات الرياضيات التفاعلية',
      description: 'جدول الضرب التفاعلي، حساب الأشكال والمجسمات الهندسية، تحويل المعايير، ورسام محاكاة المعادلات.',
      category: 'math',
      icon: 'BookOpen',
      badge: 'رياضيات ذكية 📐',
    },
    {
      id: 'exam-generator',
      title: 'إنشاء الفروض والامتحانات تونس',
      description: 'أنشئ فوراً فروض مراقبة وتأليف نموذجية حسب موضوع ومقترح التدريس المدرسي الرسمي تونس لتطبعها للتلاميذ.',
      category: 'exam',
      icon: 'GraduationCap',
      badge: 'جديد ومقترح ✏️',
    },
    {
      id: 'pdf-stamp',
      title: 'تخصيص ملفات PDF والعلامة المائية',
      description: 'استورد ملفك من الحاسوب، أضف علامات مائية نصية، أختاماً وتوقيعات وشعارات، ترقيم صفحات تلقائي، وترويسة رسمية.',
      category: 'pdf',
      icon: 'Stamp',
      badge: 'محدّث ومطور 🌟',
    },
    {
      id: 'resize-image',
      title: 'تغيير حجم ومقاس الصورة',
      description: 'غيّر أبعاد صور الملخصات والوثائق بدقة تامة بالبكسل مع قوالب جاهزة متوافقة مع الأنظمة المدرسية.',
      category: 'image',
      icon: 'Scale',
      badge: 'ضبط الحجم 📏',
    },
    {
      id: 'remove-bg',
      title: 'إزالة وعزل خلفيات الصور',
      description: 'اجعل خلفيات صور التلاميذ شفافة أو غيّر لونها للون الأبيض أو الأزرق المعتمد للبطاقات المدرسية والمناظرات.',
      category: 'image',
      icon: 'User',
      badge: 'عزل شفّاف ✂️',
    },
  ];

  // Map icon strings to React elements
  const renderIcon = (iconName: string) => {
    const props = { className: `h-6 w-6 ${isBlue ? 'text-indigo-600 dark:text-sky-400' : 'text-rose-600 dark:text-rose-450'}` };
    switch (iconName) {
      case 'FileText':
        return <FileText {...props} />;
      case 'Minimize2':
        return <Minimize2 {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'FileImage':
        return <FileImage {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'GraduationCap':
        return <GraduationCap {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Scale':
        return <Scale {...props} />;
      case 'User':
        return <User {...props} />;
      case 'Stamp':
        return <Stamp {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  // Filters logic
  const filteredTools = toolCatalog.filter((t) => {
    const matchesCategory =
      currentCategory === 'all' || t.category === currentCategory;
    const matchesSearch =
      t.title.includes(searchQuery) || t.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const selectCategory = (cat: CategoryId) => {
    setView('home');
    setActiveToolId(null);
    setCurrentCategory(cat);
  };

  const getActiveToolComponent = () => {
    switch (activeToolId) {
      case 'image-to-pdf':
        return <ImageToPdfTool />;
      case 'compress-image':
        return <CompressImageTool />;
      case 'merge-pdf':
        return <MergeSplitPdfTool />;
      case 'compress-pdf':
        return <CompressPdfTool />;
      case 'pdf-to-images':
        return <PdfToImagesTool />;
      case 'math-tools':
        return <MathTools />;
      case 'exam-generator':
        return <ExamGeneratorTool />;
      case 'pdf-stamp':
        return <PdfStampTool />;
      case 'resize-image':
        return <ResizeImageTool />;
      case 'remove-bg':
        return <RemoveBgTool />;
      default:
        return null;
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans" dir="rtl">
      {/* Dynamic Nav Header */}
      <Navbar
        currentCategory={currentCategory}
        setCurrentCategory={selectCategory}
        view={view}
        setView={setView}
        brandTheme={brandTheme}
        setBrandTheme={handleSetBrandTheme}
      />

      {/* Main Body content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {view === 'about' ? (
          <AboutView />
        ) : currentCategory === 'contact' ? (
          <ContactView />
        ) : activeToolId ? (
          /* Single active tool page */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-205/60 dark:border-slate-800/80 rounded-2xl py-3.5 px-5 shadow-sm">
              <button
                onClick={() => setActiveToolId(null)}
                className={`text-sm font-bold text-slate-600 ${styles.hoverText} transition-colors flex items-center gap-1.5 cursor-pointer`}
              >
                ← العودة إلى قائمة الأدوات والمنصة الرئيسية
              </button>
              <div className={`text-xs font-black ${styles.primaryText}`}>
                {brandTheme === 'blue' ? 'منصة أدوات التميز • معالجة محلية آمنة 🔒' : 'مسار التميز النموذجي • حماية كاملة للتلميذ 🔒'}
              </div>
            </div>
            {getActiveToolComponent()}
          </div>
        ) : (
          /* Hub view (catalogs & lists) */
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Elegant Hero Banner - with high professionalism and dynamic graphics */}
            <div className={`bg-gradient-to-br ${styles.bgGradient} text-white rounded-[2.5rem] p-8 md:p-12 text-center shadow-xl relative overflow-hidden transition-all duration-500`}>
              {/* Grid abstract overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              <div className="relative z-10 space-y-6 max-w-3xl mx-auto flex flex-col items-center">
                {/* Center stage Logo displaying official visual identity beautifully */}
                <div className="bg-white/95 dark:bg-slate-900/90 p-5 rounded-[2rem] shadow-2xl border border-white/20 hover:scale-[1.03] transition-transform duration-300">
                  <Logo variant={brandTheme} size="lg" showText={true} animate={true} />
                </div>

                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${styles.bannerBadge} backdrop-blur-sm text-xs font-bold text-white tracking-wide border border-white/10`}>
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
                  المنصة التعليمية الشاملة رقم #1 لمسيرة التميز والتعليم الحديث
                </span>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  بوابة الـتمـيـّز المدرسية الذكية
                </h1>

                <p className="text-sm md:text-base text-slate-100 leading-relaxed font-semibold max-w-2xl mx-auto opacity-95">
                  حوّل صور واجباتك المدرسية لـ PDF، اضغط وعالج كراساتك، ارسم الرسوم والبيانات الهندسية، وأنشئ فروض و امتحانات ورقية نموذجية لطباعتها مجاناً 100%!
                </p>

                {/* Live Search bar */}
                <div className="w-full max-w-xl mx-auto pt-2">
                  <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/30 overflow-hidden flex items-center px-4">
                    <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن أداة تريد استخدامها (مثال: جدول الضرب، ضغط صور...)"
                      className="w-full bg-transparent border-0 px-3 py-4 text-slate-800 dark:text-white placeholder-slate-400 text-xs md:text-sm font-semibold focus:outline-none"
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

            {/* Quick Stat info segment */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                <span className={`block text-2xl font-black ${styles.primaryText}`}>9+</span>
                <span className="text-xs text-slate-450 dark:text-slate-400 font-bold block mt-1">أدوات ويب ذكية</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                <span className={`block text-2xl font-black ${styles.primaryText}`}>100%</span>
                <span className="text-xs text-slate-450 dark:text-slate-400 font-bold block mt-1">أمان وخصوصية محلية</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                <span className={`block text-2xl font-black ${styles.primaryText}`}>مجاناً</span>
                <span className="text-xs text-slate-450 dark:text-slate-400 font-bold block mt-1">دون اشتراك مادي أو قيود</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                <span className={`block text-2xl font-black ${styles.primaryText}`}>تونس 🇹🇳</span>
                <span className="text-xs text-slate-450 dark:text-slate-400 font-bold block mt-1">بفكر و منهج متميز</span>
              </div>
            </div>

            {/* Hub Filters segment */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  🛠️ تصفح وتفعيل أدوات مسار
                </h2>

                <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800">
                  <button
                    onClick={() => selectCategory('all')}
                    className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentCategory === 'all'
                        ? styles.categoryActiveBg
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => selectCategory('pdf')}
                    className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentCategory === 'pdf'
                        ? styles.categoryActiveBg
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    📄 ملفات ومستندات PDF
                  </button>
                  <button
                    onClick={() => selectCategory('image')}
                    className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentCategory === 'image'
                        ? styles.categoryActiveBg
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    🖼️ صور غرافيك وتصميم
                  </button>
                  <button
                    onClick={() => selectCategory('math')}
                    className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentCategory === 'math'
                        ? styles.categoryActiveBg
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    📐 مواد و رياضيات
                  </button>
                  <button
                    onClick={() => selectCategory('exam')}
                    className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentCategory === 'exam'
                        ? styles.categoryActiveBg
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    📝 فروض وامتحانات
                  </button>
                </div>
              </div>

              {/* Grid bento box segment */}
              {filteredTools.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl">
                  <p className="text-slate-400 dark:text-slate-500 font-semibold text-sm">
                    لم يثبت العثور على أية أدوات تطابق الكلمات المفتاحية لمسعاك المتميز. جرب كلمة أخرى!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveToolId(tool.id);
                      }}
                      className={`group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 ${styles.hoverBorder} hover:shadow-xl hover:-translate-y-1.5 p-6 rounded-3xl transition-all cursor-pointer flex flex-col justify-between shadow-md`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-2xl transition-all ${styles.iconBgLight} ${styles.iconBgActive} group-hover:text-white`}>
                            {renderIcon(tool.icon)}
                          </div>
                          {tool.badge && (
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-black border ${isBlue ? 'bg-sky-50 dark:bg-sky-950/40 text-indigo-700 dark:text-sky-350 border-sky-100 dark:border-sky-900/50' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-350 border-rose-100 dark:border-rose-900/50'}`}>
                              {tool.badge}
                            </span>
                          )}
                        </div>

                        <h3 className={`text-base font-extrabold text-slate-900 dark:text-white tracking-tight ${isBlue ? 'group-hover:text-indigo-650 dark:group-hover:text-sky-400' : 'group-hover:text-rose-650 dark:group-hover:text-rose-400'} transition-colors`}>
                          {tool.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5">
                          {tool.description}
                        </p>
                      </div>

                      <div className={`pt-5 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold ${isBlue ? 'text-indigo-600 dark:text-sky-400' : 'text-rose-600 dark:text-rose-450'}`}>
                        <span>ابدأ تشغيل الأداة</span>
                        <ArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Portal Integration: Modern & Classic Masar Tamayoz Resources Hub */}
            <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏛️</span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      بوابة موارد مسار التميز الأصلية — مسار النجاح المتكامل
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                    دمج متكامل بين أحدث أدوات الويب الذكية والمكتبة البيداغوجية التاريخية لمسار التميز التونسي.
                  </p>
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  من الابتدائي إلى الباكالوريا 🇹🇳
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Resource 1: Exam Bank */}
                <div className="bg-gradient-to-br from-indigo-50/60 to-white dark:from-slate-900 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 rounded-3xl p-5 hover:shadow-lg transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      بنك الفروض والامتحانات الوطنية
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      فروض مراقبة وتأليفية مع الإصلاح الدقيق لمناظرات السادسة، التاسعة، وامتحانات الباكالوريا.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setActiveToolId('exam-generator');
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <span>فتح مولد الفروض والامتحانات</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Resource 2: Textbooks & Parallels */}
                <div className="bg-gradient-to-br from-emerald-50/60 to-white dark:from-slate-900 dark:to-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-5 hover:shadow-lg transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                      <BookMarked className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      الكتب الموازية والملخصات
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      سلسلة مسار التميز للكتب المدرسية الموازية وبحوث وتمارين معمقة باللغتين العربية والفرنسية.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setActiveToolId('pdf-stamp');
                    }}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <span>تخصيص وختم الملخصات PDF</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Resource 3: Online Tutoring & Support */}
                <div className="bg-gradient-to-br from-amber-50/60 to-white dark:from-slate-900 dark:to-slate-900 border border-amber-100 dark:border-slate-800 rounded-3xl p-5 hover:shadow-lg transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      الدعم المدرسي والمراجعة المباشرة
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      حصص خصوصية تفاعلية ومراجعات مباشرة عبر Google Meet مع نخبة من الأساتذة المتميزين.
                    </p>
                  </div>
                  <button
                    onClick={() => selectCategory('contact')}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <span>طلب الدعم والاستفسار</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Resource 4: Official Channel */}
                <div className="bg-gradient-to-br from-rose-50/60 to-white dark:from-slate-900 dark:to-slate-900 border border-rose-100 dark:border-slate-800 rounded-3xl p-5 hover:shadow-lg transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
                      <Video className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      قناة مسار التميز المرئية
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      مقاطع فيديو تعليمية لشرح المفاهيم المعقدة وحلول نموذجية خطوة بخطوة للتمارين والفروض.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setActiveToolId('math-tools');
                    }}
                    className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <span>أدوات الرياضيات التفاعلية</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Decorative Warning Notice Alert about static preview storage boundaries */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full mt-10">
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 rounded-2xl flex flex-col sm:flex-row items-center gap-3.5 text-xs text-center sm:text-right leading-relaxed justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <p className="font-semibold">
              <strong>ضمان الخصوصية الرقمي:</strong> تقتصر معالجة الملفات والامتحانات على محرك الويب بمتصفحك فقط، ولا يتم تخزين أي شيء في سحابة الخادم لحماية التلاميذ والخصوصية المدرسية بالجمهورية التونسية!
            </p>
          </div>
          <button
            onClick={() => selectCategory('contact')}
            className="px-4.5 py-1.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-bold cursor-pointer text-[10px]"
          >
            اقرأ البند والسياسة
          </button>
        </div>
      </div>

      {/* Footer Branding block */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-220 dark:border-slate-800 py-10 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-right text-xs">
            <div>
              <p className="font-extrabold text-slate-800 dark:text-white text-sm">أدوات التميّز المدرسية</p>
              <p className="text-slate-400 mt-1">
                صمم و رتب بأمان. جميع الحقوق لكل تلاميذ ومنسقي المسيرة التعليمية بالجمهورية التونسية محفوظة © {currentYear}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-end text-slate-450 dark:text-slate-400 font-bold">
              <button onClick={() => setView('about')} className="hover:text-indigo-600 transition-colors cursor-pointer">عن مسار</button>
              <button onClick={() => { setView('home'); selectCategory('pdf'); }} className="hover:text-indigo-600 transition-colors cursor-pointer">الملفات</button>
              <button onClick={() => { setView('home'); selectCategory('image'); }} className="hover:text-indigo-600 transition-colors cursor-pointer">الصور</button>
              <button onClick={() => { setView('home'); selectCategory('contact'); }} className="hover:text-indigo-600 transition-colors cursor-pointer">اتصل بنا الدعم</button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 font-semibold">
            <span>صنع بكل</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 animate-pulse fill-rose-500" />
            <span>للتلاميذ والمعلمين وأولياء الأمور — شبكة مسار التميز</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
