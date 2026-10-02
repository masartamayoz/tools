import { useState } from 'react';
import { MultiplicationQuestion, UnitCategory } from '../types';
import { Play, Sparkles, CheckCircle, Calculator, HelpCircle, Activity, ChevronRight } from 'lucide-react';

export default function MathTools() {
  const [panelTab, setPanelTab] = useState<'tables' | 'geometry' | 'converter' | 'graph'>('tables');

  // --- Multiplication Tables State ---
  const [selectedNum, setSelectedNum] = useState<number>(5);
  const [quizQuestions, setQuizQuestions] = useState<MultiplicationQuestion[]>([]);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | null>(null);
  const [quizActive, setQuizActive] = useState(false);

  // --- Geometry State ---
  const [selectedShape, setSelectedShape] = useState<'circle' | 'rectangle' | 'triangle' | 'cylinder' | 'sphere'>('circle');
  const [geomRadius, setGeomRadius] = useState<number>(5);
  const [geomWidth, setGeomWidth] = useState<number>(8);
  const [geomHeight, setGeomHeight] = useState<number>(6);

  // --- Unit Converter State ---
  const [unitCategoryIdx, setUnitCategoryIdx] = useState<number>(0);
  const [fromUnitIdx, setFromUnitIdx] = useState<number>(0);
  const [toUnitIdx, setToUnitIdx] = useState<number>(1);
  const [unitInputValue, setUnitInputValue] = useState<string>('12');

  // --- Graph Plotter State ---
  const [eqType, setEqType] = useState<'linear' | 'quadratic'>('quadratic');
  const [coeffA, setCoeffA] = useState<number>(1);
  const [coeffB, setCoeffB] = useState<number>(0);
  const [coeffC, setCoeffC] = useState<number>(-4);

  // Constants & Static Data
  const unitCategories: UnitCategory[] = [
    {
      id: 'length',
      name: '📐 حدة القيس - المسافات والخطوط',
      units: [
        { name: 'ميليمتر', symbol: 'مم', factor: 0.001 },
        { name: 'سنتيمتر', symbol: 'سم', factor: 0.01 },
        { name: 'ديسيمتر', symbol: 'دم', factor: 0.1 },
        { name: 'متر', symbol: 'م', factor: 1 },
        { name: 'كيلومتر', symbol: 'كم', factor: 1000 },
      ],
    },
    {
      id: 'mass',
      name: '⚖️ حدة قيس الكتل - الأوزان',
      units: [
        { name: 'غرام', symbol: 'غ', factor: 0.001 },
        { name: 'كيلوغرام', symbol: 'كغ', factor: 1 },
        { name: 'قنطار', symbol: 'ق', factor: 100 },
        { name: 'طن', symbol: 'ط', factor: 1000 },
      ],
    },
    {
      id: 'area',
      name: '🗺️ قيس المساحات الأرضية والخرائط',
      units: [
        { name: 'متر مربع', symbol: 'م²', factor: 1 },
        { name: 'آر', symbol: 'آر', factor: 100 },
        { name: 'هكتار', symbol: 'هك', factor: 10000 },
        { name: 'كيلومتر مربع', symbol: 'كم²', factor: 1000000 },
      ],
    },
  ];

  // Logic: Multiplication Quiz
  const startQuiz = () => {
    const list: MultiplicationQuestion[] = [];
    // Pick 10 random questions
    for (let i = 0; i < 8; i++) {
      const num1 = Math.floor(Math.random() * 9) + 2;
      const num2 = Math.floor(Math.random() * 9) + 2;
      list.push({ num1, num2, answer: num1 * num2 });
    }
    setQuizQuestions(list);
    setQuizScore(null);
    setQuizActive(true);
  };

  const handleAnswerChange = (idx: number, val: string) => {
    const copy = [...quizQuestions];
    copy[idx].userAnswer = val;
    setQuizQuestions(copy);
  };

  const submitQuiz = () => {
    let rightCount = 0;
    quizQuestions.forEach((q) => {
      if (parseInt(q.userAnswer || '', 10) === q.answer) {
        rightCount++;
      }
    });
    setQuizScore({ correct: rightCount, total: quizQuestions.length });
  };

  // Logic: Geometry
  const calcGeometry = () => {
    const pi = 3.14159;
    switch (selectedShape) {
      case 'circle': {
        const area = pi * geomRadius * geomRadius;
        const perimeter = 2 * pi * geomRadius;
        return {
          props: [{ name: 'مساحة القرص الدائري', val: `${area.toFixed(2)} سم²` }, { name: 'المحيط الخارجي للدائرة', val: `${perimeter.toFixed(2)} سم` }],
          rule: 'المساحة = π × شعاع²  |  المحيط = 2 × π × شعاع (π ≈ 3.14)',
        };
      }
      case 'rectangle': {
        const area = geomWidth * geomHeight;
        const perimeter = 2 * (geomWidth + geomHeight);
        return {
          props: [{ name: 'مساحة المستطيل', val: `${area} سم²` }, { name: 'محيط المستطيل', val: `${perimeter} سم` }],
          rule: 'المساحة = الطول × العرض  |  المحيط = (الطول + العرض) × 2',
        };
      }
      case 'triangle': {
        // Assume right angled
        const area = 0.5 * geomWidth * geomHeight;
        const hypotenuse = Math.sqrt(geomWidth * geomWidth + geomHeight * geomHeight);
        const perimeter = geomWidth + geomHeight + hypotenuse;
        return {
          props: [{ name: 'مساحة المثلث (قائم)', val: `${area.toFixed(2)} سم²` }, { name: 'المحيط التقريبي', val: `${perimeter.toFixed(2)} سم` }],
          rule: 'المساحة = (القاعدة × الارتفاع) ÷ 2  |  المحيط = مجموع أطوال الأضلاع',
        };
      }
      case 'cylinder': {
        const volume = pi * geomRadius * geomRadius * geomHeight;
        const lArea = 2 * pi * geomRadius * geomHeight;
        return {
          props: [{ name: 'حجم الأسطوانة الدائرية القائمة', val: `${volume.toFixed(2)} سم³` }, { name: 'المساحة الجانبية', val: `${lArea.toFixed(2)} سم²` }],
          rule: 'الحجم = مساحة القاعدة × الارتفاع  |  المساحة الجانبية = محيط القاعدة × الارتفاع',
        };
      }
      case 'sphere': {
        const volume = (4 / 3) * pi * Math.pow(geomRadius, 3);
        const sArea = 4 * pi * geomRadius * geomRadius;
        return {
          props: [{ name: 'حجم الكرة الملساء', val: `${volume.toFixed(2)} سم³` }, { name: 'مساحة السطح الجانبي الفردية', val: `${sArea.toFixed(2)} سم²` }],
          rule: 'الحجم = (4/3) × π × شعاع³  |  مساحة السطح = 4 × π × شعاع²',
        };
      }
    }
  };

  // Logic: Unit Converter
  const convertUnits = () => {
    const val = parseFloat(unitInputValue) || 0;
    const cat = unitCategories[unitCategoryIdx];
    const fromUnit = cat.units[fromUnitIdx] || cat.units[0];
    const toUnit = cat.units[toUnitIdx] || cat.units[1];

    if (!fromUnit || !toUnit) return { result: 0, formula: '' };

    // Convert to base units first, then to target
    const valueInBase = val * fromUnit.factor;
    const result = valueInBase / toUnit.factor;

    const baseSymbols = fromUnit.symbol === toUnit.symbol ? '' : ` (${fromUnit.symbol} ← ${toUnit.symbol})`;
    const formulaSteps = `${val} ${fromUnit.symbol} × (${fromUnit.factor} للتحويل للوحدة المرجعية) ÷ ${toUnit.factor} = ${result.toFixed(4)} ${toUnit.symbol}`;

    return {
      result: result.toFixed(3),
      steps: formulaSteps,
    };
  };

  // Logic: SVG Graph coordinates
  const generateGraphPoints = () => {
    const points: string[] = [];
    const scaleX = 20; // 20px per unit
    const scaleY = 15; // 15px per unit

    for (let x = -10; x <= 10; x += 0.25) {
      let y = 0;
      if (eqType === 'linear') {
        y = coeffA * x + coeffB;
      } else {
        y = coeffA * x * x + coeffB * x + coeffC;
      }

      // Mirror Y for standard browser SVG rendering coordinates where Y goes downwards
      const svgX = 200 + x * scaleX;
      const svgY = 200 - y * scaleY;

      if (svgY >= 0 && svgY <= 400) {
        points.push(`${svgX},${svgY}`);
      }
    }
    return points.join(' ');
  };

  const getEquationText = () => {
    if (eqType === 'linear') {
      return `y = ${coeffA}x + ${coeffB}`;
    }
    const bPart = coeffB > 0 ? ` + ${coeffB}x` : coeffB < 0 ? ` - ${Math.abs(coeffB)}x` : '';
    const cPart = coeffC > 0 ? ` + ${coeffC}` : coeffC < 0 ? ` - ${Math.abs(coeffC)}` : '';
    return `y = ${coeffA}x²${bPart}${cPart}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📐 أدوات الرياضيات التفاعلية ممتازة
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            جدول ضرب ذكي، حساب مساحات ومجسمات، تحويل الوحدات القياسية، ومحاكاة رسم المعادلات البيانية المباشرة.
          </p>
        </div>
      </div>

      {/* Sub menu tabs inside math workspace */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 dark:bg-slate-950/20 p-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-850/30">
        <button
          onClick={() => setPanelTab('tables')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            panelTab === 'tables'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50'
          }`}
        >
          ✖️ جدول الضرب والاختبار الزمني
        </button>
        <button
          onClick={() => setPanelTab('geometry')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            panelTab === 'geometry'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50'
          }`}
        >
          🔮 الكفاءة الهندسية والمجسمات
        </button>
        <button
          onClick={() => setPanelTab('converter')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            panelTab === 'converter'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50'
          }`}
        >
          🔄 تحويل الوحدات وشرح الخطوات
        </button>
        <button
          onClick={() => setPanelTab('graph')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            panelTab === 'graph'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/50'
          }`}
        >
          📈 رسم المعادلات والرسوم البيانية
        </button>
      </div>

      {/* WORKSPACE PANELS */}
      {panelTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Table Selector Card */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-855 dark:text-white text-sm flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800">
              ✖️ جدول الرقم المختار
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setSelectedNum(num);
                    setQuizActive(false);
                  }}
                  className={`py-3 rounded-xl border text-sm font-black transition-all cursor-pointer text-center ${
                    selectedNum === num && !quizActive
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={startQuiz}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer transition-all text-xs"
            >
              <Sparkles className="h-4 w-4" />
              ابدأ تحدي واختبار جدول الضرب الذكي
            </button>
          </div>

          {/* Render Active View */}
          <div className="lg:col-span-3 bg-slate-50/50 dark:bg-slate-950/10 border border-slate-250 dark:border-slate-850 p-6 rounded-2xl">
            {!quizActive ? (
              <div className="space-y-4">
                <div className="text-center py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-extrabold rounded-xl text-lg">
                  جدول ضرب الرقم {selectedNum}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-4 py-2.5 rounded-xl font-mono text-slate-800 dark:text-slate-250"
                    >
                      <span>
                        {selectedNum} × {item}
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">= {selectedNum * item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Quiz active view */
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">تحدي جدول الضرب</span>
                  <button
                    onClick={() => setQuizActive(false)}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    إنهاء التحدي وتصفح الجداول
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pl-1 pr-1">
                  {quizQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl"
                    >
                      <span className="text-sm font-bold font-mono text-slate-705 dark:text-slate-300">
                        {q.num1} × {q.num2} =
                      </span>
                      <input
                        type="number"
                        value={q.userAnswer || ''}
                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-bold focus:outline-none focus:border-indigo-600"
                        placeholder="؟"
                      />
                    </div>
                  ))}
                </div>

                {quizScore ? (
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl space-y-2">
                    <p className="text-sm font-black text-emerald-800 dark:text-emerald-400">
                      نتيجة تدريبك الممتاز: {quizScore.correct} صحيحة من أصل {quizScore.total}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      التميز يأتي بالمحاولة الصادقة. يمكنك إعادة المحاولة لتثبيت الحفظ وتحصيل الكفاءة!
                    </p>
                    <button
                      onClick={startQuiz}
                      className="px-4 py-2 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      جرب أسئلة جديدة 💥
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={submitQuiz}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all cursor-pointer"
                  >
                    عرض نتيجتي وتقييمي 🧮
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {panelTab === 'geometry' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Shape selectors & parameters */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">اختر المجسم أو الشكل:</label>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'circle', name: '🔵 قرص دائري' },
                  { id: 'rectangle', name: '🟩 مستطيل هندسي' },
                  { id: 'triangle', name: '📐 مثلث قائم الزاوية' },
                  { id: 'cylinder', name: '🔋 أسطوانة مستديرة قائمة' },
                  { id: 'sphere', name: '⚽ كرة مجسمة كاملة' },
                ].map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => setSelectedShape(shape.id as any)}
                    className={`py-3 px-4 text-sm font-bold text-right rounded-xl border transition-all cursor-pointer ${
                      selectedShape === shape.id
                        ? 'bg-indigo-50/50 border-indigo-600 text-indigo-700 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {shape.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider inputs as parameters */}
            <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-4">
              {(selectedShape === 'circle' || selectedShape === 'cylinder' || selectedShape === 'sphere') && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex justify-between">
                    <span>الشعاع (نق)</span>
                    <span className="font-bold text-indigo-600">{geomRadius} سم</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={geomRadius}
                    onChange={(e) => setGeomRadius(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}

              {(selectedShape === 'rectangle' || selectedShape === 'triangle') && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex justify-between">
                    <span>الطول / القاعدة</span>
                    <span className="font-bold text-indigo-600">{geomWidth} سم</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={geomWidth}
                    onChange={(e) => setGeomWidth(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}

              {(selectedShape === 'rectangle' || selectedShape === 'triangle' || selectedShape === 'cylinder') && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex justify-between">
                    <span>العرض / الارتفاع (ع)</span>
                    <span className="font-bold text-indigo-600">{geomHeight} سم</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={geomHeight}
                    onChange={(e) => setGeomHeight(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* live results pane */}
          <div className="lg:col-span-3 bg-slate-50/50 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">نتائج حساب القيس والمجسم:</h4>
              <div className="space-y-3">
                {calcGeometry()?.props.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center"
                  >
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{p.name}</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{p.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-xl">
              <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1">
                <Calculator className="h-4.5 w-4.5" />
                القاعدة الرياضية والمبدأ المتبع:
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-305 leading-relaxed">{calcGeometry()?.rule}</p>
            </div>
          </div>
        </div>
      )}

      {panelTab === 'converter' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Unit types selector & input */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">نوع معيار القيس والوزن:</label>
              <select
                value={unitCategoryIdx}
                onChange={(e) => {
                  setUnitCategoryIdx(parseInt(e.target.value, 10));
                  setFromUnitIdx(0);
                  setToUnitIdx(1);
                }}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                {unitCategories.map((cat, idx) => (
                  <option key={cat.id} value={idx}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">الكمية المدخلة للقيس:</label>
              <input
                type="number"
                value={unitInputValue}
                onChange={(e) => setUnitInputValue(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-800 dark:text-white text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">مِن وحدة:</label>
                <select
                  value={fromUnitIdx}
                  onChange={(e) => setFromUnitIdx(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  {unitCategories[unitCategoryIdx].units.map((u, i) => (
                    <option key={i} value={i}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">إلى وحدة:</label>
                <select
                  value={toUnitIdx}
                  onChange={(e) => setToUnitIdx(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  {unitCategories[unitCategoryIdx].units.map((u, i) => (
                    <option key={i} value={i}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* converter output steps and details */}
          <div className="lg:col-span-3 bg-slate-50/50 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">القيمة المعادلة المحسوبة:</h4>
              <div className="text-center p-6 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 rounded-xl">
                <span className="block text-3xl font-black text-indigo-700 dark:text-indigo-400">
                  {convertUnits().result}
                </span>
                <span className="text-xs text-slate-450 dark:text-slate-400 font-bold block mt-2">
                  {unitCategories[unitCategoryIdx].units[toUnitIdx]?.name} ({unitCategories[unitCategoryIdx].units[toUnitIdx]?.symbol})
                </span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/40 rounded-xl space-y-1">
              <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1">
                <CheckCircle className="h-4.5 w-4.5" />
                خطوات التحليل للحفظ والفهم:
              </h5>
              <p className="font-mono text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {convertUnits().steps}
              </p>
            </div>
          </div>
        </div>
      )}

      {panelTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Equation properties */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">نوع المعادلة:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setEqType('linear')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    eqType === 'linear'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  خطية (أولى) y=ax+b
                </button>
                <button
                  onClick={() => setEqType('quadratic')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    eqType === 'quadratic'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  تربيعية (ثانية) y=ax²+bx+c
                </button>
              </div>
            </div>

            {/* Slider Parameters */}
            <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex justify-between">
                  <span>المعامل (أ) / Coeff A</span>
                  <span className="font-mono text-indigo-600 text-sm font-bold">{coeffA}</span>
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={coeffA}
                  onChange={(e) => setCoeffA(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex justify-between">
                  <span>المعامل (ب) / Coeff B</span>
                  <span className="font-mono text-indigo-600 text-sm font-bold">{coeffB}</span>
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={coeffB}
                  onChange={(e) => setCoeffB(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {eqType === 'quadratic' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex justify-between">
                    <span>المعامل الثابت (ج) / Coeff C</span>
                    <span className="font-mono text-indigo-600 text-sm font-bold">{coeffC}</span>
                  </label>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={coeffC}
                    onChange={(e) => setCoeffC(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Cartesian plane in live SVG rendering */}
          <div className="lg:col-span-3 bg-slate-50/50 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 p-6 rounded-2xl flex flex-col items-center">
            <h4 className="font-extrabold text-slate-805 dark:text-white text-xs mb-4 w-full text-right flex justify-between">
              <span>المحاكاة الهندسية التعبيرية:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{getEquationText()}</span>
            </h4>

            <div className="w-full max-w-[320px] aspect-square bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 relative">
              <svg viewBox="0 0 400 400" className="w-full h-full text-slate-350 dark:text-slate-800">
                {/* Horizontal reference X-axis */}
                <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="2" />
                {/* Vertical reference Y-axis */}
                <line x1="200" y1="0" x2="200" y2="400" stroke="currentColor" strokeWidth="2" />

                {/* Sub grid units */}
                <path d="M 0 50 L 400 50 M 0 100 L 400 100 M 0 150 L 400 150 M 0 250 L 400 250 M 0 300 L 400 300 M 0 350 L 400 350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                <path d="M 50 0 L 50 400 M 100 0 L 100 400 M 150 0 L 150 400 M 250 0 L 250 400 M 300 0 L 300 400 M 350 0 L 350 400" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* Draw dynamic algebraic equation path! */}
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3.5"
                  points={generateGraphPoints()}
                />
              </svg>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              نظام الإحداثيات المتعامد والمتجانس (X, Y) من -10 إلى +10.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
