import { ToolItem } from '../types';
import { Sparkles, Clock, X } from 'lucide-react';

interface UpcomingModalProps {
  tool: ToolItem | null;
  onClose: () => void;
  onNavigateToAlternative?: (toolId: string) => void;
}

export default function UpcomingModal({
  tool,
  onClose,
  onNavigateToAlternative,
}: UpcomingModalProps) {
  if (!tool) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 start-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {tool.title}
              </h3>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                قريباً
              </span>
            </div>
            <p className="text-sm text-slate-500 font-semibold mt-0.5">
              ميزة قيد التطوير المتقدم
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
          <p className="font-black text-slate-900 dark:text-white text-base">
            لماذا تظهر هذه الأداة مع شارة «قريباً»؟
          </p>
          <p>
            {tool.upcomingMessage ||
              'تتطلب هذه العملية معالجة خادم متخصصة للحفاظ على بنية الخطوط العربية وتنسيقات الجداول المعقدة بدون أي تشويه.'}
          </p>
          <p className="text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm font-semibold">
            احتراماً لخصوصيتكم التامة، تعمل منصة «أدوات التميز» حالياً بالكامل داخل متصفحكم محلياً (<strong className="text-slate-800 dark:text-slate-200">ملفاتك لا تغادر جهازك</strong>)، وسيتم إطلاق هذه الميزة قريباً مع معايير حماية مشددة.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          {onNavigateToAlternative && (
            <button
              onClick={() => {
                onClose();
                onNavigateToAlternative('pdf-stamp');
              }}
              className="flex-1 py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>استخدم أداة تخصيص وعلامة مائية PDF</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-sm font-bold transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
