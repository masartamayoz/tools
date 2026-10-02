import { useState, useRef, DragEvent } from 'react';
import { Upload, Download, Check, RefreshCw } from 'lucide-react';

interface CompressedImageItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  savingPercent: number;
}

export default function CompressImageTool() {
  const [items, setItems] = useState<CompressedImageItem[]>([]);
  const [quality, setQuality] = useState<number>(70); // Default 70% quality
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    compressBatch(fileList);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      compressBatch(e.dataTransfer.files);
    }
  };

  const compressBatch = async (files: FileList) => {
    setIsCompressing(true);
    const results: CompressedImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const originalUrl = URL.createObjectURL(file);
        const originalSize = file.size;

        const compressed = await compressSingle(originalUrl, file.type, quality / 100);
        const compressedSize = compressed.size;
        const compressedUrl = URL.createObjectURL(compressed);

        const savingPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

        results.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          originalSize,
          compressedSize,
          originalUrl,
          compressedUrl,
          savingPercent,
        });
      } catch (err) {
        console.error('Compression failed for', file.name, err);
      }
    }

    setItems((prev) => [...prev, ...results]);
    setIsCompressing(false);
  };

  const compressSingle = (url: string, mimeType: string, qualityVal: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Limit excessively large resolutions to avoid memory crashes on client
        const maxDim = 2500;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context is null'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Always compress as jpeg or webp to guarantee reduction
        const exportMime = mimeType === 'image/png' ? 'image/jpeg' : mimeType;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Blob generation failed'));
            }
          },
          exportMime,
          qualityVal
        );
      };
      img.onerror = () => reject(new Error('Image load error'));
      img.src = url;
    });
  };

  const clearAll = () => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      URL.revokeObjectURL(item.compressedUrl);
    });
    setItems([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const downloadItem = (item: CompressedImageItem) => {
    const a = document.createElement('a');
    a.href = item.compressedUrl;
    // Append _compressed suffix
    const dotIdx = item.name.lastIndexOf('.');
    const nameOnly = dotIdx > -1 ? item.name.substring(0, dotIdx) : item.name;
    const ext = dotIdx > -1 ? item.name.substring(dotIdx) : '.jpg';
    a.download = `${nameOnly}_مضغوطة${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🖼️ ضغط ومعالجة حجم الصور
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            قلّص مساحة وحجم صور الفروض والواجبات المدرسية لتسهيل إرسالها للأساتذة عبر المنصات التعليمية.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 dark:text-rose-400 rounded-xl transition-all cursor-pointer"
          >
            مسح القائمة
          </button>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-slate-950/10 p-5 rounded-2xl mb-8 border border-slate-100 dark:border-slate-850">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                نسبة ضغط الجودة المفضلة
              </span>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                {quality}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              الجودة الأقل تعني حجماً أصغر بكثير. جودة 70% هي الخيار المتوازن الممتاز للتصفح المدرسي.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isCompressing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-none text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex-shrink-0"
          >
            {isCompressing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                جاري الضغط الفوري...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                اختر الصور للضغط
              </>
            )}
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
      </div>

      {items.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-16 text-center bg-slate-50/50 dark:bg-slate-950/5 hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-all cursor-pointer"
        >
          <p className="text-slate-400 dark:text-slate-500 font-medium">
            قم بسحب وإفلات صورك هنا لبدء الضغط المباشر
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
            تم ضغط الصور واستغلال المساحة:
          </h3>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <img src={item.compressedUrl} alt="Compressed" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-slate-400 line-through">
                        {formatSize(item.originalSize)}
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
                        {formatSize(item.compressedSize)}
                      </span>
                      <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-md">
                        توفير {item.savingPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => downloadItem(item)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer self-start sm:self-center"
                >
                  <Download className="h-4 w-4" />
                  تحميل الصورة
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
