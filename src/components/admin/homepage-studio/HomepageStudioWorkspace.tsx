'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { SectionNavigator } from './SectionNavigator';
import { PropertiesInspector } from './PropertiesInspector';
import { SectionPickerModal } from './SectionPickerModal';
import { PublishDialog } from './PublishDialog';
import { RevisionHistoryDrawer } from './RevisionHistoryDrawer';
import { SectionRenderer } from '@/components/homepage/SectionRenderer';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';
import type { PopulatedArticle, PopulatedProduct, CompetitionRow, PopulatedHomepageSection } from '@/types/models';
import { Plus, CheckCircle2 } from 'lucide-react';

interface HomepageStudioWorkspaceProps {
  initialSections: PopulatedHomepageSection[];
  allArticles: PopulatedArticle[];
  allProducts: PopulatedProduct[];
  activeCompetition: CompetitionRow | null;
}

export function HomepageStudioWorkspace({
  initialSections,
  allArticles,
  allProducts,
  activeCompetition,
}: HomepageStudioWorkspaceProps) {
  const {
    sections,
    setSections,
    selectedSectionId,
    selectSection,
    viewport,
    mode,
    setMode,
    isDirty,
    version,
    setSaving,
    markSaved,
    setPublishing,
    addSection,
    undo,
    redo,
  } = useHomepageStudioStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Set mode to edit when entering studio workspace, and cleanup to preview on unmount
  useEffect(() => {
    setMode('edit');
    return () => {
      setMode('preview');
    };
  }, [setMode]);

  // Initialize draft from server on first render
  useEffect(() => {
    fetch('/api/admin/homepage-studio/draft')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSections(json.data.sections, json.data.version);
        } else {
          setSections(initialSections);
        }
      })
      .catch(() => {
        setSections(initialSections);
      });
  }, [initialSections, setSections]);

  // Unsaved changes browser warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSaveDraft = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/homepage-studio/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections,
          expectedVersion: version,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        markSaved(json.data.version);
        showToast('Draft successfully saved.');
      } else if (json.conflict) {
        alert(
          'Conflict detected: Another editor has updated this draft. Please reload to review current changes.'
        );
      } else {
        alert(`Failed to save draft: ${json.error}`);
      }
    } catch (err: unknown) {
      alert(`Save error: ${err instanceof Error ? err.message : 'Unknown save error'}`);
    } finally {
      setSaving(false);
    }
  }, [sections, version, setSaving, markSaved]);

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveDraft, undo, redo]);

  const handleConfirmPublish = async (notes: string) => {
    setPublishing(true);
    try {
      const res = await fetch('/api/admin/homepage-studio/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections,
          notes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast('Published live! Kaftan homepage cache revalidated.');
        markSaved(version + 1);
      } else {
        throw new Error(json.error || 'Publication failed.');
      }
    } finally {
      setPublishing(false);
    }
  };

  const handleRestoreRevision = async (revisionId: string) => {
    const res = await fetch('/api/admin/homepage-studio/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revisionId }),
    });

    const json = await res.json();
    if (json.success && json.data) {
      setSections(json.data.sections, json.data.version);
      showToast('Revision snapshot restored into active draft.');
    } else {
      throw new Error(json.error || 'Restore failed.');
    }
  };

  // Viewport Container Styles
  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'tablet':
        return 'w-[768px] mx-auto shadow-2xl border-x border-[#D8D1C5] my-6';
      case 'mobile':
        return 'w-[375px] mx-auto shadow-2xl border-x border-[#D8D1C5] my-6';
      default:
        return 'w-full max-w-full';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#EAE6DE] text-[#25221F] overflow-hidden">
      {/* Top Toolbar */}
      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onOpenPublish={() => setIsPublishDialogOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
      />

      {/* Main 3-Region Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Section Navigator */}
        <SectionNavigator onOpenAddModal={() => setIsAddModalOpen(true)} />

        {/* Center: Live Preview Canvas */}
        <main className="flex-1 bg-[#E8E4DC] overflow-y-auto flex flex-col relative shadow-inner">
          {/* Canvas Viewport Notice on responsive switch */}
          {viewport !== 'desktop' && (
            <div className="bg-[#1C1A17] text-[#EDE8DF] text-[10px] uppercase font-mono tracking-widest text-center py-1.5 sticky top-0 z-40 border-b border-[#38332E]">
              Responsive Preview Mode: {viewport === 'tablet' ? 'Tablet (768px)' : 'Mobile (375px)'}
            </div>
          )}

          {/* Actual Homepage Rendered with Draft Configuration */}
          <div
            className={`transition-all duration-200 bg-[#F7F4ED] ${getViewportWidthClass()} min-h-full flex flex-col pb-16 shadow-sm`}
          >
            {sections.map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
                allArticles={allArticles}
                activeCompetition={activeCompetition}
                isEditorMode={mode === 'edit'}
                isSelected={selectedSectionId === section.id}
                onSelect={(id) => selectSection(id)}
              />
            ))}

            {/* Quick Add Section Card at bottom of preview (in edit mode) */}
            {mode === 'edit' && (
              <div className="px-6 py-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#FFFEFA] border-2 border-dashed border-[#D8D1C5] hover:border-[#25221F] text-[#77716A] hover:text-[#25221F] transition-all hover:shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Section Below</span>
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Right: Properties Inspector */}
        <PropertiesInspector
          allArticles={allArticles}
          allProducts={allProducts}
        />
      </div>

      {/* Modals & Drawers */}
      <SectionPickerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectType={(type) => addSection(type)}
      />

      <PublishDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onConfirmPublish={handleConfirmPublish}
      />

      <RevisionHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        onRestore={handleRestoreRevision}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#25221F] text-[#F7F4ED] px-4 py-2.5 shadow-2xl text-xs flex items-center gap-2 border-l-4 border-[#777B59] animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#777B59]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

