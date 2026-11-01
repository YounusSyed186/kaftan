'use client';

import React, { useState } from 'react';
import { X, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';

interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: (notes: string) => Promise<void>;
}

export function PublishDialog({
  isOpen,
  onClose,
  onConfirmPublish,
}: PublishDialogProps) {
  const { sections, isPublishing } = useHomepageStudioStore();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeSections = sections.filter((s) => s.is_active);
  const hiddenSections = sections.filter((s) => !s.is_active);

  // Validation warnings
  const warnings: string[] = [];
  const emptySections = activeSections.filter(
    (s) => s.section_key !== 'competition_banner' && (!s.items || s.items.length === 0)
  );
  if (emptySections.length > 0) {
    warnings.push(
      `${emptySections.length} section(s) have no manually curated items and will use automatic fallback content.`
    );
  }

  const handlePublish = async () => {
    setError(null);
    try {
      await onConfirmPublish(notes);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Publication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFEFA] text-[#25221F] border border-[#D8D1C5] w-full max-w-lg shadow-2xl rounded-xs overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#D8D1C5] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-[#A94F42]" />
            <h3 className="font-serif-editorial text-xl text-[#25221F]">
              Publish Homepage Revision
            </h3>
          </div>
          <button
            type="button"
            disabled={isPublishing}
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-[#25221F]">
          <p className="text-stone-600 leading-relaxed">
            This operation will create an immutable revision snapshot and immediately promote this draft sequence to the public KAFTAN homepage. Next.js edge caches will be automatically purged and revalidated.
          </p>

          {/* Revision Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="p-3 bg-[#FAF8F5] border border-[#E5DFD4] rounded-xs flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#77716A]">
                Visible Sections
              </span>
              <span className="font-mono text-base font-bold text-emerald-800">
                {activeSections.length}
              </span>
            </div>
            <div className="p-3 bg-[#FAF8F5] border border-[#E5DFD4] rounded-xs flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#77716A]">
                Hidden in Draft
              </span>
              <span className="font-mono text-base font-bold text-amber-800">
                {hiddenSections.length}
              </span>
            </div>
          </div>

          {/* Warnings if any */}
          {warnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xs space-y-1">
              {warnings.map((w, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Publication Notes */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-[#77716A] tracking-wider mb-1">
              Release Notes / Revision Log (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Featured Autumn resortwear drop, reordered trending stories..."
              className="w-full bg-[#FAF8F5] border border-[#D8D1C5] p-2.5 rounded-xs text-[#25221F] placeholder:text-stone-400 focus:outline-none focus:border-[#A94F42]"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xs text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#D8D1C5] bg-[#FAF8F5] flex items-center justify-between">
          <button
            type="button"
            disabled={isPublishing}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#25221F] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isPublishing}
            onClick={handlePublish}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#A94F42] hover:bg-[#8e392d] text-white rounded-xs shadow-xs transition-colors disabled:opacity-50"
          >
            {isPublishing ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing Live...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Promote to Live</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

