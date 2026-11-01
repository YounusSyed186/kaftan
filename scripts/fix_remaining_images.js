const fs = require('fs');

// 1. Fix ClearanceSaleSection.tsx line 164
let css = fs.readFileSync('src/components/homepage/ClearanceSaleSection.tsx', 'utf8');
css = css.replace(
  "src={currentProduct.image?.storage_key || '/images/products/azure-resort-kaftan.jpg'}",
  "src={buildCloudinaryUrl(currentProduct.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 800 })}"
);
fs.writeFileSync('src/components/homepage/ClearanceSaleSection.tsx', css, 'utf8');
console.log('Fixed ClearanceSaleSection.tsx');

// 2. Fix AdminDashboardClient.tsx
let adc = fs.readFileSync('src/components/admin/AdminDashboardClient.tsx', 'utf8');
if (!adc.includes('buildCloudinaryUrl')) {
  adc = adc.replace(
    "import Image from 'next/image';",
    "import Image from 'next/image';\nimport { buildCloudinaryUrl } from '@/lib/cloudinary/url';"
  );
}
adc = adc.replace(
  /src=\{art\.featured_image\?\.storage_key \|\| '[^']+'\}/g,
  "src={buildCloudinaryUrl(art.featured_image?.storage_key || 'kaftan/editorial/hero-mediterranean-resortwear', { width: 400 })}"
);
adc = adc.replace(
  /src=\{prod\.image\?\.storage_key \|\| '[^']+'\}/g,
  "src={buildCloudinaryUrl(prod.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 400 })}"
);
fs.writeFileSync('src/components/admin/AdminDashboardClient.tsx', adc, 'utf8');
console.log('Fixed AdminDashboardClient.tsx');

