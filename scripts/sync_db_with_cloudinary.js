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
const manifest = require('./cloudinary_manifest.json');

async function sync() {
  console.log('--- Syncing Supabase with Cloudinary Manifest ---');

  // 1. Update the original 16 media assets to point to Cloudinary public IDs
  const editorialMap = [
    { id: '30000000-0000-0000-0000-000000000001', key: '/images/editorial/hero-mediterranean-resortwear.jpg' },
    { id: '30000000-0000-0000-0000-000000000002', key: '/images/editorial/story-resortwear-trends.jpg' },
    { id: '30000000-0000-0000-0000-000000000003', key: '/images/editorial/story-australian-labels.jpg' },
    { id: '30000000-0000-0000-0000-000000000004', key: '/images/editorial/story-capsule-wardrobe.jpg' },
    { id: '30000000-0000-0000-0000-000000000005', key: '/images/editorial/story-fashion-boutiques.jpg' },
    { id: '30000000-0000-0000-0000-000000000006', key: '/images/editorial/redefining-fashion.jpg' },
    { id: '30000000-0000-0000-0000-000000000007', key: '/images/editorial/effortless-dressing.jpg' },
    { id: '30000000-0000-0000-0000-000000000008', key: '/images/editorial/next-getaway.jpg' },
    { id: '30000000-0000-0000-0000-000000000009', key: '/images/editorial/warm-days-bolder-looks.jpg' },
    { id: '30000000-0000-0000-0000-000000000010', key: '/images/editorial/sponsored-resort-living.jpg' },
    { id: '30000000-0000-0000-0000-000000000011', key: '/images/editorial/ad-fashion-spectrum.jpg' },
    { id: '30000000-0000-0000-0000-000000000012', key: '/images/editorial/more-accessories.jpg' },
    { id: '30000000-0000-0000-0000-000000000013', key: '/images/editorial/more-emerging-talent.jpg' },
    { id: '30000000-0000-0000-0000-000000000014', key: '/images/editorial/more-conscious-wardrobe.jpg' },
    { id: '30000000-0000-0000-0000-000000000015', key: '/images/editorial/more-bec-bridge.jpg' },
    { id: '30000000-0000-0000-0000-000000000016', key: '/images/editorial/competition-strawhat-beach.jpg' },
  ];

  for (const item of editorialMap) {
    const cloud = manifest[item.key];
    if (cloud) {
      const { error } = await supabase
        .from('media_assets')
        .update({
          storage_key: cloud.public_id,
          mime_type: 'image/' + cloud.format,
          width: cloud.width,
          height: cloud.height,
          file_size_bytes: cloud.bytes,
          metadata: { cloudinary_url: cloud.secure_url }
        })
        .eq('id', item.id);
      if (error) console.error(`Error updating asset ${item.id}:`, error.message);
      else console.log(`Updated asset ${item.id} -> ${cloud.public_id}`);
    }
  }

  // 2. Insert/Upsert Product and Category Media Assets
  const additionalAssets = [
    {
      id: '30000000-0000-0000-0000-000000000021',
      key: '/images/products/azure-resort-kaftan.jpg',
      alt: 'Azure Resort Kaftan by Fashion Spectrum',
      filename: 'azure-resort-kaftan.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000022',
      key: '/images/products/blush-print-kaftan.jpg',
      alt: 'Blush Print Kaftan by Fashion Spectrum',
      filename: 'blush-print-kaftan.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000023',
      key: '/images/products/classic-black-kaftan.jpg',
      alt: 'Classic Black Kaftan by Fashion Spectrum',
      filename: 'classic-black-kaftan.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000024',
      key: '/images/products/emerald-resort-kaftan.jpg',
      alt: 'Emerald Resort Kaftan by Fashion Spectrum',
      filename: 'emerald-resort-kaftan.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000025',
      key: '/images/products/terracotta-sunset-kaftan.jpg',
      alt: 'Terracotta Sunset Kaftan by Fashion Spectrum',
      filename: 'terracotta-sunset-kaftan.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000026',
      key: '/images/products/solstice-gold-earrings.jpg',
      alt: 'Solstice Gold Drop Earrings by KAFTAN Atelier',
      filename: 'solstice-gold-earrings.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000027',
      key: '/images/products/mediterranean-straw-panama.jpg',
      alt: 'Mediterranean Handwoven Straw Panama Hat',
      filename: 'mediterranean-straw-panama.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000028',
      key: '/images/products/monochrome-blazer-dress.jpg',
      alt: 'Monochrome Linen Tailored Blazer Dress',
      filename: 'monochrome-blazer-dress.jpg'
    },
    // Categories
    {
      id: '30000000-0000-0000-0000-000000000031',
      key: '/images/categories/accessories.jpg',
      alt: 'Luxury Accessories Category',
      filename: 'accessories.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000032',
      key: '/images/categories/australian-designers.jpg',
      alt: 'Australian Designers Category',
      filename: 'australian-designers.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000033',
      key: '/images/categories/occasion-wear.jpg',
      alt: 'Occasion Wear Category',
      filename: 'occasion-wear.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000034',
      key: '/images/categories/resortwear.jpg',
      alt: 'Resortwear Category',
      filename: 'resortwear.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000035',
      key: '/images/categories/street-style.jpg',
      alt: 'Street Style Category',
      filename: 'street-style.jpg'
    },
    {
      id: '30000000-0000-0000-0000-000000000036',
      key: '/images/categories/sustainable-fashion.jpg',
      alt: 'Sustainable Fashion Category',
      filename: 'sustainable-fashion.jpg'
    }
  ];

  for (const asset of additionalAssets) {
    const cloud = manifest[asset.key];
    if (!cloud) continue;

    const { error } = await supabase
      .from('media_assets')
      .upsert({
        id: asset.id,
        storage_key: cloud.public_id,
        original_filename: asset.filename,
        mime_type: 'image/' + cloud.format,
        width: cloud.width,
        height: cloud.height,
        file_size_bytes: cloud.bytes,
        alt_text: asset.alt,
        caption: asset.alt,
        metadata: { cloudinary_url: cloud.secure_url }
      }, { onConflict: 'id' });

    if (error) console.error(`Error upserting asset ${asset.id}:`, error.message);
    else console.log(`Upserted media asset ${asset.id} -> ${cloud.public_id}`);
  }

  // 3. Update existing 4 products to use dedicated images
  const productUpdates = [
    { id: '70000000-0000-0000-0000-000000000001', image_id: '30000000-0000-0000-0000-000000000021' },
    { id: '70000000-0000-0000-0000-000000000002', image_id: '30000000-0000-0000-0000-000000000022' },
    { id: '70000000-0000-0000-0000-000000000003', image_id: '30000000-0000-0000-0000-000000000023' },
    { id: '70000000-0000-0000-0000-000000000004', image_id: '30000000-0000-0000-0000-000000000024' },
  ];

  for (const p of productUpdates) {
    const { error } = await supabase
      .from('products')
      .update({ image_id: p.image_id })
      .eq('id', p.id);
    if (error) console.error(`Error updating product ${p.id}:`, error.message);
    else console.log(`Updated product ${p.id} with dedicated image`);
  }

  // 4. Add the other 4 luxury products to products table
  const newProducts = [
    {
      id: '70000000-0000-0000-0000-000000000005',
      name: 'Terracotta Sunset Kaftan',
      slug: 'terracotta-sunset-kaftan',
      description: 'Earthy tones, dramatic drape, and artisan tie-dye technique.',
      brand_name: 'Fashion Spectrum',
      image_id: '30000000-0000-0000-0000-000000000025',
      original_price: 380,
      sale_price: 260,
      currency: 'AUD',
      product_url: 'https://fashionspectrum.com.au/products/terracotta-sunset',
      link_type: 'external',
      status: 'active'
    },
    {
      id: '70000000-0000-0000-0000-000000000006',
      name: 'Solstice Gold Drop Hoops',
      slug: 'solstice-gold-drop-hoops',
      description: '18k gold vermeil sculptural statement earrings hand-cast in Sydney.',
      brand_name: 'KAFTAN Atelier',
      image_id: '30000000-0000-0000-0000-000000000026',
      original_price: 140,
      sale_price: 95,
      currency: 'AUD',
      product_url: 'https://kaftan.fashion/shop/solstice-gold-drop-hoops',
      link_type: 'external',
      status: 'active'
    },
    {
      id: '70000000-0000-0000-0000-000000000007',
      name: 'Handwoven Straw Panama Hat',
      slug: 'handwoven-straw-panama-hat',
      description: 'Wide-brim UPF50+ toquilla straw hat with Italian leather band.',
      brand_name: 'Byron Bay Millinery',
      image_id: '30000000-0000-0000-0000-000000000027',
      original_price: 210,
      sale_price: 155,
      currency: 'AUD',
      product_url: 'https://kaftan.fashion/shop/handwoven-straw-panama-hat',
      link_type: 'external',
      status: 'active'
    },
    {
      id: '70000000-0000-0000-0000-000000000008',
      name: 'Monochrome Tailored Blazer Dress',
      slug: 'monochrome-linen-blazer-dress',
      description: 'Structured silhouette in pure Australian linen with notched lapels.',
      brand_name: 'St. Agni Studio',
      image_id: '30000000-0000-0000-0000-000000000028',
      original_price: 490,
      sale_price: 340,
      currency: 'AUD',
      product_url: 'https://kaftan.fashion/shop/monochrome-linen-blazer-dress',
      link_type: 'external',
      status: 'active'
    }
  ];

  for (const prod of newProducts) {
    const { error } = await supabase
      .from('products')
      .upsert(prod, { onConflict: 'id' });
    if (error) console.error(`Error upserting product ${prod.id}:`, error.message);
    else console.log(`Upserted product ${prod.name}`);
  }

  console.log('\n--- Sync Complete! ---');
}

sync().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});

