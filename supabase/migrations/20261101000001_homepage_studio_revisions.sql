-- =============================================================================
-- Migration: 20261101000001_homepage_studio_revisions.sql
-- Description: Immutable revision history and working draft storage for Visual Homepage Studio
-- =============================================================================

-- 1. Create Homepage Revisions Table (Immutable Historical Snapshots)
CREATE TABLE IF NOT EXISTS homepage_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revision_number INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    snapshot JSONB NOT NULL,
    notes TEXT,
    created_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ
);

-- Indexes for efficient revision retrieval and sequencing
CREATE INDEX IF NOT EXISTS idx_homepage_revisions_status_created 
    ON homepage_revisions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_homepage_revisions_number 
    ON homepage_revisions (revision_number DESC);

-- 2. Create Working Draft Table (Isolated Staging Area)
CREATE TABLE IF NOT EXISTS homepage_drafts (
    id TEXT PRIMARY KEY DEFAULT 'current',
    version INTEGER NOT NULL DEFAULT 1,
    snapshot JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to maintain updated_at on drafts
CREATE TRIGGER update_homepage_drafts_updated_at 
    BEFORE UPDATE ON homepage_drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Row Level Security (RLS) Configuration
ALTER TABLE homepage_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_drafts ENABLE ROW LEVEL SECURITY;

-- Public can inspect published historical records
CREATE POLICY "Public can view published revisions" 
    ON homepage_revisions
    FOR SELECT 
    USING (status = 'published');

-- Authenticated editorial staff have full manage access to revisions
CREATE POLICY "Staff full access homepage_revisions" 
    ON homepage_revisions
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Authenticated editorial staff have full access to working drafts
CREATE POLICY "Staff full access homepage_drafts" 
    ON homepage_drafts
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- 4. Initial Seed Snapshot for Revision #1
INSERT INTO homepage_revisions (revision_number, status, snapshot, notes, created_by, published_at)
SELECT 
    1,
    'published',
    jsonb_build_object(
        'sections', 
        COALESCE(
            (
                SELECT jsonb_agg(to_jsonb(s.*) ORDER BY s.display_order ASC) 
                FROM homepage_sections s 
                WHERE s.is_active = true
            ), 
            '[]'::jsonb
        ),
        'metadata',
        jsonb_build_object(
            'schemaVersion', 1,
            'notes', 'Initial publication snapshot'
        )
    ),
    'Initial publication baseline',
    'admin',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM homepage_revisions WHERE revision_number = 1);

