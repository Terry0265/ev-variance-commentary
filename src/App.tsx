import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { PresetSelector } from './components/PresetSelector';
import { InputPanel } from './components/InputPanel';
import { ValidationAlert } from './components/ValidationAlert';
import { ExecutiveSummaryCard } from './components/ExecutiveSummaryCard';
import { WbsTableCard } from './components/WbsTableCard';
import { TopIssuesCard } from './components/TopIssuesCard';
import { EacReserveCard } from './components/EacReserveCard';
import { ExportToolbar } from './components/ExportToolbar';

import { PRESET_DATASETS, PresetDataset } from './data/presetData';
import { parseEvInput } from './utils/evParser';
import { computeWbsRows, computeTotals, formatCAD } from './utils/evMath';
import { EvCommentaryResult } from './types/evTypes';
import { AlertTriangle, Clock, Calendar, ShieldCheck, UserCheck } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState<string>(PRESET_DATASETS[0].rawText);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(PRESET_DATASETS[0].id);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [commentary, setCommentary] = useState<EvCommentaryResult | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Parse input text live
  const parseResult = useMemo(() => {
    return parseEvInput(inputText);
  }, [inputText]);

  // Compute earned value rows in code
  const computedRows = useMemo(() => {
    return computeWbsRows(parseResult.rows);
  }, [parseResult.rows]);

  // Compute project totals in code
  const totals = useMemo(() => {
    return computeTotals(
      parseResult.rows,
      parseResult.approvedBudget,
      parseResult.managementReserve
    );
  }, [parseResult.rows, parseResult.approvedBudget, parseResult.managementReserve]);

  // Function to call backend to generate or update commentary
  const generateCommentary = useCallback(async () => {
    if (!parseResult.validation.canGenerateCommentary) {
      setCommentary(null);
      return;
    }

    setIsGenerating(true);
    setApiError(null);

    const payload = {
      projectName: parseResult.projectName,
      inServiceDate: parseResult.inServiceDate,
      dataDate: parseResult.dataDate,
      approvedBudget: parseResult.approvedBudget,
      managementReserve: parseResult.managementReserve,
      totals,
      rows: computedRows,
      validation: parseResult.validation,
    };

    try {
      const response = await fetch('/api/generate-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success && data.commentary) {
        setCommentary({
          projectName: parseResult.projectName,
          dataDate: parseResult.dataDate,
          inServiceDate: parseResult.inServiceDate,
          threeSentenceSummary: data.commentary.threeSentenceSummary,
          topIssues: data.commentary.topIssues || [],
          managementReserveNote: data.commentary.managementReserveNote,
        });
      } else {
        setApiError(data.error || 'Failed to generate commentary');
        setCommentary(null);
      }
    } catch (err: any) {
      console.error('Commentary generation error:', err);
      setApiError(err.message || 'Network error communicating with commentary server');
    } finally {
      setIsGenerating(false);
    }
  }, [parseResult, computedRows, totals]);

  // Automatically generate commentary whenever preset changes or input becomes valid
  useEffect(() => {
    if (parseResult.validation.canGenerateCommentary) {
      generateCommentary();
    } else {
      setCommentary(null);
    }
  }, [inputText, parseResult.validation.canGenerateCommentary]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetDataset) => {
    setSelectedPresetId(preset.id);
    setIsCustom(false);
    setInputText(preset.rawText);
  };

  const handleSelectCustom = () => {
    setSelectedPresetId(null);
    setIsCustom(true);
  };

  const handleReset = () => {
    setInputText('');
    setSelectedPresetId(null);
    setIsCustom(true);
    setCommentary(null);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-200">
      <Header />

      <PresetSelector
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onSelectCustom={handleSelectCustom}
        isCustom={isCustom}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Input Panel */}
        <InputPanel
          inputText={inputText}
          onInputChange={(text) => {
            setInputText(text);
            setIsCustom(true);
            setSelectedPresetId(null);
          }}
          parseResult={parseResult}
          onGenerate={generateCommentary}
          isGenerating={isGenerating}
          onReset={handleReset}
        />

        {/* Validation Alert (Test 5: Northgate or any missing data) */}
        <ValidationAlert validation={parseResult.validation} />

        {/* If validation fails, also show the incomplete WBS table so the user can inspect */}
        {!parseResult.validation.canGenerateCommentary && parseResult.rows.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Earned Value Input Data Inspection Table</span>
              <span className="text-[11px] font-normal text-slate-500">
                (Inspection mode — commentary withheld until all values provided)
              </span>
            </div>
            <WbsTableCard rows={computedRows} totals={totals} />
          </div>
        )}

        {/* Full One-Page Commentary Layout when Data is Valid */}
        {parseResult.validation.canGenerateCommentary && commentary && (
          <div className="space-y-6">
            <ExportToolbar
              commentary={commentary}
              totals={totals}
              rows={computedRows}
            />

            {/* Print Container: styled to look like an executive one-page memorandum */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs print:shadow-none print:border-none print:p-0">
              {/* Memorandum Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-amber-600 uppercase">
                      Owner-Side Project Controls Office
                    </span>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      WEEKLY EARNED VALUE VARIANCE COMMENTARY
                    </h2>
                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        <strong className="text-slate-800">Project:</strong> {parseResult.projectName}
                      </span>
                      <span>
                        <strong className="text-slate-800">Target In-Service Date (ISD):</strong>{' '}
                        {parseResult.inServiceDate || 'As Planned'}
                      </span>
                      <span>
                        <strong className="text-slate-800">Data Date:</strong>{' '}
                        {parseResult.dataDate || 'Current Week'}
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right text-xs">
                    <div className="inline-block bg-slate-900 text-white font-mono font-bold px-3 py-1.5 rounded">
                      Approved Budget: {formatCAD(totals.approvedBudget)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Mgmt Reserve: {formatCAD(totals.managementReserve)} | Total Auth:{' '}
                      {formatCAD(totals.totalAuthorizedBudget)}
                    </div>
                  </div>
                </div>
              </div>

              {/* (1) Three-Sentence Status Summary */}
              <ExecutiveSummaryCard commentary={commentary} totals={totals} />

              {/* (2) WBS Table */}
              <WbsTableCard rows={computedRows} totals={totals} />

              {/* (3) Top Three Issues */}
              <TopIssuesCard issues={commentary.topIssues} />

              {/* (4) EAC = BAC / CPI & Management Reserve Comparison */}
              <EacReserveCard totals={totals} />

              {/* Document Sign-off Footer */}
              <div className="border-t border-slate-200 pt-4 mt-6 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>
                    Prepared for Project Manager by Owner Controls Analyst. All math performed in deterministic code.
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span>Currency: Canadian Dollars (CAD)</span>
                  <span>•</span>
                  <span>EAC Rule: EAC = BAC / CPI</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no text is pasted */}
        {parseResult.rows.length === 0 && !apiError && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center my-8">
            <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Earned Value Data Pasted</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Please paste one row per WBS with BAC, PV, EV, AC, Approved Budget, and Management Reserve, or select one of the Acceptance Test presets above.
            </p>
            <button
              type="button"
              onClick={() => handleSelectPreset(PRESET_DATASETS[0])}
              className="text-xs px-3.5 py-2 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Load Test 1: Foothills Substation Data
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
