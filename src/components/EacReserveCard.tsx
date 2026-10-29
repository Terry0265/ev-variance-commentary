import React from 'react';
import { ProjectEvTotals } from '../types/evTypes';
import { DollarSign, Calculator, AlertTriangle, ShieldCheck, Flag, CheckCircle } from 'lucide-react';
import { formatCAD, formatIndex } from '../utils/evMath';

interface EacReserveCardProps {
  totals: ProjectEvTotals;
}

export const EacReserveCard: React.FC<EacReserveCardProps> = ({ totals }) => {
  const cpiFormatted = totals.totalCpi !== null ? formatIndex(totals.totalCpi) : '—';
  const bacFormatted = formatCAD(totals.totalBac);
  const eacFormatted = formatCAD(totals.eac);
  const budgetFormatted = formatCAD(totals.approvedBudget);
  const reserveFormatted = formatCAD(totals.managementReserve);
  const totalAuthFormatted = formatCAD(totals.totalAuthorizedBudget);

  const varianceToReserve = totals.varianceToTotalAuthorized;
  const isOverReserve = totals.isOverReserve;
  const overReserveAmount = totals.overReserveAmount;
  const requiresReserveDraw = totals.requiresReserveDraw;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
            (4) Estimate at Completion (EAC) & Management Reserve Analysis
          </h2>
        </div>
        <div className="text-[11px] text-slate-300">
          Formulas Shown | All figures in CAD
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Beyond Reserve Alert Banner */}
        {isOverReserve && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-red-900 text-sm flex items-center gap-2">
                <span>FLAG: Forecast EAC Exceeds Management Reserve</span>
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  +${Math.round(overReserveAmount / 1_000)}K BEYOND RESERVE
                </span>
              </div>
              <p className="text-red-800 mt-1">
                The forecast Estimate at Completion ({formatCAD(totals.eac, true)}) exceeds total authorized
                project funds including reserve ({totalAuthFormatted}) by{' '}
                <span className="font-bold font-mono text-red-950">
                  {formatCAD(overReserveAmount)} CAD (~${Math.round(overReserveAmount / 1_000)}K CAD)
                </span>
                . An immediate baseline review and executive intervention is warranted.
              </p>
            </div>
          </div>
        )}

        {/* Reserve Draw Required (Within Reserve) */}
        {!isOverReserve && requiresReserveDraw && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 flex items-start gap-3 shadow-xs">
            <Flag className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-amber-950 text-sm">
                FLAG: Forecast EAC Requires Management Reserve Draw
              </div>
              <p className="text-amber-900 mt-1">
                EAC ({eacFormatted}) exceeds the Approved Budget ({budgetFormatted}) by{' '}
                <span className="font-bold font-mono">
                  {formatCAD((totals.eac ?? 0) - totals.approvedBudget)} CAD
                </span>
                , but remains within the total authorized envelope ({totalAuthFormatted}).{' '}
                <span className="font-semibold underline">
                  Any draw or allocation from the Management Reserve is strictly an Owner Project Manager (PM) decision.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Under Budget */}
        {!isOverReserve && !requiresReserveDraw && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3.5 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold">EAC Within Authorized Budget: </span>
              Forecast completion cost ({eacFormatted}) is currently within the approved baseline budget ({budgetFormatted}).
            </div>
          </div>
        )}

        {/* Explicit Mathematical Formulas Display */}
        <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-amber-400 uppercase tracking-wider font-bold">
            <span>Explicit Earned Value Formula Breakdown</span>
            <span>Mathematical Audit Trail</span>
          </div>

          <div className="space-y-2">
            {/* Formula 1 */}
            <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
              <div className="text-slate-400 text-[11px]">Primary Formula:</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">
                EAC = BAC / CPI
              </div>
              <div className="text-slate-300 text-xs mt-1">
                EAC = {bacFormatted} / {cpiFormatted} ={' '}
                <span className="text-white font-bold bg-slate-700 px-1.5 py-0.5 rounded">
                  {eacFormatted}
                </span>{' '}
                <span className="text-slate-400">({formatCAD(totals.eac, true)})</span>
              </div>
            </div>

            {/* Formula 2: Budget + Reserve Comparison */}
            <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700 space-y-1.5">
              <div className="text-slate-400 text-[11px]">Authorized Envelope Comparison:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Approved Project Budget:</span>{' '}
                  <span className="text-slate-100 font-bold">{budgetFormatted}</span>
                </div>
                <div>
                  <span className="text-slate-400">Management Reserve:</span>{' '}
                  <span className="text-slate-100 font-bold">{reserveFormatted}</span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-1.5 flex flex-wrap justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400">Total Authorized (Budget + Reserve):</span>{' '}
                  <span className="text-amber-300 font-bold">{totalAuthFormatted}</span>
                </div>
                <div>
                  <span className="text-slate-400">Variance to Total:</span>{' '}
                  <span
                    className={`font-bold ${
                      varianceToReserve !== null && varianceToReserve > 0
                        ? 'text-red-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {varianceToReserve !== null
                      ? `${varianceToReserve > 0 ? '+' : ''}${formatCAD(varianceToReserve)}`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Governance Guardrail Note */}
        <div className="bg-amber-50/80 border border-amber-300 rounded-md p-3 text-xs text-amber-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Governance Rule Enforced: </span>
            Any release or expenditure of the Management Reserve (${formatCAD(totals.managementReserve)}) is strictly
            an <span className="font-semibold underline">Owner Project Manager (PM) decision</span>. Per standard
            controls protocol, the controls analyst never recommends or presumes spending the reserve.
          </div>
        </div>
      </div>
    </div>
  );
};
