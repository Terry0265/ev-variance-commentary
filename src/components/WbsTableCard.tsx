import React from 'react';
import { ComputedWbsRow, ProjectEvTotals } from '../types/evTypes';
import { Table, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatCAD, formatIndex } from '../utils/evMath';

interface WbsTableCardProps {
  rows: ComputedWbsRow[];
  totals: ProjectEvTotals;
}

export const WbsTableCard: React.FC<WbsTableCardProps> = ({ rows, totals }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
            (2) Work Breakdown Structure (WBS) Performance Table
          </h2>
        </div>
        <div className="text-[11px] text-slate-300 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            Flagged Index &lt; 0.95
          </span>
          <span className="text-slate-400">|</span>
          <span className="font-mono text-amber-300">All figures CAD</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th scope="col" className="px-3.5 py-2.5 text-left">WBS</th>
              <th scope="col" className="px-3.5 py-2.5 text-left">Package Name</th>
              <th scope="col" className="px-3 py-2.5 text-right">BAC</th>
              <th scope="col" className="px-3 py-2.5 text-right">PV</th>
              <th scope="col" className="px-3 py-2.5 text-right">EV</th>
              <th scope="col" className="px-3 py-2.5 text-right">AC</th>
              <th scope="col" className="px-3 py-2.5 text-right font-mono">CV (EV-AC)</th>
              <th scope="col" className="px-3 py-2.5 text-right font-mono">SV (EV-PV)</th>
              <th scope="col" className="px-3 py-2.5 text-center font-mono">CPI (EV/AC)</th>
              <th scope="col" className="px-3 py-2.5 text-center font-mono">SPI (EV/PV)</th>
              <th scope="col" className="px-3.5 py-2.5 text-left">Field Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row) => {
              const isCostUnfavorable = row.cv !== null && row.cv < 0;
              const isSchedUnfavorable = row.sv < 0;

              return (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    row.isFlagged ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="px-3.5 py-2.5 font-bold font-mono text-slate-900 whitespace-nowrap">
                    {row.wbs}
                  </td>
                  <td className="px-3.5 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{row.name}</span>
                      {row.isFlagged && (
                        <span
                          title="Performance index below 0.95 threshold"
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200"
                        >
                          <AlertTriangle className="w-3 h-3 mr-0.5" />
                          Flagged
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-700 whitespace-nowrap">
                    {formatCAD(row.bac)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-700 whitespace-nowrap">
                    {formatCAD(row.pv)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-700 whitespace-nowrap">
                    {formatCAD(row.ev)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-700 whitespace-nowrap">
                    {row.ac !== null ? formatCAD(row.ac) : <span className="text-red-600 font-bold">MISSING</span>}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono whitespace-nowrap font-medium ${
                      isCostUnfavorable ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {row.cv !== null ? formatCAD(row.cv) : '—'}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono whitespace-nowrap font-medium ${
                      isSchedUnfavorable ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    {formatCAD(row.sv)}
                  </td>

                  {/* CPI with < 0.95 flagging */}
                  <td className="px-3 py-2.5 text-center font-mono whitespace-nowrap">
                    {row.cpi !== null ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold ${
                          row.cpiFlagged
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'text-slate-900'
                        }`}
                      >
                        {formatIndex(row.cpi)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* SPI with < 0.95 flagging */}
                  <td className="px-3 py-2.5 text-center font-mono whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold ${
                        row.spiFlagged
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'text-slate-900'
                      }`}
                    >
                      {formatIndex(row.spi)}
                    </span>
                  </td>

                  <td className="px-3.5 py-2.5 text-slate-600 text-[11px] max-w-xs truncate" title={row.notes}>
                    {row.notes || <span className="italic text-slate-400">None</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Totals Summary Footer */}
          <tfoot className="bg-slate-900 text-white font-semibold">
            <tr>
              <td colSpan={2} className="px-3.5 py-2.5 text-left uppercase tracking-wider text-[11px] font-bold text-amber-400">
                Project Total
              </td>
              <td className="px-3 py-2.5 text-right font-mono">{formatCAD(totals.totalBac)}</td>
              <td className="px-3 py-2.5 text-right font-mono">{formatCAD(totals.totalPv)}</td>
              <td className="px-3 py-2.5 text-right font-mono">{formatCAD(totals.totalEv)}</td>
              <td className="px-3 py-2.5 text-right font-mono">
                {totals.totalAc !== null ? formatCAD(totals.totalAc) : 'MISSING'}
              </td>
              <td
                className={`px-3 py-2.5 text-right font-mono font-bold ${
                  totals.totalCv !== null && totals.totalCv < 0 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {totals.totalCv !== null ? formatCAD(totals.totalCv) : '—'}
              </td>
              <td
                className={`px-3 py-2.5 text-right font-mono font-bold ${
                  totals.totalSv < 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {formatCAD(totals.totalSv)}
              </td>
              <td className="px-3 py-2.5 text-center font-mono">
                <span
                  className={`px-2 py-0.5 rounded font-bold text-xs ${
                    totals.cpiFlagged ? 'bg-red-600 text-white' : 'text-white'
                  }`}
                >
                  {formatIndex(totals.totalCpi)}
                </span>
              </td>
              <td className="px-3 py-2.5 text-center font-mono">
                <span
                  className={`px-2 py-0.5 rounded font-bold text-xs ${
                    totals.spiFlagged ? 'bg-amber-600 text-white' : 'text-white'
                  }`}
                >
                  {formatIndex(totals.totalSpi)}
                </span>
              </td>
              <td className="px-3.5 py-2.5 text-[11px] text-slate-300">
                Overall EAC: {formatCAD(totals.eac, true)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
