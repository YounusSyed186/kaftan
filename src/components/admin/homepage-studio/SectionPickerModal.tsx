'use client';

import React from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import {
  SUPPORTED_SECTION_REGISTRY,
  type HomepageSectionType,
} from '@/components/homepage/section-registry';

interface SectionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: HomepageSectionType) => void;
}

export function SectionPickerModal({
  isOpen,
  onClose,
  onSelectType,
}: SectionPickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFEFA] text-[#25221F] border border-[#D8D1C5] w-full max-w-2xl shadow-2xl rounded-xs overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#D8D1C5] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#A94F42]" />
            <div>
              <h3 className="font-serif-editorial text-xl text-[#25221F]">
                Add Homepage Section
              </h3>
              <p className="text-xs text-[#77716A]">
                Choose an editorial, commercial, or commerce layout block to insert into the homepage sequence.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Library Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SUPPORTED_SECTION_REGISTRY.map((sec) => (
            <div
              key={sec.type}
              onClick={() => {
                onSelectType(sec.type);
                onClose();
              }}
              className="p-4 bg-white border border-[#E5DFD4] hover:border-[#A94F42] hover:bg-[#FAF8F5] rounded-xs cursor-pointer transition-all group flex flex-col justify-between shadow-2xs hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#A94F42] bg-[#FAF8F5] px-1.5 py-0.5 rounded-2xs border border-[#E5DFD4]">
                    {sec.category}
                  </span>
                  <span className="text-[9px] font-mono text-stone-400">
                    {sec.defaultLayout}
                  </span>
                </div>
                <h4 className="font-serif-editorial text-base text-[#25221F] font-semibold group-hover:text-[#A94F42] transition-colors">
                  {sec.name}
                </h4>
                <p className="text-xs text-[#77716A] mt-1 leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#25221F] group-hover:text-[#A94F42]">
                <span>Insert Block</span>
                <Plus className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#D8D1C5] bg-[#FAF8F5] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#25221F]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

