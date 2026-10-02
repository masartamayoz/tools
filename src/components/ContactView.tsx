import { useState, FormEvent } from 'react';
import { Mail, Clock, MapPin, Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const faqs = [
    { q: 'هل مسار مجاني بالكامل؟', a: 'نعم، جميع الأدوات مجانية تماماً للمدرسة التونسية والتلاميذ دون حدود أو ضرورة اشتراك.' },
    { q: 'هل ملفاتي آمنة؟', a: 'نعم 100%. تتم معالجة صورك المدرسية ومستنداتك بالكامل محلياً داخل متصفحك بشكل آمن؛ لا نقوم أبداً بتحميل خصوصيتك لأية خوادم خارجية.' },
    { q: 'هل يمكنني طلب أداة تفاعلية جديدة؟', a: 'بكل سرور! نحن مسرورون جداً بمشاركتك. أرسل لنا فكرتك والمقرر المستهدف وسنقوم بتضمينها في أقرب تحديث لمسار التميز.' },
    { q: 'هل تعمل الأدوات بدون اتصال بالإنترنت؟', a: 'تتطلب تحميل الصفحة لأول مرة فقط، لكن يمكنك متابعة قيس الأشكال، جدول الضرب وعمليات الضغط والختم دون الحاجة لإنترنت ناصع بعد ذلك!' },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('يرجى ملء جميع الحقول المطلوبة والمؤشرة بالنجمة لحفظ وتوصيل الرسالة!');
      return;
    }
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Short Banner */}
      <div className="bg-gradient-to-r from-indigo-650 to-indigo-750 text-white rounded-3xl p-8 text-center shadow-lg bg-indigo-700">
        <h1 className="text-3xl font-black mb-2">📬 اتصل بنا ودعم مسار التميز</h1>
        <p className="text-slate-200 text-sm max-w-lg mx-auto">
          اقتراحاتك تهمنا جداً لتطوير أدوات المسيرة التعليمية وسهولة دراسة تلاميذنا بمختلف المدارس التونسية.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850">
            أرسل لنا رسالة فادمة ✉️
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900 text-center rounded-2xl space-y-3">
              <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-emerald-800 dark:text-emerald-400">تم استقبال رسالتك بنجاح!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                شكراً لدعمك وتفاعلك الطيب. يقرأ فريق مسار كل الرسائل وسنرد على بريدك المدرسي المسجل بأول فرصة ممكنة.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                ارسل رسالة إضافية
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">الاسم واللقب <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-white"
                    placeholder="أحمد بن صالح"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">البريد الإلكتروني <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-white"
                    placeholder="ahmed@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">موضوع الرسالة والاقتراح:</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <option value="">حدد غرض التواصل</option>
                  <option value="suggest">💡 اقتراح أداة ذكية جديدة</option>
                  <option value="bug">🐛 الإبلاغ عن ثغرة أو خطأ فني</option>
                  <option value="review">⭐ تقديم تهنئة أو رأي إيجابي</option>
                  <option value="collab">🤝 طلب تعاون وشراكة مدرسية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">نص ومضمون الرسالة الفعلي <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-white"
                  placeholder="اكتب اقتراحاتك أو مشكلتك الفنية هنا..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-black rounded-xl shadow-md transition-all cursor-pointer text-xs bg-indigo-700"
              >
                📤 إرسال المقترح لشبكة مسار التميز
              </button>
            </form>
          )}
        </div>

        {/* Right Info Cards & mini FAQs */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-md space-y-4">
            <h3 className="font-extrabold text-slate-755 dark:text-white text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
              📞 معلومات التواصل السريعة
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-450 dark:text-slate-450">البريد الإلكتروني الرسمي</p>
                  <a href="mailto:tools.masartamayoz@gmail.com" className="text-indigo-600 hover:underline font-semibold block mt-0.5">
                    tools.masartamayoz@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-450 dark:text-slate-450">وقت التفاعل والاستجابة</p>
                  <p className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">عادة من 24 إلى 48 ساعة كأقصى تقدير</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-450 dark:text-slate-450">مقر ومنبع المنصة</p>
                  <p className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">تونس الخضراء 🇹🇳</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Interactive Accordion FAQs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-md space-y-4">
            <h3 className="font-extrabold text-slate-755 dark:text-white text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
              💡 الأسئلة الشائعة جداً
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-right p-3 bg-slate-50 dark:bg-slate-950/10 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {openFaqIdx === idx ? <ChevronUp className="h-3.5 w-3.5 text-indigo-500" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
                  </button>
                  {openFaqIdx === idx && (
                    <div className="p-3 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-805 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
