import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Minimize2, Check, Download } from 'lucide-react';

interface SelectedImage {
  name: string;
  url: string;
  originalWidth: number;
  originalHeight: number;
  mimeType: string;
}

export default function ResizeImageTool() {
  const [imgData, setImgData] = useState<SelectedImage | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImgData({
        name: file.name,
        url: url,
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
        mimeType: file.type,
      });
      setTargetWidth(Math.min(img.naturalWidth, 1200));
      setTargetHeight(Math.round((Math.min(img.naturalWidth, 1200) * img.naturalHeight) / img.naturalWidth));
      setResizedUrl(null);
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspect && imgData) {
      const ratio = imgData.originalHeight / imgData.originalWidth;
      setTargetHeight(Math.round(val * ratio));
    }
    setResizedUrl(null);
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspect && imgData) {
      const ratio = imgData.originalWidth / imgData.originalHeight;
      setTargetWidth(Math.round(val * ratio));
    }
    setResizedUrl(null);
  };

  const applyTemplate = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    setResizedUrl(null);
  };

  const applyResizeAction = async () => {
    if (!imgData) return;
    setIsResizing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const url = canvas.toDataURL(imgData.mimeType, 0.9);
          setResizedUrl(url);
        }
        setIsResizing(false);
      };
      img.src = imgData.url;
    } catch (err) {
      console.error(err);
      setIsResizing(false);
    }
  };

  const downloadResized = () => {
    if (!resizedUrl || !imgData) return;
    const a = document.createElement('a');
    a.href = resizedUrl;
    // Append resized metadata tag to download
    const dotIdx = imgData.name.lastIndexOf('.');
    const ext = dotIdx > -1 ? imgData.name.substring(dotIdx) : '.jpg';
    const cleanName = dotIdx > -1 ? imgData.name.substring(0, dotIdx) : imgData.name;
    a.download = `${cleanName}_معدلة_الأبعاد${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📐 تغيير حجم وضبط أبعاد الصور
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            عدّل دقة صورتك بالبكسل لتمر بسهولة في منصات الاختبارات وتوفر باقة الإنترنت لديك والمساحة الكلية.
          </p>
        </div>
      </div>

      {!imgData ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-14 text-center bg-slate-50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-950/40 transition-all cursor-pointer group"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="h-7 w-7" />
          </div>
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
            حدد الصورة المطلوب تعديل مقاساتها بدقة
          </p>
          <p className="text-xs text-slate-400 mt-2">
            يدعم صور الهاتف، والملخصات المنسوخة
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Options panels */}
          <div className="bg-slate-50 dark:bg-slate-950/10 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-6">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              ⚙️ تحديد الأبعاد الملائمة
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">العرض (أفقي بكسل):</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm font-bold text-center focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">الارتفاع (عمودي بكسل):</label>
                  <input
                    type="number"
                    value={targetHeight}
                    disabled={lockAspect}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm font-bold text-center focus:outline-none focus:border-indigo-600 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="lock_aspect_box"
                  checked={lockAspect}
                  onChange={(e) => {
                    setLockAspect(e.target.checked);
                    if (e.target.checked && imgData) {
                      const ratio = imgData.originalHeight / imgData.originalWidth;
                      setTargetHeight(Math.round(targetWidth * ratio));
                    }
                  }}
                  className="w-4.5 h-4.5 text-indigo-600 rounded bg-slate-105 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="lock_aspect_box" className="text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  حفظ وتأمين كفاءة التناسب (نسبة الطول للعرض)
                </label>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">قوالب قياس جاهزة وسريعة:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyTemplate(200, 200)}
                    className="py-2 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs hover:border-indigo-600 dark:hover:border-indigo-400 transition-all text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    شعار مدرسة (200x200)
                  </button>
                  <button
                    onClick={() => applyTemplate(800, 600)}
                    className="py-2 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs hover:border-indigo-600 dark:hover:border-indigo-400 transition-all text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    صورة فيسبوك (800x600)
                  </button>
                  <button
                    onClick={() => applyTemplate(1280, 720)}
                    className="py-2 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs hover:border-indigo-600 dark:hover:border-indigo-400 transition-all text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    دقة HD عالية (1280x720)
                  </button>
                  <button
                    onClick={() => {
                      setImgData(null);
                      setResizedUrl(null);
                    }}
                    className="py-2 px-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs hover:bg-rose-100 transition-all font-bold cursor-pointer"
                  >
                    تغيير الصورة وإلغائها
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-850">
              {resizedUrl ? (
                <button
                  onClick={downloadResized}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer text-xs"
                >
                  <Download className="h-5 w-5" />
                  حمل الصورة المعدلة بنجاح
                </button>
              ) : (
                <button
                  onClick={applyResizeAction}
                  disabled={isResizing}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
                >
                  {isResizing ? 'جاري تغيير الأبعاد...' : 'تنبيط وضبط الأبعاد الآن'}
                </button>
              )}
            </div>
          </div>

          {/* Visual comparison results sidebar */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-slate-50/20">
            <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-4 w-full text-right">
              حالة الصورة الحالية المعروضة:
            </h4>

            <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2">
              <img
                src={resizedUrl || imgData.url}
                alt="Working scale preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 block mb-1">الأبعاد الأصلية:</span>
                <span className="font-mono text-slate-850 dark:text-slate-200 font-bold">
                  {imgData.originalWidth} × {imgData.originalHeight} بكسل
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 block mb-1">الأبعاد المطلوبة:</span>
                <span className="font-mono text-indigo-600 font-bold">
                  {targetWidth} × {targetHeight} بكسل
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
