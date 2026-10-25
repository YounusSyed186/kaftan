-- KAFTAN Editorial Publication & CMS Database Schema
-- Migration: 20261025000001_initial_kaftan_schema.sql
-- Based on: KAFTAN_Database_Design_Document_Revised.docx

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Roles Definition (Required to cleanly satisfy users.role_id foreign key constraint)
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (id, name, description) VALUES
    ('admin', 'Administrator', 'Full system access, publication settings, and user management'),
    ('editor', 'Editor', 'Editorial content management, article reviews, and homepage curation'),
    ('author', 'Author', 'Story writing, contributor drafts, and image submissions')
ON CONFLICT (id) DO NOTHING;

-- 2. Users (Administration)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT DEFAULT 'author',
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'invited')),
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Media Assets (Central image library)
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_key TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    credit TEXT,
    license_info TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Media Variants (Optimized derivatives)
CREATE TABLE IF NOT EXISTS media_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    storage_key TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    format TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Authors (Editorial contributors)
CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    bio TEXT,
    profile_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    website_url TEXT,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Sponsors (Sponsorship)
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    website_url TEXT,
    description TEXT,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Campaigns (Sponsorship)
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_campaign_dates CHECK (end_date >= start_date)
);

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Articles (Editorial core)
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    body JSONB NOT NULL DEFAULT '[]'::jsonb,
    article_type TEXT NOT NULL CHECK (article_type IN ('fashion_editorial', 'interview', 'trend_report', 'style_guide', 'designer_profile', 'news')),
    content_type TEXT NOT NULL DEFAULT 'original' CHECK (content_type IN ('original', 'sponsored', 'affiliate')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'scheduled', 'published', 'archived')),
    featured_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_sponsored_sponsor CHECK (content_type <> 'sponsored' OR sponsor_id IS NOT NULL)
);

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Article Authors (Multiple contributors per article)
CREATE TABLE IF NOT EXISTS article_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    contribution_type TEXT NOT NULL DEFAULT 'writer',
    display_order INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT uq_article_author_role UNIQUE (article_id, author_id, contribution_type)
);

-- 10. Sponsored Content (Campaign association and disclosure)
CREATE TABLE IF NOT EXISTS sponsored_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    disclosure_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sponsored_article_campaign UNIQUE (article_id, campaign_id)
);

CREATE TRIGGER update_sponsored_content_updated_at BEFORE UPDATE ON sponsored_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Products (Lightweight editorial product cards & promotional listings)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    brand_name TEXT NOT NULL,
    image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    original_price NUMERIC(10, 2) CHECK (original_price IS NULL OR original_price >= 0),
    sale_price NUMERIC(10, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
    currency TEXT NOT NULL DEFAULT 'AUD',
    product_url TEXT NOT NULL,
    link_type TEXT NOT NULL DEFAULT 'external' CHECK (link_type IN ('external', 'affiliate')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Competitions (Competition management)
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    prize_summary TEXT NOT NULL,
    terms TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'closed', 'completed')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_competition_times CHECK (end_time >= start_time)
);

-- Crucial Rule: Exactly one active competition allowed at any given time
CREATE UNIQUE INDEX IF NOT EXISTS idx_competitions_single_active ON competitions (status) WHERE (status = 'active');

CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Competition Entries (Submissions)
CREATE TABLE IF NOT EXISTS competition_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    participant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    form_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    is_eligible BOOLEAN NOT NULL DEFAULT true
);

-- 14. Competition Prizes (Optional multiple prizes)
CREATE TABLE IF NOT EXISTS competition_prizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_competition_prizes_updated_at BEFORE UPDATE ON competition_prizes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. Advertising Placements
CREATE TABLE IF NOT EXISTS ad_placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    placement_key TEXT UNIQUE NOT NULL,
    description TEXT,
    supported_layouts JSONB NOT NULL DEFAULT '["banner"]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_ad_placements_updated_at BEFORE UPDATE ON ad_placements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 16. Advertising Creatives
CREATE TABLE IF NOT EXISTS ad_creatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    ad_placement_id UUID NOT NULL REFERENCES ad_placements(id) ON DELETE RESTRICT,
    headline TEXT NOT NULL,
    copy TEXT,
    destination_url TEXT NOT NULL,
    desktop_image_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
    mobile_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_ad_creative_dates CHECK (end_date >= start_date)
);

CREATE TRIGGER update_ad_creatives_updated_at BEFORE UPDATE ON ad_creatives
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 17. Homepage Sections (Database-driven layout)
CREATE TABLE IF NOT EXISTS homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    title TEXT,
    layout_type TEXT NOT NULL CHECK (layout_type IN ('hero', 'grid', 'carousel', 'banner', 'product_grid')),
    source_mode TEXT NOT NULL DEFAULT 'manual' CHECK (source_mode IN ('manual', 'automatic')),
    items_limit INTEGER CHECK (items_limit IS NULL OR items_limit > 0),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON homepage_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 18. Homepage Items (Ordered content assignments)
