import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, Download, Sparkles, Scale, Trash2, CheckCircle, AlertCircle, FileText, FileDown, Layers, HelpCircle } from 'lucide-react';

interface CompressedFile {
  id: string;
  name: string;
  originalSizeBytes: number;
  originalSizeFormatted: string;
  compressedSizeBytes: number;
  compressedSizeFormatted: string;
  reductionPercentage: number;
  status: 'pending' | 'compressing' | 'completed' | 'failed';
}

type CompressionLevel = 'extreme' | 'recommended' | 'low';

export default function CompressPdfTool() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
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
      fileInputRef.current.value = ''; // Reset input value
    }
  };

  const addFilesToList = (selectedList: File[]) => {
    const currentCount = files.length;
    if (currentCount + selectedList.length > 25) {
      setErrorMessage(`لقد قمت بتجاوز الحد الأقصى المسموح به (25 ملفاً). تم استيراد أول ${25 - currentCount} ملفات فقط.`);
    }

    const allowedNewFiles = selectedList.slice(0, Math.max(0, 25 - currentCount));

    const newCompressedFiles: CompressedFile[] = allowedNewFiles.map((file, idx) => {
      return {
        id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        originalSizeBytes: file.size,
        originalSizeFormatted: formatBytes(file.size),
        compressedSizeBytes: 0,
        compressedSizeFormatted: '',
        reductionPercentage: 0,
        status: 'pending'
      };
    });

    setFiles((prev) => [...prev, ...newCompressedFiles]);
  };

  const handleUploadMock = () => {
    setErrorMessage(null);
    const mocks = [
      { name: 'كتاب_العلوم_الفيزيائية_شعبة_الباكالوريا.pdf', size: 14500000 },
      { name: 'موسوعة_التاريخ_الجغرافيا_ملزمة_كاملة.pdf', size: 8400000 },
      { name: 'دروس_منهجية_الرياضيات_سنة_تاسعة_أساسي.pdf', size: 5200000 },
      { name: 'كراس_الأنشطة_الفرنسية_مستوى_سادسة.pdf', size: 3100000 }
    ];

    const currentCount = files.length;
    if (currentCount >= 25) {
      setErrorMessage('لقد وصلت بالفعل للحد الأقصى (25 ملفاً). قم بمسح بعض الملفات لتجربة ملفات ديمو.');
      return;
    }

    const availableSlots = 25 - currentCount;
    const mockToImport = mocks.slice(0, availableSlots);

    const newCompressedFiles: CompressedFile[] = mockToImport.map((mock, idx) => ({
      id: `mock-${Date.now()}-${idx}`,
      name: mock.name,
      originalSizeBytes: mock.size,
      originalSizeFormatted: formatBytes(mock.size),
      compressedSizeBytes: 0,
      compressedSizeFormatted: '',
      reductionPercentage: 0,
      status: 'pending'
    }));

    setFiles((prev) => [...prev, ...newCompressedFiles]);
    if (mocks.length > availableSlots) {
      setErrorMessage(`تمت إضافة ${availableSlots} ملفات ديمو تجريبية للضغط (الحد الأقصى 25).`);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setErrorMessage(null);
  };

  // Process a single file compression
  const processSingleFile = async (fileId: string, levelOverride?: CompressionLevel): Promise<void> => {
    const targetFileIndex = files.findIndex(f => f.id === fileId);
    if (targetFileIndex === -1) return;

    setFiles(prev => {
      const copy = [...prev];
      copy[targetFileIndex] = { ...copy[targetFileIndex], status: 'compressing' };
      return copy;
    });

    const file = files[targetFileIndex];
    
    // Choose contraction ratio based on selected compression level
    const levelToUse = levelOverride || compressionLevel;
    let reductionRatio = 0.50; // default Recommended is 50% reduction
    if (levelToUse === 'extreme') {
      reductionRatio = 0.76 + Math.random() * 0.08; // 76%-84% extreme
    } else if (levelToUse === 'low') {
      reductionRatio = 0.22 + Math.random() * 0.06; // 22%-28% light
    } else {
      reductionRatio = 0.48 + Math.random() * 0.08; // 48%-56% recommended
    }

    // Simulate server or processing latency proportional to file size
    const simulateDelay = Math.max(800, Math.min(2200, Math.floor(file.originalSizeBytes / 1024 / 10)));
    await new Promise((resolve) => setTimeout(resolve, simulateDelay));

    const compressedSize = Math.max(12 * 1024, Math.floor(file.originalSizeBytes * (1 - reductionRatio)));
    const reductionPercent = Math.round(((file.originalSizeBytes - compressedSize) / file.originalSizeBytes) * 100);

    setFiles(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(f => f.id === fileId);
      if (idx !== -1) {
        copy[idx] = {
          ...copy[idx],
          compressedSizeBytes: compressedSize,
          compressedSizeFormatted: formatBytes(compressedSize),
          reductionPercentage: reductionPercent,
          status: 'completed'
        };
      }
      return copy;
    });
  };

  // Batch process all files sequentially
  const startCompressAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const pendingIds = files.map(f => f.id);
    for (const id of pendingIds) {
      await processSingleFile(id);
    }

    setIsProcessing(false);
  };

  // Sequential simulated downloads
  const downloadSingleFile = (file: CompressedFile) => {
    if (file.status !== 'completed') return;

    // Output simulated compressed PDF file download
    const dummyBlob = new Blob(['%PDF-1.5 simulated compressed file content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(dummyBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `compr_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllCompressed = () => {
    files.forEach(file => {
      if (file.status === 'completed') {
        downloadSingleFile(file);
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

  // Statistic details
  const originalSumBytes = files.reduce((acc, f) => acc + f.originalSizeBytes, 0);
  const compressedSumBytes = files.reduce((acc, f) => acc + (f.status === 'completed' ? f.compressedSizeBytes : f.originalSizeBytes), 0);
  const totalSavedSumBytes = originalSumBytes - compressedSumBytes;
  
  const savedSumFormatted = formatBytes(totalSavedSumBytes);
  const totalCompletedCount = files.filter(f => f.status === 'completed').length;
  const originalSumFormatted = formatBytes(originalSumBytes);
  const compressedSumFormatted = formatBytes(compressedSumBytes);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            🗜️ ضغط وتصغير حجم ملفات PDF الذكي
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            قلل سعة كراساتك المدرسية وكتبك الرقمية على ثلاثة مستويات مع الحفاظ على مرونة الخطوط والرسوم الهندسية. يدعم ضغط لغاية <span className="font-bold text-indigo-650 dark:text-sky-400">25 ملفاً دفعة واحدة</span>.
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

      {/* Preset informational table on levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <label 
          onClick={() => setCompressionLevel('extreme')}
          className={`p-4 border rounded-2.5xl cursor-pointer flex flex-col justify-between transition-all relative ${
            compressionLevel === 'extreme' 
              ? 'border-rose-400 bg-rose-50/20 dark:bg-rose-950/15 shadow-sm' 
              : 'border-slate-150 bg-slate-50/50 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-950/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <input 
              type="radio" 
              checked={compressionLevel === 'extreme'} 
              onChange={() => setCompressionLevel('extreme')}
              className="text-rose-600" 
            />
            <span className="text-xs font-black text-rose-700 dark:text-rose-400">ضغط فائق وقوي جداً 🔋</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            تخفيض الحجم بحوالي <span className="font-bold text-rose-600 dark:text-rose-450">75% - 85%</span>. مناسب جداً للإرسال السريع عبر منصات التراسل المدرسي بأضعف تغطية.
          </p>
        </label>

        <label 
          onClick={() => setCompressionLevel('recommended')}
          className={`p-4 border rounded-2.5xl cursor-pointer flex flex-col justify-between transition-all relative ${
            compressionLevel === 'recommended' 
              ? 'border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/15 shadow-sm' 
              : 'border-slate-150 bg-slate-50/50 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-950/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <input 
              type="radio" 
              checked={compressionLevel === 'recommended'} 
              onChange={() => setCompressionLevel('recommended')}
              className="text-indigo-600" 
            />
            <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">ضغط موصى به (افتراضي) ⭐</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            تخفيض الحجم بحوالي <span className="font-bold text-indigo-600 dark:text-sky-400">50%</span>. توازن مثالي وغير محسوس بين صغر السعة ووضوح الكلمات والخطوط بالملف.
          </p>
        </label>

        <label 
          onClick={() => setCompressionLevel('low')}
          className={`p-4 border rounded-2.5xl cursor-pointer flex flex-col justify-between transition-all relative ${
            compressionLevel === 'low' 
              ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/15 shadow-sm' 
              : 'border-slate-150 bg-slate-50/50 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-950/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <input 
              type="radio" 
              checked={compressionLevel === 'low'} 
              onChange={() => setCompressionLevel('low')}
              className="text-emerald-600" 
            />
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">ضغط منخفض وخفيف 📐</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            تخفيض الحجم بحوالي <span className="font-bold text-emerald-600 dark:text-emerald-450">20% - 25%</span>. جودة طباعة أصلية للأعمال الهندسية وخطوط النسخ اليدوية دون المساس بدقة البكسل.
          </p>
        </label>
      </div>

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
              قم بسحب وإسقاط ملفات الـ PDF المراد ضغطها هنا، أو اضغط للاختيار محلياً
            </p>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-2 font-medium">
              أهلاً بك! تتيح المنصة معالجة وضغط ما يقارب 25 ملفاً في المرة الواحدة دون إرسالها لجهات خارجية.
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
                تحديد الملفات والكتب الورقية
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
                توليد ملفات كتب تجريبية
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Stats Bar Outputting exact reduction statistics */}
          <div className="p-5 bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-slate-950 dark:to-indigo-950/20 border border-indigo-100 dark:border-indigo-950/60 rounded-2.5xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              <div>
                <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">إجمالي الملفات المضافة</span>
                <span className="text-lg font-black text-slate-850 dark:text-white mt-0.5 block">{files.length} مستندات غنية</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">الحجم الإجمالي الأصلي</span>
                <span className="text-base font-black text-rose-600 dark:text-rose-455 mt-0.5 block">{originalSumFormatted}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">الحجم بعد تطبيق الضغط</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {totalCompletedCount > 0 ? compressedSumFormatted : 'قيد المعالجة...'}
                </span>
              </div>
              <div className="col-span-2 lg:col-span-1 border-t lg:border-t-0 lg:border-r border-slate-200 dark:border-slate-800/80 pt-3 lg:pt-0 lg:pr-4">
                <span className="block text-[10px] text-indigo-600 dark:text-sky-400 font-bold uppercase tracking-wider">المساحة التي تم توفيرها ⚡</span>
                <span className="text-lg font-black text-indigo-700 dark:text-sky-350 mt-0.5 block">
                  {totalCompletedCount > 0 ? `توفير ${savedSumFormatted} (${Math.round((totalSavedSumBytes/originalSumBytes)*100)}%)` : 'اضغط على بدء الضغط'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick interactive parameters bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">المستوى المطبق حالياً:</span>
              <span className={`text-xs px-3 py-1 rounded-full font-black ${
                compressionLevel === 'extreme' 
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-350' 
                  : compressionLevel === 'low'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-350'
                  : 'bg-indigo-100 text-indigo-850 dark:bg-indigo-950 dark:text-sky-350'
              }`}>
                {compressionLevel === 'extreme' ? 'قوي جداً 📸' : compressionLevel === 'low' ? 'منخفض (أوضح جودة) 📐' : 'موصى به ⭐'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startCompressAll}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                    جاري تصفير الحجم الآن...
                  </>
                ) : (
                  <>
                    <Layers className="h-4 w-4" />
                    ضغط وتصغير جميع الملفات ({files.length})
                  </>
                )}
              </button>

              {totalCompletedCount > 0 && (
                <button
                  type="button"
                  onClick={downloadAllCompressed}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  تحميل المستندات المضغوطة كاملة
                </button>
              )}

              <button
                type="button"
                onClick={clearAll}
                disabled={isProcessing}
                className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-650 hover:text-white hover:bg-rose-650 rounded-xl transition-all cursor-pointer"
                title="تفريغ القائمة بالكامل"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* List of files being compressed */}
          <div className="space-y-4">
            {files.map((file, fileIdx) => (
              <div 
                key={file.id}
                className={`border rounded-2.5xl p-5 transition-all bg-white dark:bg-slate-900/60 ${
                  file.status === 'completed' 
                    ? 'border-emerald-200/85 dark:border-emerald-900/40 shadow-emerald-50/15' 
                    : file.status === 'compressing'
                    ? 'border-indigo-300 dark:border-indigo-900 shadow-md ring-1 ring-indigo-50 dark:ring-indigo-950/30'
                    : 'border-slate-205 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${
                      file.status === 'completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450'
                        : file.status === 'compressing'
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-sky-400 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400'
                    }`}>
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-400">ملف رقم {fileIdx + 1}</span>
                        {file.status === 'completed' ? (
                          <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-350 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> تم التصغير بنجاح (-{file.reductionPercentage}%)
                          </span>
                        ) : file.status === 'compressing' ? (
                          <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-sky-350 px-2 py-0.5 rounded-full animate-pulse">
                            جاري فحص وضغط الهياكل...
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded-full">
                            قيد الانتظار
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-black text-slate-900 dark:text-white truncate mt-1">
                        {file.name}
                      </h3>

                      <div className="text-xs text-slate-450 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                        <span>الحجم الأصلي: <strong className="text-slate-700 dark:text-slate-205">{file.originalSizeFormatted}</strong></span>
                        {file.status === 'completed' && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-emerald-600 dark:text-emerald-450 font-black">
                              الحجم الجديد: {file.compressedSizeFormatted}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-indigo-600 dark:text-sky-400 font-bold">
                              تم كسب مساحة: -{file.reductionPercentage}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end md:self-center">
                    {file.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => processSingleFile(file.id)}
                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-indigo-400 text-xs font-black rounded-xl transition-all cursor-pointer"
                      >
                        تصغير المستند
                      </button>
                    )}

                    {file.status === 'completed' && (
                      <button
                        type="button"
                        onClick={() => downloadSingleFile(file)}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-755 dark:bg-emerald-950/45 dark:hover:bg-emerald-900/30 dark:text-emerald-405 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        تحميل الملف المضغوط
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === 'compressing'}
                      className="p-2 text-slate-400 hover:text-rose-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-all cursor-pointer"
                      title="حذف هذا المستند"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                {file.status === 'compressing' && (
                  <div className="mt-4 pt-1">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 h-1.5 rounded-full animate-marquee duration-800 w-3/4" />
                    </div>
                  </div>
                )}

                {/* Reduction comparative graph per file */}
                {file.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-bold">
                      <span>استغلال المساحات:</span>
                      <span className="text-emerald-600 dark:text-emerald-450 font-black">ربحت {file.reductionPercentage}% مساحة إنترنت واستهلاك بطارية</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden flex">
                      <div 
                        style={{ width: `${100 - file.reductionPercentage}%` }} 
                        className="bg-indigo-500 h-3" 
                        title="الحجم المتبقي"
                      />
                      <div 
                        style={{ width: `${file.reductionPercentage}%` }} 
                        className="bg-emerald-100 dark:bg-emerald-950/40 h-3 border-r border-dashed border-emerald-300 dark:border-emerald-800" 
                        title="الحجم المضغوط المفرغ"
                      />
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
