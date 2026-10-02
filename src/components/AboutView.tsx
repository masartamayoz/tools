import { GraduationCap, Heart, Database, ShieldCheck, Zap } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto py-4 text-right" dir="rtl">
      {/* Visual top card */}
      <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-205 dark:border-slate-800 rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/10">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">عن منصة أدوات التميز التعليمية</h1>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold mt-0.5">شبكة مسار التميز</p>
          </div>
        </div>

        <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed text-slate-700 dark:text-slate-350">
          تعتبر <strong>أدوات التميز</strong> مبادرة تعليمية تكنولوجية مجانية بالكامل، أسستها رغب وبدافع من الإيمان العميق للتلميذ والشباب الإداري والتربوي بتونس بضرورة رقمنة وتيسير أدوات إدارة الفروض وتلخيص الكراسات وإيصال الملفات دون عبء مادي أو تعقيدات تقنية.
        </p>
      </div>

      {/* Core values bento style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">خصوصية وأمان 100%</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            المنصة مصممة بتقنيات الويب المتصفحية الحديثة؛ لا نقوم إطلاقاً برفع أو تخرين كراسات تلاميذنا أو ملفات فروضهم بأي سرفر خارجي للخصوصية والتأمين.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-651 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">سريعة وبدون تكلّف</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            تعمل بضغطة زر وتنسجم تلقائياً مع الهواتف الذكية من فئات متوسطة وتسهل على الوالدين مشاركة واجبات الأبناء.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">مجانية ممتدة</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            من تلاميذنا وبلدنا الخضراء وإليها؛ لا توجد أي اشتراكات خفية، ولا حدود قاسية في عدد الملفات المستخرجة يومياً.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">مستندة للمنهج الرسمي</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            تعكس فروضنا وامتحاناتنا المقترحة خلاصة التوجيهات والإعداد الفني تونس، لرفع كفاءة التدريب والتحصيل.
          </p>
        </div>
      </div>
    </div>
  );
}
