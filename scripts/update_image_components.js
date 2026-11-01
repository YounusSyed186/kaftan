const fs = require('fs');

// 1. FeaturedEditorialGrid.tsx
let feg = fs.readFileSync('src/components/homepage/FeaturedEditorialGrid.tsx', 'utf8');
if (!feg.includes('buildCloudinaryUrl')) {
  feg = feg.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport { buildCloudinaryUrl } from '@/lib/cloudinary/url';");
  feg = feg.replace(
    /const leftImg = [^;]+;/,
    "const leftImg = buildCloudinaryUrl(storyLeft.featured_image?.storage_key || 'kaftan/editorial/redefining-fashion', { width: 1200 });"
  );
  feg = feg.replace(
    /const centerTopImg = [^;]+;/,
    "const centerTopImg = buildCloudinaryUrl(storyCenterTop.featured_image?.storage_key || 'kaftan/editorial/effortless-dressing', { width: 600 });"
  );
  feg = feg.replace(
    /const centerBottomImg = [^;]+;/,
    "const centerBottomImg = buildCloudinaryUrl(storyCenterBottom.featured_image?.storage_key || 'kaftan/editorial/next-getaway', { width: 600 });"
  );
  feg = feg.replace(
    /const rightImg = [^;]+;/,
    "const rightImg = buildCloudinaryUrl(storyRight.featured_image?.storage_key || 'kaftan/editorial/warm-days-bolder-looks', { width: 1200 });"
  );
  fs.writeFileSync('src/components/homepage/FeaturedEditorialGrid.tsx', feg, 'utf8');
  console.log('Updated FeaturedEditorialGrid.tsx');
}

// 2. ClearanceSaleSection.tsx
let css = fs.readFileSync('src/components/homepage/ClearanceSaleSection.tsx', 'utf8');
if (!css.includes('buildCloudinaryUrl')) {
  css = css.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport { buildCloudinaryUrl } from '@/lib/cloudinary/url';");
  css = css.replace(
    /src=\{product\.image\?\.storage_key \|\| '[^']+'\}/g,
    "src={buildCloudinaryUrl(product.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 800 })}"
  );
  fs.writeFileSync('src/components/homepage/ClearanceSaleSection.tsx', css, 'utf8');
  console.log('Updated ClearanceSaleSection.tsx');
}

// 3. SponsoredAndAdSection.tsx
let sas = fs.readFileSync('src/components/homepage/SponsoredAndAdSection.tsx', 'utf8');
if (!sas.includes('buildCloudinaryUrl')) {
  sas = sas.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport { buildCloudinaryUrl } from '@/lib/cloudinary/url';");
  sas = sas.replace(
    /const sponsoredImg = [^;]+;/,
    "const sponsoredImg = buildCloudinaryUrl(sponsoredArticle.featured_image?.storage_key || 'kaftan/editorial/sponsored-resort-living', { width: 1200 });"
  );
  sas = sas.replace(
    /const adImg = [^;]+;/,
    "const adImg = buildCloudinaryUrl(adCreative.desktop_image?.storage_key || 'kaftan/editorial/ad-fashion-spectrum', { width: 1200 });"
  );
  fs.writeFileSync('src/components/homepage/SponsoredAndAdSection.tsx', sas, 'utf8');
  console.log('Updated SponsoredAndAdSection.tsx');
}

// 4. MoreStoriesSection.tsx
let mss = fs.readFileSync('src/components/homepage/MoreStoriesSection.tsx', 'utf8');
if (!mss.includes('buildCloudinaryUrl')) {
  mss = mss.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport { buildCloudinaryUrl } from '@/lib/cloudinary/url';");
  mss = mss.replace(
    /const imgSrc =\s*story\.featured_image\?\.storage_key \|\|\s*'[^']+';/g,
    "const imgSrc = buildCloudinaryUrl(story.featured_image?.storage_key || 'kaftan/editorial/more-accessories', { width: 800 });"
  );
  fs.writeFileSync('src/components/homepage/MoreStoriesSection.tsx', mss, 'utf8');
  console.log('Updated MoreStoriesSection.tsx');
}

// 5. CompetitionBanner.tsx
let cb = fs.readFileSync('src/components/homepage/CompetitionBanner.tsx', 'utf8');
if (!cb.includes('buildCloudinaryUrl')) {
  cb = cb.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport { buildCloudinaryUrl } from '@/lib/cloudinary/url';");
  cb = cb.replace(
    'src="/images/editorial/competition-strawhat-beach.jpg"',
    "src={buildCloudinaryUrl('kaftan/editorial/competition-strawhat-beach', { width: 1400 })}"
  );
  fs.writeFileSync('src/components/homepage/CompetitionBanner.tsx', cb, 'utf8');
  console.log('Updated CompetitionBanner.tsx');
}

// 6. VisualCategoryStrip.tsx
let vcs = fs.readFileSync('src/components/homepage/VisualCategoryStrip.tsx', 'utf8');
if (!vcs.includes('buildCloudinaryUrl')) {
  vcs = vcs.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport { buildCloudinaryUrl } from '@/lib/cloudinary/url';");
  vcs = vcs.replace(
    /src=\{cat\.imageSrc\}/g,
    "src={buildCloudinaryUrl(cat.imageSrc, { width: 400 })}"
  );
  vcs = vcs.replace("'/images/categories/resortwear.jpg'", "'kaftan/categories/resortwear'");
  vcs = vcs.replace("'/images/categories/occasion-wear.jpg'", "'kaftan/categories/occasion-wear'");
  vcs = vcs.replace("'/images/categories/australian-designers.jpg'", "'kaftan/categories/australian-designers'");
  vcs = vcs.replace("'/images/categories/sustainable-fashion.jpg'", "'kaftan/categories/sustainable-fashion'");
  vcs = vcs.replace("'/images/categories/street-style.jpg'", "'kaftan/categories/street-style'");
  vcs = vcs.replace("'/images/categories/accessories.jpg'", "'kaftan/categories/accessories'");
  fs.writeFileSync('src/components/homepage/VisualCategoryStrip.tsx', vcs, 'utf8');
  console.log('Updated VisualCategoryStrip.tsx');
}

console.log('All image components updated successfully!');

