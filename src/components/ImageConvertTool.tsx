import { useState, useRef, ChangeEvent } from 'react';
import {
  Upload,
  RefreshCw,
  Download,
  Image as ImageIcon,
  Check,
  FileImage,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ConvertedItem {
  file: File;
  previewUrl: string;
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  targetBlob?: Blob;
  downloadUrl?: string;
  originalSize: number;
  newSize?: number;
}

export default function ImageConvertTool() {
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.9);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = (Array.from(e.target.files) as File[]).filter((f) => f.type.startsWith('image/'));

    const newItems: ConvertedItem[] = files.map((f) => ({
      file: f,
      previewUrl: URL.createObjectURL(f),
      targetFormat,
      originalSize: f.size,
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const convertAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    const updated = await Promise.all(
      items.map(async (item) => {
        return new Promise<ConvertedItem>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(item);
              return;
            }

            // Fill white background for PNG with transparency when converted to JPEG
            if (targetFormat === 'image/jpeg') {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  resolve({
                    ...item,
                    targetFormat,
                    targetBlob: blob,
                    downloadUrl: url,
                    newSize: blob.size,
                  });
                } else {
                  resolve(item);
                }
              },
              targetFormat,
              quality
            );
          };
          img.src = item.previewUrl;
        });
      })
    );

    setItems(updated);
    setIsProcessing(false);
  };

  const getExt = (fmt: string) => {
    switch (fmt) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      default:
        return 'jpg';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-teal-200 border border-white/15">
            <FileImage className="w-4 h-4 text-teal-300" />
            <span>أدوات الصور — مسار التميز</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            تحويل صيغ الصور (JPG / PNG / WebP)
          </h1>
          <p className="text-xs md:text-sm text-teal-100/90 font-medium max-w-2xl leading-relaxed">
            حوّل صور الفروض والواجبات المدرسية بين الصيغ الشهيرة بكل سهولة وأمان محلياً مع تحكم في الجودة وحجم الملف.
          </p>
        </div>
      </div>

      {/* Target Format & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              الصيغة المستهدفة للتحويل:
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              اختر الصيغة المناسبة لمتطلبات المنصة المدرسية
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetFormat('image/jpeg')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetFormat === 'image/jpeg'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              JPG (الأكثر توافقاً)
            </button>
            <button
              onClick={() => setTargetFormat('image/png')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetFormat === 'image/png'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              PNG (أعلى وضوح)
            </button>
            <button
              onClick={() => setTargetFormat('image/webp')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetFormat === 'image/webp'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              WebP (أخف حجماً للويب)
            </button>
          </div>
        </div>

        {targetFormat !== 'image/png' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              مستوى الجودة: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>
        )}
      </div>

      {/* Upload button or area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-teal-500 rounded-3xl p-10 text-center cursor-pointer bg-white dark:bg-slate-900 shadow-sm transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-7 h-7" />
        </div>
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
          انقر هنا لاختيار صور من جهازك
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          يمكنك اختيار عدة صور في وقت واحد لتحويلها دفعة واحدة
        </p>
      </div>

      {/* Files List & Conversion */}
      {items.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              الصور المختارة ({items.length})
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={convertAll}
                disabled={isProcessing}
                className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>تحويل الكل إلى {getExt(targetFormat).toUpperCase()}</span>
              </button>
              <button
                onClick={() => setItems([])}
                className="text-xs text-rose-500 font-bold hover:underline cursor-pointer ps-2"
              >
                مسح الكل
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.file.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      الحجم الأصلي: {(item.originalSize / 1024).toFixed(1)} ك.ب
                    </p>
                    {item.newSize && (
                      <p className="text-[10px] text-teal-600 font-bold mt-0.5">
                        الحجم الجديد: {(item.newSize / 1024).toFixed(1)} ك.ب
                      </p>
                    )}
                  </div>
                </div>

                {item.downloadUrl ? (
                  <a
                    href={item.downloadUrl}
                    download={`${item.file.name.split('.')[0]}.${getExt(item.targetFormat)}`}
                    className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل بصيغة {getExt(item.targetFormat).toUpperCase()}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium text-center">
                    في انتظار النقر على "تحويل الكل"
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
