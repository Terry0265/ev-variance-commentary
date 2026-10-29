import React, { useState } from 'react';
import { ParseResult } from '../types/evTypes';
import {
  Sparkles,
  ClipboardPaste,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { formatCAD } from '../utils/evMath';

interface InputPanelProps {
  inputText: string;
  onInputChange: (text: string) => void;
  parseResult: ParseResult;
  onGenerate: () => void;
  isGenerating: boolean;
  onReset: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  inputText,
  onInputChange,
  parseResult,
  onGenerate,
  isGenerating,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { validation, rows, approvedBudget, managementReserve, projectName } = parseResult;

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onInputChange(text);
      }
    } catch (e) {
      console.warn('Could not read from clipboard directly:', e);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden mb-6">
      {/* Top Bar */}
      <div className="bg-slate-100 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <ClipboardPaste className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Earned Value Input Data
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
            {rows.length} WBS Package{rows.length !== 1 ? 's' : ''} Detected
          </span>
          {validation.canGenerateCommentary ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle className="w-3 h-3" />
              Valid Data
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Incomplete Data
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded hover:bg-slate-200 flex items-center gap-1 transition cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Hide Raw Input</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>View / Edit Raw Input</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-red-700 px-2 py-1 rounded hover:bg-slate-200 flex items-center gap-1 transition cursor-pointer"
            title="Clear text"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <div>
            <span className="text-slate-400">Project:</span>{' '}
            <span className="font-semibold text-slate-900">{projectName}</span>
          </div>
          <div>
            <span className="text-slate-400">Approved Budget:</span>{' '}
            <span className="font-semibold text-slate-900">{formatCAD(approvedBudget)}</span>
          </div>
          <div>
            <span className="text-slate-400">Management Reserve:</span>{' '}
            <span className="font-semibold text-slate-900">{formatCAD(managementReserve)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!validation.canGenerateCommentary || isGenerating}
            className={`text-xs px-4 py-1.5 rounded-md font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
              validation.canGenerateCommentary && !isGenerating
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isGenerating
                ? 'Generating Commentary...'
                : !validation.canGenerateCommentary
                ? 'Commentary Withheld (Data Missing)'
                : 'Update One-Page Commentary'}
            </span>
          </button>
        </div>
      </div>

      {/* Collapsible Text Area */}
      {isExpanded && (
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Paste One Row per WBS (BAC, PV, EV, AC, Field Notes):
            </label>
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="text-[11px] text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer font-medium"
            >
              <ClipboardPaste className="w-3 h-3" />
              <span>Paste from Clipboard</span>
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            rows={8}
            placeholder={`Project: Foothills Substation Upgrade\nApproved Budget: $10,500,000 CAD\nManagement Reserve: $600,000 CAD\nTarget ISD: Nov 30, 2026\n\nWBS | Package Name | BAC | PV | EV | AC | Field Notes\n1.1 | Engineering | 1,500,000 | 1,500,000 | 1,500,000 | 1,450,000 | On track\n1.2 | Procurement | 3,200,000 | 2,400,000 | 2,100,000 | 2,250,000 | Transformer delayed due to supplier backlog`}
            className="w-full font-mono text-xs p-3 bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 shadow-inner"
          />

          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Supports pipe-delimited (|), tab-separated, comma-separated, or labeled text. Math is computed automatically in code.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
