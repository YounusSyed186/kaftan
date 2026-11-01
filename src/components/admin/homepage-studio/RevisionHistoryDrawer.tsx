'use client';

import React, { useState, useEffect } from 'react';
import { X, History, RotateCcw, GitCompare, Calendar, CheckCircle2 } from 'lucide-react';
import type { HomepageRevision } from '@/types/models';
import { RevisionCompareModal } from './RevisionCompareModal';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';

interface RevisionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (revisionId: string) => Promise<void>;
}

export function RevisionHistoryDrawer({
  isOpen,
  onClose,
  onRestore,
}: RevisionHistoryDrawerProps) {
  const { sections: currentSections } = useHomepageStudioStore();
  const [revisions, setRevisions] = useState<HomepageRevision[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compareTarget, setCompareTarget] = useState<HomepageRevision | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    fetch('/api/admin/homepage-studio/revisions')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setRevisions(json.data);
        } else {
          setError(json.error || 'Failed to load revisions');
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Network error');
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-[#FFFEFA] text-[#25221F] border-l border-[#D8D1C5] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[#D8D1C5] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-[#A94F42]" />
                <h3 className="font-serif-editorial text-lg text-[#25221F]">
                  Revision History
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Revisions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading && (
                <div className="py-12 text-center text-xs text-[#77716A]">
                  <span className="w-4 h-4 border-2 border-[#A94F42] border-t-transparent rounded-full animate-spin inline-block mb-2" />
                  <p>Loading historical snapshots...</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs">
                  {error}
                </div>
              )}

              {!loading && revisions.length === 0 && (
                <div className="py-12 text-center text-xs text-[#77716A]">
                  <p>No published revisions on record yet.</p>
                </div>
              )}

              {revisions.map((rev) => {
                const isPublished = rev.status === 'published';
                const dateStr = new Date(rev.created_at).toLocaleString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={rev.id}
                    className={`p-3.5 border rounded-xs space-y-2 transition-all ${
                      isPublished
                        ? 'bg-[#FCFAF6] border-emerald-300 shadow-2xs'
                        : 'bg-white border-[#E5DFD4]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-serif-editorial text-base font-semibold text-[#25221F]">
                          Revision #{rev.revision_number}
                        </span>
                        <span
                          className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-2xs ${
                            isPublished
                              ? 'bg-emerald-100 text-emerald-800 font-bold'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {rev.snapshot?.sections?.length || 0} blocks
                      </span>
                    </div>

                    {rev.notes && (
                      <p className="text-xs text-stone-600 italic bg-[#FAF8F5] p-2 rounded-2xs border border-[#EFEAE0]">
                        &ldquo;{rev.notes}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-[#77716A] pt-1">
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </div>
                      <span className="capitalize">{rev.created_by || 'Admin'}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setCompareTarget(rev)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#55504A] hover:text-[#25221F] bg-[#FAF8F5] hover:bg-[#EFEAE0] rounded-xs border border-[#D8D1C5] transition-colors"
                      >
                        <GitCompare className="w-3 h-3" />
                        <span>Compare</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          if (
                            confirm(
                              `Restore Revision #${rev.revision_number}? This will replace your working draft with this historical snapshot.`
                            )
                          ) {
                            await onRestore(rev.id);
                            onClose();
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#A94F42] hover:text-white bg-[#FFFEFA] hover:bg-[#A94F42] rounded-xs border border-[#A94F42] transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore Snapshot</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {compareTarget && (
        <RevisionCompareModal
          isOpen={Boolean(compareTarget)}
          onClose={() => setCompareTarget(null)}
          revisionNumber={compareTarget.revision_number}
          historicalSections={compareTarget.snapshot?.sections || []}
          currentSections={currentSections}
        />
      )}
    </>
  );
}

