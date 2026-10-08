import { useState, useRef, ChangeEvent } from 'react';
import { jsPDF } from 'jspdf';
import {
  Camera,
  Upload,
  FileText,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  RefreshCw,
  Sun,
  Contrast,
  Check
} from 'lucide-react';

interface ScannedPage {
  id: string;
  file: File;
  previewUrl: string;
  filter: 'none' | 'document' | 'grayscale' | 'bw';
}

export default function NotebookScannerTool() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = (Array.from(e.target.files) as File[]).map((f) => ({
      id: Math.random().toString(36).substring(7),
      file: f,
      previewUrl: URL.createObjectURL(f),
      filter: 'document' as const, // default document enhancement
    }));

    setPages((prev) => [...prev, ...newFiles]);
    setPdfUrl(null);
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setPdfUrl(null);
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const newPages = [...pages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPages.length) return;
    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;
    setPages(newPages);
  };

  const setPageFilter = (id: string, filter: ScannedPage['filter']) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, filter } : p))
    );
  };

  // Process an image through canvas with the selected filter
  const applyFilterToImage = async (
    page: ScannedPage
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(page.previewUrl);
          return;
        }

        ctx.drawImage(img, 0, 0);

        if (page.filter !== 'none') {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;

            if (page.filter === 'grayscale') {
              data[i] = gray;
              data[i + 1] = gray;
              data[i + 2] = gray;
            } else if (page.filter === 'bw') {
              // High contrast binary threshold
              const v = gray > 140 ? 255 : 0;
              data[i] = v;
              data[i + 1] = v;
              data[i + 2] = v;
            } else if (page.filter === 'document') {
              // Enhanced contrast + slight brightness for clean page background
              const enhanced = Math.min(255, Math.max(0, (gray - 128) * 1.35 + 140));
              data[i] = enhanced;
              data[i + 1] = enhanced;
              data[i + 2] = enhanced;
            }
          }

          ctx.putImageData(imgData, 0, 0);
        }

        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = page.previewUrl;
    });
  };

  const generateNotebookPdf = async () => {
    if (pages.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const a4Width = 210;
      const a4Height = 297;

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) doc.addPage();
        const filteredDataUrl = await applyFilterToImage(pages[i]);

        // Fit image inside A4
        doc.addImage(
          filteredDataUrl,
          'JPEG',
          5,
          5,
          a4Width - 10,
          a4Height - 10,
          undefined,
          'FAST'
        );
      }

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch {
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm font-black text-purple-200 border border-white/20">
            <Camera className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>ماسح الكراسات الذكي — مسار التميز</span>
          </div>
          <h1 className="text-[24px] min-[380px]:text-[28px] sm:text-[34px] lg:text-[40px] font-black tracking-normal leading-[1.35] max-w-3xl break-words">
            ماسح الكراسات والواجبات بالجوال إلى PDF
          </h1>
          <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-purple-100 font-medium max-w-2xl leading-[1.8] break-words">
            التقط صور كراسات الدروس وفروض المراقبة بكاميرا هاتفك أو ارفعها من حاسوبك؛ حسّن التباين لتبييض الخلفية وتوضيح خط اليد، ثم صدّرها كملف PDF موحد بنقرة واحدة.
          </p>
        </div>
      </div>

      {/* Buttons: Camera vs File Upload */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mobile Camera direct trigger */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="p-6 sm:p-7 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-4 cursor-pointer min-h-[72px]"
        >
          <Camera className="w-7 h-7 flex-shrink-0" />
          <div className="text-right">
            <h4 className="font-black text-base sm:text-lg">تصوير صفحة بالكاميرا</h4>
            <span className="text-xs sm:text-sm opacity-90 block font-medium mt-0.5">التقط صفحات الكراس تباعاً</span>
          </div>
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFiles}
          className="hidden"
        />

        {/* Gallery / Computer Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 text-slate-900 dark:text-white shadow-sm transition-all flex items-center justify-center gap-4 cursor-pointer min-h-[72px]"
        >
          <Upload className="w-7 h-7 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <div className="text-right">
            <h4 className="font-black text-base sm:text-lg">اختيار صور من الجهاز</h4>
            <span className="text-xs sm:text-sm text-slate-500 block font-medium mt-0.5">اختر عدة صور دفعة واحدة</span>
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>

      {/* Scanned Pages Preview List */}
      {pages.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              الصفحات الممسوحة ({pages.length} صفحة)
            </h4>
            <button
              onClick={() => setPages([])}
              className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
            >
              مسح الكل
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border">
                  <img
                    src={p.previewUrl}
                    alt={`Page ${idx + 1}`}
                    className={`w-full h-full object-cover ${
                      p.filter === 'grayscale'
                        ? 'grayscale'
                        : p.filter === 'bw'
                        ? 'contrast-200 grayscale'
                        : p.filter === 'document'
                        ? 'contrast-125 brightness-105 grayscale'
                        : ''
                    }`}
                  />
                  <span className="absolute top-2 start-2 bg-black/70 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    صفحة {idx + 1}
                  </span>
                </div>

                {/* Filter Selector */}
                <div className="flex items-center justify-between text-[11px] gap-1">
                  <button
                    onClick={() => setPageFilter(p.id, 'document')}
                    className={`flex-1 py-1 rounded font-bold transition-all cursor-pointer ${
                      p.filter === 'document'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    مستند ✨
                  </button>
                  <button
                    onClick={() => setPageFilter(p.id, 'bw')}
                    className={`flex-1 py-1 rounded font-bold transition-all cursor-pointer ${
                      p.filter === 'bw'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    أبيض/أسود
                  </button>
                  <button
                    onClick={() => setPageFilter(p.id, 'none')}
                    className={`flex-1 py-1 rounded font-bold transition-all cursor-pointer ${
                      p.filter === 'none'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    أصلي
                  </button>
                </div>

                {/* Reorder and Delete controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      title="تقديم"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePage(idx, 'down')}
                      disabled={idx === pages.length - 1}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      title="تأخير"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removePage(p.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    title="حذف هذه الصفحة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action generate button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            {!pdfUrl ? (
              <button
                onClick={generateNotebookPdf}
                disabled={isGenerating}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جارٍ معالجة الصور وإنشاء مستند PDF الموحد...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>توليد كراس PDF الموحد ({pages.length} صفحة)</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <a
                  href={pdfUrl}
                  download={`notebook-scan-${Date.now()}.pdf`}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>تحميل كراس الـ PDF الجاهز الآن</span>
                </a>
                <button
                  onClick={() => setPdfUrl(null)}
                  className="w-full py-2 text-xs text-slate-500 hover:underline font-bold cursor-pointer"
                >
                  تعديل الصفحات أو إضافة المزيد
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
