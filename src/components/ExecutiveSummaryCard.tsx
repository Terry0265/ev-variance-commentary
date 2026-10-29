import React, { useState } from 'react';
import { EvCommentaryResult, ProjectEvTotals } from '../types/evTypes';
import { FileText, Copy, Check, TrendingUp, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { formatCAD, formatIndex } from '../utils/evMath';

interface ExecutiveSummaryCardProps {
  commentary: EvCommentaryResult;
  totals: ProjectEvTotals;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  commentary,
  totals,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(commentary.threeSentenceSummary.fullParagraph);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cpiVal = totals.totalCpi;
  const spiVal = totals.totalSpi;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden mb-6">
      {/* Card Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
            (1) Executive Three-Sentence Status Summary
          </h2>
          <span className="text-[11px] bg-slate-800 text-amber-300 font-medium px-2 py-0.5 rounded border border-slate-700">
            For Project Manager
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Badges Banner */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-2.5 rounded border border-slate-200">
          <div className="text-slate-500 text-[11px] font-medium">Cost Performance (CPI)</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-base font-bold font-mono ${
                totals.cpiFlagged ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              {formatIndex(cpiVal)}
            </span>
            {totals.cpiFlagged && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800 border border-red-200">
                &lt; 0.95
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-2.5 rounded border border-slate-200">
          <div className="text-slate-500 text-[11px] font-medium">Schedule Performance (SPI)</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-base font-bold font-mono ${
                totals.spiFlagged ? 'text-amber-600' : 'text-slate-900'
              }`}
            >
              {formatIndex(spiVal)}
            </span>
            {totals.spiFlagged && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                &lt; 0.95
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-2.5 rounded border border-slate-200">
          <div className="text-slate-500 text-[11px] font-medium">Forecast EAC (BAC / CPI)</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-base font-bold font-mono text-slate-900">
              {formatCAD(totals.eac, true)}
            </span>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded border border-slate-200">
          <div className="text-slate-500 text-[11px] font-medium">Management Reserve Status</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {totals.isOverReserve ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
                +${Math.round(totals.overReserveAmount / 1_000)}K Beyond Reserve
              </span>
            ) : totals.requiresReserveDraw ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Requires PM Reserve Draw
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                Within Budget
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Structured Three Sentences */}
      <div className="p-5 space-y-4">
        <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5">
              1. Health
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {commentary.threeSentenceSummary.sentence1}
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5">
              2. ISD Impact
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {commentary.threeSentenceSummary.sentence2}
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="bg-indigo-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5">
              3. Forecast & Reserve
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {commentary.threeSentenceSummary.sentence3}
            </p>
          </div>
        </div>

        {/* Unified Paragraph for PM */}
        <div className="bg-white border-l-4 border-slate-900 pl-4 py-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Complete Memo Paragraph:
          </div>
          <p className="text-xs sm:text-sm font-serif text-slate-900 leading-relaxed italic">
            "{commentary.threeSentenceSummary.fullParagraph}"
          </p>
        </div>
      </div>
    </div>
  );
};
