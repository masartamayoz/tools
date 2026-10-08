import { useState, useEffect, useMemo, useRef } from 'react';
import { CategoryKey, ToolItem } from './types';
import brand from './data/brand';
import { categories, allTools } from './data/tools';
import { Navbar } from './components/Navbar';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import ArchivedLinksView from './components/ArchivedLinksView';
import UpcomingModal from './components/UpcomingModal';

// Interactive Tool Components
import ImageToPdfTool from './components/ImageToPdfTool';
import CompressImageTool from './components/CompressImageTool';
import MergeSplitPdfTool from './components/MergeSplitPdfTool';
import PdfToImagesTool from './components/PdfToImagesTool';
import CompressPdfTool from './components/CompressPdfTool';
import MathTools from './components/MathTools';
import ExamGeneratorTool from './components/ExamGeneratorTool';
import PdfStampTool from './components/PdfStampTool';
import ResizeImageTool from './components/ResizeImageTool';
import LatexToImageTool from './components/LatexToImageTool';
import WorksheetPrintTool from './components/WorksheetPrintTool';
import NotebookScannerTool from './components/NotebookScannerTool';
import PdfToTextTool from './components/PdfToTextTool';
import ImageConvertTool from './components/ImageConvertTool';

// Icons
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
  Heart,
  Paintbrush,
  Stamp,
  ExternalLink,
  BookMarked,
  Video,
  Award,
  Trash2,
  RotateCw,
  FileSpreadsheet,
  ArrowUpDown,
  Wrench,
  FileUp,
  FileDown,
  Presentation,
  Sheet,
  Globe,
  Type,
  Hash,
  Crop,
  PenTool,
  Lock,
  Unlock,
  EyeOff,
  GitCompare,
  LayoutTemplate,
  Camera,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<CategoryKey>('all');
  const [view, setView] = useState<'home' | 'about'>('home');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingTool, setUpcomingTool] = useState<ToolItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Sync with URL hash for clean permalinks & back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setActiveToolId(null);
        return;
      }

      if (hash === 'about') {
        setView('about');
        setActiveToolId(null);
        return;
      }

      if (hash === 'archive') {
        setView('home');
        setCurrentCategory('archive');
        setActiveToolId(null);
        return;
      }

      // Check if hash matches a tool slug
      const foundTool = allTools.find(
        (t) => t.slug.replace(/^\//, '') === hash || t.id === hash
      );
      if (foundTool) {
        setView('home');
        if (foundTool.isUpcoming) {
          setUpcomingTool(foundTool);
        } else {
          setActiveToolId(foundTool.id);
        }
        return;
      }

      // Check if hash matches a category slug
      const foundCat = categories.find(
        (c) => c.slug.replace(/^\//, '') === hash || c.id === hash
      );
      if (foundCat) {
        setView('home');
        setCurrentCategory(foundCat.id);
        setActiveToolId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update document title following brand guidelines
  useEffect(() => {
    if (activeToolId) {
      const tool = allTools.find((t) => t.id === activeToolId);
      document.title = brand.getPageTitle(tool ? tool.title : undefined);
    } else if (currentCategory === 'archive') {
      document.title = brand.getPageTitle('أرشيف وروابط مسار المعتمدة');
    } else if (view === 'about') {
      document.title = brand.getPageTitle('عن المنصة');
    } else {
      document.title = `${brand.arabicName} | ${brand.descriptor}`;
    }
  }, [activeToolId, currentCategory, view]);

  // Navigate to tool and update hash cleanly
  const openTool = (tool: ToolItem) => {
    if (tool.isUpcoming) {
      setUpcomingTool(tool);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveToolId(tool.id);
    window.location.hash = tool.slug.replace(/^\//, '');
  };

  const closeTool = () => {
    setActiveToolId(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCategory = (cat: CategoryKey) => {
    setView('home');
    setActiveToolId(null);
    setCurrentCategory(cat);
    if (cat === 'all') {
      window.location.hash = '';
    } else if (cat === 'archive') {
      window.location.hash = 'archive';
    } else {
      const found = categories.find((c) => c.id === cat);
      if (found) {
        window.location.hash = found.slug.replace(/^\//, '');
      }
    }
  };

  // Icon renderer mapping
  const renderIcon = (iconName: string) => {
    const props = { className: 'h-6 w-6' };
    switch (iconName) {
      case 'Layers':
        return <Layers {...props} />;
      case 'Scissors':
        return <Scissors {...props} />;
      case 'Trash2':
        return <Trash2 {...props} />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet {...props} />;
      case 'ArrowUpDown':
        return <ArrowUpDown {...props} />;
      case 'RotateCw':
        return <RotateCw {...props} />;
      case 'Minimize2':
        return <Minimize2 {...props} />;
      case 'Wrench':
        return <Wrench {...props} />;
      case 'Search':
        return <Search {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'FileUp':
        return <FileUp {...props} />;
      case 'FileDown':
        return <FileDown {...props} />;
      case 'Presentation':
        return <Presentation {...props} />;
      case 'Sheet':
        return <Sheet {...props} />;
      case 'Globe':
        return <Globe {...props} />;
      case 'FileImage':
        return <FileImage {...props} />;
      case 'Type':
        return <Type {...props} />;
      case 'Stamp':
        return <Stamp {...props} />;
      case 'Hash':
        return <Hash {...props} />;
      case 'Crop':
        return <Crop {...props} />;
      case 'Info':
        return <Info {...props} />;
      case 'PenTool':
        return <PenTool {...props} />;
      case 'Lock':
        return <Lock {...props} />;
      case 'Unlock':
        return <Unlock {...props} />;
      case 'EyeOff':
        return <EyeOff {...props} />;
      case 'GitCompare':
        return <GitCompare {...props} />;
      case 'Scale':
        return <Scale {...props} />;
      case 'User':
        return <User {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'LayoutTemplate':
        return <LayoutTemplate {...props} />;
      case 'Camera':
        return <Camera {...props} />;
      case 'GraduationCap':
        return <GraduationCap {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  // Filter tools by category and search
  const filteredTools = useMemo(() => {
    return allTools.filter((t) => {
      const matchesCategory =
        currentCategory === 'all' || t.category === currentCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        (t.keywords && t.keywords.some((k) => k.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });
  }, [currentCategory, searchQuery]);

  // Current active tool component
  const renderActiveToolComponent = () => {
    switch (activeToolId) {
      case 'image-to-pdf':
        return <ImageToPdfTool />;
      case 'compress-image':
        return <CompressImageTool />;
      case 'merge-pdf':
      case 'split-pdf':
      case 'remove-pages':
      case 'extract-pages':
      case 'reorder-pdf':
      case 'rotate-pdf':
        return <MergeSplitPdfTool />;
      case 'compress-pdf':
        return <CompressPdfTool />;
      case 'pdf-to-images':
        return <PdfToImagesTool />;
      case 'pdf-to-text':
        return <PdfToTextTool />;
      case 'pdf-stamp':
      case 'page-numbers':
      case 'crop-pdf':
      case 'pdf-metadata':
      case 'sign-pdf':
        return <PdfStampTool />;
      case 'resize-image':
        return <ResizeImageTool />;
      case 'crop-rotate-image':
      case 'watermark-image':
      case 'ocr-image':
        return <ResizeImageTool />;
      case 'convert-image':
        return <ImageConvertTool />;
      case 'latex-to-image':
        return <LatexToImageTool />;
      case 'worksheet-print':
        return <WorksheetPrintTool />;
      case 'notebook-scanner':
        return <NotebookScannerTool />;
      case 'exam-generator':
        return <ExamGeneratorTool />;
      case 'math-tools':
        return <MathTools />;
      default:
        return null;
    }
  };

  const currentToolItem = allTools.find((t) => t.id === activeToolId);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300"
    >
      {/* Navbar with brand identity */}
      <Navbar
        currentCategory={currentCategory}
        setCurrentCategory={selectCategory}
        view={view}
        setView={setView}
        brandTheme={brandTheme}
        setBrandTheme={handleSetBrandTheme}
        onSearchClick={() => {
          setView('home');
          setActiveToolId(null);
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* VIEW: About */}
        {view === 'about' ? (
          <AboutView brandTheme={brandTheme} />
        ) : activeToolId ? (
          /* VIEW: Active Tool Running */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Breadcrumb Navigation */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-5 py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                <button
                  onClick={closeTool}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  الرئيسية
                </button>
                <span>/</span>
                <span className="text-slate-900 dark:text-white font-black">
                  {currentToolItem?.title || 'الأداة'}
                </span>
                {currentToolItem?.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold ms-1">
                    {currentToolItem.badge}
                  </span>
                )}
              </div>

              <button
                onClick={closeTool}
                className="py-1.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>العودة لكافة الأدوات</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Active Tool Body */}
            {renderActiveToolComponent()}
          </div>
        ) : currentCategory === 'archive' ? (
          /* VIEW: Archived Links & Resources Portal */
          <ArchivedLinksView
            brandTheme={brandTheme}
            onOpenInternalTool={(toolId) => {
              const tool = allTools.find((t) => t.id === toolId);
              if (tool) openTool(tool);
            }}
          />
        ) : (
          /* VIEW: Homepage & Tools Bento Grid */
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Hero Section */}
            <div
              className={`rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden bg-gradient-to-br ${
                isBlue
                  ? 'from-sky-700 via-indigo-800 to-slate-900'
                  : 'from-rose-700 via-rose-800 to-slate-900'
              }`}
            >
              {/* Background decorative grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

              <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm font-bold text-white border border-white/20">
                  <Sparkles className="h-4 w-4 text-amber-300 flex-shrink-0" />
                  <span>{brand.descriptor} — شبكة {brand.parentNetworkName}</span>
                </div>

                {/* H1 strictly adheres to designated dimension: 28px mobile -> 44px desktop with leading 1.4 */}
                <h1 className="text-[26px] min-[380px]:text-[28px] sm:text-[34px] md:text-[38px] lg:text-[44px] font-black tracking-normal leading-[1.35] sm:leading-[1.4] max-w-3xl break-words">
                  كل ما تحتاجه لملفات PDF والصور المدرسية في مكان واحد
                </h1>

                {/* Body paragraph adheres to: 16 -> 17px, line-height 1.8, max ~65 characters */}
                <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-slate-100 font-medium leading-[1.8] max-w-2xl break-words">
                  حوّل صور الكراسات إلى PDF، صغّر حجم الفروض المنزلية حتى 25 ملفاً دفعة واحدة، اكتب معادلات LaTeX، وخصص الامتحانات مع ضمان الخصوصية التامة: <strong className="text-white underline decoration-amber-400 decoration-2 underline-offset-4">ملفاتك لا تغادر جهازك أبداً</strong>.
                </p>

                {/* Instant Search Bar */}
                <div className="pt-2">
                  <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-white/20 overflow-hidden flex items-center px-4 max-w-2xl">
                    <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث في 40+ أداة (مثال: دمج، ضغط 25 ملف، LaTeX، صور إلى PDF، وورد...)"
                      className="w-full bg-transparent border-0 px-4 py-3.5 sm:py-4 text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base font-bold focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Trust & Privacy Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    ملفاتك لا تغادر جهازك
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    معالجة داخلية 100% دون أي رفع لسيرفرات خارجية
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    موجّهة للتلاميذ والأساتذة
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    أدوات مخصصة للفروض، الكراسات، وسلاسل التمارين
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    دفعات حتى 25 ملفاً مجاناً
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    ضغط وتحويل سريع دون أي قيود على عدد الصفحات
                  </p>
                </div>
              </div>
            </div>

            {/* Horizontal Filter Chips Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] sm:text-[24px] lg:text-[28px] font-black text-slate-900 dark:text-white flex items-center gap-2.5 leading-[1.35]">
                  <span className="text-2xl">🛠️</span>
                  <span>تصفح أدوات التميز حسب الفئة:</span>
                </h2>
                <span className="text-xs sm:text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-850 px-3 py-1 rounded-full">
                  {filteredTools.length} أداة متاحة
                </span>
              </div>

              {/* Scrollable Chips with snap */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                <button
                  onClick={() => selectCategory('all')}
                  className={`py-2.5 px-5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap snap-start cursor-pointer min-h-[44px] ${
                    currentCategory === 'all'
                      ? 'bg-indigo-600 text-white shadow-md font-black'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  الكل ({allTools.length})
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.id)}
                    className={`py-2.5 px-5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap snap-start cursor-pointer flex items-center gap-2 min-h-[44px] ${
                      currentCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-md font-black'
                        : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.id === 'edu' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-black">
                        حصري
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={() => selectCategory('archive')}
                  className="py-2.5 px-5 rounded-2xl text-sm font-black whitespace-nowrap snap-start cursor-pointer flex items-center gap-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 min-h-[44px]"
                >
                  <span>🏛️ أرشيف وروابط مسار</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black">
                    مفعّل ↗
                  </span>
                </button>
              </div>
            </div>

            {/* Tools Bento Grid (1 col mobile, 2-3 col tablet, 4 col desktop) */}
            {filteredTools.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3">
                <p className="font-bold text-slate-700 dark:text-slate-300 text-base">
                  لم يتم العثور على أية أدوات تطابق كلمة البحث "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentCategory('all');
                  }}
                  className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  إعادة ضبط البحث واستعراض جميع الأدوات
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => openTool(tool)}
                    className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Top icon and badge row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {renderIcon(tool.icon)}
                        </div>

                        {tool.badge && (
                          <span
                            className={`text-[11px] font-black px-3 py-1 rounded-full border ${
                              tool.isUpcoming
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-750 dark:text-slate-250 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      {/* Tool Title */}
                      <h3 className="font-black text-[17px] sm:text-[18px] md:text-[20px] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-[1.4] break-words line-clamp-2">
                        {tool.title}
                      </h3>

                      {/* Tool Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-medium">
                        {tool.description}
                      </p>
                    </div>

                    {/* Bottom action trigger */}
                    <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      <span>{tool.isUpcoming ? 'عرض التفاصيل' : 'فتح وتجربة الأداة'}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Integrated Masar Tamayoz Hub Section (دمج القديم بالجديد) */}
            <div className="pt-10 border-t border-slate-200/80 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🏛️</span>
                    <h3 className="text-[19px] sm:text-[22px] font-black text-slate-900 dark:text-white leading-[1.35]">
                      بوابة موارد مسار التميز الرسمية — دمج القديم بالجديد
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                    الوصول الشفاف والمباشر إلى بنك الامتحانات، الأكاديمية التفاعلية، والكتب المدرسية الموازية.
                  </p>
                </div>

                <button
                  onClick={() => selectCategory('archive')}
                  className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>استعراض كافة الروابط المعتمدة ↗</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Exam Bank */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        masartamayoz.com
                      </span>
                    </div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white">
                      بنك الفروض والامتحانات
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      مناظرات السيزيام (6ème)، النوفيام (9ème)، والباكالوريا الرسمية مع الإصلاح الدقيق.
                    </p>
                  </div>
                  <a
                    href="https://masartamayoz.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>زيارة بنك الفروض</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* 2. Parallel Books */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                        <BookMarked className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        masartamayoz.com
                      </span>
                    </div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white">
                      الكتب الموازية والملخصات
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      سلسلة مسار التميز للكتب المنهجية والتمارين المعمقة بالعربية والفرنسية.
                    </p>
                  </div>
                  <a
                    href="https://masartamayoz.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>تصفح الكتب الموازية</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* 3. Academy & Live tutoring */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                        <Award className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        academy.masartamayoz.com
                      </span>
                    </div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white">
                      أكاديمية مسار — حصص تفاعلية
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      دروس دعم ومراجعة دورية عبر Google Meet وفضاء خاص بمتابعة الأولياء.
                    </p>
                  </div>
                  <a
                    href="https://academy.masartamayoz.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>دخول الأكاديمية</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* 4. Official YouTube Channel */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                        <Video className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        youtube.com
                      </span>
                    </div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white">
                      قناة مسار التميز المرئية
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      فيديوهات شرح للدروس الصعبة وإصلاح تفاعلي للتمارين والامتحانات الوطنية.
                    </p>
                  </div>
                  <a
                    href="https://www.youtube.com/@masartamayoz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>مشاهدة الفيديوهات</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upcoming Tool Explanatory Modal */}
      <UpcomingModal
        tool={upcomingTool}
        onClose={() => setUpcomingTool(null)}
        onNavigateToAlternative={(toolId) => {
          const tool = allTools.find((t) => t.id === toolId);
          if (tool) openTool(tool);
        }}
      />

      {/* Footer Branding strictly following rules */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-12 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-right">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <span className="font-black text-slate-900 dark:text-white text-lg sm:text-xl">
                  {brand.arabicName}
                </span>
                <span className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  ({brand.latinName})
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed max-w-xl">
                «{brand.descriptor}» — {brand.privacyNotice}
              </p>
            </div>

            {/* Footer Navigation Links */}
            <div className="flex flex-wrap gap-5 justify-center md:justify-end text-sm font-bold text-slate-700 dark:text-slate-300">
              <button
                onClick={() => setView('about')}
                className="hover:text-indigo-600 transition-colors cursor-pointer"
              >
                عن المنصة
              </button>
              <button
                onClick={() => selectCategory('organize')}
                className="hover:text-indigo-600 transition-colors cursor-pointer"
              >
                تنظيم PDF
              </button>
              <button
                onClick={() => selectCategory('edu')}
                className="hover:text-indigo-600 transition-colors cursor-pointer text-purple-600 dark:text-purple-400 font-black"
              >
                أدوات تعليمية
              </button>
              <button
                onClick={() => selectCategory('archive')}
                className="hover:text-amber-600 transition-colors cursor-pointer text-amber-700 dark:text-amber-400 font-black"
              >
                أرشيف الروابط المعتمدة ↗
              </button>
            </div>
          </div>

          {/* Strict Brand Footer Line */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            <a
              href={brand.urls.academy}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200"
            >
              <span>«{brand.footerLine}»</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span>صُنعت بكل</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>للتلاميذ والمعلمين — جميع الحقوق محفوظة {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
