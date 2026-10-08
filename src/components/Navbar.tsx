import { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  Paintbrush,
  Layers,
  Minimize2,
  FileText,
  FileImage,
  Stamp,
  Globe,
  ChevronDown,
  Search,
  ExternalLink
} from 'lucide-react';
import { CategoryKey } from '../types';
import brand from '../data/brand';
import Logo from './Logo';

interface NavbarProps {
  currentCategory: CategoryKey;
  setCurrentCategory: (cat: CategoryKey) => void;
  setView: (view: 'home' | 'about') => void;
  view: 'home' | 'about';
  brandTheme: 'blue' | 'red';
  setBrandTheme: (theme: 'blue' | 'red') => void;
  onSelectTool?: (toolId: string) => void;
  onSearchClick?: () => void;
}

export function Navbar({
  currentCategory,
  setCurrentCategory,
  view,
  setView,
  brandTheme,
  setBrandTheme,
  onSelectTool,
  onSearchClick,
}: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const navigateTo = (cat: CategoryKey) => {
    setView('home');
    setCurrentCategory(cat);
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const navigateToAbout = () => {
    setView('about');
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const isBlue = brandTheme === 'blue';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 min-h-[64px]">
          {/* Brand Logo & Descriptor */}
          <div
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group py-1 flex-shrink-0"
            onClick={() => navigateTo('all')}
          >
            {/* Logo compact height ~40px mobile, ~48px desktop strictly following brand rules */}
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center flex-shrink-0">
              <Logo variant={brandTheme} size="sm" showText={false} animate={true} />
            </div>

            <div className="text-right flex flex-col justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-normal leading-tight whitespace-nowrap">
                  {brand.arabicName}
                </span>
                <span
                  className={`text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-md leading-none ${
                    isBlue
                      ? 'bg-sky-100 text-sky-850 dark:bg-sky-950 dark:text-sky-300'
                      : 'bg-rose-100 text-rose-850 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {isBlue ? 'مسار' : 'نموذجي'}
                </span>
              </div>
              <span className="hidden min-[380px]:block text-[11px] sm:text-xs lg:text-sm font-bold text-slate-500 dark:text-slate-400 leading-tight whitespace-nowrap truncate max-w-[150px] sm:max-w-xs">
                {brand.descriptor}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Categories */}
          <div className="hidden xl:flex items-center space-x-reverse space-x-1">
            <button
              onClick={() => navigateTo('all')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                view === 'home' && currentCategory === 'all'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              الرئيسية
            </button>

            <button
              onClick={() => navigateTo('organize')}
              className={`px-2.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                view === 'home' && currentCategory === 'organize'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              تنظيم PDF
            </button>

            <button
              onClick={() => navigateTo('optimize')}
              className={`px-2.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                view === 'home' && currentCategory === 'optimize'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              تحسين وضغط
            </button>

            <button
              onClick={() => navigateTo('to-pdf')}
              className={`px-2.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                view === 'home' && currentCategory === 'to-pdf'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              إلى PDF
            </button>

            <button
              onClick={() => navigateTo('from-pdf')}
              className={`px-2.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                view === 'home' && currentCategory === 'from-pdf'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              من PDF
            </button>

            <button
              onClick={() => navigateTo('edit')}
              className={`px-2.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                view === 'home' && currentCategory === 'edit'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              تحرير وختم
            </button>

            <button
              onClick={() => navigateTo('images')}
              className={`px-2.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                view === 'home' && currentCategory === 'images'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              أدوات الصور
            </button>

            {/* Signature EDU category */}
            <button
              onClick={() => navigateTo('edu')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                view === 'home' && currentCategory === 'edu'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>أدوات تعليمية</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-black">
                جديد
              </span>
            </button>

            {/* Transparent Masar Archive Tab */}
            <button
              onClick={() => navigateTo('archive')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                view === 'home' && currentCategory === 'archive'
                  ? 'bg-amber-600 text-white shadow-sm font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>🏛️ أرشيف مسار</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black">
                مفعّل ↗
              </span>
            </button>
          </div>

          {/* Medium screens (lg to xl) compact category button */}
          <div className="hidden lg:flex xl:hidden items-center gap-2">
            <button
              onClick={() => navigateTo('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                currentCategory === 'all'
                  ? 'bg-indigo-50 text-indigo-700 font-black'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              الأدوات
            </button>
            <button
              onClick={() => navigateTo('edu')}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>تعليمية</span>
            </button>
            <button
              onClick={() => navigateTo('archive')}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
            >
              الأرشيف
            </button>
          </div>

          {/* Right Toolbar: Search, Theme toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {onSearchClick && (
              <button
                onClick={onSearchClick}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="البحث في الأدوات"
                aria-label="البحث"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Brand Theme Switcher (Blue / Red) */}
            <button
              onClick={() => setBrandTheme(brandTheme === 'blue' ? 'red' : 'blue')}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-black ${
                isBlue
                  ? 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-900/40 dark:bg-sky-950/25 dark:text-sky-300'
                  : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/25 dark:text-rose-300'
              }`}
              title="تغيير الطابع اللوني (أزرق / أحمر)"
            >
              <Paintbrush className="h-4 w-4" />
              <span className="hidden xl:inline text-[10px]">
                {isBlue ? 'أزرق' : 'أحمر'}
              </span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="تغيير المظهر"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            {/* Mobile hamburger menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="القائمة"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => navigateTo('all')}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-black text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              الرئيسية (جميع الأدوات)
            </button>
            <button
              onClick={() => navigateTo('organize')}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              1. تنظيم PDF (دمج، تقسيم، ترتيب، تدوير)
            </button>
            <button
              onClick={() => navigateTo('optimize')}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              2. تحسين وضغط PDF (دفعات 25 ملف، OCR)
            </button>
            <button
              onClick={() => navigateTo('to-pdf')}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              3. التحويل إلى PDF (صور، مستندات)
            </button>
            <button
              onClick={() => navigateTo('from-pdf')}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              4. التحويل من PDF (إلى صور، إلى نص)
            </button>
            <button
              onClick={() => navigateTo('edit')}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              5. تحرير PDF (علامة مائية، أختام، ترقيم)
            </button>
            <button
              onClick={() => navigateTo('images')}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              6. أدوات الصور (ضغط، تغيير حجم، تحويل صيغ)
            </button>
            <button
              onClick={() => navigateTo('edu')}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60"
            >
              ✨ 7. أدوات تعليمية (LaTeX، أوراق العمل، ماسح الكراسات)
            </button>
            <button
              onClick={() => navigateTo('archive')}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-black text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60"
            >
              🏛️ 8. أرشيف وروابط مسار التميز المعتمدة ↗
            </button>
            <button
              onClick={navigateToAbout}
              className="block w-full text-right px-4 py-3 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              عن منصة مسار التميز
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
