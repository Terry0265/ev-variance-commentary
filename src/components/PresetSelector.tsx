import React from 'react';
import { PRESET_DATASETS, PresetDataset } from '../data/presetData';
import { CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

interface PresetSelectorProps {
  selectedPresetId: string | null;
  onSelectPreset: (preset: PresetDataset) => void;
  onSelectCustom: () => void;
  isCustom: boolean;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPresetId,
  onSelectPreset,
  onSelectCustom,
  isCustom,
}) => {
  return (
    <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 shrink-0">
            Acceptance Tests:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESET_DATASETS.map((preset) => {
              const isSelected = !isCustom && selectedPresetId === preset.id;
              const isTest5 = preset.id === 'northgate';
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  title={preset.description}
                  className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : isTest5
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {isTest5 ? (
                    <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                  )}
                  <span>{preset.testLabel}</span>
                  <span className="hidden sm:inline font-normal opacity-90">
                    {preset.id === 'foothills' && 'Foothills Meter Station'}
                    {preset.id === 'ridgeview' && 'Ridgeview Compressor Station'}
                    {preset.id === 'lakeshore' && 'Lakeshore Valve Site'}
                    {preset.id === 'messy-foothills' && 'Messy Foothills'}
                    {preset.id === 'northgate' && 'Northgate Pipeline Tie-in'}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={onSelectCustom}
              className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isCustom
                  ? 'bg-indigo-700 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span>Custom Paste</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Click any preset to verify exact acceptance test criteria or paste your own data.</span>
        </div>
      </div>
    </div>
  );
};
