import { GraduationCap, Heart, Database, ShieldCheck, Zap } from 'lucide-react';
import brand from '../data/brand';

interface AboutViewProps {
  brandTheme?: 'blue' | 'red';
}

export default function AboutView({ brandTheme = 'blue' }: AboutViewProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-300 max-w-4xl mx-auto py-4 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-10 space-y-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              عن منصة {brand.arabicName}
            </h1>
            <p className="text-sm sm:text-base text-indigo-600 dark:text-sky-400 font-extrabold mt-1">
              «{brand.descriptor}» — شبكة {brand.parentNetworkName}
            </p>
          </div>
        </div>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          تعتبر <strong>«أدوات التميز»</strong> مبادرة تعليمية تكنولوجية مجانية بالكامل، أُسست بدافع الإيمان العميق بضرورة تيسير أدوات إدارة الفروض وتلخيص الكراسات ومعالجة ملفات PDF والصور للتلاميذ والأساتذة والأولياء بالجمهورية التونسية والعالم العربي دون عبء مادي أو تعقيدات تقنية، ومع أقصى معايير الخصوصية والأمان: <strong className="text-indigo-600 dark:text-sky-400">ملفاتك لا تغادر متصفح جهازك أبداً</strong>.
        </p>
      </div>

      {/* Core Values Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">خصوصية وأمان 100%</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            المنصة مصممة بأحدث تقنيات الويب المحلية؛ لا نقوم إطلاقاً برفع أو تخزين كراسات تلاميذنا أو ملفات فروضهم بأي سرفر خارجي لضمان الأمان التام.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">معالجة فورية وسلسة</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            تعمل بضغطة زر وتنسجم تلقائياً مع الهواتف الذكية والحواسيب وتسهل على التلاميذ وأولياء الأمور مشاركة وطباعة الواجبات المدرسية.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">مجانية دائمة وبلا حدود</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            أدوات مجانية لخدمة مسيرة التعليم والتميز؛ لا توجد أي اشتراكات خفية، مع دعم تحويل وضغط حتى 25 ملفاً دفعة واحدة.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">منسجمة مع المناهج التعليمية</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            تعكس فروضنا وامتحاناتنا المقترحة خلاصة التوجيهات الرسمية لمناظرات السيزيام والنوفيام والباكالوريا لرفع كفاءة التدريب والتحصيل.
          </p>
        </div>
      </div>
    </div>
  );
}
