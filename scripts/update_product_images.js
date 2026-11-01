const fs = require('fs');

// 1. ProductCatalogView.tsx
let pcv = fs.readFileSync('src/components/products/ProductCatalogView.tsx', 'utf8');
if (!pcv.includes('buildCloudinaryUrl')) {
  pcv = pcv.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport { buildCloudinaryUrl } from '@/lib/cloudinary/url';");
  pcv = pcv.replace(
    /src=\{product\.image\?\.storage_key \|\| '[^']+'\}/g,
    "src={buildCloudinaryUrl(product.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 800 })}"
  );
  pcv = pcv.replace(
    /src=\{quickViewProduct\.image\?\.storage_key \|\| '[^']+'\}/g,
    "src={buildCloudinaryUrl(quickViewProduct.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 1000 })}"
  );
  fs.writeFileSync('src/components/products/ProductCatalogView.tsx', pcv, 'utf8');
  console.log('Updated ProductCatalogView.tsx');
}

// 2. ProductDetailInteractive.tsx
let pdi = fs.readFileSync('src/components/products/ProductDetailInteractive.tsx', 'utf8');
if (!pdi.includes('buildCloudinaryUrl')) {
  pdi = pdi.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport { buildCloudinaryUrl } from '@/lib/cloudinary/url';");
  pdi = pdi.replace(
    /src=\{product\.image\?\.storage_key \|\| '[^']+'\}/g,
    "src={buildCloudinaryUrl(product.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 1200 })}"
  );
  pdi = pdi.replace(
    /src=\{rel\.image\?\.storage_key \|\| '[^']+'\}/g,
    "src={buildCloudinaryUrl(rel.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 600 })}"
  );
  fs.writeFileSync('src/components/products/ProductDetailInteractive.tsx', pdi, 'utf8');
  console.log('Updated ProductDetailInteractive.tsx');
}

