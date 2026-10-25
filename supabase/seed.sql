-- KAFTAN Development Seed Data
-- Matches the visual design reference and approved editorial structure

-- Clean existing seed data safely if re-running
DELETE FROM homepage_items;
DELETE FROM homepage_sections;
DELETE FROM content_images;
DELETE FROM sponsored_content;
DELETE FROM ad_creatives;
DELETE FROM ad_placements;
DELETE FROM campaigns;
DELETE FROM sponsors;
DELETE FROM competition_entries;
DELETE FROM competition_prizes;
DELETE FROM competitions;
DELETE FROM products;
DELETE FROM article_authors;
DELETE FROM articles;
DELETE FROM authors;
DELETE FROM media_variants;
DELETE FROM media_assets;
DELETE FROM navigation_items;
DELETE FROM users;

-- 1. Test Admin & Editor Users
INSERT INTO users (id, name, email, role_id, account_status) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Elena Vance', 'elena.vance@kaftan.fashion', 'admin', 'active'),
    ('00000000-0000-0000-0000-000000000002', 'Marcus Sterling', 'marcus.sterling@kaftan.fashion', 'editor', 'active'),
    ('00000000-0000-0000-0000-000000000003', 'Chloe Montgomery', 'chloe.m@kaftan.fashion', 'author', 'active');

-- 2. Authors
INSERT INTO authors (id, name, slug, bio, website_url) VALUES
    ('10000000-0000-0000-0000-000000000001', 'Chloe Montgomery', 'chloe-montgomery', 'Senior Fashion & Style Editor at KAFTAN.', 'https://kaftan.fashion/authors/chloe-montgomery'),
    ('10000000-0000-0000-0000-000000000002', 'Lachlan Hayes', 'lachlan-hayes', 'Sydney-based fashion photographer and visual storyteller.', 'https://lachlanhayes.com'),
    ('10000000-0000-0000-0000-000000000003', 'Sienna Wright', 'sienna-wright', 'Luxury travel, lifestyle and sustainable fashion writer.', 'https://kaftan.fashion/authors/sienna-wright');

-- 3. Navigation Items
INSERT INTO navigation_items (id, label, url, display_order, is_active, open_in_new_tab) VALUES
    ('20000000-0000-0000-0000-000000000001', 'Latest', '/latest', 1, true, false),
    ('20000000-0000-0000-0000-000000000002', 'Trends', '/trends', 2, true, false),
    ('20000000-0000-0000-0000-000000000003', 'Style', '/style', 3, true, false),
    ('20000000-0000-0000-0000-000000000004', 'Designers', '/designers', 4, true, false),
    ('20000000-0000-0000-0000-000000000005', 'Travel', '/travel', 5, true, false),
    ('20000000-0000-0000-0000-000000000006', 'Lifestyle', '/lifestyle', 6, true, false),
    ('20000000-0000-0000-0000-000000000007', 'Beauty', '/beauty', 7, true, false),
    ('20000000-0000-0000-0000-000000000008', 'Sale', '/sale', 8, true, false);

