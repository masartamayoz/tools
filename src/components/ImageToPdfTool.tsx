import { useState, useRef, DragEvent } from 'react';
import { jsPDF } from 'jspdf';
import { Upload, FileDown, Trash2, ArrowUp, ArrowDown, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

interface ImageFile {
  id: string;
  name: string;
  url: string;
  size: string;
}

export default function ImageToPdfTool() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [margin, setMargin] = useState<number>(10);
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newImages: ImageFile[] = [];

    Array.from(fileList).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
        newImages.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          url: URL.createObjectURL(file),
          size: `${sizeInMb} MB`,
        });
      }
    });

    setImages((prev) => [...prev, ...newImages]);
    setPdfUrl(null); // Clear old output
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((img) => img.id !== id);
    });
    setPdfUrl(null);
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setPdfUrl(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[nextIndex];
    copy[nextIndex] = temp;
    setImages(copy);
    setPdfUrl(null);
  };

  const compilePdf = async () => {
    if (images.length === 0) return;
    setIsCompiling(true);

    // Give UI thread time to render spinner
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const printableWidth = pageWidth - margin * 2;
      const printableHeight = pageHeight - margin * 2;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (i > 0) {
          doc.addPage();
        }

        // Load image to compute aspect ratio
        const imgObj = await new Promise<HTMLImageElement>((resolve, reject) => {
          const loadedImg = new Image();
          loadedImg.onload = () => resolve(loadedImg);
          loadedImg.onerror = () => reject();
          loadedImg.src = img.url;
        });

        const imgWidth = imgObj.naturalWidth;
        const imgHeight = imgObj.naturalHeight;
        const imgRatio = imgWidth / imgHeight;

        let targetWidth = printableWidth;
        let targetHeight = targetWidth / imgRatio;

        if (targetHeight > printableHeight) {
          targetHeight = printableHeight;
          targetWidth = targetHeight * imgRatio;
        }

        // Center on page within margins
        const xOffset = margin + (printableWidth - targetWidth) / 2;
        const yOffset = margin + (printableHeight - targetHeight) / 2;

        doc.addImage(img.url, 'JPEG', xOffset, yOffset, targetWidth, targetHeight, undefined, 'FAST');
      }

      const pdfBlob = doc.output('blob');
      const docUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(docUrl);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsCompiling(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `أدوات_التميز_مستند_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📄 تحويل الصور إلى PDF
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            رتب صور الواجبات، الكراسات أو الأوراق، وحملها كملف PDF عالي الجودة بضغطة زر واحدة.
          </p>
        </div>
        {images.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 dark:text-rose-400 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            مسح الكل
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Options/Dropzone Area */}
        <div className="lg:col-span-2 space-y-6">
          {images.length === 0 ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-12 text-center bg-slate-50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-950/40 transition-all cursor-pointer group"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8" />
              </div>
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                اسحب الصور وأفلتها هنا، أو اضغط للتصفح
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                يدعم صور JPG، PNG، WEBP وغيرها
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-100/70 dark:bg-slate-800/40 p-3 rounded-2xl">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  عدد الصور المحدد: {images.length}
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  إضافة المزيد من الصور
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {/* Sorting grid/list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/60 rounded-2xl hover:border-slate-200 dark:hover:border-slate-800 transition-all items-center relative group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200/50 dark:bg-slate-800/50 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                      <img src={img.url} alt="upload" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-4">
                        {img.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{img.size}</p>
                    </div>

                    {/* Sorting actions & delete */}
                    <div className="flex flex-col gap-1 flex-shrink-0 items-center border-r border-slate-200 dark:border-slate-800/60 pr-2 py-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveItem(idx, 'up')}
                        className={`p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-800 transition-all ${
                          idx === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === images.length - 1}
                        onClick={() => moveItem(idx, 'down')}
                        className={`p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-800 transition-all ${
                          idx === images.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 left-2 p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right PDF options area */}
        <div className="bg-slate-50/50 dark:bg-slate-950/10 border border-slate-200/60 dark:border-slate-850 p-6 rounded-2xl space-y-6">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850 pb-3 flex items-center gap-2">
            ⚙️ إعدادات مستند PDF
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                حجم الورقة
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPageSize('a4');
                    setPdfUrl(null);
                  }}
                  className={`py-2 px-3 text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    pageSize === 'a4'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  A4
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPageSize('letter');
                    setPdfUrl(null);
                  }}
                  className={`py-2 px-3 text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    pageSize === 'letter'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Letter
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                الاتجاه
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOrientation('p');
                    setPdfUrl(null);
                  }}
                  className={`py-2 px-3 text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    orientation === 'p'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  عمودي
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrientation('l');
                    setPdfUrl(null);
                  }}
                  className={`py-2 px-3 text-sm font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    orientation === 'l'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  أفقي
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex justify-between">
                <span>الهوامش</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{margin} مم</span>
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={margin}
                onChange={(e) => {
                  setMargin(parseInt(e.target.value, 10));
                  setPdfUrl(null);
                }}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            {pdfUrl ? (
              <div className="space-y-3">
                <button
                  onClick={downloadPdf}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <FileDown className="h-5 w-5" />
                  تحميل ملف PDF
                </button>
                <div className="flex items-center gap-2 justify-center py-2 px-3 text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-xl">
                  <CheckCircle2 className="h-4 w-4" />
                  تم تجميع المستند بنجاح!
                </div>
                <button
                  onClick={() => setPdfUrl(null)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  إعادة إنشاء وتعديل
                </button>
              </div>
            ) : (
              <button
                onClick={compilePdf}
                disabled={images.length === 0 || isCompiling}
                className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 font-bold rounded-2xl shadow-lg transition-all ${
                  images.length === 0
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 cursor-pointer'
                }`}
              >
                {isCompiling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    جاري تجميع الملف...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    إنشاء مستند PDF الآن
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
