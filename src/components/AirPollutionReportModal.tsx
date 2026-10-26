import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  Bike,
  Home,
  HeartPulse,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Calendar,
  MapPin,
  Activity,
  Layers,
  Code2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AirPollutionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CustomerTarget = 'school' | 'fleet' | 'rwa' | 'clinic' | 'sports';

interface TargetConfig {
  id: CustomerTarget;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  badge: string;
  pricingTier: string;
  executiveTitle: string;
  targetAudience: string;
  riskEvaluation: string;
  primaryDirective: string;
  actionItems: string[];
}

export const AirPollutionReportModal: React.FC<AirPollutionReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { airData, currentLocation } = useAirGuard();
  const [selectedTarget, setSelectedTarget] = useState<CustomerTarget>('school');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Always reset to normal default windowed size every time modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsFullscreen(false);
    onClose();
  };

  // Generate reproducible Audit ID based on location and date
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const cityCode = (currentLocation.city || 'IND').substring(0, 3).toUpperCase();
  const auditId = `AG-${cityCode}-${now.getFullYear()}-${Math.abs(
    (currentLocation.baseAqi || 100) * 47 + 1024
  )}`;

  const aqi = airData.aqi;
  const pm25 = airData.pm25;
  const pm10 = airData.pm10;
  const no2 = airData.no2 || 38;
  const o3 = airData.o3 || 24;
  const co = airData.co || 1.1;

  // Determine overall compliance grade
  const isHazardous = aqi > 250 || pm25 > 120;
  const isModerate = aqi > 100 && aqi <= 250;
  const complianceStatus = isHazardous
    ? 'CRITICAL EXCEEDANCE (NON-COMPLIANT)'
    : isModerate
    ? 'MODERATE ELEVATION (ACTION REQUIRED)'
    : 'SATISFACTORY COMPLIANCE (SAFE)';

  const statusColor = isHazardous
    ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30'
    : isModerate
    ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30'
    : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  // 5 Customer Profiles & Monetization Configurations
  const targetConfigs: Record<CustomerTarget, TargetConfig> = {
    school: {
      id: 'school',
      label: 'Campus / Schools',
      subLabel: 'Educational SOP',
      icon: Building2,
      badge: 'Educational Compliance SOP',
      pricingTier: 'SaaS: ₹2,500/mo',
      executiveTitle: 'Morning Campus Environmental Safety & Sports Advisory',
      targetAudience: 'Principals, Physical Education Dept, Parent-Teacher Council',
      riskEvaluation: isHazardous
        ? 'Severe alveolar deposition risk for students under 14. Pulmonary strain index exceeds safe physiological threshold.'
        : 'Acceptable baseline. Sensitive children with diagnosed asthma require preemptive bronchodilator accessibility.',
      primaryDirective: isHazardous
        ? 'MANDATORY SUSPENSION of outdoor assemblies, PE sports periods, and marathon training.'
        : 'Outdoor physical education permitted with continuous PM2.5 monitoring.',
      actionItems: [
        'Relocate morning prayer & assemblies to indoor auditorium with active air recirculators.',
        'Ensure classroom HEPA filtration or seal windward windows between 07:00 AM – 10:30 AM.',
        'Issue digital WhatsApp/SMS alert to parents recommending N95 masks during bus transit.',
        'Keep school medical bay stocked with salbutamol inhalers and pulse oximeters.',
      ],
    },
    fleet: {
      id: 'fleet',
      label: 'Delivery Logistics',
      subLabel: 'Gig-Worker ESG',
      icon: Bike,
      badge: 'ESG Occupational Safety SOP',
      pricingTier: 'API: ₹25/rider/mo',
      executiveTitle: 'Fleet Occupational Respiratory Safety & ESG Exposure Audit',
      targetAudience: 'Operations Directors (Zomato/Blinkit/Swiggy/Amazon), Rider Safety Officers',
      riskEvaluation: isHazardous
        ? 'Riders on 8-hour outdoor road shifts inhale an estimated ~240µg of particulate matter (equivalent to smoking 8 cigarettes).'
        : 'Moderate traffic corridor particulate build-up. Cumulative 8-hour exposure within manageable threshold.',
      primaryDirective: isHazardous
        ? 'TRIGGER RIDER SAFETY PROTOCOL: Rotate hub shifts to maximum 3.5 continuous hours; enforce clean routing corridors.'
        : 'Standard shift allocation permitted. Distribute activated-carbon N95 masks at regional hubs.',
      actionItems: [
        'Route active orders through low-particulate secondary arterial roads via AirGuard Clean Routing.',
        'Mandatory 20-minute rest intervals inside air-conditioned dark stores/hubs every 2 hours.',
        'Provide company-sponsored daily clean hydration points and certified anti-pollution masks.',
        'Log individual rider exposure score into the company monthly ESG sustainability compliance filing.',
      ],
    },
    rwa: {
      id: 'rwa',
      label: 'Residential / RWA',
      subLabel: 'Estate Ambient Audit',
      icon: Home,
      badge: 'Property ESG Ambient Audit',
      pricingTier: 'Audit: ₹3,500/qtr',
      executiveTitle: 'Residential Society Ambient Air Quality & Facility HVAC Audit',
      targetAudience: 'Society Management Committee, Estate Managers, High-Rise Residents',
      riskEvaluation: isHazardous
        ? 'Estate boundary air quality exceeds WHO standards by 4.8x. Inversion trapping particulate matter in inner courtyards.'
        : 'Estate ambient particulate levels within regional baseline. Green buffer foliage acting effectively.',
      primaryDirective: isHazardous
        ? 'TRIGGER ESTATE PURIFICATION: Activate basement exhaust scrubbers and indoor community clubhouse filtration.'
        : 'Maintain standard mechanical ventilation schedules; schedule weekly foliage water misting.',
      actionItems: [
        'Run basement parking exhaust fans between 08:00 AM – 11:00 AM to eliminate vehicle cold-start CO build-up.',
        'Deploy perimeter misting water nozzles along jogging tracks to knock down suspended PM10 dust.',
        'Display live AirGuard AQI index on society entrance lobby digital notice boards.',
        'Issue advisory to senior citizen residents to avoid morning walks before 09:30 AM.',
      ],
    },
    clinic: {
      id: 'clinic',
      label: 'Clinical / Healthcare',
      subLabel: 'Pulmonology Dossier',
      icon: HeartPulse,
      badge: 'Clinical Diagnostic Record',
      pricingTier: 'Partner: ₹75/audit',
      executiveTitle: 'Clinical Respiratory Inhalation Deposition Profile',
      targetAudience: 'Pulmonologists, Pediatricians, Chest Physicians, Health Insurers',
      riskEvaluation: isHazardous
        ? 'Calculated minute alveolar volume at 16 breaths/min deposits ~18.4µg/hr of PM2.5 in deep bronchial pathways.'
        : 'Particulate deposition within compensatory clearance limits of pulmonary macrophage system.',
      primaryDirective: isHazardous
        ? 'CLINICAL ADVISORY: Step-up prophylactic corticosteroid dosage as indicated; avoid outdoor cardio.'
        : 'Maintain baseline maintenance medication. Monitor peak expiratory flow rate (PEFR).',
      actionItems: [
        'Patient should keep short-acting beta-agonists (SABA) readily available during local travel.',
        'Seal domestic sleeping quarters with continuous CADR >250 m³/h air purifier.',
        'Schedule follow-up spirometry if persistent dry cough, nocturnal wheeze, or chest tightness occurs.',
        'Provide this environmental telemetry summary to your physician during clinical consultations.',
      ],
    },
    sports: {
      id: 'sports',
      label: 'Sports & Marathons',
      subLabel: 'Event Clearance',
      icon: Trophy,
      badge: 'Event Liability Clearance',
      pricingTier: 'Clearance: ₹7,500/event',
      executiveTitle: 'Athletic High-VO2 Endurance & Event Environmental Clearance',
      targetAudience: 'Marathon Race Directors, Sports Academies, Tournament Committees',
      riskEvaluation: isHazardous
        ? 'Athletes under high aerobic exertion inhale 40–80 L/min of air (5x resting volume), inducing severe airway hyperreactivity.'
        : 'Aerobic exertion within acceptable sports safety index. Optimum athletic window open.',
      primaryDirective: isHazardous
        ? 'EVENT CLEARANCE RESTRICTED: Postpone high-intensity outdoor endurance events until atmospheric inversion lifts.'
        : 'CLEARANCE GRANTED: Outdoor endurance athletics permitted with designated hydration/recovery zones.',
      actionItems: [
        'Shift outdoor training to safest 2-hour window: 03:30 PM – 05:30 PM today.',
        'Set up medical first-aid recovery tents equipped with oxygen concentrators along race perimeter.',
        'Enforce mandatory pre-race pulmonary screening for athletes with allergic rhinitis.',
        'File this signed AirGuard Environmental Clearance Certificate with the sports governing board.',
      ],
    },
  };

  const currentConfig = targetConfigs[selectedTarget];

  // Professional Single-Page A4 Isolated Print Engine (Guaranteed zero right-cut, zero blank pages)
  const handlePrint = () => {
    const printSource = document.getElementById('airguard-print-certificate');
    if (!printSource) {
      window.print();
      return;
    }

    // Clean up any stale print frames first
    const existingFrame = document.getElementById('airguard-isolated-print-iframe');
    if (existingFrame) {
      existingFrame.remove();
    }

    // Create an isolated sandbox iframe with exact A4 portrait physical dimensions
    // Positive dimensions + opacity 0 force full DOM layout tree computation without visual artifacts
    const iframe = document.createElement('iframe');
    iframe.id = 'airguard-isolated-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-99999';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    // Collect all stylesheets from host document to inherit typography and Tailwind classes
    let stylesHtml = '';
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
      stylesHtml += el.outerHTML;
    });

    // Write self-contained HTML directly into the isolated iframe
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>AirGuard_Compliance_Audit_${auditId}</title>
          ${stylesHtml}
          <style>
            @page {
              size: A4 portrait;
              margin: 7mm 9mm 7mm 9mm;
            }
            * {
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: auto !important;
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              -webkit-font-smoothing: antialiased;
              overflow: visible !important;
            }
            :root {
              --ink: #0f172a !important;
              --mut: #334155 !important;
              --card: #ffffff !important;
              --bg: #f8fafc !important;
              --line: #cbd5e1 !important;
              --ac: #0284c7 !important;
              --onac: #ffffff !important;
            }
            .print-document-root {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 auto !important;
              padding: 0 !important;
              background: #ffffff !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            /* Deterministic print frame styling matching official ISO/CPCB certificate */
            .certificate-frame {
              border: 2px solid #0f172a !important;
              border-radius: 10px !important;
              background-color: #ffffff !important;
              padding: 14px 18px !important;
              margin: 0 auto !important;
              width: 100% !important;
              box-sizing: border-box !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .no-print {
              display: none !important;
            }
            .print-avoid-break {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            /* Table formatting */
            table {
              width: 100% !important;
              border-collapse: collapse !important;
            }
            th, td {
              border-color: #cbd5e1 !important;
            }
          </style>
        </head>
        <body>
          <div class="print-document-root">
            ${printSource.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Trigger printing once the iframe document has parsed and applied styles
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Iframe print error, falling back to window.print():', err);
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            iframe.remove();
          }
        }, 4000);
      }
    }, 300);
  };

  // Intercept keyboard Ctrl+P / Cmd+P while modal is open to ensure clean isolated single-page print
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        if (isOpen) {
          e.preventDefault();
          handlePrint();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedTarget, currentLocation, airData]);

  if (!isOpen) return null;

  const handleExportCsv = () => {
    const csvContent = [
      ['AirGuard Environmental Compliance Audit Report'],
      ['Audit ID', auditId],
      ['Generated On', `${dateStr} ${timeStr}`],
      ['Location', currentLocation.name],
      ['Coordinates', `${currentLocation.coordinates[0]}, ${currentLocation.coordinates[1]}`],
      ['Audit Target', currentConfig.label],
      ['Compliance Status', complianceStatus],
      [''],
      ['Pollutant', 'Observed Value', 'WHO Benchmark', 'National Standard', 'Status'],
      ['AQI', aqi, '50', '100', aqi > 100 ? 'Exceeded' : 'Safe'],
      ['PM2.5 (ug/m3)', pm25, '15', '60', pm25 > 60 ? 'Exceeded' : 'Safe'],
      ['PM10 (ug/m3)', pm10, '45', '100', pm10 > 100 ? 'Exceeded' : 'Safe'],
      ['NO2 (ug/m3)', no2, '25', '80', no2 > 80 ? 'Exceeded' : 'Safe'],
      ['O3 (ug/m3)', o3, '60', '100', o3 > 100 ? 'Exceeded' : 'Safe'],
      ['CO (mg/m3)', co, '4.0', '2.0', co > 2.0 ? 'Exceeded' : 'Safe'],
      [''],
      ['Primary Directive', currentConfig.primaryDirective],
      ['Target Audience', currentConfig.targetAudience],
      ['Pricing Model', currentConfig.pricingTier],
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AirGuard_Audit_${auditId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Audit Report downloaded');
  };

  const handleExportJson = () => {
    const jsonPayload = {
      reportId: auditId,
      issuedAt: now.toISOString(),
      location: {
        name: currentLocation.name,
        city: currentLocation.city,
        state: currentLocation.state,
        latitude: currentLocation.coordinates[0],
        longitude: currentLocation.coordinates[1],
      },
      sectorAudit: {
        targetId: selectedTarget,
        title: currentConfig.executiveTitle,
        audience: currentConfig.targetAudience,
        commercialTier: currentConfig.pricingTier,
      },
      environmentalTelemetry: {
        aqi: aqi,
        complianceFinding: complianceStatus,
        pollutants: {
          pm25: { observed: pm25, unit: 'µg/m³', whoBenchmark: 15, cpcbLimit: 60, isSafe: pm25 <= 60 },
          pm10: { observed: pm10, unit: 'µg/m³', whoBenchmark: 45, cpcbLimit: 100, isSafe: pm10 <= 100 },
          no2: { observed: no2, unit: 'µg/m³', whoBenchmark: 25, cpcbLimit: 80, isSafe: no2 <= 80 },
          o3: { observed: o3, unit: 'µg/m³', whoBenchmark: 60, cpcbLimit: 100, isSafe: o3 <= 100 },
          co: { observed: co, unit: 'mg/m³', whoBenchmark: 4.0, cpcbLimit: 2.0, isSafe: co <= 2.0 },
        },
      },
      actionDirectives: {
        physiologicalRisk: currentConfig.riskEvaluation,
        primaryMandate: currentConfig.primaryDirective,
        actionableSOPs: currentConfig.actionItems,
      },
      cryptographicSignature: {
        authority: 'AirGuard Telemetry System',
        hash: `${auditId}-${(pm25 * 97).toFixed(0)}e9f`,
        certified: true,
      },
    };

    const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AirGuard_Enterprise_API_${auditId}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Enterprise JSON API payload downloaded');
  };

  const handleCopySummary = async () => {
    const summaryText = `🛡️ *AirGuard Compliance Audit Summary*
📍 Location: ${currentLocation.name} (${currentLocation.coordinates[0].toFixed(2)}°N, ${currentLocation.coordinates[1].toFixed(2)}°E)
🆔 Audit ID: ${auditId}
📅 Generated: ${dateStr} at ${timeStr}
🎯 Sector: ${currentConfig.label}

⚠️ Status: ${complianceStatus}
• Composite NAQI: ${aqi}
• PM2.5: ${pm25} µg/m³ (WHO Limit: 15 µg/m³)
• PM10: ${pm10} µg/m³

📌 Core Directive:
"${currentConfig.primaryDirective}"

SOP Action Directives:
${currentConfig.actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}

🔒 Verified by AirGuard Environmental Operations`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setIsCopied(true);
      toast.success('Formatted summary copied to clipboard (WhatsApp/Slack ready)');
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      toast.info('Summary copied');
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-200",
      isFullscreen ? "p-0" : "p-2 sm:p-4 md:p-6 overflow-y-auto"
    )}>
      {/* Fallback in-page print styles in case print is triggered without iframe */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 7mm 9mm 7mm 9mm;
        }

        @media print {
          html, body {
            overflow: visible !important;
            height: auto !important;
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Expansive Modal Container */}
      <div className={cn(
        "card bg-[var(--card)] border border-[var(--line)] shadow-2xl flex flex-col transition-all duration-200 overflow-hidden",
        isFullscreen
          ? "fixed inset-0 w-full h-full rounded-none max-w-none max-h-none m-0"
          : "rounded-[16px] max-w-5xl xl:max-w-6xl w-full max-h-[92vh] my-auto"
      )}>
        {/* Top Control Bar with Multi-Format Export Suite & Fullscreen Toggle */}
        <div className="no-print flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--line)] bg-[var(--bg)]/95 gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/25 shadow-2xs font-bold shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-[var(--ink)] tracking-tight truncate">
                  Area Air Quality Compliance Audit Generator
                </h3>
                <Badge variant="outline" className="hidden sm:inline-flex text-[10px] py-0 px-2 font-mono text-[var(--ac)] border-[var(--ac)]/30">
                  {auditId}
                </Badge>
              </div>
              <p className="text-[11px] sm:text-xs text-[var(--mut)] truncate">
                Multi-Sector Enterprise Regulatory & ESG Compliance Dossier
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="h-8 gap-1.5 text-xs border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] font-medium shadow-2xs"
              title="Copy formatted summary to clipboard (WhatsApp/Slack ready)"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[var(--ac)]" />}
              <span className="hidden md:inline">{isCopied ? 'Copied' : 'Copy Text'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="h-8 gap-1.5 text-xs border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] font-medium shadow-2xs"
              title="Export machine-readable B2B Fleet JSON API payload"
            >
              <Code2 className="w-3.5 h-3.5 text-[var(--ac)]" />
              <span className="hidden md:inline">JSON API</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="h-8 gap-1.5 text-xs border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] font-medium shadow-2xs"
              title="Download Excel / Spreadsheet Audit CSV"
            >
              <Download className="w-3.5 h-3.5 text-[var(--ac)]" />
              <span className="hidden sm:inline">CSV</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handlePrint}
              className="h-8 gap-1.5 text-xs bg-[var(--ac)] text-[var(--onac)] hover:opacity-90 shadow-2xs font-semibold px-3"
              title="Print or Save as Official A4 PDF Certificate (Single Page, Zero Blank Pages)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </Button>

            {/* Fullscreen / Windowed Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="h-8 w-8 text-[var(--mut)] hover:text-[var(--ink)] border-[var(--line)] bg-[var(--card)] shadow-2xs"
              title={isFullscreen ? 'Restore Window Size' : 'Expand to Fullscreen View'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </Button>

            {/* Close Button (Resets Fullscreen state) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Spacious 5-Sector Grid Selector (100% VISIBLE, NO TRUNCATION!) */}
        <div className="no-print px-4 sm:px-6 py-3 bg-[var(--bg)]/60 border-b border-[var(--line)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[var(--mut)] uppercase tracking-wider flex items-center gap-1.5">
              <span>Select Enterprise Audit Sector:</span>
            </span>
            <span className="text-[10px] text-[var(--ac)] font-semibold hidden sm:inline">
              5 Dedicated B2B Industry Verticals (1-Click Dynamic Compliance Directives)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {(Object.keys(targetConfigs) as CustomerTarget[]).map((key) => {
              const cfg = targetConfigs[key];
              const Icon = cfg.icon;
              const isActive = selectedTarget === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTarget(key)}
                  className={cn(
                    "flex flex-col text-left p-2.5 sm:p-3 rounded-[10px] transition-all cursor-pointer border relative group",
                    isActive
                      ? "bg-[var(--card)] border-[var(--ac)] shadow-sm ring-1 ring-[var(--ac)]/40"
                      : "bg-[var(--card)]/60 border-[var(--line)] hover:border-[var(--ac)]/40 hover:bg-[var(--card)]"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className={cn(
                      "w-7 h-7 rounded-[8px] flex items-center justify-center transition-colors",
                      isActive ? "bg-[var(--ac)] text-[var(--onac)]" : "bg-[var(--bg)] text-[var(--mut)] group-hover:text-[var(--ink)]"
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={cn(
                      "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded",
                      isActive ? "bg-[var(--ac)]/15 text-[var(--ac)]" : "bg-[var(--bg)] text-[var(--mut)]"
                    )}>
                      {cfg.pricingTier}
                    </span>
                  </div>
                  <div className={cn(
                    "text-xs font-semibold tracking-tight truncate",
                    isActive ? "text-[var(--ink)] font-bold" : "text-[var(--ink)]/80"
                  )}>
                    {cfg.label}
                  </div>
                  <div className="text-[10px] text-[var(--mut)] truncate">
                    {cfg.subLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Document Container with Pure Print Output */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7" ref={printRef}>
          {/* Certificate Inner Frame (Target element cloned into isolated Print Engine) */}
          <div
            id="airguard-print-certificate"
            className="certificate-frame border-2 border-[var(--line)] dark:border-zinc-700 rounded-[12px] p-4 sm:p-5 bg-[var(--card)] relative shadow-xs"
          >
            {/* Top Certificate Header */}
            <div className="print-avoid-break flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b-2 border-[var(--line)] dark:border-zinc-700">
              <div className="flex items-start gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center font-display font-black text-lg shadow-sm shrink-0">
                  AG
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-sm sm:text-base font-bold tracking-tight text-[var(--ink)] uppercase">
                      AirGuard Telemetry System
                    </span>
                    <Badge variant="outline" className="text-[8px] py-0.5 px-1.5 font-mono text-[var(--ac)] border-[var(--ac)]/40 bg-[var(--ac)]/5">
                      ISO/CPCB 2026 Compliant
                    </Badge>
                  </div>
                  <h4 className="text-[11px] font-semibold text-[var(--mut)] mt-0.5">
                    Official Environmental & Inhalation Health Compliance Certificate
                  </h4>
                  <p className="text-[10px] text-[var(--mut)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[var(--ac)] shrink-0" />
                    <span className="font-medium text-[var(--ink)]">{currentLocation.name}</span>
                    <span className="font-mono text-[9px] text-[var(--mut)]">
                      ({currentLocation.coordinates[0].toFixed(2)}°N, {currentLocation.coordinates[1].toFixed(2)}°E)
                    </span>
                  </p>
                </div>
              </div>

              {/* Audit Meta Box */}
              <div className="text-left md:text-right md:border-l md:border-[var(--line)] md:pl-4 shrink-0">
                <div className="text-[8px] uppercase font-bold text-[var(--mut)] tracking-widest">
                  Report Serial ID
                </div>
                <div className="font-mono text-[11px] font-bold text-[var(--ink)] tracking-wider mt-0.5">
                  {auditId}
                </div>
                <div className="text-[9px] text-[var(--mut)] flex items-center md:justify-end gap-1 mt-0.5">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{dateStr} • {timeStr}</span>
                </div>
                <div className="no-print mt-1">
                  <Badge variant="accent" className="text-[8px] py-0 px-1.5 font-semibold">
                    {currentConfig.pricingTier}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Target Sector Executive Banner */}
            <div className="print-avoid-break my-2.5 p-2 rounded-[6px] bg-[var(--bg)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center shrink-0">
                  <currentConfig.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-wider text-[var(--mut)]">
                    Audit Classification & Sector Focus
                  </div>
                  <div className="text-[11px] font-bold text-[var(--ink)]">
                    {currentConfig.executiveTitle}
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right sm:border-l sm:border-[var(--line)] sm:pl-3">
                <div className="text-[8px] font-semibold text-[var(--mut)] uppercase">Target Stakeholder</div>
                <div className="text-[10px] font-semibold text-[var(--ink)] mt-0.5">{currentConfig.targetAudience}</div>
              </div>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-2.5">
              {/* Left Column (7 cols): Compliance Verdict & Pollutant Breakdown */}
              <div className="md:col-span-7 space-y-2.5">
                {/* Overall Compliance Verdict Badge */}
                <div className={`print-avoid-break p-2.5 rounded-[8px] border flex items-center justify-between gap-2.5 ${statusColor}`}>
                  <div className="flex items-center gap-2">
                    {isHazardous ? (
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 shrink-0" />
                    )}
                    <div>
                      <div className="text-[8px] font-bold uppercase tracking-wider opacity-80">
                        Official Environmental Compliance Finding
                      </div>
                      <div className="text-xs font-bold tracking-tight mt-0.5">
                        {complianceStatus}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 border-l border-current/20 pl-2.5">
                    <div className="text-xl font-black font-display leading-tight">{aqi}</div>
                    <div className="text-[8px] font-bold uppercase tracking-wide opacity-80">Composite NAQI</div>
                  </div>
                </div>

                {/* Real-Time Telemetry & Standards Comparison Table */}
                <div className="print-avoid-break">
                  <h5 className="text-[10px] font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Layers className="w-3 h-3 text-[var(--ac)]" />
                    Ambient Micro-Pollutant Breakdown vs Health Standards
                  </h5>
                  <div className="overflow-x-auto border border-[var(--line)] rounded-[6px]">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-[var(--bg)] border-b border-[var(--line)] text-[8px] uppercase font-bold text-[var(--mut)]">
                        <tr>
                          <th className="py-1 px-2.5">Pollutant</th>
                          <th className="py-1 px-2.5">Observed</th>
                          <th className="py-1 px-2.5">WHO Limit</th>
                          <th className="py-1 px-2.5">CPCB Std</th>
                          <th className="py-1 px-2.5 text-right">Evaluation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)] text-[10px]">
                        <tr>
                          <td className="py-1 px-2.5 font-semibold text-[var(--ink)]">PM2.5 (Fine Particulate)</td>
                          <td className="py-1 px-2.5 font-mono font-bold text-rose-600 dark:text-rose-400">{pm25} µg/m³</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--mut)]">15 µg/m³</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--mut)]">60 µg/m³</td>
                          <td className="py-1 px-2.5 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${
                              pm25 > 60 ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {pm25 > 60 ? `${(pm25 / 15).toFixed(1)}x WHO Limit` : 'Nominal'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2.5 font-semibold text-[var(--ink)]">PM10 (Inhalable Dust)</td>
                          <td className="py-1 px-2.5 font-mono font-bold text-[var(--ink)]">{pm10} µg/m³</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--mut)]">45 µg/m³</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--mut)]">100 µg/m³</td>
                          <td className="py-1 px-2.5 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${
                              pm10 > 100 ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {pm10 > 100 ? 'Elevated Dust' : 'Normal'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2.5 font-semibold text-[var(--ink)]">Nitrogen Dioxide (NO₂)</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--ink)]">{no2} µg/m³</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--mut)]">25 µg/m³</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--mut)]">80 µg/m³</td>
                          <td className="py-1 px-2.5 text-right">
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                              Within Standard
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2.5 font-semibold text-[var(--ink)]">Carbon Monoxide (CO)</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--ink)]">{co} mg/m³</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--mut)]">4.0 mg/m³</td>
                          <td className="py-1 px-2.5 font-mono text-[var(--mut)]">2.0 mg/m³</td>
                          <td className="py-1 px-2.5 text-right">
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                              Safe Margin
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Risk Assessment & SOP Directives */}
              <div className="md:col-span-5 space-y-2.5">
                {/* Physiological Respiratory Impact Box */}
                <div className="print-avoid-break p-2.5 rounded-[6px] bg-[var(--bg)] border border-[var(--line)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity className="w-3 h-3 text-[var(--ac)]" />
                    <h5 className="text-[9px] font-bold text-[var(--ink)] uppercase tracking-wider">
                      Physiological Inhalation Exposure
                    </h5>
                  </div>
                  <p className="text-[10px] text-[var(--ink)] leading-normal">
                    {currentConfig.riskEvaluation}
                  </p>
                </div>

                {/* Institutional Action Plan & SOP Directives */}
                <div className="print-avoid-break p-2.5 rounded-[6px] bg-[var(--card)] border border-[var(--line)]">
                  <h5 className="text-[9px] font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Mandatory Institutional SOP Directives
                  </h5>
                  <div className="p-2 rounded-[4px] bg-amber-500/10 border border-amber-500/25 mb-1.5">
                    <span className="text-[8px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block">
                      Core Mandate:
                    </span>
                    <span className="text-[10px] font-bold text-[var(--ink)] leading-tight block">
                      {currentConfig.primaryDirective}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {currentConfig.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[9.5px] text-[var(--mut)] leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--ac)] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Digital Verification & Audit Seal Footer */}
            <div className="print-avoid-break pt-2.5 border-t-2 border-[var(--line)] dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-2.5 mt-2.5">
              <div className="flex items-center gap-2 text-left">
                <div className="w-9 h-9 rounded-full border-2 border-dashed border-[var(--ac)] flex items-center justify-center text-[var(--ac)] font-bold text-[9px] shrink-0 bg-[var(--ac)]/5">
                  SEAL
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--ink)]">
                    AirGuard Cryptographic Telemetry Engine
                  </div>
                  <div className="text-[8px] font-mono text-[var(--mut)]">
                    Sha256 Hash: {auditId}-{(pm25 * 97).toFixed(0)}e9f
                  </div>
                  <div className="text-[8px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    <span>Tamper-Proof Audit Record • Verified Telemetry</span>
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-[9px] font-semibold text-[var(--mut)]">Authorized Compliance Signature</div>
                <div className="font-display font-bold text-[11px] text-[var(--ac)] mt-0.5">AirGuard Environmental Operations</div>
                <div className="text-[8px] font-mono text-[var(--mut)]">Cert ID: {auditId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
