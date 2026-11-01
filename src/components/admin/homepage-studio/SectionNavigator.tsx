'use client';

import React, { useState } from 'react';
import {
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Layers,
} from 'lucide-react';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';

interface SectionNavigatorProps {
  onOpenAddModal: () => void;
}

export function SectionNavigator({ onOpenAddModal }: SectionNavigatorProps) {
  const {
    sections,
    selectedSectionId,
    selectSection,
    reorderSections,
    toggleVisibility,
    duplicateSection,
    deleteSection,
  } = useHomepageStudioStore();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderSections(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const activeCount = sections.filter((s) => s.is_active).length;

  return (
    <aside className="w-80 shrink-0 bg-[#FFFEFA] text-[#25221F] border-r border-[#D8D1C5] flex flex-col h-full select-none shadow-2xs">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#D8D1C5] bg-[#FAF8F5] flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[#25221F]">
          <Layers className="w-4 h-4 text-[#A94F42]" />
          <h2 className="font-serif-editorial text-sm font-semibold tracking-wider uppercase">
            Section Sequence
          </h2>
        </div>
        <span className="text-[10px] font-mono uppercase bg-[#EFEAE0] text-[#77716A] px-2 py-0.5 rounded-xs border border-[#D8D1C5]">
          {activeCount}/{sections.length} active
        </span>
      </div>

      {/* Section List (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {sections.map((section, idx) => {
          const isSelected = selectedSectionId === section.id;
          const isDragging = draggedIndex === idx;
          const isDropTarget = dragOverIndex === idx && draggedIndex !== idx;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              onClick={() => selectSection(section.id)}
              className={`group relative flex items-center p-3 rounded-xs border text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#F2ECE1] border-[#A94F42] shadow-xs ring-1 ring-[#A94F42]/30'
                  : 'bg-white border-[#E5DFD4] hover:border-[#C5BEB3] hover:bg-[#FAF8F5]'
              } ${isDragging ? 'opacity-40 border-dashed border-[#A94F42]' : ''} ${
                isDropTarget ? 'border-t-2 border-t-[#A94F42] bg-[#F7F4ED]' : ''
              } ${!section.is_active ? 'opacity-60 bg-stone-50' : ''}`}
            >
              {/* Drag Handle */}
              <div
                className="cursor-grab active:cursor-grabbing text-stone-400 group-hover:text-stone-700 mr-2 shrink-0 p-0.5"
                title="Drag to reorder section"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              {/* Order Badge */}
              <span className="font-mono text-[10px] text-[#77716A] font-semibold w-5 shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Section Meta */}
              <div className="flex-1 min-w-0 pr-1.5">
                <p className="font-semibold text-[#25221F] truncate text-xs leading-snug">
                  {section.name || section.section_key}
                </p>
                <span className="text-[9.5px] uppercase tracking-wider text-[#77716A] font-mono block truncate mt-0.5">
                  {section.section_key}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(section.id);
                  }}
                  title={section.is_active ? 'Hide section from visitors' : 'Show section'}
                  className={`p-1 rounded-2xs hover:bg-[#D8D1C5]/50 transition-colors ${
                    section.is_active ? 'text-stone-600' : 'text-amber-600'
                  }`}
                >
                  {section.is_active ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    reorderSections(idx, idx - 1);
                  }}
                  title="Move Up"
                  className="p-1 rounded-2xs hover:bg-[#D8D1C5]/50 disabled:opacity-20 text-stone-600"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === sections.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    reorderSections(idx, idx + 1);
                  }}
                  title="Move Down"
                  className="p-1 rounded-2xs hover:bg-[#D8D1C5]/50 disabled:opacity-20 text-stone-600"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSection(section.id);
                  }}
                  title="Duplicate Section"
                  className="p-1 rounded-2xs hover:bg-[#D8D1C5]/50 text-stone-600 hidden group-hover:block"
                >
                  <Copy className="w-3 h-3" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Remove section "${section.name}" from homepage?`)) {
                      deleteSection(section.id);
                    }
                  }}
                  title="Delete Section"
                  className="p-1 rounded-2xs hover:bg-rose-100 text-rose-700 hidden group-hover:block"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Section Action Footer */}
      <div className="p-3 border-t border-[#D8D1C5] bg-[#FAF8F5]">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-[#25221F] hover:bg-[#3d3834] text-[#F7F4ED] rounded-xs shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>
      </div>
    </aside>
  );
}

