import React from 'react';
import { EvIssue } from '../types/evTypes';
import { AlertCircle, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatCAD, formatIndex } from '../utils/evMath';

interface TopIssuesCardProps {
  issues: EvIssue[];
}

export const TopIssuesCard: React.FC<TopIssuesCardProps> = ({ issues }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
            (3) Top Three Issues — Cause, In-Service Date Impact & Action
          </h2>
        </div>
        <div className="text-[11px] text-slate-300">
          Strict Rule: "cause not stated" if omitted | Never invent causes/owners
        </div>
      </div>

      {/* Issues Grid */}
      <div className="p-5">
        {issues.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No critical issues identified. All packages performing within acceptable thresholds.
          </div>
        ) : (
          <div className="space-y-4">
            {issues.slice(0, 3).map((issue, idx) => {
              const isCauseNotStated =
                issue.cause.toLowerCase().includes('cause not stated') ||
                issue.cause.trim() === '';

              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-all hover:border-slate-300 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        WBS {issue.wbs}
                      </span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {issue.packageName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      {issue.cpi !== null && (
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            issue.cpi < 0.95
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          CPI: {formatIndex(issue.cpi)}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          issue.spi < 0.95
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        SPI: {formatIndex(issue.spi)}
                      </span>
                      {issue.cv !== null && (
                        <span className="text-slate-600 text-[11px]">
                          CV: {formatCAD(issue.cv, true)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3 Pillars: Cause, Impact, Action */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Cause */}
                    <div className="bg-white p-3 rounded border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                          Stated Cause
                        </div>
                        <p className="text-slate-800 text-xs leading-relaxed">
                          {isCauseNotStated ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-mono font-semibold border border-amber-200">
                              cause not stated
                            </span>
                          ) : (
                            issue.cause
                          )}
                        </p>
                      </div>
                      {isCauseNotStated && (
                        <span className="text-[10px] text-slate-600 mt-2 italic">
                          *Field notes provide no root cause; strictly adhering to rule.
                        </span>
                      )}
                    </div>

                    {/* Impact on ISD */}
                    <div className="bg-white p-3 rounded border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          Impact on In-Service Date (ISD)
                        </div>
                        <p className="text-slate-800 text-xs leading-relaxed">
                          {issue.impact}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="bg-white p-3 rounded border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          One Owner Action
                        </div>
                        <p className="text-slate-800 text-xs leading-relaxed font-medium">
                          {issue.action}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-600 mt-2 italic">
                        *Owner control action; reserve spending is never recommended.
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
