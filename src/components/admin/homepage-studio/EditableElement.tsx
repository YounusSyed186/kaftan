'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';
import { useStudioMode } from './StudioModeContext';
import { Edit3, Sparkles } from 'lucide-react';

interface EditableElementProps {
  sectionId: string;
  elementId: string;
  elementType?: 'heading' | 'text' | 'image' | 'link' | 'cta' | 'slot';
  label: string;
  children: React.ReactNode;
  isOverridden?: boolean;
  inlineTextValue?: string;
  onCommitInlineText?: (newValue: string) => void;
  className?: string;
  allowInlineEdit?: boolean;
}

export function EditableElement({
  sectionId,
  elementId,
  elementType = 'text',
  label,
  children,
  isOverridden = false,
  inlineTextValue,
  onCommitInlineText,
  className = '',
  allowInlineEdit = false,
}: EditableElementProps) {
  const isEditorMode = useStudioMode();
  const {
    mode,
    selectedSectionId,
    selectedElementId,
    selectSection,
    selectElement,
  } = useHomepageStudioStore();

  const [isEditingInline, setIsEditingInline] = useState(false);
  const [currentText, setCurrentText] = useState(inlineTextValue || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentText(inlineTextValue || '');
  }, [inlineTextValue]);

  useEffect(() => {
    if (isEditingInline && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingInline]);

  // If not explicitly in studio editor mode, render pure production children with zero editor overhead
  // Preserve className wrappers so layout-critical styles (relative, aspect ratios, flex/grid) are maintained
  if (!isEditorMode || mode !== 'edit') {
    if (className) {
      return <div className={className}>{children}</div>;
    }
    return <>{children}</>;
  }

  // Safety safeguard: never show studio elements on live public routes
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/homepage-studio')) {
    if (className) {
      return <div className={className}>{children}</div>;
    }
    return <>{children}</>;
  }

  const isSelected =
    selectedSectionId === sectionId && selectedElementId === elementId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent bubbling to whole section select
    selectSection(sectionId);
    selectElement(elementId, elementType);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (allowInlineEdit && onCommitInlineText) {
      e.stopPropagation();
      setIsEditingInline(true);
    }
  };

  const handleBlur = () => {
    setIsEditingInline(false);
    if (onCommitInlineText && currentText !== inlineTextValue) {
      onCommitInlineText(currentText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setCurrentText(inlineTextValue || '');
      setIsEditingInline(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`relative group/editable transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-[#A94F42] ring-offset-2 z-20 shadow-xs'
          : 'hover:outline-dashed hover:outline-1 hover:outline-[#A94F42]/80 hover:ring-1 hover:ring-[#A94F42]/20'
      } ${className}`}
      title={`Click to edit ${label} in Inspector${allowInlineEdit ? ' (Double-click to edit inline)' : ''}`}
    >
      {/* Editorial Hover Badge */}
      <div
        className={`absolute -top-3 left-2 z-30 flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-mono uppercase tracking-wider rounded-2xs pointer-events-none transition-all ${
          isSelected
            ? 'bg-[#A94F42] text-white opacity-100 shadow-sm'
            : 'bg-[#25221F] text-[#F7F4ED] opacity-0 group-hover/editable:opacity-100'
        }`}
      >
        <Edit3 className="w-2.5 h-2.5" />
        <span>{label}</span>
        {isOverridden && (
          <span className="flex items-center gap-0.5 text-[#F7DCD7] pl-1 font-semibold">
            <Sparkles className="w-2 h-2" />
            OVERRIDE
          </span>
        )}
      </div>

      {/* Inline Text Input (When double-clicked) */}
      {isEditingInline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={Math.max(1, currentText.split('\n').length)}
          className="w-full bg-[#FAF8F5] text-[#25221F] p-1 border-2 border-[#A94F42] rounded-xs font-inherit text-inherit leading-inherit focus:outline-hidden resize-none z-30 relative shadow-md"
        />
      ) : (
        children
      )}
    </div>
  );
}

