import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, GraduationCap, ArrowLeft, Paintbrush } from 'lucide-react';
import { CategoryId } from '../types';
import Logo from './Logo';

interface NavbarProps {
  currentCategory: CategoryId;
  setCurrentCategory: (cat: CategoryId) => void;
  setView: (view: 'home' | 'about') => void;
  view: 'home' | 'about';
  brandTheme: 'blue' | 'red';
  setBrandTheme: (theme: 'blue' | 'red') => void;
}

export function Navbar({ currentCategory, setCurrentCategory, view, setView, brandTheme, setBrandTheme }: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  const [isOpen, setIsOpen] = useState(false);

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

  const navigateTo = (cat: CategoryId) => {
    setView('home');
    setCurrentCategory(cat);
    setIsOpen(false);
  };

  const navigateToAbout = () => {
    setView('about');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('all')}>
            <Logo variant={brandTheme} size="sm" showText={false} animate={true} />
            <div className="text-right">
              <span className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                مسار التميز
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${brandTheme === 'blue' ? 'bg-sky-100 text-sky-850 dark:bg-sky-950 dark:text-sky-305' : 'bg-rose-100 text-rose-850 dark:bg-rose-950 dark:text-rose-305'}`}>
                  {brandTheme === 'blue' ? 'أدوات' : 'نموذجي'}
                </span>
              </span>
              <span className={`block text-[10px] font-extrabold leading-none ${brandTheme === 'blue' ? 'text-sky-600 dark:text-sky-400' : 'text-rose-600 dark:text-rose-450'}`}>
                {brandTheme === 'blue' ? 'أدوات التميز التعليمية' : 'طريقك نحو التميز'}
              </span>
            </div>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center space-x-reverse space-x-1 lg:space-x-2">
            <button
              onClick={() => navigateTo('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === 'home' && currentCategory !== 'contact'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              الرئيسية
            </button>
            
            <button
              onClick={() => navigateTo('pdf')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === 'home' && currentCategory === 'pdf'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              📄 مستندات و PDF
            </button>

            <button
              onClick={() => navigateTo('image')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === 'home' && currentCategory === 'image'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              🖼️ صور وتصميم
            </button>

            <button
              onClick={() => navigateTo('math')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === 'home' && currentCategory === 'math'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              📐 رياضيات
            </button>

            <button
              onClick={() => navigateTo('exam')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === 'home' && currentCategory === 'exam'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              📝 فروض واختبارات
            </button>

            <button
              onClick={() => navigateTo('archive')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                view === 'home' && currentCategory === 'archive'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>🏛️ أرشيف وروابط مسار</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-extrabold">
                مفعّل ↗
              </span>
            </button>

            <button
              onClick={navigateToAbout}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === 'about'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              عن مسار
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === 'home' && currentCategory === 'contact'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              اتصل بنا
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Brand Theme Toggle */}
            <button
              onClick={() => setBrandTheme(brandTheme === 'blue' ? 'red' : 'blue')}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-black ${
                brandTheme === 'blue'
                  ? 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-900/40 dark:bg-sky-950/25 dark:text-sky-450'
                  : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/25 dark:text-rose-450'
              }`}
              title="تغيير الهوية المظهرية (الأزرق / الأحمر)"
            >
              <Paintbrush className="h-4 w-4" />
              <span className="hidden lg:inline text-[10px]">
                {brandTheme === 'blue' ? 'طابع أزرق' : 'طابع أحمر'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="تغيير المظهر"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <button
              onClick={() => navigateTo('all')}
              className="block w-full text-right px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              الرئيسية
            </button>
            <button
              onClick={() => navigateTo('pdf')}
              className="block w-full text-right px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              📄 مستندات و PDF
            </button>
            <button
              onClick={() => navigateTo('image')}
              className="block w-full text-right px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              🖼️ صور وتصميم
            </button>
            <button
              onClick={() => navigateTo('math')}
              className="block w-full text-right px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              📐 رياضيات
            </button>
            <button
              onClick={() => navigateTo('exam')}
              className="block w-full text-right px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              📝 فروض واختبارات
            </button>
            <button
              onClick={() => navigateTo('archive')}
              className="block w-full text-right px-4 py-2.5 rounded-xl text-base font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
            >
              🏛️ أرشيف وروابط مسار المعتمدة ↗
            </button>
            <button
              onClick={navigateToAbout}
              className="block w-full text-right px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              عن مسار
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="block w-full text-right px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
            >
              اتصل بنا
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
