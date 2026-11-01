const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(process.cwd(), '.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const manifestPath = path.resolve(process.cwd(), 'scripts', 'cloudinary_manifest.json');

async function seed() {
  console.log('--- Starting Cloud Supabase Seeding ---');
  console.log('Target URL:', env.NEXT_PUBLIC_SUPABASE_URL);

  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  console.log('Loaded Cloudinary manifest with', Object.keys(manifest).length, 'entries');

  // Helper to resolve storage key and metadata
  function getMediaInfo(localPath, fallbackAlt) {
    const entry = manifest[localPath];
    if (entry) {
      return {
        storage_key: entry.public_id,
        mime_type: 'image/' + entry.format,
        width: entry.width,
        height: entry.height,
        file_size_bytes: entry.bytes,
        metadata: { cloudinary_url: entry.secure_url },
      };
    }
    return {
      storage_key: localPath,
      mime_type: 'image/jpeg',
      width: 1200,
      height: 800,
      file_size_bytes: 350000,
      metadata: {},
    };
  }

  // 1. Clean existing records in reverse dependency order
  console.log('Cleaning existing rows...');
  await supabase.from('homepage_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('homepage_sections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('ad_creatives').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('ad_placements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('campaigns').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('sponsors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('competition_prizes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('competition_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('competitions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('sponsored_content').delete().neq('article_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('authors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('media_assets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('navigation_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Users
  console.log('Seeding users...');
  const users = [
    { id: '00000000-0000-0000-0000-000000000001', name: 'Elena Vance', email: 'elena.vance@kaftan.fashion', role_id: 'admin', account_status: 'active' },
    { id: '00000000-0000-0000-0000-000000000002', name: 'Marcus Sterling', email: 'marcus.sterling@kaftan.fashion', role_id: 'editor', account_status: 'active' },
    { id: '00000000-0000-0000-0000-000000000003', name: 'Chloe Montgomery', email: 'chloe.m@kaftan.fashion', role_id: 'author', account_status: 'active' },
  ];
  const { error: usersErr } = await supabase.from('users').insert(users);
  if (usersErr) throw new Error(`Users error: ${usersErr.message}`);

  // 3. Authors
  console.log('Seeding authors...');
  const authors = [
    { id: '10000000-0000-0000-0000-000000000001', name: 'Chloe Montgomery', slug: 'chloe-montgomery', bio: 'Senior Fashion & Style Editor at KAFTAN.', website_url: 'https://kaftan.fashion/authors/chloe-montgomery' },
    { id: '10000000-0000-0000-0000-000000000002', name: 'Lachlan Hayes', slug: 'lachlan-hayes', bio: 'Sydney-based fashion photographer and visual storyteller.', website_url: 'https://lachlanhayes.com' },
    { id: '10000000-0000-0000-0000-000000000003', name: 'Sienna Wright', slug: 'sienna-wright', bio: 'Luxury travel, lifestyle and sustainable fashion writer.', website_url: 'https://kaftan.fashion/authors/sienna-wright' },
  ];
  const { error: authErr } = await supabase.from('authors').insert(authors);
  if (authErr) throw new Error(`Authors error: ${authErr.message}`);

  // 4. Navigation
  console.log('Seeding navigation...');
  const navItems = [
    { id: '20000000-0000-0000-0000-000000000001', label: 'Latest', url: '/latest', display_order: 1, is_active: true, open_in_new_tab: false },
    { id: '20000000-0000-0000-0000-000000000002', label: 'Trends', url: '/trends', display_order: 2, is_active: true, open_in_new_tab: false },
    { id: '20000000-0000-0000-0000-000000000003', label: 'Style', url: '/style', display_order: 3, is_active: true, open_in_new_tab: false },
    { id: '20000000-0000-0000-0000-000000000004', label: 'Designers', url: '/designers', display_order: 4, is_active: true, open_in_new_tab: false },
    { id: '20000000-0000-0000-0000-000000000005', label: 'Travel', url: '/travel', display_order: 5, is_active: true, open_in_new_tab: false },
    { id: '20000000-0000-0000-0000-000000000006', label: 'Lifestyle', url: '/lifestyle', display_order: 6, is_active: true, open_in_new_tab: false },
    { id: '20000000-0000-0000-0000-000000000007', label: 'Beauty', url: '/beauty', display_order: 7, is_active: true, open_in_new_tab: false },
    { id: '20000000-0000-0000-0000-000000000008', label: 'Sale', url: '/sale', display_order: 8, is_active: true, open_in_new_tab: false },
  ];
  const { error: navErr } = await supabase.from('navigation_items').insert(navItems);
  if (navErr) throw new Error(`Navigation error: ${navErr.message}`);

  // 5. Media Assets (Curated with Cloudinary mapping)
  console.log('Seeding media assets with Cloudinary keys...');
  const mediaDefs = [
    { id: '30000000-0000-0000-0000-000000000001', path: '/images/editorial/hero-mediterranean-resortwear.jpg', alt: 'Model in ivory resortwear with dark sunglasses on Mediterranean stone terrace', caption: 'A new season of modern elegance.' },
    { id: '30000000-0000-0000-0000-000000000002', path: '/images/editorial/story-resortwear-trends.jpg', alt: 'Model in bohemian resortwear dress on sand', caption: '5 Resortwear Trends Defining Summer 2026' },
    { id: '30000000-0000-0000-0000-000000000003', path: '/images/editorial/story-australian-labels.jpg', alt: 'Model in tailored black designer blazer', caption: 'Australian Labels Making a Global Impact' },
    { id: '30000000-0000-0000-0000-000000000004', path: '/images/editorial/story-capsule-wardrobe.jpg', alt: 'Model in crisp white shirt and retro sunglasses', caption: 'How to Build a Timeless Capsule Wardrobe' },
    { id: '30000000-0000-0000-0000-000000000005', path: '/images/editorial/story-fashion-boutiques.jpg', alt: 'Luxury fashion boutique interior in Paddington Sydney', caption: 'The Best Fashion Boutiques to Visit in Australia' },
    { id: '30000000-0000-0000-0000-000000000006', path: '/images/editorial/redefining-fashion.jpg', alt: 'Model with sleek sunglasses and sculpted tailoring', caption: 'The Designers Redefining Australian Fashion' },
    { id: '30000000-0000-0000-0000-000000000007', path: '/images/editorial/effortless-dressing.jpg', alt: 'Model in backless black knit evening dress', caption: 'The Art of Effortless Dressing' },
    { id: '30000000-0000-0000-0000-000000000008', path: '/images/editorial/next-getaway.jpg', alt: 'Colourful coastal cliffside village overlooking Mediterranean ocean', caption: 'Where to Shop on Your Next Getaway' },
    { id: '30000000-0000-0000-0000-000000000009', path: '/images/editorial/warm-days-bolder-looks.jpg', alt: 'Model in flowing terracotta pleated gown', caption: 'Warm Days, Bolder Looks' },
    { id: '30000000-0000-0000-0000-000000000010', path: '/images/editorial/sponsored-resort-living.jpg', alt: 'Models in colourful patterned resort kaftans', caption: 'The Art of Resort Living with Fashion Spectrum' },
    { id: '30000000-0000-0000-0000-000000000011', path: '/images/editorial/ad-fashion-spectrum.jpg', alt: 'Model in elegant floral kaftan for ad campaign', caption: 'Effortless Kaftans For Every Occasion' },
    { id: '30000000-0000-0000-0000-000000000012', path: '/images/editorial/more-accessories.jpg', alt: 'Accessories and gold link drop earrings', caption: '6 Accessories Elevating Any Look' },
    { id: '30000000-0000-0000-0000-000000000013', path: '/images/editorial/more-emerging-talent.jpg', alt: 'Emerging fashion designer talent', caption: 'Emerging Talent You Need to Know' },
    { id: '30000000-0000-0000-0000-000000000014', path: '/images/editorial/more-conscious-wardrobe.jpg', alt: 'Sustainable textiles and conscious fashion', caption: 'A More Conscious Wardrobe' },
    { id: '30000000-0000-0000-0000-000000000015', path: '/images/editorial/more-bec-bridge.jpg', alt: 'Bec and Bridge founders interview', caption: 'In Conversation With Bec + Bridge' },
    { id: '30000000-0000-0000-0000-000000000016', path: '/images/editorial/competition-strawhat-beach.jpg', alt: 'Woman in straw sunhat overlooking turquoise sea', caption: 'Win a Kaftan from Fashion Spectrum' },
    // Product Images
    { id: '30000000-0000-0000-0000-000000000021', path: '/images/products/azure-resort-kaftan.jpg', alt: 'Azure Resort Kaftan', caption: 'Fashion Spectrum Azure Kaftan' },
    { id: '30000000-0000-0000-0000-000000000022', path: '/images/products/blush-print-kaftan.jpg', alt: 'Blush Print Kaftan', caption: 'Fashion Spectrum Blush Kaftan' },
    { id: '30000000-0000-0000-0000-000000000023', path: '/images/products/classic-black-kaftan.jpg', alt: 'Classic Black Kaftan', caption: 'Fashion Spectrum Black Kaftan' },
    { id: '30000000-0000-0000-0000-000000000024', path: '/images/products/emerald-resort-kaftan.jpg', alt: 'Emerald Resort Kaftan', caption: 'Fashion Spectrum Emerald Kaftan' },
  ];

  const mediaAssets = mediaDefs.map(m => {
    const info = getMediaInfo(m.path, m.alt);
    return {
      id: m.id,
      storage_key: info.storage_key,
      original_filename: path.basename(m.path),
      mime_type: info.mime_type,
      width: info.width,
      height: info.height,
      file_size_bytes: info.file_size_bytes,
      alt_text: m.alt,
      caption: m.caption,
      credit: 'Kaftan Editorial Team',
      metadata: info.metadata,
      uploaded_by: '00000000-0000-0000-0000-000000000001',
    };
  });

  const { error: mediaErr } = await supabase.from('media_assets').insert(mediaAssets);
  if (mediaErr) throw new Error(`MediaAssets error: ${mediaErr.message}`);

  // 6. Sponsors & Campaigns
  console.log('Seeding sponsors & campaigns...');
  const { error: sponErr } = await supabase.from('sponsors').insert([
    { id: '40000000-0000-0000-0000-000000000001', name: 'Fashion Spectrum', slug: 'fashion-spectrum', website_url: 'https://fashionspectrum.com.au', description: 'Australian label specializing in luxury silk and embellished kaftans.', contact_name: 'Sarah Jenkins', contact_email: 'partnerships@fashionspectrum.com.au', status: 'active' },
  ]);
  if (sponErr) throw new Error(`Sponsor error: ${sponErr.message}`);

  const { error: campErr } = await supabase.from('campaigns').insert([
    { id: '50000000-0000-0000-0000-000000000001', sponsor_id: '40000000-0000-0000-0000-000000000001', name: 'Summer 2026 Resort Showcase', description: 'Promotional campaign highlighting the 2026 Kaftan collection and national competition.', start_date: '2026-10-01T00:00:00Z', end_date: '2026-12-31T23:59:59Z', status: 'active' },
  ]);
  if (campErr) throw new Error(`Campaign error: ${campErr.message}`);

  // 7. Articles
  console.log('Seeding articles...');
  const articles = [
    { id: '60000000-0000-0000-0000-000000000001', title: 'A New Season of Modern Elegance', slug: 'a-new-season-of-modern-elegance', excerpt: 'From refined resortwear to elevated everyday pieces, explore the looks, designers and destinations defining this season.', body: [{ type: 'paragraph', content: 'As warm summer breezes return to Australian shores, modern elegance takes on a new silhouette. Fluid linens, intentional tailoring, and earthy tones define the new mood of timeless dressing.' }], article_type: 'fashion_editorial', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000001', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: null, published_at: '2026-10-20T08:00:00Z', seo_title: 'A New Season of Modern Elegance | KAFTAN', seo_description: 'Discover the key resortwear and fashion looks defining Summer 2026.' },
    { id: '60000000-0000-0000-0000-000000000002', title: '5 Resortwear Trends Defining Summer 2026', slug: '5-resortwear-trends-defining-summer-2026', excerpt: 'The silhouettes, fabrics, and palettes set to dominate coastal getaways and long European holidays.', body: [{ type: 'paragraph', content: 'From billowing silk dresses to handcrafted crochet, this season marks a return to celebratory resort dressing.' }], article_type: 'trend_report', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000002', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: null, published_at: '2026-10-20T07:30:00Z', seo_title: '5 Resortwear Trends Defining Summer 2026 | KAFTAN', seo_description: 'Explore the top resortwear silhouettes and styles for Summer 2026.' },
    { id: '60000000-0000-0000-0000-000000000003', title: 'Australian Labels Making a Global Impact', slug: 'australian-labels-making-a-global-impact', excerpt: 'How independent Australian designers are reshaping luxury showrooms across Paris, Milan, and New York.', body: [{ type: 'paragraph', content: 'Australian design has cemented its place on the international stage with effortless silhouettes and unmatched textile quality.' }], article_type: 'designer_profile', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000003', author_id: '10000000-0000-0000-0000-000000000003', sponsor_id: null, published_at: '2026-10-19T09:00:00Z', seo_title: 'Australian Labels Making a Global Impact | KAFTAN', seo_description: 'Discover the homegrown Australian fashion brands conquering the world.' },
    { id: '60000000-0000-0000-0000-000000000004', title: 'How to Build a Timeless Capsule Wardrobe', slug: 'how-to-build-a-timeless-capsule-wardrobe', excerpt: 'Ten essential investments that transcend seasonal cycles and deliver effortless styling year-round.', body: [{ type: 'paragraph', content: 'Curating a disciplined wardrobe requires focus on proportion, tactile fabrics, and versatile neutrals.' }], article_type: 'style_guide', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000004', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: null, published_at: '2026-10-18T10:15:00Z', seo_title: 'How to Build a Timeless Capsule Wardrobe | KAFTAN', seo_description: 'Master the art of minimal, high-impact dressing with our guide.' },
    { id: '60000000-0000-0000-0000-000000000005', title: 'The Best Fashion Boutiques to Visit in Australia', slug: 'the-best-fashion-boutiques-to-visit-in-australia', excerpt: 'From Sydney terrace showrooms to Melbourne laneway ateliers, our definitive shopping itinerary.', body: [{ type: 'paragraph', content: 'A curated guide to the finest destination boutiques offering bespoke shopping experiences.' }], article_type: 'trend_report', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000005', author_id: '10000000-0000-0000-0000-000000000003', sponsor_id: null, published_at: '2026-10-17T11:00:00Z', seo_title: 'The Best Fashion Boutiques to Visit in Australia | KAFTAN', seo_description: 'The definitive shopping guide to Australias chicest boutiques.' },
    { id: '60000000-0000-0000-0000-000000000006', title: 'The Designers Redefining Australian Fashion', slug: 'the-designers-redefining-australian-fashion', excerpt: 'Meet the visionary designers shaping a more modern, confident and globally recognized Australian fashion industry.', body: [{ type: 'paragraph', content: 'A new generation of founders and creative directors is redefining Australian luxury on their own terms.' }], article_type: 'designer_profile', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000006', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: null, published_at: '2026-10-16T14:00:00Z', seo_title: 'The Designers Redefining Australian Fashion | KAFTAN', seo_description: 'In-depth interviews with visionary Australian fashion designers.' },
    { id: '60000000-0000-0000-0000-000000000007', 'title': 'The Art of Effortless Dressing', slug: 'the-art-of-effortless-dressing', excerpt: 'Modern outfit ideas for everyday elegance.', body: [{ type: 'paragraph', content: 'Effortless dressing is less about simplicity and more about harmonious balance.' }], article_type: 'style_guide', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000007', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: null, published_at: '2026-10-16T12:00:00Z', seo_title: 'The Art of Effortless Dressing | KAFTAN', seo_description: 'Effortless styling techniques for modern Australian lifestyles.' },
    { id: '60000000-0000-0000-0000-000000000008', title: 'Where to Shop on Your Next Getaway', slug: 'where-to-shop-on-your-next-getaway', excerpt: 'From coastal boutiques to hidden gems, explore the best fashion destinations.', body: [{ type: 'paragraph', content: 'Pack light, shop thoughtfully: the coastal concept stores worth planning a holiday around.' }], article_type: 'style_guide', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000008', author_id: '10000000-0000-0000-0000-000000000003', sponsor_id: null, published_at: '2026-10-16T11:00:00Z', seo_title: 'Where to Shop on Your Next Getaway | KAFTAN', seo_description: 'The world finest holiday fashion destinations and coastal ateliers.' },
    { id: '60000000-0000-0000-0000-000000000009', title: 'Warm Days, Bolder Looks', slug: 'warm-days-bolder-looks', excerpt: 'The key trends, colours and pieces defining the new season.', body: [{ type: 'paragraph', content: 'Saturated shades of saffron, terracotta, and Mediterranean cobalt breathe vibrant energy into summer.' }], article_type: 'trend_report', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000009', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: null, published_at: '2026-10-15T15:30:00Z', seo_title: 'Warm Days, Bolder Looks | KAFTAN', seo_description: 'Summer 2026 trends and palette forecasts.' },
    { id: '60000000-0000-0000-0000-000000000010', title: 'The Art of Resort Living with Fashion Spectrum', slug: 'the-art-of-resort-living-with-fashion-spectrum', excerpt: 'Discover timeless kaftans and elevated resortwear designed for modern women.', body: [{ type: 'paragraph', content: 'Crafted from pure silk with hand-embellished accents, Fashion Spectrum latest collection redefines luxury poolside living.' }], article_type: 'fashion_editorial', content_type: 'sponsored', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000010', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: '40000000-0000-0000-0000-000000000001', published_at: '2026-10-15T09:00:00Z', seo_title: 'The Art of Resort Living | Fashion Spectrum x KAFTAN', seo_description: 'Sponsored editorial featuring Fashion Spectrum resortwear.' },
    { id: '60000000-0000-0000-0000-000000000011', title: '6 Accessories Elevating Any Look', slug: '6-accessories-elevating-any-look', excerpt: 'Sculptural gold earrings, woven leather slides, and architectural eyewear.', body: [{ type: 'paragraph', content: 'A thoughtful accessory changes the entire cadence of a minimal ensemble.' }], article_type: 'style_guide', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000012', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: null, published_at: '2026-10-16T16:00:00Z', seo_title: '6 Accessories Elevating Any Look | KAFTAN', seo_description: 'Essential accessories to finish any summer outfit.' },
    { id: '60000000-0000-0000-0000-000000000012', title: 'Emerging Talent You Need to Know', slug: 'emerging-talent-you-need-to-know', excerpt: 'The graduates and fresh labels transforming Australian design.', body: [{ type: 'paragraph', content: 'From ethical dye processes to zero-waste pattern making, meet fashion new vanguard.' }], article_type: 'designer_profile', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000013', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: null, published_at: '2026-10-15T13:00:00Z', seo_title: 'Emerging Talent You Need to Know | KAFTAN', seo_description: 'Spotlight on Australia rising fashion designers.' },
    { id: '60000000-0000-0000-0000-000000000013', title: 'A More Conscious Wardrobe', slug: 'a-more-conscious-wardrobe', excerpt: 'Sustainable materials and regenerative practices in Australian fashion.', body: [{ type: 'paragraph', content: 'How leading brands are proving that circularity and luxury are natural partners.' }], article_type: 'trend_report', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000014', author_id: '10000000-0000-0000-0000-000000000003', sponsor_id: null, published_at: '2026-10-14T10:00:00Z', seo_title: 'A More Conscious Wardrobe | KAFTAN', seo_description: 'Sustainability in modern fashion.' },
    { id: '60000000-0000-0000-0000-000000000014', title: 'In Conversation With Bec + Bridge', slug: 'in-conversation-with-bec-and-bridge', excerpt: 'Founders Becky Cooper and Bridget Yorston on twenty years of iconic Australian silhouettes.', body: [{ type: 'paragraph', content: 'Reflecting on two decades of defining celebratory Australian fashion.' }], article_type: 'interview', content_type: 'original', status: 'published', featured_image_id: '30000000-0000-0000-0000-000000000015', author_id: '10000000-0000-0000-0000-000000000001', sponsor_id: null, published_at: '2026-10-13T11:00:00Z', seo_title: 'In Conversation With Bec + Bridge | KAFTAN', seo_description: 'Exclusive interview with Bec and Bridge founders.' },
  ];
  const { error: artErr } = await supabase.from('articles').insert(articles);
  if (artErr) throw new Error(`Articles error: ${artErr.message}`);

  // 8. Sponsored Content Link
  await supabase.from('sponsored_content').insert([
    { article_id: '60000000-0000-0000-0000-000000000010', campaign_id: '50000000-0000-0000-0000-000000000001', disclosure_text: 'This editorial story is presented in partnership with Fashion Spectrum Australia.' }
  ]);

  // 9. Products (Clearance Sale)
  console.log('Seeding products...');
  const products = [
    { id: '70000000-0000-0000-0000-000000000001', name: 'Azure Resort Kaftan', slug: 'azure-resort-kaftan', description: 'Hand-embellished silk crepe kaftan in radiant Mediterranean azure print.', brand_name: 'Fashion Spectrum', image_id: '30000000-0000-0000-0000-000000000021', original_price: 249.00, sale_price: 149.00, currency: 'AUD', product_url: 'https://fashionspectrum.com.au/products/azure-resort-kaftan', link_type: 'external', status: 'active' },
    { id: '70000000-0000-0000-0000-000000000002', name: 'Blush Print Kaftan', slug: 'blush-print-kaftan', description: 'Ethereal floral silk kaftan with Swarovski crystal neckline accents.', brand_name: 'Fashion Spectrum', image_id: '30000000-0000-0000-0000-000000000022', original_price: 229.00, sale_price: 129.00, currency: 'AUD', product_url: 'https://fashionspectrum.com.au/products/blush-print-kaftan', link_type: 'external', status: 'active' },
    { id: '70000000-0000-0000-0000-000000000003', name: 'Classic Black Kaftan', slug: 'classic-black-kaftan', description: 'Dramatic floor-length silk georgette kaftan with subtle side vents.', brand_name: 'Fashion Spectrum', image_id: '30000000-0000-0000-0000-000000000023', original_price: 199.00, sale_price: 99.00, currency: 'AUD', product_url: 'https://fashionspectrum.com.au/products/classic-black-kaftan', link_type: 'external', status: 'active' },
    { id: '70000000-0000-0000-0000-000000000004', name: 'Emerald Resort Kaftan', slug: 'emerald-resort-kaftan', description: 'Lush botanical emerald silk kaftan, ideal for twilight poolside dining.', brand_name: 'Fashion Spectrum', image_id: '30000000-0000-0000-0000-000000000024', original_price: 229.00, sale_price: 139.00, currency: 'AUD', product_url: 'https://fashionspectrum.com.au/products/emerald-resort-kaftan', link_type: 'external', status: 'active' },
  ];
  const { error: prodErr } = await supabase.from('products').insert(products);
  if (prodErr) throw new Error(`Products error: ${prodErr.message}`);

  // 10. Competitions & Prizes
  console.log('Seeding competitions & prizes...');
  const { error: compErr } = await supabase.from('competitions').insert([
    {
      id: '80000000-0000-0000-0000-000000000001',
      title: 'Win a Kaftan from Fashion Spectrum',
      slug: 'win-a-kaftan-from-fashion-spectrum',
      description: 'Purchase an eligible kaftan, scan the QR code, upload your receipt and go in the draw to win a stunning kaftan from Fashion Spectrum.',
      prize_summary: 'One luxury silk embellished kaftan valued at up to $350 AUD.',
      terms: 'Open to Australian residents aged 18+. Competition closes 31 Dec 2026. Terms and conditions apply.',
      start_time: '2026-10-01T00:00:00Z',
      end_time: '2026-12-31T23:59:59Z',
      status: 'active',
      created_by: '00000000-0000-0000-0000-000000000001',
    }
  ]);
  if (compErr) throw new Error(`Competition error: ${compErr.message}`);

  await supabase.from('competition_prizes').insert([
    { competition_id: '80000000-0000-0000-0000-000000000001', title: 'Grand Prize: Luxury Silk Kaftan of Choice', description: 'Winner selects any silk kaftan from the current Fashion Spectrum resort collection.', quantity: 1, display_order: 1 }
  ]);

  // 11. Ad Placements & Creatives
  console.log('Seeding advertising...');
  await supabase.from('ad_placements').insert([
    { id: '90000000-0000-0000-0000-000000000001', name: 'Homepage Mid Split Banner', placement_key: 'homepage_mid_split', description: 'Placement adjacent to sponsored editorial box in middle of homepage', supported_layouts: ['banner'], is_active: true }
  ]);

  await supabase.from('ad_creatives').insert([
    { id: '95000000-0000-0000-0000-000000000001', campaign_id: '50000000-0000-0000-0000-000000000001', ad_placement_id: '90000000-0000-0000-0000-000000000001', headline: 'FASHION SPECTRUM', copy: 'EFFORTLESS KAFTANS FOR EVERY OCCASION', destination_url: 'https://fashionspectrum.com.au/collection', desktop_image_id: '30000000-0000-0000-0000-000000000011', start_date: '2026-10-01T00:00:00Z', end_date: '2026-12-31T23:59:59Z', status: 'active' }
  ]);

  // 12. Homepage Sections
  console.log('Seeding homepage sections & items...');
  const sections = [
    { id: 'a0000000-0000-0000-0000-000000000001', section_key: 'hero_editorial', name: 'Hero Editorial & Latest Split', title: 'The Kaftan Edit', layout_type: 'hero', source_mode: 'manual', items_limit: 1, display_order: 1, is_active: true, settings: { show_latest_sidebar: true } },
    { id: 'a0000000-0000-0000-0000-000000000003', section_key: 'featured_editorial_grid', name: 'Featured Editorial Asymmetric Grid', title: null, layout_type: 'grid', source_mode: 'manual', items_limit: 4, display_order: 2, is_active: true, settings: { layout: 'asymmetric_3col' } },
    { id: 'a0000000-0000-0000-0000-000000000004', section_key: 'sponsored_and_advertising', name: 'Sponsored Story & Ad Banner Split', title: null, layout_type: 'banner', source_mode: 'manual', items_limit: 2, display_order: 4, is_active: true, settings: { split: '50_50' } },
    { id: 'a0000000-0000-0000-0000-000000000005', section_key: 'clearance_sale', name: 'Clearance Sale Promotional Grid', title: 'CLEARANCE SALE', layout_type: 'product_grid', source_mode: 'manual', items_limit: 4, display_order: 5, is_active: true, settings: { view_all_url: '/sale' } },
    { id: 'a0000000-0000-0000-0000-000000000006', section_key: 'competition_banner', name: 'Active Competition Feature Banner', title: 'COMPETITION', layout_type: 'banner', source_mode: 'manual', items_limit: 1, display_order: 6, is_active: true, settings: { badge_text: 'WIN a Kaftan' } },
    { id: 'a0000000-0000-0000-0000-000000000007', section_key: 'more_stories', name: 'More Editorial Stories', title: 'MORE STORIES', layout_type: 'grid', source_mode: 'automatic', items_limit: 4, display_order: 7, is_active: true, settings: { columns: 4, view_all_url: '/latest' } },
  ];
  const { error: secErr } = await supabase.from('homepage_sections').insert(sections);
  if (secErr) throw new Error(`Sections error: ${secErr.message}`);

  const items = [
    // Hero item
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000001', article_id: '60000000-0000-0000-0000-000000000001', display_order: 1, is_active: true },
    // Featured Editorial Grid items
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000003', article_id: '60000000-0000-0000-0000-000000000006', display_order: 1, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000003', article_id: '60000000-0000-0000-0000-000000000007', display_order: 2, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000003', article_id: '60000000-0000-0000-0000-000000000008', display_order: 3, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000003', article_id: '60000000-0000-0000-0000-000000000009', display_order: 4, is_active: true },
    // Sponsored & Ad Split
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000004', article_id: '60000000-0000-0000-0000-000000000010', display_order: 1, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000004', ad_creative_id: '95000000-0000-0000-0000-000000000001', display_order: 2, is_active: true },
    // Clearance Sale products
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000005', product_id: '70000000-0000-0000-0000-000000000001', display_order: 1, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000005', product_id: '70000000-0000-0000-0000-000000000002', display_order: 2, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000005', product_id: '70000000-0000-0000-0000-000000000003', display_order: 3, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000005', product_id: '70000000-0000-0000-0000-000000000004', display_order: 4, is_active: true },
    // More Stories
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000007', article_id: '60000000-0000-0000-0000-000000000011', display_order: 1, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000007', article_id: '60000000-0000-0000-0000-000000000012', display_order: 2, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000007', article_id: '60000000-0000-0000-0000-000000000013', display_order: 3, is_active: true },
    { homepage_section_id: 'a0000000-0000-0000-0000-000000000007', article_id: '60000000-0000-0000-0000-000000000014', display_order: 4, is_active: true },
  ];
  const { error: itemErr } = await supabase.from('homepage_items').insert(items);
  if (itemErr) throw new Error(`Homepage items error: ${itemErr.message}`);

  // 13. Create initial published homepage revision
  console.log('Seeding initial homepage revision...');
  const { data: revData, error: revErr } = await supabase.from('homepage_revisions').insert({
    title: 'Editorial Launch Baseline',
    revision_number: 1,
    is_published: true,
    published_at: new Date().toISOString(),
    created_by: '00000000-0000-0000-0000-000000000001',
    snapshot_sections: sections,
    section_overrides: {},
  }).select().single();

  if (revErr) {
    console.warn('Note: homepage_revisions insert warning:', revErr.message);
  }

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

seed().catch(err => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});

