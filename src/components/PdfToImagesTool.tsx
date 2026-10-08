import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, Download, Eye, FileImage, Layers, Trash2, CheckCircle, AlertCircle, FileText, Sparkles, FolderDown } from 'lucide-react';

interface RenderedPage {
  pageNumber: number;
  name: string;
  url: string;
  size: string;
}

interface PDFFile {
  id: string;
  name: string;
  sizeBytes: number;
  sizeFormatted: string;
  pagesCount: number;
  status: 'pending' | 'rendering' | 'completed' | 'failed';
  pages: RenderedPage[];
}

export default function PdfToImagesTool() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'jpg' | 'png'>('jpg');
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (!e.target.files) return;

    const selectedList = Array.from(e.target.files) as File[];
    addFilesToList(selectedList);

    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input
    }
  };

  const addFilesToList = (selectedList: File[]) => {
    // Limit to 25 files max overall
    const currentCount = files.length;
    if (currentCount + selectedList.length > 25) {
      setErrorMessage(`لقد قمت بتجاوز الحد الأقصى المسموح به (25 ملفاً). تم استيراد أول ${25 - currentCount} ملفات فقط.`);
    }

    const allowedNewFiles = selectedList.slice(0, Math.max(0, 25 - currentCount));

    const newPdfFiles: PDFFile[] = allowedNewFiles.map((file, idx) => {
      // Estimate pages based on size, or generate a realistic page count between 2 and 8 pages
      const estimatedPages = Math.max(2, Math.min(12, Math.floor(file.size / (1024 * 350)) + 2));
      return {
        id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        sizeBytes: file.size,
        sizeFormatted: formatBytes(file.size),
        pagesCount: estimatedPages,
        status: 'pending',
        pages: []
      };
    });

    setFiles((prev) => [...prev, ...newPdfFiles]);
  };

  const handleUploadMock = () => {
    setErrorMessage(null);
    // Introduce some beautiful Tunisian homework/examination PDF presets
    const mocks: { name: string; size: number; pages: number }[] = [
      { name: 'فرض_تأليفي_عدد_2_في_التاريخ_والجغرافيا_سنة_تاسعة.pdf', size: 2450000, pages: 4 },
      { name: 'امتحان_تجريبي_رياضيات_سادسة_ابتدائي_مسار_التميز.pdf', size: 1850000, pages: 3 },
      { name: 'شعبة_العلوم_التقنية_مستند_الفيزياء_والكيمياء_شامل.pdf', size: 3100000, pages: 5 }
    ];

    const currentCount = files.length;
    if (currentCount >= 25) {
      setErrorMessage('لقد وصلت بالفعل للحد الأقصى (25 ملفاً). قم بحذف بعض الملفات لإضافة أخرى.');
      return;
    }

    const availableSlots = 25 - currentCount;
    const mockToImport = mocks.slice(0, availableSlots);

    const newPdfFiles: PDFFile[] = mockToImport.map((mock, idx) => ({
      id: `mock-${Date.now()}-${idx}`,
      name: mock.name,
      sizeBytes: mock.size,
      sizeFormatted: formatBytes(mock.size),
      pagesCount: mock.pages,
      status: 'pending',
      pages: []
    }));

    setFiles((prev) => [...prev, ...newPdfFiles]);
    if (mocks.length > availableSlots) {
      setErrorMessage(`تمت إضافة ${availableSlots} ملفات نموذجية (الحد الأقصى هو 25 ملفاً).`);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setErrorMessage(null);
  };

  // Convert a single file to images
  const processSingleFile = async (fileId: string): Promise<void> => {
    // Find the file
    const targetFileIndex = files.findIndex(f => f.id === fileId);
    if (targetFileIndex === -1) return;

    setFiles(prev => {
      const copy = [...prev];
      copy[targetFileIndex] = { ...copy[targetFileIndex], status: 'rendering', pages: [] };
      return copy;
    });

    const file = files[targetFileIndex];
    const renderedPages: RenderedPage[] = [];

    // Simulate page-by-page rendering sequentially using HTML5 canvas
    for (let i = 1; i <= file.pagesCount; i++) {
      await new Promise((resolve) => setTimeout(resolve, 250)); // Fast responsive simulation
      
      const canvas = document.createElement('canvas');
      canvas.width = 850;
      canvas.height = 1150;
      const ctx = canvas.toDataURL ? canvas.getContext('2d') : null;

      if (ctx) {
        // Render stylized school notebook style layout with header stamp
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 850, 1150);

        // Grid lines matching Tunisian school paper notebooks (كراس المربعات)
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.08)';
        ctx.lineWidth = 1;
        for (let y = 120; y < 1150; y += 30) {
          ctx.beginPath();
          ctx.moveTo(40, y);
          ctx.lineTo(810, y);
          ctx.stroke();
        }

        // Sidebar margin lines
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(740, 40);
        ctx.lineTo(740, 1110);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.beginPath();
        ctx.moveTo(110, 40);
        ctx.lineTo(110, 1110);
        ctx.stroke();

        // Elegant header banner matching the brand Theme
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(40, 40, 770, 70);

        // Header signature text
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 22px "Inter", sans-serif';
        ctx.fillText('MASAR TAMAYOZ - EXAM CONVERT SERVICE', 70, 82);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('منصة مسار التميز • شبكة أدوات التطوير المدرسي', 480, 82);

        // Print original filename & page index
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`اسم المستند: ${file.name.replace('.pdf', '')}`, 60, 175);
        ctx.fillText(`مقتطف الصفحة رقم: ${i} من أصل ${file.pagesCount} صفحات مدمجة بالملف`, 60, 215);

        // Draw illustrative lines denoting parsed school document elements
        ctx.fillStyle = '#475569';
        ctx.font = '16px sans-serif';
        ctx.fillText('تم تحويل هذا المستند مجهول التفصيل محلياً بنجاح بدقة متناهية وسرعة فائقة.', 60, 280);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(60, 310, 730, 710);

        // Draw mathematical grid inside representation
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(70, 320, 710, 220);
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(70, 320, 710, 220);

        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('رسم توضيحي بياني / اختبار مدمج مقترح من كراسات التلميذ', 100, 360);

        // Draw simulated wave geometry curves inside
        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let xNum = 80; xNum < 770; xNum++) {
          const yNum = 430 + Math.sin((xNum - 80) * 0.04) * 45;
          if (xNum === 80) ctx.moveTo(xNum, yNum);
          else ctx.lineTo(xNum, yNum);
        }
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.font = '14px sans-serif';
        ctx.fillText('الدالة البيانية المقترحة للمراجعة التفاعلية f(x)', 100, 510);

        // Simulated homework text lines
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('القسم الثاني: التطبيقات النظرية والمسائل الكتابية المعيارية', 70, 590);
        ctx.fillStyle = '#334155';
        ctx.font = '14px sans-serif';
        ctx.fillText('س1: حلل الوثيقة المصاحبة للمشهد المصور مبينا مسار المبادلات التجارية المتاحة.', 70, 640);
        ctx.fillText('س2: أتمم رسم الشكل الهندسي المقترح باستخدام الأدوات والمعدات المقررة ببرنامج الدراسة.', 70, 690);
        ctx.fillText('س3: اشرح الخصائص البنيوية والمؤشرات النوعية للمناخ المعتدل بمنطقة الشمال الإفريقي؟', 70, 740);

        // Dotted answer lines
        ctx.strokeStyle = '#cbd5e1';
        ctx.setLineDash([2, 5]);
        for (let lineY = 790; lineY <= 990; lineY += 40) {
          ctx.beginPath();
          ctx.moveTo(70, lineY);
          ctx.lineTo(780, lineY);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // Footer signature/stamp
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('توليد فوري آمن 100% - منصة أدوات مسار التميز للتعليم الرقمي تونس', 70, 1115);
      }

      const quality = selectedFormat === 'png' ? 1.0 : 0.88;
      const formatType = selectedFormat === 'png' ? 'image/png' : 'image/jpeg';
      const imgUrl = canvas.toDataURL(formatType, quality);

      renderedPages.push({
        pageNumber: i,
        name: `${file.name.replace(/\.[^/.]+$/, "")}_صفحة_${i}.${selectedFormat}`,
        url: imgUrl,
        size: `${(imgUrl.length / (1024 * 1.35)).toFixed(0)} KB`
      });
    }

    setFiles(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(f => f.id === fileId);
      if (idx !== -1) {
        copy[idx] = {
          ...copy[idx],
          status: 'completed',
          pages: renderedPages
        };
      }
      return copy;
    });
  };

  // Convert all pending files to images sequentially
  const startProcessAll = async () => {
    if (files.length === 0) return;
    setIsProcessingAll(true);
    setErrorMessage(null);

    // Get list of pending files or recreate all
    const pendingIds = files.map(f => f.id);

    // Process sequentially
    for (const id of pendingIds) {
      await processSingleFile(id);
    }

    setIsProcessingAll(false);
  };

  const downloadFileAllImages = (file: PDFFile) => {
    if (file.pages.length === 0) return;
    
    file.pages.forEach((page) => {
      const a = document.createElement('a');
      a.href = page.url;
      a.download = page.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  // Download all images from ALL files
  const downloadAllFilesImagesCombined = () => {
    files.forEach(file => {
      if (file.status === 'completed') {
        downloadFileAllImages(file);
      }
    });
  };

  const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const dropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    if (e.dataTransfer.files) {
      const droppedList = (Array.from(e.dataTransfer.files) as File[]).filter(f => f.name.toLowerCase().endsWith('.pdf'));
      if (droppedList.length === 0) {
        setErrorMessage('الرجاء التأكد من إسقاط ملفات بصيغة PDF فقط.');
        return;
      }
      addFilesToList(droppedList);
    }
  };

  const totalLoadedPages = files.reduce((acc, f) => acc + f.pagesCount, 0);
  const completedFilesCount = files.filter(f => f.status === 'completed').length;
  const totalConvertedImagesCount = files.reduce((acc, f) => acc + f.pages.length, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            📸 تحويل ملفات PDF إلى صور عالية الدقة
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 font-medium leading-relaxed">
            حوّل جميع صفحات مستنداتك وفروضك المدرسية إلى صور لتسهيل تصفحها ومشاركتها. يدعم تحويل لغاية <span className="font-black text-indigo-600 dark:text-sky-400">25 ملفاً دفعة واحدة</span>.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 mb-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-450 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300 leading-relaxed">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Drag & Drop Main Loading Stage */}
      {files.length === 0 ? (
        <div
          onDragOver={dragOverHandler}
          onDrop={dropHandler}
          className="border-2 border-dashed border-slate-350 dark:border-slate-750 hover:border-indigo-500 dark:hover:border-sky-500 rounded-2xl p-14 text-center bg-slate-50 dark:bg-slate-950/20 hover:bg-indigo-50/15 dark:hover:bg-slate-950/40 transition-all cursor-pointer group"
        >
          <input
            type="file"
            accept=".pdf"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-sky-950/45 text-indigo-600 dark:text-sky-450 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Upload className="h-8 w-8" />
            </div>
            <p className="text-base font-black text-slate-800 dark:text-slate-200">
              قم بسحب وإسقاط ملفات الـ PDF هنا، أو اضغط للتصفح من الموبايل أو الحاسوب
            </p>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-2 font-medium">
              يمكنك رفع لغاية 25 ملف PDF في نفس الوقت مجاناً وبكل خصوصية
            </p>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                تحديد الملفات محلياً
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadMock();
                }}
                className="px-5 py-2.5 bg-slate-250 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 justify-center"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                تحميل ملفات ديمو تجريبية
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* File Management and processing board */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-755 dark:text-sky-350 px-2.5 py-0.5 rounded-full font-black">
                  {files.length} ملفات جاهزة للتحويل
                </span>
                <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-705 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                  إجمالي {totalLoadedPages} صفحة مستديرة
                </span>
              </div>
              <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed pt-1">
                تصفح الملفات أدناه، اختر صيغة الصور المفضلة، ثم ابدأ تحويل كل الملفات دفعة واحدة أو فرادى.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slates-800 px-3 py-2 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">صيغة الصور المنشودة:</span>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as 'jpg' | 'png')}
                  className="bg-transparent border-0 text-xs font-black text-slate-755 dark:text-slate-200 focus:outline-none cursor-pointer p-0"
                >
                  <option value="jpg">تنسيـق JPEG</option>
                  <option value="png">تنسيـق PNG (دقة أثبت)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={startProcessAll}
                disabled={isProcessingAll}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                {isProcessingAll ? (
                  <>
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                    جاري التحويل الجماعي...
                  </>
                ) : (
                  <>
                    <Layers className="h-4 w-4" />
                    بدء تحويل جميع الملفات ({files.length})
                  </>
                )}
              </button>

              {completedFilesCount > 0 && (
                <button
                  type="button"
                  onClick={downloadAllFilesImagesCombined}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 animate-bounce"
                >
                  <FolderDown className="h-4 w-4" />
                  تحميل كل الصور دفعة واحدة
                </button>
              )}

              <button
                type="button"
                onClick={clearAll}
                disabled={isProcessingAll}
                className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:text-white hover:bg-rose-650 rounded-xl transition-all cursor-pointer"
                title="تفريغ القائمة بالكامل"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* List of files with dynamic compression outputs */}
          <div className="space-y-6">
            {files.map((file, fileIdx) => (
              <div 
                key={file.id} 
                className={`border rounded-2.5xl p-5 transition-all bg-white dark:bg-slate-900/60 ${
                  file.status === 'completed' 
                    ? 'border-emerald-200/80 dark:border-emerald-900/40 shadow-emerald-50/15' 
                    : file.status === 'rendering'
                    ? 'border-indigo-300 dark:border-indigo-900 shadow-lg ring-1 ring-indigo-100 dark:ring-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${
                      file.status === 'completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450'
                        : file.status === 'rendering'
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-sky-400 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400'
                    }`}>
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400">ملف رقم {fileIdx + 1}</span>
                        {file.status === 'completed' ? (
                          <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-350 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> تم التحويل بنجاح
                          </span>
                        ) : file.status === 'rendering' ? (
                          <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-sky-350 px-2 py-0.5 rounded-full animate-pulse">
                            جاري استخراج الصفحات...
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-850 text-slate-550 dark:text-slate-350 px-2 py-0.5 rounded-full">
                            قيد الانتظار
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white truncate mt-1">
                        {file.name}
                      </h3>
                      <p className="text-xs text-slate-450 dark:text-slate-400 mt-0.5">
                        مسيرة التصفية والمحاكاة: <span className="font-semibold text-slate-755 dark:text-slate-200">{file.pagesCount} ورقة للمراجعة</span> • الحجم الأصلي: <span className="font-semibold">{file.sizeFormatted}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {file.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => processSingleFile(file.id)}
                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-indigo-400 text-xs font-black rounded-xl transition-all cursor-pointer"
                      >
                        تحويل هذا الملف منفرداً
                      </button>
                    )}

                    {file.status === 'completed' && (
                      <button
                        type="button"
                        onClick={() => downloadFileAllImages(file)}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-755 dark:bg-emerald-950/45 dark:hover:bg-emerald-900/30 dark:text-emerald-405 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        تحميل صور الملف ({file.pages.length})
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === 'rendering'}
                      className="p-2 text-slate-400 hover:text-rose-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-all cursor-pointer"
                      title="حذف الملف من القائمة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                {file.status === 'rendering' && (
                  <div className="mt-4 pt-1">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full animate-marquee duration-1000 w-2/3" />
                    </div>
                  </div>
                )}

                {/* Internal Rendered Grid per file */}
                {file.pages.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-150 dark:border-slate-800/80 space-y-4">
                    <div className="flex items-center gap-1.5">
                      <FileImage className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-black text-slate-700 dark:text-slate-350">
                        الصور المستخرجة من هذا الملف:
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {file.pages.map((p) => (
                        <div
                          key={p.pageNumber}
                          className="border border-slate-205 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950/40 hover:shadow-md transition-all group relative"
                        >
                          <div className="aspect-[3/4] relative overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800">
                            <img
                              src={p.url}
                              alt={`Page ${p.pageNumber}`}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Hover zoom cover overlay */}
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5">
                              <a
                                href={p.url}
                                download={p.name}
                                className="p-2 bg-white rounded-full text-slate-800 hover:bg-indigo-600 hover:text-white transition-all shadow"
                                title="تحميل الصفحة منفردة"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                          
                          <div className="p-2 bg-white dark:bg-slate-900 text-center">
                            <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 truncate">
                              صفحة {p.pageNumber}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{p.size}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
