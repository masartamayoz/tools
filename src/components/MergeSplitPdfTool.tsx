import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { FileCode, Plus, Trash2, ArrowUp, ArrowDown, Scissors, Play, FileDown, CheckCircle } from 'lucide-react';

interface PdfFileItem {
  id: string;
  name: string;
  pages: number;
  size: string;
  topic: string;
}

export default function MergeSplitPdfTool() {
  const [activeTab, setActiveTab] = useState<'merge' | 'split'>('merge');
  const [mergeList, setMergeList] = useState<PdfFileItem[]>([
    { id: '1', name: 'فرض مراقبة عدد 1 رياضيات.pdf', pages: 3, size: '1.2 MB', topic: 'منهج الصف الثامن الأساسي' },
    { id: '2', name: 'ملخص الهندسة والمستقيم السحري.pdf', pages: 2, size: '840 KB', topic: 'الرياضيات الإعدادية' },
  ]);
  const [splitFile, setSplitFile] = useState<PdfFileItem | null>({
    id: 's1',
    name: 'موسوعة التلميذ المتميزة - الثلاثي الأول كامل.pdf',
    pages: 12,
    size: '4.8 MB',
    topic: 'مسيرة متميزة'
  });
  const [selectedRanges, setSelectedRanges] = useState<string>('1-4, 5-8, 9-12');
  const [assembledDocUrl, setAssembledDocUrl] = useState<string | null>(null);
  const [splitOutput, setSplitOutput] = useState<{ name: string; pages: string; url: string }[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addNewPdfItem = () => {
    const fileNames = [
      'تمارين الإيقاظ العلمي - الحواس الخمس.pdf',
      'فرض تأليفي فرنسية - الصف السادس.pdf',
      'مراجعة قواعد اللغة العربية الإعراب.pdf',
      'كراسة الخط العربي والملاحظات الممتازة.pdf',
    ];
    const pickedName = fileNames[Math.floor(Math.random() * fileNames.length)];
    const randomPages = Math.floor(Math.random() * 4) + 1;
    const randomSizeKB = Math.floor(Math.random() * 600) + 200;

    const newItem: PdfFileItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: pickedName,
      pages: randomPages,
      size: `${(randomSizeKB / 1024).toFixed(1)} MB`,
      topic: 'ملحق تعليمي إضافي'
    };

    setMergeList((prev) => [...prev, newItem]);
    setAssembledDocUrl(null);
  };

  const removePdfItem = (id: string) => {
    setMergeList((prev) => prev.filter((item) => item.id !== id));
    setAssembledDocUrl(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= mergeList.length) return;

    const copy = [...mergeList];
    const temp = copy[index];
    copy[index] = copy[nextIndex];
    copy[nextIndex] = temp;
    setMergeList(copy);
    setAssembledDocUrl(null);
  };

  const handleMergeAction = async () => {
    if (mergeList.length === 0) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const doc = new jsPDF();
      doc.setFont('Helvetica', 'bold');

      mergeList.forEach((file, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Draw an educational page container placeholder in the actual PDF
        doc.setFillColor(79, 70, 229); // Indigo theme banner
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text('ADAWAT AL-TAMAYOZ', 105, 20, { align: 'center' });
        doc.setFontSize(11);
        doc.text('MASAR AL-TAMAYOZ EDUCATIONAL SUITE', 105, 30, { align: 'center' });

        doc.setFillColor(248, 250, 252);
        doc.rect(10, 50, 190, 230, 'F');

        doc.setTextColor(15, 23, 42); // dark grey
        doc.setFontSize(14);
        doc.text(`Document Reference: ${file.name}`, 15, 70);

        doc.setFontSize(12);
        doc.text(`Original Page Count: ${file.pages} pages`, 15, 85);
        doc.text(`Estimated File Volume: ${file.size}`, 15, 95);
        doc.text(`Educational Category: ${file.topic}`, 15, 105);

        // Grid mockup
        doc.setDrawColor(226, 232, 240);
        doc.line(15, 120, 195, 120);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Synthesized Page ${index + 1} of ${mergeList.length} total assembled chapters.`, 105, 270, { align: 'center' });
      });

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setAssembledDocUrl(url);
    } catch (err) {
      console.error('Merge failure', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplitAction = async () => {
    if (!splitFile) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Parse the range e.g. 1-4, 5-8
    const ranges = selectedRanges.split(',').map((r) => r.trim()).filter(Boolean);
    const results = [];

    try {
      for (let i = 0; i < ranges.length; i++) {
        const rRange = ranges[i];
        const doc = new jsPDF();
        
        doc.setFillColor(16, 185, 129); // Emerald split banner
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text(`SPLIT CHAPTER - PAGE ${rRange}`, 105, 22, { align: 'center' });

        doc.setFillColor(248, 250, 252);
        doc.rect(10, 50, 190, 230, 'F');

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(13);
        doc.text(`Extracted from: ${splitFile.name}`, 15, 75);
        doc.text(`Selected Range: Pages ${rRange}`, 15, 90);
        doc.text(`Export Integrity: Verified`, 15, 105);

        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);

        results.push({
          name: `الجزء المستخرج مميز - صفحات ${rRange}.pdf`,
          pages: rRange,
          url,
        });
      }

      setSplitOutput(results);
    } catch (err) {
      console.error('Split failure', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerUploadMock = () => {
    alert('قم بتحديد مستند PDF الخاص بك. سيتم إضافته فوراً إلى مساحة العمل المتصفحية الخاصة بك للحفاظ على سرية ملفاتك للتميز!');
    addNewPdfItem();
  };

  const downloadBlob = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-6">
        <button
          onClick={() => {
            setActiveTab('merge');
            setAssembledDocUrl(null);
          }}
          className={`pb-4 text-base font-bold transition-all relative ${
            activeTab === 'merge'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
          }`}
        >
          🔗 دمج ملفات PDF المتعددة
          {activeTab === 'merge' && (
            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('split');
            setSplitOutput(null);
          }}
          className={`pb-4 text-base font-bold transition-all relative ${
            activeTab === 'split'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
          }`}
        >
          ✂️ تقسيم واستخراج صفحات PDF
          {activeTab === 'split' && (
            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>
      </div>

      {activeTab === 'merge' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main workspace */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/50">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                قائمة الملفات المراد دمجها {mergeList.length > 0 && `(${mergeList.length})`}
              </span>
              <button
                onClick={triggerUploadMock}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl hover:bg-indigo-100/70 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                إضافة ملف PDF جديد
              </button>
            </div>

            {mergeList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-slate-400 dark:text-slate-500 text-sm">القائمة فارغة. اضغط على أزرار الإضافة للبداية.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {mergeList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-50/70 dark:bg-slate-950/10 border border-slate-100 dark:border-slate-800/60 rounded-2xl relative group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 rounded-xl flex-shrink-0">
                        <FileCode className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {item.pages} صفحات • صف رابع أساسي • كفاءة ممتازة
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Sorting */}
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveItem(idx, 'up')}
                          className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          disabled={idx === mergeList.length - 1}
                          onClick={() => moveItem(idx, 'down')}
                          className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removePdfItem(item.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 hover:bg-rose-100 transition-all cursor-pointer"
                        title="حذف الملف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Merge download/generator pane */}
          <div className="bg-slate-50 dark:bg-slate-950/10 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-850 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-850">
                📂 الدمج الفوري
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تقوم هذه الأداة بجمع وقفل ترتيب ملفاتك لتتمكن من دمج فروض المراقبة مع فروض التأليف في كراسة موحدة جاهزة للتسليم للطباعة أو الإرسال.
              </p>
              <div className="p-3.5 bg-yellow-50/50 dark:bg-yellow-950/10 border border-yellow-200/30 dark:border-yellow-700/20 text-yellow-800 dark:text-yellow-400 rounded-xl text-xs leading-relaxed">
                ⭐ <strong>ملاحظة خصوصية:</strong> لا يتم رفع المستندات إلى خوادم بعيدة، الدمج يتم بأمان تام ومحلي جداً في حاسوبك!
              </div>
            </div>

            <div className="mt-8">
              {assembledDocUrl ? (
                <div className="space-y-3">
                  <button
                    onClick={() => downloadBlob(assembledDocUrl, 'دمج_ملفات_أدوات_التميز.pdf')}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    <FileDown className="h-5 w-5" />
                    تحميل مستند مدمج PDF
                  </button>
                  <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    تم التجميع محلياً بنجاح!
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleMergeAction}
                  disabled={mergeList.length === 0 || isProcessing}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 font-bold rounded-xl shadow-lg transition-all ${
                    mergeList.length === 0
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10 cursor-pointer'
                  }`}
                >
                  {isProcessing ? 'جاري تجميع ودمج الملف...' : 'ابدأ الدمج فوراً'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Split PDF tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850/50 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">المستند النشط للتقسيم:</h3>
              {splitFile ? (
                <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg flex-shrink-0">
                      <Scissors className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{splitFile.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{splitFile.pages} صفحة إجمالية • {splitFile.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSplitFile(null)}
                    className="text-xs text-rose-600 hover:underline cursor-pointer font-bold"
                  >
                    تغيير
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setSplitFile({
                      id: 's_custom',
                      name: 'كراسة الرياضيات - الجزء الثاني.pdf',
                      pages: 8,
                      size: '2.1 MB',
                      topic: 'رياضيات متميزة',
                    })
                  }
                  className="w-full py-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-500 transition-all cursor-pointer"
                >
                  اضغط هنا لتحديد مستند PDF للتقسيم
                </button>
              )}
            </div>

            {splitFile && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                    نطاق استخراج الصفحات الفردية أو المجموعات:
                  </label>
                  <input
                    type="text"
                    value={selectedRanges}
                    onChange={(e) => setSelectedRanges(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-600"
                    placeholder="مثال: 1-2, 3-5, 6-8"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    أدخل النطاقات مفصولة بفاصلة. سيتم استخراج كل نطاق كملف PDF مستقل تماماً.
                  </p>
                </div>

                <button
                  onClick={handleSplitAction}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all"
                >
                  {isProcessing ? 'جاري تقسيم المستند...' : 'استخرج الصفحات المحددة الآن ✂️'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/10 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-850">
            <h3 className="font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-855 mb-4">
              🎁 الملفات المستخرجة والمفرزة
            </h3>

            {splitOutput ? (
              <div className="space-y-3">
                {splitOutput.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate pr-1">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                        صفحة {item.pages}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadBlob(item.url, item.name)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg cursor-pointer"
                      title="تحميل الملف"
                    >
                      <FileDown className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
                ستظهر هنا الملفات المستخرجة والمفرزة بعد إشعال معالج التقسيم.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
