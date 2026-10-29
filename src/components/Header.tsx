import React from 'react';
import { ShieldCheck, FileSpreadsheet, DollarSign, Clock, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 text-amber-400 p-1.5 rounded-md flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Earned Value Variance Commentary Generator
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                Owner Controls Edition
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Rapid weekly WBS variance analysis & one-page Project Manager commentary with strict CAD currency math & governance guardrails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Currency: CAD
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Math In Code (Zero AI Math)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Reserve Draw: PM Decision
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              5-Min PM Turnaround
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
