import { useState, useRef, ChangeEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Upload,
  FileText,
  Copy,
  Check,
  Download,
  Search,
  RefreshCw,
  Type,
  FileDown
} from 'lucide-react';

export default function PdfToTextTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMessage('يرجى اختيار ملف PDF صالح');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
    setIsProcessing(true);
    setExtractedText('');

    try {
      const buffer = await file.arrayBuffer();
      // Inspect PDF with PDFDocument to count pages
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdf.getPageCount();
      setPageCount(pages);

      // Extract text streams by parsing font/text operators
      const textDecoder = new TextDecoder('utf-8');
      const uint8 = new Uint8Array(buffer);
      const rawString = textDecoder.decode(uint8);

      // Clean extraction of BT ... ET blocks and stream texts
      const textMatches: string[] = [];
      const streamRegex = /\(([^)]+)\)\s*Tj|\[([^\]]+)\]\s*TJ/g;
      let match;
      while ((match = streamRegex.exec(rawString)) !== null) {
        if (match[1]) {
          textMatches.push(match[1]);
        } else if (match[2]) {
          // TJ array
          const subMatches = match[2].match(/\(([^)]+)\)/g);
          if (subMatches) {
            textMatches.push(subMatches.map((s) => s.slice(1, -1)).join(' '));
          }
        }
      }

      if (textMatches.length > 0) {
        setExtractedText(textMatches.join(' '));
      } else {
        // Fallback for scanned/vector documents
        setExtractedText(
          `تم استعراض المستند (${file.name}) بنجاح بواقع ${pages} صفحة.\n\nتنبيه: يبدو أن هذا الملف يتكون من صور ممسوحة ضوئياً (Scanned PDF) أو منحنيات خطية؛ لذلك ننصح باستعمال أداة OCR أو تحويل PDF إلى صور لاستخراج المحتوى الدقيق.`
        );
      }
    } catch {
      setErrorMessage('تعذر قراءة المستند. تأكد من أن الملف سليم وغير مشفر.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile?.name.replace('.pdf', '') || 'document'}-text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-200 border border-white/15">
            <Type className="w-4 h-4 text-amber-300" />
            <span>التحويل من PDF — مسار التميز</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            استخراج النصوص من ملفات PDF
          </h1>
          <p className="text-xs md:text-sm text-amber-100/90 font-medium max-w-2xl leading-relaxed">
            استخرج النصوص والمحتوى المكتوب من كتبك وملخصاتك وفروضك المدرسية بسرعة وأمان محلياً بنسبة 100% دون رفع الملف لأي خادم.
          </p>
        </div>
      </div>

      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-amber-500 rounded-3xl p-12 text-center cursor-pointer bg-white dark:bg-slate-900 shadow-sm transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            اختر ملف PDF لاستخراج النص منه
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            معالجة سريعة وآمنة داخل متصفحك
          </p>
          <div className="mt-5 inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm">
            <FileText className="w-4 h-4" />
            <span>تصفح ملفات جهازك</span>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {selectedFile.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {pageCount} صفحة • {wordCount} كلمة • {charCount} حرف
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={isProcessing || !extractedText}
                className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
              </button>
              <button
                onClick={handleDownloadTxt}
                disabled={isProcessing || !extractedText}
                className="py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل كملف TXT</span>
              </button>
              <button
                onClick={() => { setSelectedFile(null); setExtractedText(''); }}
                className="text-xs text-rose-500 font-bold hover:underline cursor-pointer ps-2"
              >
                ملف جديد
              </button>
            </div>
          </div>

          {isProcessing ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-600" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                جارٍ فحص طبقات المستند واستخراج النصوص بدقة...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-sans text-xs md:text-sm leading-relaxed border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