-- 4. Media Assets (Curated high-res editorial imagery)
INSERT INTO media_assets (id, storage_key, original_filename, mime_type, width, height, file_size_bytes, alt_text, caption, credit, uploaded_by) VALUES
    ('30000000-0000-0000-0000-000000000001', '/images/editorial/hero-mediterranean-resortwear.jpg', 'hero-mediterranean-resortwear.jpg', 'image/jpeg', 2400, 1600, 850000, 'Model in ivory resortwear with dark sunglasses on Mediterranean stone terrace', 'A new season of modern elegance.', 'Photo by Kaftan Editorial Team', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000002', '/images/editorial/story-resortwear-trends.jpg', 'resortwear-trends-summer.jpg', 'image/jpeg', 800, 600, 185430, 'Model in bohemian resortwear dress on sand', '5 Resortwear Trends Defining Summer 2026', 'Photo by Marcus Sterling', '00000000-0000-0000-0000-000000000002'),
    ('30000000-0000-0000-0000-000000000003', '/images/editorial/story-australian-labels.jpg', 'australian-labels-global.jpg', 'image/jpeg', 800, 600, 210430, 'Model in tailored black designer blazer', 'Australian Labels Making a Global Impact', 'Photo by Chloe Montgomery', '00000000-0000-0000-0000-000000000003'),
    ('30000000-0000-0000-0000-000000000004', '/images/editorial/story-capsule-wardrobe.jpg', 'capsule-wardrobe-timeless.jpg', 'image/jpeg', 800, 600, 198210, 'Model in crisp white shirt and retro sunglasses', 'How to Build a Timeless Capsule Wardrobe', 'Photo by Marcus Sterling', '00000000-0000-0000-0000-000000000002'),
    ('30000000-0000-0000-0000-000000000005', '/images/editorial/story-fashion-boutiques.jpg', 'boutiques-australia.jpg', 'image/jpeg', 800, 600, 240120, 'Luxury fashion boutique interior in Paddington Sydney', 'The Best Fashion Boutiques to Visit in Australia', 'Photo by Sienna Wright', '00000000-0000-0000-0000-000000000003'),
    ('30000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85', 'designers-redefining.jpg', 'image/jpeg', 900, 1200, 310500, 'Model with sleek sunglasses and sculpted tailoring', 'The Designers Redefining Australian Fashion', 'Photo by Lachlan Hayes', '00000000-0000-0000-0000-000000000002'),
    ('30000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85', 'effortless-dressing.jpg', 'image/jpeg', 800, 600, 189000, 'Model in backless black knit evening dress', 'The Art of Effortless Dressing', 'Photo by Chloe Montgomery', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=85', 'coastal-getaway-shopping.jpg', 'image/jpeg', 800, 600, 290100, 'Colourful coastal cliffside village overlooking Mediterranean ocean', 'Where to Shop on Your Next Getaway', 'Photo by Sienna Wright', '00000000-0000-0000-0000-000000000003'),
    ('30000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85', 'warm-days-bolder-looks.jpg', 'image/jpeg', 900, 1300, 345000, 'Model in flowing terracotta burnt-orange pleated gown in sunshine', 'Warm Days, Bolder Looks', 'Photo by Lachlan Hayes', '00000000-0000-0000-0000-000000000002'),
    ('30000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85', 'resort-living-sponsored.jpg', 'image/jpeg', 800, 800, 275000, 'Two models wearing colourful patterned resort kaftans', 'The Art of Resort Living with Fashion Spectrum', 'Photo courtesy of Fashion Spectrum', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=85', 'fashion-spectrum-ad.jpg', 'image/jpeg', 800, 800, 260000, 'Model in elegant floral kaftan for ad campaign', 'Effortless Kaftans For Every Occasion', 'Fashion Spectrum', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85', 'gold-accessories.jpg', 'image/jpeg', 800, 600, 195000, 'Gold link drop earrings resting on brass tray', '6 Accessories Elevating Any Look', 'Photo by Marcus Sterling', '00000000-0000-0000-0000-000000000002'),
    ('30000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=85', 'emerging-talent.jpg', 'image/jpeg', 800, 600, 220000, 'Model in cream silk belted suit on urban terrace', 'Emerging Talent You Need to Know', 'Photo by Chloe Montgomery', '00000000-0000-0000-0000-000000000001'),
    ('30000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=85', 'conscious-wardrobe.jpg', 'image/jpeg', 800, 600, 175000, 'Lush green monstera and palm foliage texture', 'A More Conscious Wardrobe', 'Photo by Sienna Wright', '00000000-0000-0000-0000-000000000003'),
    ('30000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85', 'bec-and-bridge.jpg', 'image/jpeg', 800, 600, 240000, 'Two models in chic tailoring and sunglasses in city', 'In Conversation With Bec + Bridge', 'Photo by Marcus Sterling', '00000000-0000-0000-0000-000000000002'),
    ('30000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85', 'competition-straw-hat.jpg', 'image/jpeg', 1200, 600, 320000, 'Woman in straw sunhat looking towards turquoise sea', 'Win a Kaftan from Fashion Spectrum', 'Photo by Kaftan Editorial Team', '00000000-0000-0000-0000-000000000001');

-- 5. Sponsors & Campaigns
INSERT INTO sponsors (id, name, slug, website_url, description, contact_name, contact_email, status) VALUES
    ('40000000-0000-0000-0000-000000000001', 'Fashion Spectrum', 'fashion-spectrum', 'https://fashionspectrum.com.au', 'Australian label specializing in luxury silk and embellished kaftans.', 'Sarah Jenkins', 'partnerships@fashionspectrum.com.au', 'active');

INSERT INTO campaigns (id, sponsor_id, name, description, start_date, end_date, status) VALUES
    ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Summer 2026 Resort Showcase', 'Promotional campaign highlighting the 2026 Kaftan collection and national competition.', '2026-10-01T00:00:00Z', '2026-12-31T23:59:59Z', 'active');

-- 6. Articles
INSERT INTO articles (id, title, slug, excerpt, body, article_type, content_type, status, featured_image_id, author_id, sponsor_id, published_at, seo_title, seo_description) VALUES
    ('60000000-0000-0000-0000-000000000001', 'A New Season of Modern Elegance', 'a-new-season-of-modern-elegance', 'From refined resortwear to elevated everyday pieces, explore the looks, designers and destinations defining this season.', '[{"type": "paragraph", "content": "As warm summer breezes return to Australian shores, modern elegance takes on a new silhouette. Fluid linens, intentional tailoring, and earthy tones define the new mood of timeless dressing."}]'::jsonb, 'fashion_editorial', 'original', 'published', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', NULL, '2026-10-20T08:00:00Z', 'A New Season of Modern Elegance | KAFTAN', 'Discover the key resortwear and fashion looks defining Summer 2026.'),
    ('60000000-0000-0000-0000-000000000002', '5 Resortwear Trends Defining Summer 2026', '5-resortwear-trends-defining-summer-2026', 'The silhouettes, fabrics, and palettes set to dominate coastal getaways and long European holidays.', '[{"type": "paragraph", "content": "From billowing silk dresses to handcrafted crochet, this season marks a return to celebratory resort dressing."}]'::jsonb, 'trend_report', 'original', 'published', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', NULL, '2026-10-20T07:30:00Z', '5 Resortwear Trends Defining Summer 2026 | KAFTAN', 'Explore the top resortwear silhouettes and styles for Summer 2026.'),
    ('60000000-0000-0000-0000-000000000003', 'Australian Labels Making a Global Impact', 'australian-labels-making-a-global-impact', 'How independent Australian designers are reshaping luxury showrooms across Paris, Milan, and New York.', '[{"type": "paragraph", "content": "Australian design has cemented its place on the international stage with effortless silhouettes and unmatched textile quality."}]'::jsonb, 'designer_profile', 'original', 'published', '30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', NULL, '2026-10-19T09:00:00Z', 'Australian Labels Making a Global Impact | KAFTAN', 'Discover the homegrown Australian fashion brands conquering the world.'),
    ('60000000-0000-0000-0000-000000000004', 'How to Build a Timeless Capsule Wardrobe', 'how-to-build-a-timeless-capsule-wardrobe', 'Ten essential investments that transcend seasonal cycles and deliver effortless styling year-round.', '[{"type": "paragraph", "content": "Curating a disciplined wardrobe requires focus on proportion, tactile fabrics, and versatile neutrals."}]'::jsonb, 'style_guide', 'original', 'published', '30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', NULL, '2026-10-18T10:15:00Z', 'How to Build a Timeless Capsule Wardrobe | KAFTAN', 'Master the art of minimal, high-impact dressing with our guide.'),
    ('60000000-0000-0000-0000-000000000005', 'The Best Fashion Boutiques to Visit in Australia', 'the-best-fashion-boutiques-to-visit-in-australia', 'From Sydney terrace showrooms to Melbourne laneway ateliers, our definitive shopping itinerary.', '[{"type": "paragraph", "content": "A curated guide to the finest destination boutiques offering bespoke shopping experiences."}]'::jsonb, 'trend_report', 'original', 'published', '30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', NULL, '2026-10-17T11:00:00Z', 'The Best Fashion Boutiques to Visit in Australia | KAFTAN', 'The definitive shopping guide to Australias chicest boutiques.'),
    ('60000000-0000-0000-0000-000000000006', 'The Designers Redefining Australian Fashion', 'the-designers-redefining-australian-fashion', 'Meet the visionary designers shaping a more modern, confident and globally recognized Australian fashion industry.', '[{"type": "paragraph", "content": "A new generation of founders and creative directors is redefining Australian luxury on their own terms."}]'::jsonb, 'designer_profile', 'original', 'published', '30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', NULL, '2026-10-16T14:00:00Z', 'The Designers Redefining Australian Fashion | KAFTAN', 'In-depth interviews with visionary Australian fashion designers.'),
    ('60000000-0000-0000-0000-000000000007', 'The Art of Effortless Dressing', 'the-art-of-effortless-dressing', 'Modern outfit ideas for everyday elegance.', '[{"type": "paragraph", "content": "Effortless dressing is less about simplicity and more about harmonious balance."}]'::jsonb, 'style_guide', 'original', 'published', '30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', NULL, '2026-10-16T12:00:00Z', 'The Art of Effortless Dressing | KAFTAN', 'Effortless styling techniques for modern Australian lifestyles.'),
    ('60000000-0000-0000-0000-000000000008', 'Where to Shop on Your Next Getaway', 'where-to-shop-on-your-next-getaway', 'From coastal boutiques to hidden gems, explore the best fashion destinations.', '[{"type": "paragraph", "content": "Pack light, shop thoughtfully: the coastal concept stores worth planning a holiday around."}]'::jsonb, 'style_guide', 'original', 'published', '30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', NULL, '2026-10-16T11:00:00Z', 'Where to Shop on Your Next Getaway | KAFTAN', 'The world finest holiday fashion destinations and coastal ateliers.'),
    ('60000000-0000-0000-0000-000000000009', 'Warm Days, Bolder Looks', 'warm-days-bolder-looks', 'The key trends, colours and pieces defining the new season.', '[{"type": "paragraph", "content": "Saturated shades of saffron, terracotta, and Mediterranean cobalt breathe vibrant energy into summer."}]'::jsonb, 'trend_report', 'original', 'published', '30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', NULL, '2026-10-15T15:30:00Z', 'Warm Days, Bolder Looks | KAFTAN', 'Summer 2026 trends and palette forecasts.'),
    ('60000000-0000-0000-0000-000000000010', 'The Art of Resort Living with Fashion Spectrum', 'the-art-of-resort-living-with-fashion-spectrum', 'Discover timeless kaftans and elevated resortwear designed for modern women.', '[{"type": "paragraph", "content": "Crafted from pure silk with hand-embellished accents, Fashion Spectrum latest collection redefines luxury poolside living."}]'::jsonb, 'fashion_editorial', 'sponsored', 'published', '30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '2026-10-15T09:00:00Z', 'The Art of Resort Living | Fashion Spectrum x KAFTAN', 'Sponsored editorial featuring Fashion Spectrum resortwear.'),
    ('60000000-0000-0000-0000-000000000011', '6 Accessories Elevating Any Look', '6-accessories-elevating-any-look', 'Sculptural gold earrings, woven leather slides, and architectural eyewear.', '[{"type": "paragraph", "content": "A thoughtful accessory changes the entire cadence of a minimal ensemble."}]'::jsonb, 'style_guide', 'original', 'published', '30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', NULL, '2026-10-16T16:00:00Z', '6 Accessories Elevating Any Look | KAFTAN', 'Essential accessories to finish any summer outfit.'),
    ('60000000-0000-0000-0000-000000000012', 'Emerging Talent You Need to Know', 'emerging-talent-you-need-to-know', 'The graduates and fresh labels transforming Australian design.', '[{"type": "paragraph", "content": "From ethical dye processes to zero-waste pattern making, meet fashion new vanguard."}]'::jsonb, 'designer_profile', 'original', 'published', '30000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', NULL, '2026-10-15T13:00:00Z', 'Emerging Talent You Need to Know | KAFTAN', 'Spotlight on Australia rising fashion designers.'),
    ('60000000-0000-0000-0000-000000000013', 'A More Conscious Wardrobe', 'a-more-conscious-wardrobe', 'Sustainable materials and regenerative practices in Australian fashion.', '[{"type": "paragraph", "content": "How leading brands are proving that circularity and luxury are natural partners."}]'::jsonb, 'trend_report', 'original', 'published', '30000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000003', NULL, '2026-10-14T10:00:00Z', 'A More Conscious Wardrobe | KAFTAN', 'Sustainability in modern fashion.'),
    ('60000000-0000-0000-0000-000000000014', 'In Conversation With Bec + Bridge', 'in-conversation-with-bec-and-bridge', 'Founders Becky Cooper and Bridget Yorston on twenty years of iconic Australian silhouettes.', '[{"type": "paragraph", "content": "Reflecting on two decades of defining celebratory Australian fashion."}]'::jsonb, 'interview', 'original', 'published', '30000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000001', NULL, '2026-10-13T11:00:00Z', 'In Conversation With Bec + Bridge | KAFTAN', 'Exclusive interview with Bec and Bridge founders.');

-- 7. Sponsored Content Link
INSERT INTO sponsored_content (article_id, campaign_id, disclosure_text) VALUES
    ('60000000-0000-0000-0000-000000000010', '50000000-0000-0000-0000-000000000001', 'This editorial story is presented in partnership with Fashion Spectrum Australia.');

-- 8. Products (Clearance Sale Grid)
INSERT INTO products (id, name, slug, description, brand_name, image_id, original_price, sale_price, currency, product_url, link_type, status) VALUES
    ('70000000-0000-0000-0000-000000000001', 'Azure Resort Kaftan', 'azure-resort-kaftan', 'Hand-embellished silk crepe kaftan in radiant Mediterranean azure print.', 'Fashion Spectrum', '30000000-0000-0000-0000-000000000010', 249.00, 149.00, 'AUD', 'https://fashionspectrum.com.au/products/azure-resort-kaftan', 'external', 'active'),
    ('70000000-0000-0000-0000-000000000002', 'Blush Print Kaftan', 'blush-print-kaftan', 'Ethereal floral silk kaftan with Swarovski crystal neckline accents.', 'Fashion Spectrum', '30000000-0000-0000-0000-000000000010', 229.00, 129.00, 'AUD', 'https://fashionspectrum.com.au/products/blush-print-kaftan', 'external', 'active'),
    ('70000000-0000-0000-0000-000000000003', 'Classic Black Kaftan', 'classic-black-kaftan', 'Dramatic floor-length silk georgette kaftan with subtle side vents.', 'Fashion Spectrum', '30000000-0000-0000-0000-000000000010', 199.00, 99.00, 'AUD', 'https://fashionspectrum.com.au/products/classic-black-kaftan', 'external', 'active'),
    ('70000000-0000-0000-0000-000000000004', 'Emerald Resort Kaftan', 'emerald-resort-kaftan', 'Lush botanical emerald silk kaftan, ideal for twilight poolside dining.', 'Fashion Spectrum', '30000000-0000-0000-0000-000000000010', 229.00, 139.00, 'AUD', 'https://fashionspectrum.com.au/products/emerald-resort-kaftan', 'external', 'active');

-- 9. Competitions & Optional Prizes
INSERT INTO competitions (id, title, slug, description, prize_summary, terms, start_time, end_time, status, created_by) VALUES
    ('80000000-0000-0000-0000-000000000001', 'Win a Kaftan from Fashion Spectrum', 'win-a-kaftan-from-fashion-spectrum', 'Purchase an eligible kaftan, scan the QR code, upload your receipt and go in the draw to win a stunning kaftan from Fashion Spectrum.', 'One luxury silk embellished kaftan valued at up to $350 AUD.', 'Open to Australian residents aged 18+. Competition closes 31 Dec 2026. Terms and conditions apply.', '2026-10-01T00:00:00Z', '2026-12-31T23:59:59Z', 'active', '00000000-0000-0000-0000-000000000001');

INSERT INTO competition_prizes (competition_id, title, description, quantity, display_order) VALUES
    ('80000000-0000-0000-0000-000000000001', 'Grand Prize: Luxury Silk Kaftan of Choice', 'Winner selects any silk kaftan from the current Fashion Spectrum resort collection.', 1, 1);

-- 10. Advertising Placements & Creatives
INSERT INTO ad_placements (id, name, placement_key, description, supported_layouts, is_active) VALUES
    ('90000000-0000-0000-0000-000000000001', 'Homepage Mid Split Banner', 'homepage_mid_split', 'Placement adjacent to sponsored editorial box in middle of homepage', '["banner"]'::jsonb, true);

INSERT INTO ad_creatives (id, campaign_id, ad_placement_id, headline, copy, destination_url, desktop_image_id, start_date, end_date, status) VALUES
    ('95000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', 'FASHION SPECTRUM', 'EFFORTLESS KAFTANS FOR EVERY OCCASION', 'https://fashionspectrum.com.au/collection', '30000000-0000-0000-0000-000000000011', '2026-10-01T00:00:00Z', '2026-12-31T23:59:59Z', 'active');

-- 11. Homepage Sections
INSERT INTO homepage_sections (id, section_key, name, title, layout_type, source_mode, items_limit, display_order, is_active, settings) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'hero_editorial', 'Hero Editorial & Latest Split', 'The Kaftan Edit', 'hero', 'manual', 1, 1, true, '{"show_latest_sidebar": true}'::jsonb),
    ('a0000000-0000-0000-0000-000000000003', 'featured_editorial_grid', 'Featured Editorial Asymmetric Grid', NULL, 'grid', 'manual', 4, 2, true, '{"layout": "asymmetric_3col"}'::jsonb),
    ('a0000000-0000-0000-0000-000000000004', 'sponsored_and_advertising', 'Sponsored Story & Ad Banner Split', NULL, 'banner', 'manual', 2, 4, true, '{"split": "50_50"}'::jsonb),
    ('a0000000-0000-0000-0000-000000000005', 'clearance_sale', 'Clearance Sale Promotional Grid', 'CLEARANCE SALE', 'product_grid', 'manual', 4, 5, true, '{"view_all_url": "/sale"}'::jsonb),
    ('a0000000-0000-0000-0000-000000000006', 'competition_banner', 'Active Competition Feature Banner', 'COMPETITION', 'banner', 'manual', 1, 6, true, '{"badge_text": "WIN a Kaftan"}'::jsonb),
    ('a0000000-0000-0000-0000-000000000007', 'more_stories', 'More Editorial Stories', 'MORE STORIES', 'grid', 'automatic', 4, 7, true, '{"columns": 4, "view_all_url": "/latest"}'::jsonb);

-- 12. Homepage Items
-- Hero item
INSERT INTO homepage_items (homepage_section_id, article_id, display_order, is_active) VALUES
    ('a0000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 1, true);

-- Featured Editorial Grid items
INSERT INTO homepage_items (homepage_section_id, article_id, display_order, is_active) VALUES
    ('a0000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000006', 1, true),
    ('a0000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000007', 2, true),
    ('a0000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000008', 3, true),
    ('a0000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000009', 4, true);

-- Sponsored & Advertising split
INSERT INTO homepage_items (homepage_section_id, article_id, display_order, is_active) VALUES
    ('a0000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000010', 1, true);

INSERT INTO homepage_items (homepage_section_id, ad_creative_id, display_order, is_active) VALUES
    ('a0000000-0000-0000-0000-000000000004', '95000000-0000-0000-0000-000000000001', 2, true);

-- Clearance Sale products
INSERT INTO homepage_items (homepage_section_id, product_id, display_order, is_active) VALUES
    ('a0000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000001', 1, true),
    ('a0000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000002', 2, true),
    ('a0000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000003', 3, true),
    ('a0000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000004', 4, true);

-- More Stories items
INSERT INTO homepage_items (homepage_section_id, article_id, display_order, is_active) VALUES
    ('a0000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000011', 1, true),
    ('a0000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000012', 2, true),
    ('a0000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000013', 3, true),
    ('a0000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000014', 4, true);
