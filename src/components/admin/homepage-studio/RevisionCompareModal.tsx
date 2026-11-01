'use client';

import React from 'react';
import { X, GitCompare, Plus, Minus, ArrowRight } from 'lucide-react';
import type { PopulatedHomepageSection } from '@/types/models';

interface RevisionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  revisionNumber: number;
  historicalSections: PopulatedHomepageSection[];
  currentSections: PopulatedHomepageSection[];
}

export function RevisionCompareModal({
  isOpen,
  onClose,
  revisionNumber,
  historicalSections,
  currentSections,
}: RevisionCompareModalProps) {
  if (!isOpen) return null;

  const currentKeys = new Set(currentSections.map((s) => s.section_key));
  const histKeys = new Set(historicalSections.map((s) => s.section_key));

  const added = currentSections.filter((s) => !histKeys.has(s.section_key));
  const removed = historicalSections.filter((s) => !currentKeys.has(s.section_key));
  const retained = currentSections.filter((s) => histKeys.has(s.section_key));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFEFA] text-[#25221F] border border-[#D8D1C5] w-full max-w-3xl shadow-2xl rounded-xs overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#D8D1C5] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-2">
            <GitCompare className="w-5 h-5 text-[#A94F42]" />
            <div>
              <h3 className="font-serif-editorial text-xl text-[#25221F]">
                Revision #{revisionNumber} vs Current Working Draft
              </h3>
              <p className="text-xs text-[#77716A]">
                Structural and sequence breakdown between historical snapshot and active draft.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider block">Added in Current</span>
              <span className="text-xl font-bold font-mono">+{added.length}</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider block">Removed in Current</span>
              <span className="text-xl font-bold font-mono">-{removed.length}</span>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 text-stone-800 rounded-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider block">Shared Blocks</span>
              <span className="text-xl font-bold font-mono">{retained.length}</span>
            </div>
          </div>

          {/* Added Sections */}
          {added.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Added Blocks ({added.length})</span>
              </h4>
              <div className="space-y-1.5">
                {added.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-2.5 bg-emerald-50/50 border border-emerald-200 text-emerald-950 rounded-xs flex items-center justify-between"
                  >
                    <span className="font-medium">{sec.name}</span>
                    <span className="font-mono text-[10px] text-emerald-700">{sec.section_key}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removed Sections */}
          {removed.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
                <Minus className="w-3.5 h-3.5" />
                <span>Removed Blocks ({removed.length})</span>
              </h4>
              <div className="space-y-1.5">
                {removed.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-2.5 bg-rose-50/50 border border-rose-200 text-rose-950 rounded-xs flex items-center justify-between line-through"
                  >
                    <span>{sec.name}</span>
                    <span className="font-mono text-[10px] text-rose-700">{sec.section_key}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sequence Comparison Table */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#25221F] mb-2 flex items-center gap-1.5">
              <span>Sequence Comparison</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 border border-[#E5DFD4] p-3 rounded-xs bg-[#FAF8F5]">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#77716A] block mb-2 font-semibold">
                  Historical Revision #{revisionNumber}
                </span>
                <ol className="space-y-1 list-decimal list-inside text-stone-700">
                  {historicalSections.map((s, idx) => (
                    <li key={idx} className="truncate">
                      <span className="font-medium text-[#25221F]">{s.name}</span>
                      {!s.is_active && <span className="text-amber-700 text-[10px] ml-1">(hidden)</span>}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-l border-[#D8D1C5] pl-4">
                <span className="font-mono text-[10px] uppercase text-[#77716A] block mb-2 font-semibold">
                  Current Working Draft
                </span>
                <ol className="space-y-1 list-decimal list-inside text-stone-700">
                  {currentSections.map((s, idx) => (
                    <li key={idx} className="truncate">
                      <span className="font-medium text-[#25221F]">{s.name}</span>
                      {!s.is_active && <span className="text-amber-700 text-[10px] ml-1">(hidden)</span>}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D8D1C5] bg-[#FAF8F5] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#25221F]"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}

