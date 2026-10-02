import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import {
  FileText,
  Upload,
  Settings,
  FileDown,
  Type,
  Image as ImageIcon,
  Hash,
  LayoutTemplate,
  Award,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  Sparkles,
  RotateCw,
  Sliders,
  Maximize2,
  Minimize2,
  Layers,
  Shield,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Stamp
} from 'lucide-react';

type CustomizerTab = 'watermark' | 'image-stamp' | 'numbering' | 'header-footer' | 'grading' | 'borders';

interface UploadedPdfInfo {
  name: string;
  sizeFormatted: string;
  sizeBytes: number;
  pageCount: number;
  fileBuffer: ArrayBuffer | null;
  isMock: boolean;
}

export default function PdfStampTool() {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('watermark');
  
  // Document state
  const [docInfo, setDocInfo] = useState<UploadedPdfInfo>({
    name: 'فرض_تأليفي_نموذجي_رياضيات_السنة_التاسعة.pdf',
    sizeFormatted: '1.24 MB',
    sizeBytes: 1300000,
    pageCount: 3,
    fileBuffer: null,
    isMock: true,
  });

  const [activePreviewPage, setActivePreviewPage] = useState<number>(1);
  const [pageScope, setPageScope] = useState<'all' | 'first' | 'last' | 'even' | 'odd'>('all');

  // Tab 1: Text Watermark settings
  const [enableWatermark, setEnableWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState('مسار التميز — للأستاذ المتميز');
  const [watermarkColor, setWatermarkColor] = useState('#4f46e5');
  const [watermarkSize, setWatermarkSize] = useState<number>(38);
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.28);
  const [watermarkAngle, setWatermarkAngle] = useState<number>(-35);
  const [watermarkX, setWatermarkX] = useState<number>(50); // percentage
  const [watermarkY, setWatermarkY] = useState<number>(50); // percentage
  const [watermarkRepeated, setWatermarkRepeated] = useState<boolean>(false);

  // Tab 2: Image Stamp / Logo / Signature settings
  const [enableImageStamp, setEnableImageStamp] = useState(false);
  const [stampImageSrc, setStampImageSrc] = useState<string | null>(null);
  const [stampImageName, setStampImageName] = useState<string | null>(null);
  const [stampWidth, setStampWidth] = useState<number>(120);
  const [stampOpacity, setStampOpacity] = useState<number>(0.85);
  const [stampPosition, setStampPosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' | 'custom'>('top-left');
  const [stampCustomX, setStampCustomX] = useState<number>(15);
  const [stampCustomY, setStampCustomY] = useState<number>(85);

  // Tab 3: Page Numbering
  const [enableNumbering, setEnableNumbering] = useState(true);
  const [numberingFormat, setNumberingFormat] = useState<'page_x_of_y' | 'x_slash_y' | 'page_x' | 'dash_x'>('page_x_of_y');
  const [numberingPosition, setNumberingPosition] = useState<'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right'>('bottom-center');
  const [numberingStartPage, setNumberingStartPage] = useState<number>(1);
  const [numberingColor, setNumberingColor] = useState('#475569');
  const [numberingSize, setNumberingSize] = useState<number>(11);

  // Tab 4: Header & Footer
  const [enableHeaderFooter, setEnableHeaderFooter] = useState(false);
  const [headerRightText, setHeaderRightText] = useState('الجمهورية التونسية — وزارة التربية');
  const [headerCenterText, setHeaderCenterText] = useState('المندوبية الجهوية للتربية');
  const [headerLeftText, setHeaderLeftText] = useState('السنة الدراسية: 2024-2025');
  const [footerText, setFooterText] = useState('مسار التميز • إعداد الأستاذ: .......................... • حقوق النشر والطباعة محفوظة ©');
  const [showDividerLines, setShowDividerLines] = useState(true);

  // Tab 5: Teacher Grading Box
  const [enableGradingBox, setEnableGradingBox] = useState(false);
  const [gradingPosition, setGradingPosition] = useState<'top-right' | 'top-left'>('top-right');
  const [maxScore, setMaxScore] = useState<number>(20);

  // Tab 6: Decorative Border
  const [enableBorder, setEnableBorder] = useState(false);
  const [borderStyle, setBorderStyle] = useState<'solid' | 'double' | 'dashed'>('solid');
  const [borderColor, setBorderColor] = useState('#64748b');
  const [borderWidth, setBorderWidth] = useState<number>(2);

  // Processing & Export State
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Helper: Format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Preset watermark phrases
  const watermarkPresets = [
    { label: 'مسار التميز - للأستاذ', text: 'مسار التميز — للأستاذ المتميز' },
    { label: 'فرض مراقبة رسمي', text: 'فرض مراقبة رسمي • الجمهورية التونسية' },
    { label: 'نموذجي مع الإصلاح', text: 'نسخة نموذجية مع الإصلاح والتقييم' },
    { label: 'مسودة غير صالحة للنشر', text: 'مسودة دراسية • غير مخصصة للنشر' },
    { label: 'خاص بالدعم المدرسي', text: 'خاص بالدعم والمراجعة المدرسية 2025' },
    { label: 'سري وللامتحان فقط', text: 'وثيقة امتحانية سرية • يمنع النسخ' },
  ];

  // Preset educational stamps
  const educationalPresetStamps = [
    {
      id: 'masar-seal',
      name: 'ختم مسار التميز الرسمي',
      color: '#dc2626',
      text: 'معتمد ومطابق\nمسار التميز\n★ 2025 ★',
    },
    {
      id: 'excellent',
      name: 'وسام الامتياز 20/20',
      color: '#16a34a',
      text: 'عمل متميز جداً\n20 / 20\nأحسنت واصل!',
    },
    {
      id: 'verified',
      name: 'مصادق من الأستاذ',
      color: '#2563eb',
      text: 'تمت المراجعة والتأشير\nإمضاء الأستاذ(ة)\nمعتمد تربوياً',
    },
    {
      id: 'tunisia-flag',
      name: 'وزارة التربية تونس',
      color: '#b91c1c',
      text: 'الجمهورية التونسية\nوزارة التربية\nالامتحانات الوطنية',
    },
  ];

  // Handle PDF file selection from computer
  const handlePdfUpload = async (file: File) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setDownloadUrl(null);

      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('يرجى اختيار ملف بصيغة PDF فقط.');
        return;
      }

      const buffer = await file.arrayBuffer();
      let pageCount = 1;

      try {
        const loadedPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        pageCount = loadedPdf.getPageCount();
      } catch (err) {
        console.warn('Could not parse PDF page count with pdf-lib, defaulting to 1', err);
      }

      setDocInfo({
        name: file.name,
        sizeFormatted: formatBytes(file.size),
        sizeBytes: file.size,
        pageCount: Math.max(1, pageCount),
        fileBuffer: buffer,
        isMock: false,
      });

      setActivePreviewPage(1);
      setSuccessMessage(`تم تحميل الملف "${file.name}" بنجاح (${pageCount} صفحة). يمكنك الآن تطبيق التخصيصات!`);
    } catch (err: any) {
      console.error('Error reading PDF file', err);
      setErrorMessage('حدث خطأ أثناء قراءة ملف الـ PDF. تأكد من سلامة الملف وحاول ثانية.');
    }
  };

  const handlePdfInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePdfUpload(e.target.files[0]);
    }
  };

  const handlePdfDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle Image Stamp upload from computer
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار صورة صحيحة (PNG, JPG, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setStampImageSrc(reader.result as string);
      setStampImageName(file.name);
      setEnableImageStamp(true);
      setSuccessMessage(`تم إدراج صورة الختم/الشعار "${file.name}" بنجاح.`);
      setDownloadUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  // Select mock sample document
  const handleSelectMock = (name: string, pages: number, sizeBytes: number) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setDownloadUrl(null);
    setDocInfo({
      name,
      sizeFormatted: formatBytes(sizeBytes),
      sizeBytes,
      pageCount: pages,
      fileBuffer: null,
      isMock: true,
    });
    setActivePreviewPage(1);
  };

  // Convert canvas drawing to high-res transparent PNG buffer
  const generateTextPngBuffer = (
    text: string,
    fontSize: number,
    colorHex: string,
    extraOptions?: { isWatermark?: boolean; border?: boolean }
  ): Promise<Uint8Array> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(new Uint8Array());
        return;
      }

      const scale = 3; // 3x scale for crystal sharp vector-like text
      const scaledFontSize = fontSize * scale;
      ctx.font = `bold ${scaledFontSize}px Cairo, system-ui, sans-serif`;

      const lines = text.split('\n');
      let maxWidth = 0;
      lines.forEach((l) => {
        const m = ctx.measureText(l);
        if (m.width > maxWidth) maxWidth = m.width;
      });

      const lineHeight = scaledFontSize * 1.35;
      const totalTextHeight = lines.length * lineHeight;
      const padding = 20 * scale;

      canvas.width = Math.ceil(maxWidth + padding * 2);
      canvas.height = Math.ceil(totalTextHeight + padding * 2);

      const ctx2 = canvas.getContext('2d')!;
      ctx2.font = `bold ${scaledFontSize}px Cairo, system-ui, sans-serif`;
      ctx2.fillStyle = colorHex;
      ctx2.textAlign = 'center';
      ctx2.textBaseline = 'middle';

      const centerX = canvas.width / 2;
      const startY = (canvas.height - (lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        ctx2.fillText(line, centerX, startY + index * lineHeight);
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(new Uint8Array());
          return;
        }
        const ab = await blob.arrayBuffer();
        resolve(new Uint8Array(ab));
      }, 'image/png');
    });
  };

  // Convert an HTML Image or DataURL to Uint8Array PNG
  const imageSrcToPngBuffer = (src: string): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failure'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('Blob creation failure'));
            return;
          }
          const buf = await blob.arrayBuffer();
          resolve(new Uint8Array(buf));
        }, 'image/png');
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  };

  // Create mock sample PDF using pdf-lib if user didn't upload a file
  const generateSampleMockPdf = async (pages: number): Promise<PDFDocument> => {
    const doc = await PDFDocument.create();
    for (let i = 1; i <= pages; i++) {
      const page = doc.addPage([595.28, 841.89]); // A4 in points
      const { width, height } = page.getSize();

      // Background simulated exam paper border
      page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderWidth: 1,
        borderColor: rgb(0.85, 0.88, 0.92),
        color: rgb(0.99, 0.99, 1.0),
      });

      // Simulated exam content lines
      page.drawLine({
        start: { x: 30, y: height - 70 },
        end: { x: width - 30, y: height - 70 },
        thickness: 1,
        color: rgb(0.75, 0.8, 0.85),
      });
    }
    return doc;
  };

  // Main Action: Apply All Customizations & Generate Output PDF
  const handleApplyCustomizations = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setDownloadUrl(null);

    try {
      let pdfDoc: PDFDocument;

      if (docInfo.fileBuffer) {
        // Load the actual user file uploaded from computer
        pdfDoc = await PDFDocument.load(docInfo.fileBuffer, { ignoreEncryption: true });
      } else {
        // Generate authentic mock Tunisian exam document
        pdfDoc = await generateSampleMockPdf(docInfo.pageCount);
      }

      const totalPages = pdfDoc.getPageCount();

      // Check which pages to customize
      const shouldApplyToPage = (pageIdx: number): boolean => {
        const pageNum = pageIdx + 1;
        if (pageScope === 'all') return true;
        if (pageScope === 'first') return pageNum === 1;
        if (pageScope === 'last') return pageNum === totalPages;
        if (pageScope === 'odd') return pageNum % 2 !== 0;
        if (pageScope === 'even') return pageNum % 2 === 0;
        return true;
      };

      // 1. Prepare Watermark PNG if enabled
      let watermarkPngImage: any = null;
      if (enableWatermark && watermarkText.trim()) {
        try {
          const watermarkBuffer = await generateTextPngBuffer(
            watermarkText,
            watermarkSize,
            watermarkColor
          );
          if (watermarkBuffer.length > 0) {
            watermarkPngImage = await pdfDoc.embedPng(watermarkBuffer);
          }
        } catch (e) {
          console.warn('Failed to embed watermark PNG', e);
        }
      }

      // 2. Prepare Stamp Image if enabled
      let stampPngImage: any = null;
      if (enableImageStamp && stampImageSrc) {
        try {
          const stampBuffer = await imageSrcToPngBuffer(stampImageSrc);
          if (stampBuffer.length > 0) {
            stampPngImage = await pdfDoc.embedPng(stampBuffer);
          }
        } catch (e) {
          console.warn('Failed to embed stamp image', e);
        }
      }

      // Process each page
      for (let i = 0; i < totalPages; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        const pageNum = i + 1;
        const isTargeted = shouldApplyToPage(i);

        // A. Draw Border if enabled & targeted
        if (enableBorder && isTargeted) {
          const m = 18;
          const r = parseInt(borderColor.slice(1, 3), 16) / 255 || 0.4;
          const g = parseInt(borderColor.slice(3, 5), 16) / 255 || 0.45;
          const b = parseInt(borderColor.slice(5, 7), 16) / 255 || 0.5;

          page.drawRectangle({
            x: m,
            y: m,
            width: width - m * 2,
            height: height - m * 2,
            borderWidth: borderWidth,
            borderColor: rgb(r, g, b),
            borderDashArray: borderStyle === 'dashed' ? [6, 4] : undefined,
          });

          if (borderStyle === 'double') {
            const m2 = m + 4;
            page.drawRectangle({
              x: m2,
              y: m2,
              width: width - m2 * 2,
              height: height - m2 * 2,
              borderWidth: 1,
              borderColor: rgb(r, g, b),
            });
          }
        }

        // B. Draw Watermark if enabled & targeted
        if (watermarkPngImage && isTargeted) {
          const imgWidth = (watermarkPngImage.width / 3);
          const imgHeight = (watermarkPngImage.height / 3);

          if (watermarkRepeated) {
            // Repeat diagonally across 3x3 grid
            for (let rx = 0.2; rx <= 0.8; rx += 0.3) {
              for (let ry = 0.2; ry <= 0.8; ry += 0.3) {
                const posX = width * rx - imgWidth / 2;
                const posY = height * ry - imgHeight / 2;
                page.drawImage(watermarkPngImage, {
                  x: posX,
                  y: posY,
                  width: imgWidth * 0.75,
                  height: imgHeight * 0.75,
                  opacity: Math.max(0.08, watermarkOpacity * 0.7),
                  rotate: degrees(watermarkAngle),
                });
              }
            }
          } else {
            // Single targeted watermark
            const posX = (width * (watermarkX / 100)) - (imgWidth / 2);
            const posY = (height * ((100 - watermarkY) / 100)) - (imgHeight / 2);

            page.drawImage(watermarkPngImage, {
              x: posX,
              y: posY,
              width: imgWidth,
              height: imgHeight,
              opacity: watermarkOpacity,
              rotate: degrees(watermarkAngle),
            });
          }
        }

        // C. Draw Stamp Image if enabled & targeted
        if (stampPngImage && isTargeted) {
          const ratio = stampPngImage.height / stampPngImage.width;
          const drawW = stampWidth;
          const drawH = stampWidth * ratio;

          let stampX = 30;
          let stampY = height - drawH - 30;

          if (stampPosition === 'top-right') {
            stampX = width - drawW - 30;
            stampY = height - drawH - 30;
          } else if (stampPosition === 'top-left') {
            stampX = 30;
            stampY = height - drawH - 30;
          } else if (stampPosition === 'bottom-right') {
            stampX = width - drawW - 30;
            stampY = 30;
          } else if (stampPosition === 'bottom-left') {
            stampX = 30;
            stampY = 30;
          } else if (stampPosition === 'center') {
            stampX = (width - drawW) / 2;
            stampY = (height - drawH) / 2;
          } else if (stampPosition === 'custom') {
            stampX = (width * (stampCustomX / 100)) - drawW / 2;
            stampY = (height * ((100 - stampCustomY) / 100)) - drawH / 2;
          }

          page.drawImage(stampPngImage, {
            x: Math.max(10, Math.min(width - drawW - 10, stampX)),
            y: Math.max(10, Math.min(height - drawH - 10, stampY)),
            width: drawW,
            height: drawH,
            opacity: stampOpacity,
          });
        }

        // D. Draw Header & Footer if enabled & targeted
        if (enableHeaderFooter && isTargeted) {
          // Top Header text
          const headerString = `${headerRightText}        ${headerCenterText}        ${headerLeftText}`;
          const headerPng = await generateTextPngBuffer(headerString, 9.5, '#334155');
          const headerEmbed = await pdfDoc.embedPng(headerPng);
          const hW = headerEmbed.width / 3;
          const hH = headerEmbed.height / 3;
          page.drawImage(headerEmbed, {
            x: (width - hW) / 2,
            y: height - 28 - hH / 2,
            width: hW,
            height: hH,
            opacity: 0.95,
          });

          // Header line
          if (showDividerLines) {
            page.drawLine({
              start: { x: 30, y: height - 42 },
              end: { x: width - 30, y: height - 42 },
              thickness: 0.8,
              color: rgb(0.8, 0.85, 0.9),
            });
          }

          // Footer Text
          if (footerText.trim()) {
            const footerPng = await generateTextPngBuffer(footerText, 8.5, '#64748b');
            const footerEmbed = await pdfDoc.embedPng(footerPng);
            const fW = footerEmbed.width / 3;
            const fH = footerEmbed.height / 3;
            page.drawImage(footerEmbed, {
              x: (width - fW) / 2,
              y: 22 - fH / 2,
              width: fW,
              height: fH,
              opacity: 0.85,
            });

            if (showDividerLines) {
              page.drawLine({
                start: { x: 30, y: 35 },
                end: { x: width - 30, y: 35 },
                thickness: 0.8,
                color: rgb(0.8, 0.85, 0.9),
              });
            }
          }
        }

        // E. Draw Grading Box if enabled and on targeted page
        if (enableGradingBox && isTargeted && pageNum === 1) {
          const boxW = 140;
          const boxH = 48;
          const bX = gradingPosition === 'top-right' ? width - boxW - 32 : 32;
          const bY = height - 98;

          page.drawRectangle({
            x: bX,
            y: bY,
            width: boxW,
            height: boxH,
            borderWidth: 1.5,
            borderColor: rgb(0.8, 0.2, 0.2),
            color: rgb(1, 0.98, 0.98),
          });

          const scoreText = `العدد المسند: ....... / ${maxScore}\nملاحظة الأستاذ(ة): ...........\nتوقيع الولي: ...................`;
          const scorePng = await generateTextPngBuffer(scoreText, 8.5, '#991b1b');
          const scoreEmbed = await pdfDoc.embedPng(scorePng);
          page.drawImage(scoreEmbed, {
            x: bX + 6,
            y: bY + 4,
            width: (scoreEmbed.width / 3),
            height: (scoreEmbed.height / 3),
            opacity: 1,
          });
        }

        // F. Draw Page Numbering if enabled
        if (enableNumbering && pageNum >= numberingStartPage) {
          let numberStr = '';
          if (numberingFormat === 'page_x_of_y') {
            numberStr = `صفحة ${pageNum} من ${totalPages}`;
          } else if (numberingFormat === 'x_slash_y') {
            numberStr = `${pageNum} / ${totalPages}`;
          } else if (numberingFormat === 'page_x') {
            numberStr = `الصفحة ${pageNum}`;
          } else if (numberingFormat === 'dash_x') {
            numberStr = `- ${pageNum} -`;
          }

          const numPng = await generateTextPngBuffer(numberStr, numberingSize, numberingColor);
          const numEmbed = await pdfDoc.embedPng(numPng);
          const nW = numEmbed.width / 3;
          const nH = numEmbed.height / 3;

          let nX = (width - nW) / 2;
          let nY = 16;

          if (numberingPosition === 'bottom-center') {
            nX = (width - nW) / 2;
            nY = 16;
          } else if (numberingPosition === 'bottom-right') {
            nX = width - nW - 35;
            nY = 16;
          } else if (numberingPosition === 'bottom-left') {
            nX = 35;
            nY = 16;
          } else if (numberingPosition === 'top-center') {
            nX = (width - nW) / 2;
            nY = height - 25;
          } else if (numberingPosition === 'top-right') {
            nX = width - nW - 35;
            nY = height - 25;
          }

          page.drawImage(numEmbed, {
            x: nX,
            y: nY,
            width: nW,
            height: nH,
            opacity: 0.9,
          });
        }
      }

      // Output generated PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const cleanFileName = `مخصص_مسار_التميز_${docInfo.name}`;

      setDownloadUrl(url);
      setDownloadFileName(cleanFileName);
      setSuccessMessage(`تم معالجة وتخصيص ${totalPages} صفحة بنجاح! جاهز للتحميل والطباعة.`);
    } catch (err: any) {
      console.error('Error generating customized PDF', err);
      setErrorMessage(`حدث خطأ أثناء معالجة المستند: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = downloadFileName || 'مستند_مخصص_مسار_التميز.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-all">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Stamp className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              تخصيص ملفات PDF وإضافة العلامات المائية والأختام
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              محدّث ومطوّر 🚀
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold">
            استورد أي ملف PDF من حاسوبك، أضف علامات مائية نصية، أختاماً وتوقيعات، ترقيم صفحات أوتوماتيكي، ترويسات وتذييلات رسمية، وصدره فوراً بجودة فائقة!
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {downloadUrl ? (
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all cursor-pointer text-xs md:text-sm"
            >
              <FileDown className="w-4 h-4" />
              تحميل الملف المخصص الآن (PDF)
            </button>
          ) : (
            <button
              onClick={handleApplyCustomizations}
              disabled={isProcessing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg transition-all cursor-pointer text-xs md:text-sm"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري معالجة وتثبيت التخصيصات...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  تطبيق التخصيص وحفظ الملف
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center gap-3 text-xs text-rose-700 dark:text-rose-300 font-bold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-300 font-bold">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Upload & Controls Left / Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: File Manager & Customization Tabs */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. File Selector Block (Computer Upload / Sample) */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                ملف الـ PDF المراد تخصيصه
                {docInfo.isMock ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold">
                    نموذج تجريبي
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">
                    ملف من حاسوبك ✓
                  </span>
                )}
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePdfInputChange}
                  accept="application/pdf"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  اختيار ملف من الحاسوب
                </button>
              </div>
            </div>

            {/* Drag & drop or current file badge */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handlePdfDrop}
              className="bg-white dark:bg-slate-900 border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-4 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs md:text-sm text-slate-800 dark:text-slate-100 truncate max-w-[240px] sm:max-w-xs">
                      {docInfo.name}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                      <span>الحجم: {docInfo.sizeFormatted}</span>
                      <span>•</span>
                      <span>عدد الصفحات: {docInfo.pageCount} صفحة</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                >
                  استبدال
                </button>
              </div>
            </div>

            {/* Quick Sample Selector for Users without immediate files */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
              <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                أو جرب بنقرة واحدة على نماذج امتحانات تونس الجاهزة:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSelectMock('فرض_تأليفي_نموذجي_رياضيات_السنة_التاسعة.pdf', 3, 1350000)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    docInfo.name.includes('التاسعة')
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  📝 فرض تأليفي سنة 9 أساسي (3 صفحات)
                </button>
                <button
                  onClick={() => handleSelectMock('امتحان_تجريبي_باكالوريا_علوم_فيزيائية.pdf', 4, 1890000)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    docInfo.name.includes('باكالوريا')
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  🔬 باكالوريا علوم تجريبية (4 صفحات)
                </button>
                <button
                  onClick={() => handleSelectMock('كراس_الأنشطة_والتمارين_سنة_سادسة.pdf', 2, 920000)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    docInfo.name.includes('سادسة')
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  📚 مناظرة سادسة ابتدائي (صفحتان)
                </button>
              </div>
            </div>
          </div>

          {/* 2. Toolset Tabs Navigation */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('watermark')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'watermark'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              علامة مائية نصية
            </button>

            <button
              onClick={() => setActiveTab('image-stamp')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'image-stamp'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              ختم أو شعار
            </button>

            <button
              onClick={() => setActiveTab('numbering')}
              className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'numbering'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              ترقيم الصفحات
            </button>

            <button
              onClick={() => setActiveTab('header-footer')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'header-footer'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              ترويسة وتذييل
            </button>

            <button
              onClick={() => setActiveTab('grading')}
              className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'grading'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              جدول الأعداد
            </button>

            <button
              onClick={() => setActiveTab('borders')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'borders'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              إطار وهوامش
            </button>
          </div>

          {/* 3. Tab Contents */}
          <div className="bg-slate-50 dark:bg-slate-950/20 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
            {/* TAB 1: TEXT WATERMARK */}
            {activeTab === 'watermark' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enableWatermark}
                      onChange={(e) => setEnableWatermark(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    تفعيل العلامة المائية النصية
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">تكرار شبكي:</span>
                    <button
                      onClick={() => setWatermarkRepeated(!watermarkRepeated)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                        watermarkRepeated
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {watermarkRepeated ? 'مكرر على كامل الصفحة ✓' : 'علامة واحدة مركزية'}
                    </button>
                  </div>
                </div>

                {enableWatermark && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                        نص العلامة المائية:
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="أدخل النص هنا..."
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Presets */}
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        عبارات نموذجية سريعة:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {watermarkPresets.map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() => setWatermarkText(preset.text)}
                            className="text-[10px] px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 font-bold transition-all cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color and Font Size */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                          لون النص:
                        </label>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <input
                            type="color"
                            value={watermarkColor}
                            onChange={(e) => setWatermarkColor(e.target.value)}
                            className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-xs font-bold uppercase text-slate-700 dark:text-slate-200">
                            {watermarkColor}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
                          <span>حجم الخط:</span>
                          <span className="font-mono text-indigo-600 font-bold">{watermarkSize}px</span>
                        </label>
                        <input
                          type="range"
                          min="16"
                          max="72"
                          value={watermarkSize}
                          onChange={(e) => setWatermarkSize(parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>

                    {/* Opacity & Rotation */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
                          <span>الشفافية:</span>
                          <span className="font-mono text-indigo-600 font-bold">{Math.round(watermarkOpacity * 100)}%</span>
                        </label>
                        <input
                          type="range"
                          min="0.08"
                          max="0.9"
                          step="0.05"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
                          <span>زاوية الدوران:</span>
                          <span className="font-mono text-indigo-600 font-bold">{watermarkAngle}°</span>
                        </label>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          step="5"
                          value={watermarkAngle}
                          onChange={(e) => setWatermarkAngle(parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>

                    {!watermarkRepeated && (
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
                            <span>موضع أفقي (X):</span>
                            <span className="font-bold text-indigo-600">{watermarkX}%</span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={watermarkX}
                            onChange={(e) => setWatermarkX(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
                            <span>موضع عمودي (Y):</span>
                            <span className="font-bold text-indigo-600">{watermarkY}%</span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={watermarkY}
                            onChange={(e) => setWatermarkY(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB 2: IMAGE STAMP / LOGO / SIGNATURE */}
            {activeTab === 'image-stamp' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enableImageStamp}
                      onChange={(e) => setEnableImageStamp(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    تفعيل ختم الصورة أو الشعار أو التوقيع
                  </label>

                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageInputChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    رفع صورة من الحاسوب
                  </button>
                </div>

                {enableImageStamp && (
                  <>
                    {/* Uploaded image banner */}
                    {stampImageSrc ? (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={stampImageSrc}
                            alt="Stamp preview"
                            className="w-12 h-12 object-contain bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">
                              {stampImageName || 'صورة الختم المخصصة'}
                            </p>
                            <span className="text-[10px] text-emerald-600 font-semibold">جاهز للتضمين في المستند</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setStampImageSrc(null);
                            setStampImageName(null);
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="حذف الصورة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl text-center space-y-2">
                        <p className="text-xs text-indigo-700 dark:text-indigo-300 font-bold">
                          لم يتم اختيار صورة بعد. ارفع شعار مؤسستك أو توقيعك من حاسوبك، أو اختر ختماً تعليمياً جاهزاً:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 pt-1">
                          {educationalPresetStamps.map((badge) => (
                            <button
                              key={badge.id}
                              onClick={async () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = 240;
                                canvas.height = 240;
                                const ctx = canvas.getContext('2d')!;
                                ctx.strokeStyle = badge.color;
                                ctx.lineWidth = 6;
                                ctx.beginPath();
                                ctx.arc(120, 120, 110, 0, Math.PI * 2);
                                ctx.stroke();

                                ctx.beginPath();
                                ctx.arc(120, 120, 100, 0, Math.PI * 2);
                                ctx.lineWidth = 2;
                                ctx.stroke();

                                ctx.font = 'bold 22px Cairo, sans-serif';
                                ctx.fillStyle = badge.color;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                const lines = badge.text.split('\n');
                                lines.forEach((l, idx) => {
                                  ctx.fillText(l, 120, 85 + idx * 35);
                                });

                                setStampImageSrc(canvas.toDataURL('image/png'));
                                setStampImageName(badge.name);
                              }}
                              className="text-[11px] px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 font-bold hover:border-indigo-500 transition-all cursor-pointer shadow-sm"
                            >
                              {badge.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stamp controls */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
                          <span>عرض الختم / الحجم:</span>
                          <span className="font-bold text-indigo-600">{stampWidth}px</span>
                        </label>
                        <input
                          type="range"
                          min="40"
                          max="260"
                          value={stampWidth}
                          onChange={(e) => setStampWidth(parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
                          <span>الشفافية:</span>
                          <span className="font-bold text-indigo-600">{Math.round(stampOpacity * 100)}%</span>
                        </label>
                        <input
                          type="range"
                          min="0.2"
                          max="1"
                          step="0.05"
                          value={stampOpacity}
                          onChange={(e) => setStampOpacity(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>

                    {/* Position selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                        موضع الختم في الصفحة:
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {[
                          { id: 'top-left', label: 'أعلى اليسار' },
                          { id: 'top-right', label: 'أعلى اليمين' },
                          { id: 'center', label: 'في الوسط' },
                          { id: 'bottom-left', label: 'أسفل اليسار' },
                          { id: 'bottom-right', label: 'أسفل اليمين' },
                          { id: 'custom', label: 'مخصص بالمنزلق' },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            onClick={() => setStampPosition(pos.id as any)}
                            className={`py-1.5 px-2 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                              stampPosition === pos.id
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {stampPosition === 'custom' && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                            أفقي (X): {stampCustomX}%
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="95"
                            value={stampCustomX}
                            onChange={(e) => setStampCustomX(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                            عمودي (Y): {stampCustomY}%
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="95"
                            value={stampCustomY}
                            onChange={(e) => setStampCustomY(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB 3: PAGE NUMBERING */}
            {activeTab === 'numbering' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enableNumbering}
                      onChange={(e) => setEnableNumbering(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    تفعيل ترقيم الصفحات التلقائي
                  </label>
                </div>

                {enableNumbering && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                          صيغة الترقيم:
                        </label>
                        <select
                          value={numberingFormat}
                          onChange={(e) => setNumberingFormat(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                        >
                          <option value="page_x_of_y">صفحة X من Y (مثال: صفحة 1 من 4)</option>
                          <option value="x_slash_y">X / Y (مثال: 1 / 4)</option>
                          <option value="page_x">الصفحة X (مثال: الصفحة 1)</option>
                          <option value="dash_x">- X - (مثال: - 1 -)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                          موضع الترقيم:
                        </label>
                        <select
                          value={numberingPosition}
                          onChange={(e) => setNumberingPosition(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                        >
                          <option value="bottom-center">أسفل الصفحة — في الوسط</option>
                          <option value="bottom-right">أسفل الصفحة — في اليمين</option>
                          <option value="bottom-left">أسفل الصفحة — في اليسار</option>
                          <option value="top-center">أعلى الصفحة — في الوسط</option>
                          <option value="top-right">أعلى الصفحة — في اليمين</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                          البدء من الصفحة:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={docInfo.pageCount}
                          value={numberingStartPage}
                          onChange={(e) => setNumberingStartPage(parseInt(e.target.value, 10) || 1)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-center focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                          حجم الخط:
                        </label>
                        <input
                          type="number"
                          min="8"
                          max="20"
                          value={numberingSize}
                          onChange={(e) => setNumberingSize(parseInt(e.target.value, 10) || 11)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-center focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                          لون الترقيم:
                        </label>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                          <input
                            type="color"
                            value={numberingColor}
                            onChange={(e) => setNumberingColor(e.target.value)}
                            className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[11px] font-bold uppercase">{numberingColor}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 4: HEADER & FOOTER */}
            {activeTab === 'header-footer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enableHeaderFooter}
                      onChange={(e) => setEnableHeaderFooter(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    تفعيل الترويسة والتذييل الرسمي للمستند
                  </label>

                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDividerLines}
                      onChange={(e) => setShowDividerLines(e.target.checked)}
                      className="w-3.5 h-3.5 text-indigo-600 rounded"
                    />
                    خط فاصل أنيق
                  </label>
                </div>

                {enableHeaderFooter && (
                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="block text-[11px] font-bold text-indigo-600">ترويسة أعلى الصفحة:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">اليمين:</label>
                          <input
                            type="text"
                            value={headerRightText}
                            onChange={(e) => setHeaderRightText(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">الوسط:</label>
                          <input
                            type="text"
                            value={headerCenterText}
                            onChange={(e) => setHeaderCenterText(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">اليسار:</label>
                          <input
                            type="text"
                            value={headerLeftText}
                            onChange={(e) => setHeaderLeftText(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <label className="block text-[11px] font-bold text-indigo-600 mb-1">
                        تذييل أسفل الصفحة:
                      </label>
                      <input
                        type="text"
                        value={footerText}
                        onChange={(e) => setFooterText(e.target.value)}
                        placeholder="أدخل نص التذييل (حقوق الطبع، اسم الأستاذ، الهاتف...)"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: TEACHER GRADING BOX */}
            {activeTab === 'grading' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enableGradingBox}
                      onChange={(e) => setEnableGradingBox(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    تفعيل جدول التقييم والعدد المدرسي (للأساتذة)
                  </label>
                </div>

                {enableGradingBox && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                          العلامة القصوى:
                        </label>
                        <select
                          value={maxScore}
                          onChange={(e) => setMaxScore(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                        >
                          <option value="20">على 20 (المعايير التونسية)</option>
                          <option value="10">على 10</option>
                          <option value="30">على 30</option>
                          <option value="40">على 40</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                          موضع جدول التقييم:
                        </label>
                        <select
                          value={gradingPosition}
                          onChange={(e) => setGradingPosition(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                        >
                          <option value="top-right">أعلى اليمين (الصفحة الأولى)</option>
                          <option value="top-left">أعلى اليسار (الصفحة الأولى)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-[11px] text-red-800 dark:text-red-300 font-semibold space-y-1">
                      <p className="font-bold">معاينة نص الجدول المضاف تلقائياً:</p>
                      <p>• العدد المسند: ................. / {maxScore}</p>
                      <p>• ملاحظة الأستاذ(ة): .................................</p>
                      <p>• إمضاء وتوقيع الولي: ..............................</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: DECORATIVE BORDER */}
            {activeTab === 'borders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enableBorder}
                      onChange={(e) => setEnableBorder(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    تفعيل إطار وهوامش أمان للصفحة
                  </label>
                </div>

                {enableBorder && (
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                        نمط الإطار:
                      </label>
                      <select
                        value={borderStyle}
                        onChange={(e) => setBorderStyle(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold"
                      >
                        <option value="solid">إطار كلاسيكي متصل</option>
                        <option value="double">إطار هندسي مزدوج</option>
                        <option value="dashed">إطار منقط مقطع</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                        سُمك الخط:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={borderWidth}
                        onChange={(e) => setBorderWidth(parseInt(e.target.value, 10) || 1)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                        لون الإطار:
                      </label>
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border">
                        <input
                          type="color"
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="font-mono text-[11px] font-bold uppercase">{borderColor}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Target pages selector */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                تطبيق التخصيصات المختارة على:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'جميع الصفحات' },
                  { id: 'first', label: 'الصفحة الأولى فقط' },
                  { id: 'last', label: 'الصفحة الأخيرة فقط' },
                  { id: 'odd', label: 'الصفحات الفردية' },
                  { id: 'even', label: 'الصفحات الزوجية' },
                ].map((scope) => (
                  <button
                    key={scope.id}
                    onClick={() => setPageScope(scope.id as any)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      pageScope === scope.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {scope.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Visual Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-3">
            <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs md:text-sm flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-600" />
              معاينة حية وتفاعلية للمستند
            </h4>

            {/* Page navigation */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl">
              <button
                disabled={activePreviewPage <= 1}
                onClick={() => setActivePreviewPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold px-1 text-slate-700 dark:text-slate-300">
                {activePreviewPage} / {docInfo.pageCount}
              </span>
              <button
                disabled={activePreviewPage >= docInfo.pageCount}
                onClick={() => setActivePreviewPage((p) => Math.min(docInfo.pageCount, p + 1))}
                className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                title="الصفحة التالية"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Document Sheet */}
          <div className="w-full max-w-[380px] aspect-[1/1.414] bg-white text-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl relative shadow-2xl overflow-hidden select-none p-5 flex flex-col justify-between transition-all">
            {/* Visual Simulated Border */}
            {enableBorder && (
              <div
                className="absolute inset-2 pointer-events-none rounded-lg"
                style={{
                  borderWidth: `${borderWidth}px`,
                  borderColor: borderColor,
                  borderStyle: borderStyle === 'dashed' ? 'dashed' : 'solid',
                }}
              >
                {borderStyle === 'double' && (
                  <div
                    className="absolute inset-1 border"
                    style={{ borderColor: borderColor }}
                  />
                )}
              </div>
            )}

            {/* Header section preview */}
            <div className="relative z-10 w-full">
              {enableHeaderFooter ? (
                <div className="pb-1.5 border-b border-slate-300 text-[8px] font-bold text-slate-600 flex justify-between items-center">
                  <span>{headerRightText}</span>
                  <span className="text-slate-900">{headerCenterText}</span>
                  <span>{headerLeftText}</span>
                </div>
              ) : (
                <div className="pb-1 border-b border-slate-200 text-[8px] font-bold text-slate-400 flex justify-between">
                  <span>مسار التميز النموذجي</span>
                  <span>{docInfo.name.substring(0, 30)}...</span>
                </div>
              )}
            </div>

            {/* Simulated Sheet Body / Content lines */}
            <div className="relative z-10 my-auto space-y-4 px-2">
              {/* Grading Box if enabled */}
              {enableGradingBox && activePreviewPage === 1 && (
                <div
                  className={`p-2 bg-rose-50/90 border-2 border-rose-600 rounded-lg text-[8px] font-bold text-rose-900 max-w-[140px] shadow-sm ${
                    gradingPosition === 'top-left' ? 'mr-auto text-left' : 'ml-auto text-right'
                  }`}
                >
                  <p className="border-b border-rose-200 pb-0.5 font-black">
                    العدد: ......... / {maxScore}
                  </p>
                  <p className="pt-0.5">ملاحظة: .................</p>
                  <p>توقيع الولي: .............</p>
                </div>
              )}

              {/* School exercise lines */}
              <div className="space-y-1.5 text-right">
                <div className="h-2.5 bg-slate-200 rounded w-3/4" />
                <div className="h-1.5 bg-slate-100 rounded w-1/2" />
              </div>

              <div className="border border-dashed border-slate-200 p-1.5 text-[8px] text-slate-400 text-right rounded">
                الاسم واللقب: ................................... القسم: التاسعة أساسي
              </div>

              <div className="space-y-2 mt-3 text-right">
                <div className="h-2 bg-indigo-100 rounded w-1/3" />
                <div className="h-1.5 bg-slate-100 rounded w-full" />
                <div className="h-1.5 bg-slate-100 rounded w-11/12" />
                <div className="h-1.5 bg-slate-100 rounded w-4/5" />
              </div>

              <div className="space-y-2 mt-4 text-right">
                <div className="h-2 bg-indigo-100 rounded w-1/4" />
                <div className="h-1.5 bg-slate-100 rounded w-full" />
                <div className="h-1.5 bg-slate-100 rounded w-5/6" />
              </div>
            </div>

            {/* LIVE WATERMARK OVERLAY */}
            {enableWatermark && watermarkText && (
              watermarkRepeated ? (
                <div className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-around z-20 overflow-hidden opacity-80">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <div
                      key={idx}
                      className="font-black select-none m-4"
                      style={{
                        color: watermarkColor,
                        fontSize: `${watermarkSize / 2.8}px`,
                        opacity: Math.max(0.08, watermarkOpacity * 0.7),
                        transform: `rotate(${watermarkAngle}deg)`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {watermarkText}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="absolute pointer-events-none text-center font-black tracking-wider z-20 select-none flex items-center justify-center"
                  style={{
                    left: `${watermarkX}%`,
                    top: `${watermarkY}%`,
                    transform: `translate(-50%, -50%) rotate(${watermarkAngle}deg)`,
                    color: watermarkColor,
                    fontSize: `${watermarkSize / 2.2}px`,
                    opacity: watermarkOpacity,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {watermarkText}
                </div>
              )
            )}

            {/* LIVE IMAGE STAMP / LOGO OVERLAY */}
            {enableImageStamp && stampImageSrc && (
              <div
                className="absolute pointer-events-none z-30 select-none"
                style={{
                  width: `${stampWidth / 1.7}px`,
                  opacity: stampOpacity,
                  left:
                    stampPosition === 'top-left' || stampPosition === 'bottom-left'
                      ? '16px'
                      : stampPosition === 'top-right' || stampPosition === 'bottom-right'
                      ? 'auto'
                      : stampPosition === 'center'
                      ? '50%'
                      : `${stampCustomX}%`,
                  right:
                    stampPosition === 'top-right' || stampPosition === 'bottom-right'
                      ? '16px'
                      : 'auto',
                  top:
                    stampPosition === 'top-left' || stampPosition === 'top-right'
                      ? '26px'
                      : stampPosition === 'center'
                      ? '50%'
                      : stampPosition === 'custom'
                      ? `${stampCustomY}%`
                      : 'auto',
                  bottom:
                    stampPosition === 'bottom-left' || stampPosition === 'bottom-right'
                      ? '26px'
                      : 'auto',
                  transform:
                    stampPosition === 'center' || stampPosition === 'custom'
                      ? 'translate(-50%, -50%)'
                      : 'none',
                }}
              >
                <img
                  src={stampImageSrc}
                  alt="Live Stamp Overlay"
                  className="w-full h-auto object-contain drop-shadow"
                />
              </div>
            )}

            {/* Footer / Numbering Preview */}
            <div className="relative z-10 w-full">
              {enableHeaderFooter && footerText && (
                <div className="pt-1.5 border-t border-slate-300 text-[7px] text-slate-500 font-semibold text-center truncate">
                  {footerText}
                </div>
              )}

              {enableNumbering && (
                <div
                  className={`text-[8px] font-bold text-center mt-1`}
                  style={{
                    color: numberingColor,
                    textAlign:
                      numberingPosition === 'bottom-right' || numberingPosition === 'top-right'
                        ? 'right'
                        : numberingPosition === 'bottom-left'
                        ? 'left'
                        : 'center',
                  }}
                >
                  {numberingFormat === 'page_x_of_y' && `صفحة ${activePreviewPage} من ${docInfo.pageCount}`}
                  {numberingFormat === 'x_slash_y' && `${activePreviewPage} / ${docInfo.pageCount}`}
                  {numberingFormat === 'page_x' && `الصفحة ${activePreviewPage}`}
                  {numberingFormat === 'dash_x' && `- ${activePreviewPage} -`}
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-semibold mt-3 text-center">
            💡 المعاينة تعكس فورياً جميع التعديلات والألوان والزوايا المطبقة على الصفحة {activePreviewPage}.
          </p>
        </div>
      </div>
    </div>
  );
}
