import React, { useState } from 'react';
import { Printer, Copy, Check, Download, FileText } from 'lucide-react';
import { EvCommentaryResult, ComputedWbsRow, ProjectEvTotals } from '../types/evTypes';
import { formatCAD, formatIndex } from '../utils/evMath';

interface ExportToolbarProps {
  commentary: EvCommentaryResult;
  totals: ProjectEvTotals;
  rows: ComputedWbsRow[];
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  commentary,
  totals,
  rows,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMemo = () => {
    const text = `
================================================================================
WEEKLY EARNED VALUE VARIANCE COMMENTARY — PROJECT CONTROLS MEMO
================================================================================
Project: ${commentary.projectName}
Data Date: ${commentary.dataDate || 'Current'}
Target In-Service Date (ISD): ${commentary.inServiceDate || 'As Planned'}
Approved Baseline Budget: ${formatCAD(totals.approvedBudget)}
Management Reserve: ${formatCAD(totals.managementReserve)}
Total Authorized Envelope: ${formatCAD(totals.totalAuthorizedBudget)}

--------------------------------------------------------------------------------
1. EXECUTIVE STATUS SUMMARY (THREE-SENTENCE PM COMMENTARY)
--------------------------------------------------------------------------------
${commentary.threeSentenceSummary.fullParagraph}

Key Metrics:
- Overall CPI: ${formatIndex(totals.totalCpi)} ${totals.cpiFlagged ? '[FLAGGED < 0.95]' : ''}
- Overall SPI: ${formatIndex(totals.totalSpi)} ${totals.spiFlagged ? '[FLAGGED < 0.95]' : ''}
- Forecast EAC (BAC / CPI): ${formatCAD(totals.eac)}
- Reserve Variance: ${
      totals.isOverReserve
        ? `Exceeds Total Authorized by +${formatCAD(totals.overReserveAmount)} [FLAGGED]`
        : totals.requiresReserveDraw
        ? 'Draw from Management Reserve Required (PM Decision)'
        : 'Within Approved Budget'
    }

--------------------------------------------------------------------------------
2. WBS PERFORMANCE TABLE (ALL FIGURES IN CAD)
--------------------------------------------------------------------------------
WBS | Package | BAC | PV | EV | AC | CV | SV | CPI | SPI | Notes
${rows
  .map(
    (r) =>
      `${r.wbs} | ${r.name} | ${formatCAD(r.bac)} | ${formatCAD(r.pv)} | ${formatCAD(r.ev)} | ${
        r.ac !== null ? formatCAD(r.ac) : 'MISSING'
      } | ${r.cv !== null ? formatCAD(r.cv) : '—'} | ${formatCAD(r.sv)} | ${formatIndex(r.cpi)} | ${formatIndex(r.spi)} | ${r.notes}`
  )
  .join('\n')}

Project Total: BAC ${formatCAD(totals.totalBac)} | PV ${formatCAD(totals.totalPv)} | EV ${formatCAD(totals.totalEv)} | AC ${
      totals.totalAc !== null ? formatCAD(totals.totalAc) : 'MISSING'
    } | CPI ${formatIndex(totals.totalCpi)} | SPI ${formatIndex(totals.totalSpi)}

--------------------------------------------------------------------------------
3. TOP THREE ISSUES (CAUSE, ISD IMPACT, ACTION)
--------------------------------------------------------------------------------
${commentary.topIssues
  .slice(0, 3)
  .map(
    (issue, i) => `
Issue #${i + 1}: WBS ${issue.wbs} — ${issue.packageName}
- Stated Cause: ${issue.cause}
- Impact on In-Service Date (ISD): ${issue.impact}
- Owner Action: ${issue.action}
`
  )
  .join('\n')}

--------------------------------------------------------------------------------
4. ESTIMATE AT COMPLETION (EAC) & MANAGEMENT RESERVE
--------------------------------------------------------------------------------
Primary Formula: EAC = BAC / CPI
Calculation: ${formatCAD(totals.totalBac)} / ${formatIndex(totals.totalCpi)} = ${formatCAD(totals.eac)}

Authorized Comparison:
- Approved Budget: ${formatCAD(totals.approvedBudget)}
- Management Reserve: ${formatCAD(totals.managementReserve)}
- Total Authorized Funds: ${formatCAD(totals.totalAuthorizedBudget)}
- Variance: ${
      totals.varianceToTotalAuthorized !== null
        ? `${totals.varianceToTotalAuthorized > 0 ? '+' : ''}${formatCAD(totals.varianceToTotalAuthorized)}`
        : '—'
    }

${commentary.managementReserveNote}
================================================================================
`;

    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const data = {
      project: commentary.projectName,
      dataDate: commentary.dataDate,
      summary: commentary.threeSentenceSummary,
      totals,
      wbsRows: rows,
      topIssues: commentary.topIssues,
      governanceNote: commentary.managementReserveNote,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${commentary.projectName.toLowerCase().replace(/\s+/g, '-')}-ev-commentary.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs print:hidden">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <FileText className="w-4 h-4 text-slate-700" />
        <span className="font-semibold text-slate-800">Export & Deliver to PM:</span>
        <span className="hidden sm:inline text-slate-500">
          Ready for weekly project controls review meeting
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyMemo}
          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied Full Memo!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Full Memo</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownloadJson}
          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          title="Download raw data & commentary JSON"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export JSON</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="text-xs font-bold px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <Printer className="w-3.5 h-3.5 text-amber-400" />
          <span>Print / Save 1-Page PDF</span>
        </button>
      </div>
    </div>
  );
};
