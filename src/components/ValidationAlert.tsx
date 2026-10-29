import React from 'react';
import { ValidationReport } from '../types/evTypes';
import { AlertOctagon, AlertTriangle, XCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { formatCAD } from '../utils/evMath';

interface ValidationAlertProps {
  validation: ValidationReport;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({ validation }) => {
  if (validation.isValid && validation.canGenerateCommentary && !validation.budgetGap.hasGap) {
    return null;
  }

  const { missingAcRows, missingFields, budgetGap } = validation;

  return (
    <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5 mb-6 shadow-xs text-slate-900">
      <div className="flex items-start gap-3.5">
        <div className="bg-amber-500 text-white p-2 rounded-full shrink-0 mt-0.5 shadow-xs">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Commentary Withheld
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Data Validation Incomplete — Commentary Blocked
              </h3>
            </div>
            <p className="text-xs text-slate-700 mt-1">
              Per owner-side governance rules, the commentary generator{' '}
              <span className="font-semibold text-red-700">never guesses missing numbers</span> and{' '}
              <span className="font-semibold text-red-700">
                never generates commentary when required earned value data is missing
              </span>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Missing AC Listing */}
            {missingAcRows.length > 0 && (
              <div className="bg-white border border-red-300 rounded-md p-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wide mb-2">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Missing Actual Cost (AC) ({missingAcRows.length} Package{missingAcRows.length > 1 ? 's' : ''})</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {missingAcRows.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-1.5 bg-red-50 text-red-900 px-2 py-1.5 rounded border border-red-200 font-mono text-[11px]"
                    >
                      <span className="font-bold shrink-0">{item.wbs}:</span>
                      <span className="font-sans font-medium text-slate-900">{item.name}</span>
                      <span className="ml-auto text-red-700 font-semibold">[AC MISSING]</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-600 mt-2">
                  Actual Cost is mandatory for computing Cost Variance (CV) and Cost Performance Index (CPI).
                </p>
              </div>
            )}

            {/* Budget Gap Listing */}
            {budgetGap.hasGap && (
              <div className="bg-white border border-amber-300 rounded-md p-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Budget Reconciliation Gap</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-amber-50 p-2.5 rounded border border-amber-200 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sum of WBS BAC:</span>
                      <span className="font-bold text-slate-900">{formatCAD(budgetGap.wbsTotalBac)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Approved Project Budget:</span>
                      <span className="font-bold text-slate-900">{formatCAD(budgetGap.approvedBudget)}</span>
                    </div>
                    <div className="flex justify-between border-t border-amber-300 pt-1 text-amber-900 font-bold">
                      <span>Unallocated Gap:</span>
                      <span>
                        {budgetGap.difference > 0 ? '-' : '+'}
                        {formatCAD(Math.abs(budgetGap.difference))}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-900">
                      ${(budgetGap.wbsTotalBac / 1_000_000).toFixed(1)}M vs ${(budgetGap.approvedBudget / 1_000_000).toFixed(1)}M budget gap
                    </span>{' '}
                    detected. Reconcile baseline allocations prior to baseline reporting.
                  </p>
                </div>
              </div>
            )}
          </div>

          {missingFields.length > 0 && (
            <div className="bg-white border border-red-200 rounded p-2.5 text-xs text-red-800">
              <span className="font-bold">Missing Required Fields: </span>
              {missingFields.join('; ')}
            </div>
          )}

          <div className="bg-amber-100/60 border border-amber-300 rounded p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Action Required: Please paste updated AC figures or supply missing work package data in the input box below.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
