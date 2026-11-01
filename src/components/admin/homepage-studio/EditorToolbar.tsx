'use client';

import React from 'react';
import Link from 'next/link';
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Edit3,
  Save,
  Send,
  History,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';

interface EditorToolbarProps {
  onSaveDraft: () => void;
  onOpenPublish: () => void;
  onOpenHistory: () => void;
}

export function EditorToolbar({
  onSaveDraft,
  onOpenPublish,
  onOpenHistory,
}: EditorToolbarProps) {
  const {
    viewport,
    setViewport,
    mode,
    setMode,
    isDirty,
    isSaving,
    isPublishing,
    version,
    lastSaved,
    past,
    future,
    undo,
    redo,
  } = useHomepageStudioStore();

  return (
    <div className="bg-[#1C1A17] text-[#EDE8DF] h-14 px-4 sm:px-6 flex items-center justify-between border-b border-[#322E29] shadow-sm select-none shrink-0 z-30">
      {/* Left: Branding, Return Link & Status */}
      <div className="flex items-center space-x-3.5">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs text-[#C5BEB3] hover:text-white transition-colors border-r border-[#322E29] pr-3 py-1"
          title="Return to CMS Dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">CMS</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="font-serif-editorial text-base sm:text-lg tracking-wide text-[#FFFEFA] font-medium">
            Homepage Studio
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#2E2A25] text-[#C5BEB3] border border-[#443E37] rounded-xs">
            v{version}
          </span>
        </div>

        {/* Dirty / Save Indicator */}
        <div className="hidden lg:flex items-center text-xs font-sans pl-2 border-l border-[#322E29]">
          {isSaving ? (
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Saving draft...</span>
            </span>
          ) : isDirty ? (
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-mono text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Unsaved Changes</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Draft Saved {lastSaved ? `(${lastSaved})` : ''}</span>
            </span>
          )}
        </div>
      </div>

      {/* Center: Undo/Redo & Viewport Switchers */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Undo / Redo */}
        <div className="flex items-center bg-[#292622] border border-[#3E3832] p-0.5 rounded-xs">
          <button
            type="button"
            disabled={past.length === 0}
            onClick={undo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 hover:bg-[#38332E] disabled:opacity-25 disabled:hover:bg-transparent rounded-2xs text-[#EDE8DF] transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={future.length === 0}
            onClick={redo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 hover:bg-[#38332E] disabled:opacity-25 disabled:hover:bg-transparent rounded-2xs text-[#EDE8DF] transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Viewport Selectors */}
        <div className="flex items-center bg-[#292622] border border-[#3E3832] p-0.5 rounded-xs">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            title="Desktop Viewport (100%)"
            className={`p-1.5 rounded-2xs transition-colors ${
              viewport === 'desktop' ? 'bg-[#EDE8DF] text-[#1C1A17] font-semibold' : 'text-[#A8A196] hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            title="Tablet Viewport (768px)"
            className={`p-1.5 rounded-2xs transition-colors ${
              viewport === 'tablet' ? 'bg-[#EDE8DF] text-[#1C1A17] font-semibold' : 'text-[#A8A196] hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            title="Mobile Viewport (375px)"
            className={`p-1.5 rounded-2xs transition-colors ${
              viewport === 'mobile' ? 'bg-[#EDE8DF] text-[#1C1A17] font-semibold' : 'text-[#A8A196] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode Toggle (Edit Mode vs Preview Mode) */}
        <div className="flex items-center bg-[#292622] border border-[#3E3832] p-0.5 rounded-xs text-xs">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-2xs font-medium uppercase tracking-wider text-[10px] transition-colors ${
              mode === 'edit' ? 'bg-[#EDE8DF] text-[#1C1A17] font-bold shadow-2xs' : 'text-[#A8A196] hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-2xs font-medium uppercase tracking-wider text-[10px] transition-colors ${
              mode === 'preview' ? 'bg-[#EDE8DF] text-[#1C1A17] font-bold shadow-2xs' : 'text-[#A8A196] hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Right: History, Save Draft, Publish */}
      <div className="flex items-center space-x-2.5">
        <button
          type="button"
          onClick={onOpenHistory}
          title="Revision History & Restorations"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#EDE8DF] hover:text-white bg-[#292622] hover:bg-[#38332E] border border-[#3E3832] rounded-xs transition-colors"
        >
          <History className="w-3.5 h-3.5 text-[#C5BEB3]" />
          <span className="hidden sm:inline font-medium">History</span>
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={onSaveDraft}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#2E2A25] hover:bg-[#3D3832] text-[#FFFEFA] rounded-xs border border-[#4D453D] transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Draft</span>
        </button>

        <button
          type="button"
          disabled={isPublishing}
          onClick={onOpenPublish}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#A94F42] hover:bg-[#8D3F33] text-white rounded-xs transition-colors shadow-xs disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Publish Live</span>
        </button>
      </div>
    </div>
  );
}

