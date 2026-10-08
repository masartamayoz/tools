import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import {
  Upload,
  FileText,
  LayoutTemplate,
  Download,
  RefreshCw,
  Sparkles,
  Check,
  Printer,
  Info
} from 'lucide-react';

export default function WorksheetPrintTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [layoutMode, setLayoutMode] = useState<'2-up' | '4-up'>('2-up');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [addBorder, setAddBorder] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processLoadedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processLoadedFile(e.dataTransfer.files[0]);
    }
  };

  const processLoadedFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMessage('يرجى اختيار ملف PDF صالح');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
    setDownloadUrl(null);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch {
      setErrorMessage('تعذر قراءة ملف PDF. تأكد أنه غير محمي بكلمة سر.');
    }
  };

  const generateWorksheet = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const originalBuffer = await selectedFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(originalBuffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const totalPages = srcDoc.getPageCount();

      // Standard A4 dimensions in points: 595.28 x 841.89
      const a4Width = 595.28;
      const a4Height = 841.89;

      if (layoutMode === '2-up') {
        // Landscape A4 sheet: 842 x 595
        const sheetWidth = a4Height;
        const sheetHeight = a4Width;
        const margin = 20;
        const slotWidth = (sheetWidth - margin * 3) / 2;
        const slotHeight = sheetHeight - margin * 2;

        for (let i = 0; i < totalPages; i += 2) {
          const sheet = newDoc.addPage([sheetWidth, sheetHeight]);

          // Left slot (page i in Arabic RTL is right, page i+1 is left)
          const [embeddedPage1] = await newDoc.embedPages([srcDoc.getPage(i)]);
          const scale1 = Math.min(
            slotWidth / embeddedPage1.width,
            slotHeight / embeddedPage1.height
          );
          const drawnW1 = embeddedPage1.width * scale1;
          const drawnH1 = embeddedPage1.height * scale1;
          const x1 = sheetWidth - margin - slotWidth + (slotWidth - drawnW1) / 2;
          const y1 = margin + (slotHeight - drawnH1) / 2;

          sheet.drawPage(embeddedPage1, {
            x: x1,
            y: y1,
            width: drawnW1,
            height: drawnH1,
          });

          if (addBorder) {
            sheet.drawRectangle({
              x: sheetWidth - margin - slotWidth,
              y: margin,
              width: slotWidth,
              height: slotHeight,
              borderColor: rgb(0.8, 0.8, 0.8),
              borderWidth: 0.5,
            });
          }

          if (i + 1 < totalPages) {
            const [embeddedPage2] = await newDoc.embedPages([srcDoc.getPage(i + 1)]);
            const scale2 = Math.min(
              slotWidth / embeddedPage2.width,
              slotHeight / embeddedPage2.height
            );
            const drawnW2 = embeddedPage2.width * scale2;
            const drawnH2 = embeddedPage2.height * scale2;
            const x2 = margin + (slotWidth - drawnW2) / 2;
            const y2 = margin + (slotHeight - drawnH2) / 2;

            sheet.drawPage(embeddedPage2, {
              x: x2,
              y: y2,
              width: drawnW2,
              height: drawnH2,
            });

            if (addBorder) {
              sheet.drawRectangle({
                x: margin,
                y: margin,
                width: slotWidth,
                height: slotHeight,
                borderColor: rgb(0.8, 0.8, 0.8),
                borderWidth: 0.5,
              });
            }
          }
        }
      } else {
        // 4-up mode: Portrait A4 sheet (2x2 grid)
        const sheetWidth = a4Width;
        const sheetHeight = a4Height;
        const margin = 16;
        const slotWidth = (sheetWidth - margin * 3) / 2;
        const slotHeight = (sheetHeight - margin * 3) / 2;

        for (let i = 0; i < totalPages; i += 4) {
          const sheet = newDoc.addPage([sheetWidth, sheetHeight]);

          for (let slot = 0; slot < 4; slot++) {
            const pageIndex = i + slot;
            if (pageIndex >= totalPages) break;

            const [embedded] = await newDoc.embedPages([srcDoc.getPage(pageIndex)]);
            const scale = Math.min(
              slotWidth / embedded.width,
              slotHeight / embedded.height
            );
            const drawnW = embedded.width * scale;
            const drawnH = embedded.height * scale;

            // Slots in RTL order:
            // 0: Top-Right, 1: Top-Left, 2: Bottom-Right, 3: Bottom-Left
            const col = slot % 2 === 0 ? 1 : 0; // 1 = right, 0 = left
            const row = slot < 2 ? 1 : 0; // 1 = top, 0 = bottom

            const slotX = col === 1 ? margin * 2 + slotWidth : margin;
            const slotY = row === 1 ? margin * 2 + slotHeight : margin;

            const x = slotX + (slotWidth - drawnW) / 2;
            const y = slotY + (slotHeight - drawnH) / 2;

            sheet.drawPage(embedded, {
              x,
              y,
              width: drawnW,
              height: drawnH,
            });

            if (addBorder) {
              sheet.drawRectangle({
                x: slotX,
                y: slotY,
                width: slotWidth,
                height: slotHeight,
                borderColor: rgb(0.8, 0.8, 0.8),
                borderWidth: 0.5,
              });
            }
          }
        }
      }

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch {
      setErrorMessage('حدث خطأ أثناء معالجة المستند. يرجى المحاولة مع ملف آخر.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-sky-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm font-black text-indigo-200 border border-white/20">
            <LayoutTemplate className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span>تجهيز أوراق العمل والسلاسل المدرسية</span>
          </div>
          <h1 className="text-[24px] min-[380px]:text-[28px] sm:text-[34px] lg:text-[40px] font-black tracking-normal leading-[1.35] max-w-3xl break-words">
            دمج عدة صفحات في ورقة واحدة للطباعة (2-up / 4-up)
          </h1>
          <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-indigo-100 font-medium max-w-2xl leading-[1.8] break-words">
            وفّر استهلاك الورق بنسبة 50% إلى 75%: ادمج صفحتين في ورقة A4 بالعرض أو 4 صفحات في ورقة واحدة عمودية مع ترتيب تلقائي ومحاذاة قياسية مطابقة للمناهج الدراسية.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-slate-300 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-900'
          } shadow-sm`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            اختر ملف PDF أو اسحبه وأفلته هنا
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            يدعم ملفات الفروض، السلاسل، الكراسات، والملخصات المدرسية
          </p>
          <div className="mt-5 inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm">
            <FileText className="w-4 h-4" />
            <span>تصفح ملفات جهازك</span>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          {/* File Selected Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate max-w-xs md:max-w-md">
                  {selectedFile.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  عدد الصفحات: <strong>{pageCount} صفحة</strong> • الحجم: {(selectedFile.size / 1024 / 1024).toFixed(2)} ميغابايت
                </p>
              </div>
            </div>

            <button
              onClick={() => { setSelectedFile(null); setDownloadUrl(null); }}
              className="text-xs text-rose-500 hover:underline font-bold cursor-pointer"
            >
              اختيار ملف آخر
            </button>
          </div>

          {/* Layout Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-indigo-500" />
              <span>اختر نمط دمج الصفحات في الورقة الواحدة:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 2-up Option */}
              <div
                onClick={() => setLayoutMode('2-up')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                  layoutMode === '2-up'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    صفحتان في ورقة واحدة (2 في 1)
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    توفير 50%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ورقة A4 بالعرض تضم صفحتين جنباً إلى جنب مع الحفاظ على وضوح الخط وسهولة القراءة للتلاميذ.
                </p>
                <div className="flex gap-1.5 h-10 w-20 border border-slate-300 dark:border-slate-700 rounded p-1 mx-auto mt-2">
                  <div className="flex-1 bg-indigo-200 dark:bg-indigo-900/60 rounded" />
                  <div className="flex-1 bg-indigo-200 dark:bg-indigo-900/60 rounded" />
                </div>
              </div>

              {/* 4-up Option */}
              <div
                onClick={() => setLayoutMode('4-up')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                  layoutMode === '4-up'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    أربع صفحات في ورقة واحدة (4 في 1)
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    توفير 75%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ورقة A4 عمودية مقسمة إلى 4 خانات (2x2)، مثالية للملخصات السريعة والمراجع وسلاسل المراجعة المركزة.
                </p>
                <div className="grid grid-cols-2 gap-1 h-12 w-16 border border-slate-300 dark:border-slate-700 rounded p-1 mx-auto mt-1">
                  <div className="bg-indigo-200 dark:bg-indigo-900/60 rounded" />
                  <div className="bg-indigo-200 dark:bg-indigo-900/60 rounded" />
                  <div className="bg-indigo-200 dark:bg-indigo-900/60 rounded" />
                  <div className="bg-indigo-200 dark:bg-indigo-900/60 rounded" />
                </div>
              </div>
            </div>

            {/* Checkbox: Add separating border */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={addBorder}
                  onChange={(e) => setAddBorder(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>رسم إطار وقاطع رفيع حول كل صفحة لتسهيل القص والطي</span>
              </label>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            {!downloadUrl ? (
              <button
                onClick={generateWorksheet}
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جارٍ إعادة توزيع ودمج الصفحات للطباعة...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-5 h-5" />
                    <span>تجهيز ورقة العمل للطباعة الآن</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <a
                  href={downloadUrl}
                  download={`worksheet-${layoutMode}-${selectedFile.name}`}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>تحميل ملف PDF الجاهز للطباعة ({layoutMode === '2-up' ? 'صفحتان في الورقة' : '4 صفحات في الورقة'})</span>
                </a>
                <button
                  onClick={() => setDownloadUrl(null)}
                  className="w-full py-2.5 text-xs text-slate-500 hover:underline font-bold cursor-pointer"
                >
                  تغيير الخيارات أو إعادة التجهيز
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