CREATE TABLE IF NOT EXISTS homepage_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homepage_section_id UUID NOT NULL REFERENCES homepage_sections(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    ad_creative_id UUID REFERENCES ad_creatives(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    title_override TEXT,
    excerpt_override TEXT,
    visibility_start TIMESTAMPTZ,
    visibility_end TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_single_homepage_content CHECK (
        (CASE WHEN article_id IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN product_id IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN campaign_id IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN ad_creative_id IS NOT NULL THEN 1 ELSE 0 END) = 1
    )
);

CREATE TRIGGER update_homepage_items_updated_at BEFORE UPDATE ON homepage_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 19. Navigation Items (Top menu and dropdowns)
CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    open_in_new_tab BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON navigation_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 20. Content Images (Image ownership and device crops)
CREATE TABLE IF NOT EXISTS content_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    homepage_item_id UUID REFERENCES homepage_items(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    placement TEXT NOT NULL CHECK (placement IN ('hero', 'thumbnail', 'banner', 'inline', 'card', 'category_strip')),
    desktop_image_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
    tablet_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    mobile_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    alt_text TEXT,
    focal_point_x NUMERIC(4,3) CHECK (focal_point_x IS NULL OR (focal_point_x >= 0 AND focal_point_x <= 1)),
    focal_point_y NUMERIC(4,3) CHECK (focal_point_y IS NULL OR (focal_point_y >= 0 AND focal_point_y <= 1)),
    fit_mode TEXT NOT NULL DEFAULT 'cover' CHECK (fit_mode IN ('cover', 'contain')),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_single_content_owner CHECK (
        (CASE WHEN article_id IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN product_id IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN homepage_item_id IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN campaign_id IS NOT NULL THEN 1 ELSE 0 END) = 1
    )
);

CREATE TRIGGER update_content_images_updated_at BEFORE UPDATE ON content_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_articles_status_pub_at ON articles (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles (author_id);
CREATE INDEX IF NOT EXISTS idx_articles_sponsor_id ON articles (sponsor_id);
CREATE INDEX IF NOT EXISTS idx_article_authors_article_id ON article_authors (article_id, display_order);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors (slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON homepage_sections (is_active, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_homepage_items_section_order ON homepage_items (homepage_section_id, is_active, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent_order ON navigation_items (parent_id, is_active, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_ad_creatives_placement_status ON ad_creatives (ad_placement_id, status, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns (status, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_competition_entries_comp ON competition_entries (competition_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_images_article ON content_images (article_id, placement);
CREATE INDEX IF NOT EXISTS idx_content_images_product ON content_images (product_id, placement);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsored_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_images ENABLE ROW LEVEL SECURITY;

-- Public READ policies for eligible published content:
CREATE POLICY "Public can view published articles" ON articles
    FOR SELECT USING (status = 'published' AND published_at <= CURRENT_TIMESTAMP);

CREATE POLICY "Public can view authors" ON authors
    FOR SELECT USING (true);

CREATE POLICY "Public can view article contributors" ON article_authors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles
            WHERE articles.id = article_authors.article_id
              AND articles.status = 'published'
              AND articles.published_at <= CURRENT_TIMESTAMP
        )
    );

CREATE POLICY "Public can view media assets" ON media_assets
    FOR SELECT USING (true);

CREATE POLICY "Public can view media variants" ON media_variants
    FOR SELECT USING (true);

CREATE POLICY "Public can view content images" ON content_images
    FOR SELECT USING (true);

CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active navigation items" ON navigation_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active homepage sections" ON homepage_sections
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active homepage items" ON homepage_items
    FOR SELECT USING (
        is_active = true
        AND (visibility_start IS NULL OR visibility_start <= CURRENT_TIMESTAMP)
        AND (visibility_end IS NULL OR visibility_end >= CURRENT_TIMESTAMP)
    );

CREATE POLICY "Public can view active sponsors" ON sponsors
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active campaigns" ON campaigns
    FOR SELECT USING (status = 'active' AND start_date <= CURRENT_TIMESTAMP AND end_date >= CURRENT_TIMESTAMP);

CREATE POLICY "Public can view sponsored content links" ON sponsored_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles
            WHERE articles.id = sponsored_content.article_id
              AND articles.status = 'published'
              AND articles.published_at <= CURRENT_TIMESTAMP
        )
    );

CREATE POLICY "Public can view active ad placements" ON ad_placements
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active ad creatives" ON ad_creatives
    FOR SELECT USING (status = 'active' AND start_date <= CURRENT_TIMESTAMP AND end_date >= CURRENT_TIMESTAMP);

CREATE POLICY "Public can view active competitions" ON competitions
    FOR SELECT USING (status = 'active' AND start_time <= CURRENT_TIMESTAMP AND end_time >= CURRENT_TIMESTAMP);

CREATE POLICY "Public can view active competition prizes" ON competition_prizes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM competitions
            WHERE competitions.id = competition_prizes.competition_id
              AND competitions.status = 'active'
        )
    );

-- Competition Entries: Public can INSERT with valid active competition, but CANNOT read others' entries
CREATE POLICY "Public can submit competition entries" ON competition_entries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM competitions
            WHERE competitions.id = competition_entries.competition_id
              AND competitions.status = 'active'
              AND competitions.start_time <= CURRENT_TIMESTAMP
              AND competitions.end_time >= CURRENT_TIMESTAMP
        )
    );

-- Authenticated Staff Full Access Policies (Service Role / Auth users)
CREATE POLICY "Staff full access roles" ON roles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access users" ON users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access media_assets" ON media_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access media_variants" ON media_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access authors" ON authors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access sponsors" ON sponsors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access campaigns" ON campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access articles" ON articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access article_authors" ON article_authors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access sponsored_content" ON sponsored_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access competitions" ON competitions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access competition_entries" ON competition_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access competition_prizes" ON competition_prizes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access ad_placements" ON ad_placements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access ad_creatives" ON ad_creatives FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access homepage_sections" ON homepage_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access homepage_items" ON homepage_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access navigation_items" ON navigation_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff full access content_images" ON content_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
