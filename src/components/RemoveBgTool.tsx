import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Eye, RefreshCw, Layers, Sliders, CheckCircle2 } from 'lucide-react';

interface UploadedImg {
  name: string;
  url: string;
  width: number;
  height: number;
}

export default function RemoveBgTool() {
  const [img, setImg] = useState<UploadedImg | null>(null);
  const [tolerance, setTolerance] = useState<number>(30); // 0 to 100
  const [removedUrl, setRemovedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetColor, setTargetColor] = useState<'white' | 'green' | 'custom'>('white');
  const [customHex, setCustomHex] = useState('#ffffff');
  const [bgColorReplacement, setBgColorReplacement] = useState<'transparent' | 'white' | 'indigo'>('transparent');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg({
        name: file.name,
        url: url,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setRemovedUrl(null);
    };
    image.src = url;
  };

  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const processBgRemoval = async () => {
    if (!img) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const imageElement = new Image();
      imageElement.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(imageElement, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Target color to isolate and remove
        let rTarget = 255;
        let gTarget = 255;
        let bTarget = 255;

        if (targetColor === 'green') {
          rTarget = 34;
          gTarget = 197;
          bTarget = 94; // green-500 approx
        } else if (targetColor === 'custom') {
          const rgb = hexToRgb(customHex);
          rTarget = rgb.r;
          gTarget = rgb.g;
          bTarget = rgb.b;
        }

        const toleranceThreshold = (tolerance / 100) * 255;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Compute Euclidean distance of RGB color
          const dist = Math.sqrt(
            Math.pow(r - rTarget, 2) + Math.pow(g - gTarget, 2) + Math.pow(b - bTarget, 2)
          );

          if (dist < toleranceThreshold) {
            if (bgColorReplacement === 'transparent') {
              data[i + 3] = 0; // Transparent alpha
            } else if (bgColorReplacement === 'white') {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
              data[i + 3] = 255;
            } else if (bgColorReplacement === 'indigo') {
              data[i] = 79;
              data[i + 1] = 70;
              data[i + 2] = 229; // indigo theme
              data[i + 3] = 255;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setRemovedUrl(canvas.toDataURL('image/png'));
        setIsProcessing(false);
      };
      imageElement.src = img.url;
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const downloadProcessed = () => {
    if (!removedUrl || !img) return;
    const a = document.createElement('a');
    a.href = removedUrl;
    a.download = `أدوات_التميز_بدون_خلفية_${img.name.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ✂️ إزالة وعزل خلفيات الصور الفوري
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            اجعل خلفيات صور التلاميذ شفافة أو غيّر لونها للون الأبيض أو الأزرق المعتمد رسمياً للبطاقات المدرسية بسرعة فائقة.
          </p>
        </div>
      </div>

      {!img ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-14 text-center bg-slate-50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-950/40 transition-all cursor-pointer group"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="h-7 w-7" />
          </div>
          <p className="text-base font-bold text-slate-850 dark:text-slate-200">
            اضغط هنا لتحديد الصورة للبدء بعزل الخلفية
          </p>
          <p className="text-xs text-slate-400 mt-2">
            مثالي للصور الشخصية لتراخيص النقل والمناظرات الوطنية
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Options Pane */}
          <div className="bg-slate-50 dark:bg-slate-950/10 p-6 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-6">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              إعدادات الإزالة واللون المعزول
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">نوع ولون الخلفية المراد مسحها:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setTargetColor('white');
                      setRemovedUrl(null);
                    }}
                    className={`py-2 px-1 rounded-lg border text-xs font-bold text-center cursor-pointer ${
                      targetColor === 'white'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 dark:border-slate-800 bg-white text-slate-600 dark:text-slate-350'
                    }`}
                  >
                    أبيض / فاتح
                  </button>
                  <button
                    onClick={() => {
                      setTargetColor('green');
                      setRemovedUrl(null);
                    }}
                    className={`py-2 px-1 rounded-lg border text-xs font-bold text-center cursor-pointer ${
                      targetColor === 'green'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 dark:border-slate-800 bg-white text-slate-600 dark:text-slate-350'
                    }`}
                  >
                    أخضر كرومافان
                  </button>
                  <button
                    onClick={() => {
                      setTargetColor('custom');
                      setRemovedUrl(null);
                    }}
                    className={`py-2 px-1 rounded-lg border text-xs font-bold text-center cursor-pointer ${
                      targetColor === 'custom'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 dark:border-slate-800 bg-white text-slate-600 dark:text-slate-350'
                    }`}
                  >
                    لون آخر مخصص
                  </button>
                </div>
              </div>

              {targetColor === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">حدد اللون المالي بالصورة:</label>
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => {
                      setCustomHex(e.target.value);
                      setRemovedUrl(null);
                    }}
                    className="w-full h-10 border-0 p-0 rounded-lg cursor-pointer cursor-cell bg-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex justify-between">
                  <span>منسوب دقة وحساسية العزل الرمزي:</span>
                  <span className="font-bold text-indigo-600">{tolerance}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={tolerance}
                  onChange={(e) => {
                    setTolerance(parseInt(e.target.value, 10));
                    setRemovedUrl(null);
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">استبدال مساحة الخلفية المحذوفة بـ:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setBgColorReplacement('transparent');
                      setRemovedUrl(null);
                    }}
                    className={`py-2 px-1 rounded-lg border text-xs font-bold text-center cursor-pointer ${
                      bgColorReplacement === 'transparent'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 dark:border-slate-800 bg-white text-slate-600'
                    }`}
                  >
                    شفافة مفرغة
                  </button>
                  <button
                    onClick={() => {
                      setBgColorReplacement('white');
                      setRemovedUrl(null);
                    }}
                    className={`py-2 px-1 rounded-lg border text-xs font-bold text-center cursor-pointer ${
                      bgColorReplacement === 'white'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 dark:border-slate-800 bg-white text-slate-600'
                    }`}
                  >
                    لون أبيض ناصع
                  </button>
                  <button
                    onClick={() => {
                      setBgColorReplacement('indigo');
                      setRemovedUrl(null);
                    }}
                    className={`py-2 px-1 rounded-lg border text-xs font-bold text-center cursor-pointer ${
                      bgColorReplacement === 'indigo'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 dark:border-slate-800 bg-white text-slate-600'
                    }`}
                  >
                    أزرق إداري
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-850">
              {removedUrl ? (
                <div className="space-y-3">
                  <button
                    onClick={downloadProcessed}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer text-xs"
                  >
                    تحميل الصورة المفرغة (PNG)
                  </button>
                  <button
                    onClick={() => {
                      setImg(null);
                      setRemovedUrl(null);
                    }}
                    className="w-full text-center text-xs hover:underline text-slate-500 block py-1 cursor-pointer"
                  >
                    تغيير هذه الصورة بأخرى
                  </button>
                </div>
              ) : (
                <button
                  onClick={processBgRemoval}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
                >
                  {isProcessing ? 'جاري عزل وتصفية المساحة...' : 'ابدأ تشغيل محرك العزل الفوري'}
                </button>
              )}
            </div>
          </div>

          {/* Visual Canvas comparators */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-850 p-6 rounded-2xl bg-slate-50/20">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs mb-3 w-full text-right flex items-center gap-1">
              <Eye className="w-4 h-4 text-indigo-500" />
              مقارنة النتيجة المعزولة:
            </h4>

            {/* Checkerboard style for transparency visualization */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-800 flex items-center justify-center p-1 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50 dark:bg-slate-950">
              <img
                src={removedUrl || img.url}
                alt="Chroma Key output"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="text-[10px] text-slate-450 dark:text-slate-505 mt-2 leading-relaxed text-center">
              يمكنك زيادة منسوب وحساسية الحساس لضم تفاصيل شعر الرأس والأطراف بدقة متناهية.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
