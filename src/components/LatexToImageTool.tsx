import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Type,
  Code2,
  Palette,
  Maximize2,
  RefreshCw,
  BookOpen,
  Info
} from 'lucide-react';

export default function LatexToImageTool() {
  const [latexInput, setLatexInput] = useState<string>(
    '\\int_{0}^{+\\infty} \\frac{\\sin(x)}{x} \\, dx = \\frac{\\pi}{2}'
  );
  const [fontSize, setFontSize] = useState<number>(36);
  const [textColor, setTextColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [padding, setPadding] = useState<number>(24);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ready-to-use school formulas
  const presets = [
    {
      title: 'تكامل شهير (جامعي)',
      code: '\\int_{0}^{+\\infty} \\frac{\\sin(x)}{x} \\, dx = \\frac{\\pi}{2}',
    },
    {
      title: 'مبرهنة فيثاغورس',
      code: 'AB^2 + AC^2 = BC^2 \\implies BC = \\sqrt{AB^2 + AC^2}',
    },
    {
      title: 'حل المعادلة من الدرجة 2',
      code: '\\Delta = b^2 - 4ac \\implies x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}',
    },
    {
      title: 'الدوال المثلثية',
      code: '\\cos^2(x) + \\sin^2(x) = 1 \\quad ; \\quad e^{i\\pi} + 1 = 0',
    },
    {
      title: 'المتتاليات العددية',
      code: 'U_n = U_0 + n \\cdot r \\quad ; \\quad S_n = \\frac{n(n+1)}{2}',
    },
    {
      title: 'المصفوفات والنظم',
      code: 'A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\implies \\det(A) = ad - bc',
    },
    {
      title: 'الفيزياء: سرعة وطاقة',
      code: 'E_c = \\frac{1}{2} m v^2 \\quad ; \\quad E = m c^2',
    },
  ];

  // Render KaTeX in real-time
  useEffect(() => {
    if (!previewRef.current) return;
    try {
      katex.render(latexInput || '\\text{اكتب معادلتك هنا}', previewRef.current, {
        throwOnError: true,
        displayMode: true,
      });
      setErrorMsg(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message.replace('KaTeX parse error: ', 'خطأ في صياغة LaTeX: '));
      } else {
        setErrorMsg('حدث خطأ في صياغة المعادلة');
      }
    }
  }, [latexInput]);

  // Export as PNG image using SVG ForeignObject or Canvas
  const handleExportPng = async (copyToClipboard = false) => {
    if (!previewRef.current) return;
    setIsGenerating(true);

    try {
      // Create off-screen SVG with KaTeX rendered HTML
      const mathElement = previewRef.current;
      const rect = mathElement.getBoundingClientRect();
      const width = Math.max(Math.ceil(rect.width) + padding * 2, 200);
      const height = Math.max(Math.ceil(rect.height) + padding * 2, 100);

      // Clone HTML
      const innerHtml = mathElement.innerHTML;

      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width * 2}" height="${height * 2}" viewBox="0 0 ${width} ${height}">
          <style>
            @import url('https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css');
            .latex-render-container {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${textColor};
              font-size: ${fontSize}px;
            }
          </style>
          ${bgColor !== 'transparent' ? `<rect width="100%" height="100%" fill="${bgColor}"/>` : ''}
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" class="latex-render-container">
              ${innerHtml}
            </div>
          </foreignObject>
        </svg>
      `;

      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * 2; // High resolution 2x
        canvas.height = height * 2;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        if (copyToClipboard) {
          try {
            canvas.toBlob(async (blob) => {
              if (blob) {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
                ]);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }
            }, 'image/png');
          } catch {
            // Fallback: download
            downloadCanvas(canvas);
          }
        } else {
          downloadCanvas(canvas);
        }

        setIsGenerating(false);
      };

      img.src = url;
    } catch {
      setIsGenerating(false);
    }
  };

  const downloadCanvas = (canvas: HTMLCanvasElement) => {
    const a = document.createElement('a');
    a.download = `latex-math-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm font-black text-purple-200 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>أداة تعليمية حصرية — مسار التميز</span>
          </div>
          <h1 className="text-[24px] min-[380px]:text-[28px] sm:text-[34px] lg:text-[40px] font-black tracking-normal leading-[1.35] max-w-3xl break-words">
            تحويل صيغ LaTeX إلى صور فائقة الدقة
          </h1>
          <p className="text-[15px] sm:text-[16px] lg:text-[17px] text-purple-100 font-medium max-w-2xl leading-[1.8] break-words">
            اكتب معادلات الرياضيات، الفيزياء، والكيمياء بصيغة LaTeX القياسية مع معاينة لحظية مباشرة وحمّلها بصيغة PNG شفافة عالية الجودة لإدراجها في الفروض والمذكرات والامتحانات المدرسية.
          </p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor & Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Buttons */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>نماذج وقوالب معادلات مدرسية وجامعية جاهزة:</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setLatexInput(preset.code)}
                  className="text-xs sm:text-sm py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-bold transition-all border border-slate-200/60 dark:border-slate-700 cursor-pointer"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* LaTeX Input Area */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span>كود LaTeX للصيغة الرياضية:</span>
              </label>
              <button
                onClick={() => setLatexInput('')}
                className="text-xs text-rose-500 hover:underline font-bold cursor-pointer"
              >
                مسح
              </button>
            </div>

            <textarea
              value={latexInput}
              onChange={(e) => setLatexInput(e.target.value)}
              placeholder="اكتب هنا صيغة LaTeX... مثال: \frac{-b \pm \sqrt{\Delta}}{2a}"
              dir="ltr"
              className="w-full h-36 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-sm border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Styling Options */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" />
              <span>خيارات المظهر والتصدير:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Font Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  حجم الخط: {fontSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Text Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  لون الخط:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {textColor}
                  </span>
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  خلفية الصورة:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBgColor('transparent')}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                      bgColor === 'transparent'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    شفافة
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgColor('#ffffff')}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                      bgColor === '#ffffff'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    بيضاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview & Download (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 sticky top-20">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-emerald-500" />
                <span>المعاينة الحية الفورية:</span>
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                جاهزة للتصدير 2x HD
              </span>
            </div>

            {/* Render Canvas/Div Box */}
            <div
              className={`min-h-[220px] rounded-2xl flex items-center justify-center p-6 transition-all border border-slate-200/80 dark:border-slate-800 overflow-x-auto ${
                bgColor === 'transparent'
                  ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] bg-slate-50 dark:bg-slate-950'
                  : 'bg-white'
              }`}
              style={{
                backgroundColor: bgColor !== 'transparent' ? bgColor : undefined,
              }}
            >
              <div
                ref={previewRef}
                style={{
                  fontSize: `${fontSize}px`,
                  color: textColor,
                }}
                className="select-all cursor-text text-center"
              />
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleExportPng(false)}
                disabled={isGenerating || !!errorMsg}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>تحميل كصورة PNG عالية الدقة (HD)</span>
              </button>

              <button
                onClick={() => handleExportPng(true)}
                disabled={isGenerating || !!errorMsg}
                className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-bold">تم نسخ الصورة إلى الحافظة!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ الصورة للحافظة مباشرة (لصق في Word أو PowerPoint)</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
                <Info className="w-3.5 h-3.5" />
                <span>نصيحة تربوية:</span>
              </div>
              <p>
                يمكنك نسخ الصورة مباشرة ولصقها داخل محرر المستندات Microsoft Word أو Google Docs أو LibreOffice مع شفافية تامة دون أي تشويش لخلفية الورقة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
