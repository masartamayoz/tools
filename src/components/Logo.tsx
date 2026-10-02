import { motion } from 'motion/react';

interface LogoProps {
  variant?: 'blue' | 'red';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animate?: boolean;
}

export default function Logo({ variant = 'blue', size = 'md', showText = true, animate = true }: LogoProps) {
  // Dimension definitions
  const dimensions = {
    sm: { width: 44, height: 44, textClass: 'text-sm' },
    md: { width: 80, height: 80, textClass: 'text-lg' },
    lg: { width: 140, height: 140, textClass: 'text-2xl' },
    xl: { width: 220, height: 220, textClass: 'text-4xl' },
  };

  const currentSize = dimensions[size];

  // Theme Colors variables based on Logo variant.
  // Blue Variant (أدوات التميز) vs Red Variant (طريقك نحو التميز)
  const isBlue = variant === 'blue';
  
  // Pencil color schemes representing the 3D faces
  const pencilPrimary = isBlue ? '#0284c7' : '#e11d48'; // sky-600 / rose-600
  const pencilLight = isBlue ? '#38bdf8' : '#fb7185';   // sky-400 / rose-400
  const pencilDark = isBlue ? '#0369a1' : '#be123c';    // sky-700 / rose-700
  const archColor = isBlue ? '#0ea5e9' : '#f43f5e';     // sky-500 / rose-500
  const txtColor = isBlue ? 'text-sky-600 dark:text-sky-400' : 'text-rose-600 dark:text-rose-400';
  const labelText = isBlue ? 'أدوات التميز' : 'طريقك نحو التميز';

  // Animation variants
  const pencilAnim = animate ? {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: 'spring', stiffness: 100, damping: 10 }
  } : {};

  const personAnim = animate ? {
    initial: { scale: 0.8, opacity: 0, x: 10 },
    animate: { scale: 1, opacity: 1, x: 0 },
    transition: { delay: 0.2, type: 'spring', stiffness: 120, damping: 11 }
  } : {};

  const arcAnim = animate ? {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { delay: 0.4, duration: 0.8, ease: 'easeOut' }
  } : {};

  return (
    <div className="flex flex-col items-center justify-center text-center font-sans tracking-tight">
      {/* SVG Container wrapping the exact geometries of high-school pencils & black figures */}
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
      >
        {/* Underpinning decorative horizon arc */}
        <motion.path
          d="M10 162C70 145 130 145 190 162"
          stroke={archColor}
          strokeWidth="6"
          strokeLinecap="round"
          {...arcAnim}
        />

        {/* The 3D hexagonal drawing pencil */}
        <motion.g {...pencilAnim}>
          {/* Hex Left Face */}
          <path
            d="M55 45H75V110L55 125V45Z"
            fill={pencilLight}
          />
          {/* Hex Middle Face (main) */}
          <path
            d="M75 45H95V110L85 128L75 110V45Z"
            fill={pencilPrimary}
          />
          {/* Hex Right Face */}
          <path
            d="M95 45H108V110L95 125V45Z"
            fill={pencilDark}
          />

          {/* Scalloped edge details between body & wood */}
          <path
            d="M55 125C61 120 69 120 75 110"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <path
            d="M75 110C80 115 90 115 95 110"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <path
            d="M95 110C100 120 104 120 108 125"
            stroke="#ffffff"
            strokeWidth="1.5"
          />

          {/* Rounded top of the Hexagonal pencil */}
          <path
            d="M55 45C55 38 65 35 81.5 35C98 35 108 38 108 45"
            fill={pencilPrimary}
            opacity="0.3"
          />

          {/* Sharpened wooden collar (tan body) */}
          <path
            d="M55 125L85 170L108 125C108 125 93 118 85 128C77 118 55 125 55 125Z"
            fill="#e7c8a4"
          />

          {/* Dark graphite lead tip */}
          <path
            d="M79 161L85 172L91 161C88 163 85 163 79 161Z"
            fill="#334155"
          />

          {/* Splattered droplets of pure learning action (blue/red droplets) */}
          <circle cx="50" cy="165" r="3" fill={archColor} opacity="0.75" />
          <circle cx="120" cy="160" r="2.5" fill={archColor} opacity="0.6" />
          <path d="M40 172C41 170 45 170 46 172C46 174 41 176 40 172Z" fill={archColor} opacity="0.5" />
          <path d="M130 168C131 166 134 167 134 169C133 171 130 170 130 168Z" fill={archColor} opacity="0.5" />
        </motion.g>

        {/* Stylized shiny Black figure of a person */}
        <motion.g {...personAnim}>
          {/* Round Head */}
          <circle cx="138" cy="48" r="14" fill="#1e293b" />
          
          {/* Dynamic flowing body */}
          {/* Resting arm reaching to pencil top at around (100, 48)  */}
          {/* Outstretched arm to the right at around (180, 75) */}
          {/* Tapered leg/body bottom at around (142, 160) */}
          <path
            d="M138 62C122 62 108 52 102 48C100 46 98 48 99 50C105 61 118 73 132 75V110C132 125 137 142 142 161C143 163 145 163 145 161C147 142 153 125 153 110V80C165 74 180 78 190 82C192 83 193 80 191 78C180 70 158 62 138 62Z"
            fill="#1e293b"
          />

          {/* Inner smooth highlight for 3D body aspect */}
          <path
            d="M140 68C132 68 123 60 118 57C124 64 133 70 140 71V105"
            stroke="#475569"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.4"
          />
        </motion.g>
      </svg>

      {/* Typography block with standard brand guidelines */}
      {showText && (
        <div className="mt-4 space-y-1">
          <h2 className={`font-black tracking-tight ${currentSize.textClass} text-slate-900 dark:text-white`}>
            مسار التميز
          </h2>
          <p className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
            {labelText}
          </p>
        </div>
      )}
    </div>
  );
}
