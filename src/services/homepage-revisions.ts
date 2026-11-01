import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hasSupabaseConfigured } from '@/lib/validation/env';
import { getHomepageSections } from '@/services/homepage';
import type { PopulatedHomepageSection, HomepageRevision } from '@/types/models';
import { revalidatePath } from 'next/cache';

async function getSupabaseAdmin() {
  try {
    return createAdminClient() as any;
  } catch {
    return (await createServerSupabaseClient()) as any;
  }
}

// In-memory persistent fallback cache for drafts and revisions
interface DraftStore {
  version: number;
  sections: PopulatedHomepageSection[];
  updatedAt: string;
}

const globalDraftState: {
  draft: DraftStore | null;
  revisions: HomepageRevision[];
} = {
  draft: null,
  revisions: [
    {
      id: 'rev-init-1',
      revision_number: 1,
      status: 'published',
      snapshot: {
        sections: [],
        metadata: {
          schemaVersion: 1,
          notes: 'Initial production publication',
        },
      },
      notes: 'Initial production publication',
      created_by: 'Editorial Staff',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
};

export async function getActiveDraft(): Promise<{
  version: number;
  sections: PopulatedHomepageSection[];
}> {
  if (hasSupabaseConfigured()) {
    try {
      const supabase = await getSupabaseAdmin();
      const { data, error } = await supabase
        .from('homepage_drafts')
        .select('*')
        .eq('id', 'current')
        .maybeSingle();

      if (!error && data && data.snapshot) {
        return {
          version: data.version || 1,
          sections: (data.snapshot as { sections: PopulatedHomepageSection[] }).sections || [],
        };
      }
    } catch {
      // fallback
    }
  }

  // Fallback / memory mode
  if (!globalDraftState.draft) {
    const initialSections = await getHomepageSections();
    globalDraftState.draft = {
      version: 1,
      sections: initialSections,
      updatedAt: new Date().toISOString(),
    };
    if (globalDraftState.revisions[0].snapshot.sections.length === 0) {
      globalDraftState.revisions[0].snapshot.sections = initialSections;
    }
  }

  return {
    version: globalDraftState.draft.version,
    sections: globalDraftState.draft.sections,
  };
}

export async function saveWorkingDraft(
  sections: PopulatedHomepageSection[],
  expectedVersion: number
): Promise<{ success: boolean; version: number; conflict?: boolean }> {
  if (hasSupabaseConfigured()) {
    try {
      const supabase = await getSupabaseAdmin();
      const { data: current } = await supabase
        .from('homepage_drafts')
        .select('version')
        .eq('id', 'current')
        .maybeSingle();

      if (current && current.version !== expectedVersion) {
        return { success: false, version: current.version, conflict: true };
      }

      const nextVersion = expectedVersion + 1;
      const { error } = await supabase.from('homepage_drafts').upsert({
        id: 'current',
        version: nextVersion,
        snapshot: { sections },
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        return { success: true, version: nextVersion };
      }
    } catch {
      // fallback to memory
    }
  }

  if (globalDraftState.draft && globalDraftState.draft.version !== expectedVersion) {
    return {
      success: false,
      version: globalDraftState.draft.version,
      conflict: true,
    };
  }

  const nextVersion = expectedVersion + 1;
  globalDraftState.draft = {
    version: nextVersion,
    sections,
    updatedAt: new Date().toISOString(),
  };

  return { success: true, version: nextVersion };
}

export async function publishHomepageDraft(
  sections: PopulatedHomepageSection[],
  notes: string = ''
): Promise<{ success: boolean; revisionNumber: number }> {
  const publishedAt = new Date().toISOString();

  if (hasSupabaseConfigured()) {
    try {
      const supabase = await getSupabaseAdmin();

      // 1. Get latest revision number
      const { data: latestRevs } = await supabase
        .from('homepage_revisions')
        .select('revision_number')
        .order('revision_number', { ascending: false })
        .limit(1);

      const nextRevNumber = (latestRevs?.[0]?.revision_number || 0) + 1;

      // 2. Mark previous published revisions as archived
      await supabase
        .from('homepage_revisions')
        .update({ status: 'archived' })
        .eq('status', 'published');

      // 3. Insert new published revision
      await supabase.from('homepage_revisions').insert({
        revision_number: nextRevNumber,
        status: 'published',
        snapshot: { sections, metadata: { schemaVersion: 1, notes } },
        notes,
        created_by: 'admin',
        published_at: publishedAt,
      });

      // 4. Atomically sync live homepage_sections table
      for (const [idx, sec] of sections.entries()) {
        await supabase
          .from('homepage_sections')
          .update({
            display_order: idx + 1,
            is_active: sec.is_active,
            title: sec.title,
            settings: sec.settings,
            updated_at: publishedAt,
          })
          .eq('id', sec.id);

        if (Array.isArray(sec.items)) {
          for (const [itemIdx, item] of sec.items.entries()) {
            const isTempId = !item.id || item.id.startsWith('item-');
            if (isTempId) {
              await supabase.from('homepage_items').insert({
                homepage_section_id: sec.id,
                article_id: item.article_id || null,
                product_id: item.product_id || null,
                ad_creative_id: item.ad_creative_id || null,
                display_order: item.display_order ?? itemIdx + 1,
                title_override: item.title_override || null,
                excerpt_override: item.excerpt_override || null,
                is_active: item.is_active ?? true,
                updated_at: publishedAt,
              });
            } else {
              await supabase
                .from('homepage_items')
                .update({
                  article_id: item.article_id || null,
                  product_id: item.product_id || null,
                  ad_creative_id: item.ad_creative_id || null,
                  display_order: item.display_order ?? itemIdx + 1,
                  title_override: item.title_override || null,
                  excerpt_override: item.excerpt_override || null,
                  is_active: item.is_active ?? true,
                  updated_at: publishedAt,
                })
                .eq('id', item.id);
            }
          }
        }
      }

      // 5. Invalidate public homepage edge cache
      revalidatePath('/');

      return { success: true, revisionNumber: nextRevNumber };
    } catch {
      // fallback
    }
  }

  // Memory fallback publish
  const nextRevNumber = globalDraftState.revisions.length + 1;

  // Mark previous published as archived
  for (const rev of globalDraftState.revisions) {
    if (rev.status === 'published') {
      rev.status = 'archived';
    }
  }

  const newRevision: HomepageRevision = {
    id: `rev-${Date.now()}`,
    revision_number: nextRevNumber,
    status: 'published',
    snapshot: {
      sections: JSON.parse(JSON.stringify(sections)),
      metadata: { schemaVersion: 1, notes },
    },
    notes: notes || 'Published through Homepage Studio',
    created_by: 'Editorial Staff',
    created_at: publishedAt,
    published_at: publishedAt,
  };

  globalDraftState.revisions.unshift(newRevision);

  // Invalidate public route
  try {
    revalidatePath('/');
  } catch {}

  return { success: true, revisionNumber: nextRevNumber };
}

export async function getHomepageRevisionsList(): Promise<HomepageRevision[]> {
  if (hasSupabaseConfigured()) {
    try {
      const supabase = await getSupabaseAdmin();
      const { data, error } = await supabase
        .from('homepage_revisions')
        .select('*')
        .order('revision_number', { ascending: false })
        .limit(30);

      if (!error && data && data.length > 0) {
        return data as unknown as HomepageRevision[];
      }
    } catch {
      // fallback
    }
  }

  return globalDraftState.revisions;
}

export async function restoreHistoricalRevision(revisionId: string): Promise<{
  success: boolean;
  sections: PopulatedHomepageSection[];
  version: number;
}> {
  let targetRevision: HomepageRevision | undefined;

  if (hasSupabaseConfigured()) {
    try {
      const supabase = await getSupabaseAdmin();
      const { data } = await supabase
        .from('homepage_revisions')
        .select('*')
        .eq('id', revisionId)
        .maybeSingle();

      if (data) {
        targetRevision = data as unknown as HomepageRevision;
      }
    } catch {
      // fallback
    }
  }

  if (!targetRevision) {
    targetRevision = globalDraftState.revisions.find((r) => r.id === revisionId);
  }

  if (!targetRevision || !targetRevision.snapshot?.sections) {
    throw new Error('Historical revision not found or snapshot corrupted.');
  }

  const restoredSections = targetRevision.snapshot.sections;
  const currentDraft = await getActiveDraft();
  const nextVersion = currentDraft.version + 1;

  await saveWorkingDraft(restoredSections, currentDraft.version);

  return {
    success: true,
    sections: restoredSections,
    version: nextVersion,
  };
}
