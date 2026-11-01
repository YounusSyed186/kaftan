import { describe, it, expect } from 'vitest';
import {
  getActiveDraft,
  saveWorkingDraft,
  publishHomepageDraft,
  getHomepageRevisionsList,
  restoreHistoricalRevision,
} from '@/services/homepage-revisions';

describe('Homepage Revisions Service & Lifecycle Tests', () => {
  it('retrieves the active working draft baseline', async () => {
    const draft = await getActiveDraft();
    expect(draft).toBeDefined();
    expect(draft.version).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(draft.sections)).toBe(true);
  });

  it('saves working draft changes and increments version', async () => {
    const current = await getActiveDraft();
    const updatedSections = [
      ...current.sections,
      {
        id: 'sec-test-custom',
        section_key: 'more_stories',
        name: 'Test More Stories',
        title: 'Custom Title',
        layout_type: 'grid' as const,
        source_mode: 'manual' as const,
        items_limit: 4,
        display_order: current.sections.length + 1,
        is_active: true,
        settings: {},
        created_at: '',
        updated_at: '',
        items: [],
      },
    ];

    const saveRes = await saveWorkingDraft(updatedSections, current.version);
    expect(saveRes.success).toBe(true);
    expect(saveRes.version).toBe(current.version + 1);

    const reloaded = await getActiveDraft();
    expect(reloaded.version).toBe(saveRes.version);
    expect(reloaded.sections.some((s) => s.id === 'sec-test-custom')).toBe(true);
  });

  it('detects concurrency conflict when saving with stale expectedVersion', async () => {
    const current = await getActiveDraft();
    const staleVersion = current.version - 1;

    const res = await saveWorkingDraft(current.sections, staleVersion);
    expect(res.success).toBe(false);
    expect(res.conflict).toBe(true);
  });

  it('publishes working draft and archives prior published revision', async () => {
    const draft = await getActiveDraft();
    const pubRes = await publishHomepageDraft(draft.sections, 'Release Autumn 2026');

    expect(pubRes.success).toBe(true);
    expect(pubRes.revisionNumber).toBeGreaterThan(1);

    const revisions = await getHomepageRevisionsList();
    const published = revisions.filter((r) => r.status === 'published');
    expect(published).toHaveLength(1);
    expect(published[0].revision_number).toBe(pubRes.revisionNumber);
    expect(published[0].notes).toBe('Release Autumn 2026');

    // Prior revisions should be archived
    const archived = revisions.filter((r) => r.status === 'archived');
    expect(archived.length).toBeGreaterThan(0);
  });

  it('restores historical revision into a fresh working draft without mutating historical record', async () => {
    const revisions = await getHomepageRevisionsList();
    expect(revisions.length).toBeGreaterThan(0);

    const targetRev = revisions[revisions.length - 1]; // oldest revision
    const restoreRes = await restoreHistoricalRevision(targetRev.id);

    expect(restoreRes.success).toBe(true);
    expect(restoreRes.version).toBeGreaterThan(1);

    // Active draft should now match target revision sections
    const activeDraft = await getActiveDraft();
    expect(activeDraft.sections.length).toBe(targetRev.snapshot.sections.length);

    // Historical record itself must remain unchanged
    const reloadedRevisions = await getHomepageRevisionsList();
    const historicalFound = reloadedRevisions.find((r) => r.id === targetRev.id);
    expect(historicalFound).toBeDefined();
    expect(historicalFound?.revision_number).toBe(targetRev.revision_number);
  });
});

