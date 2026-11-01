const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Load environment variables
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

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

const folders = ['editorial', 'products', 'categories'];

async function uploadAll() {
  console.log('--- Starting Cloudinary Upload ---');
  console.log('Cloud name:', env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

  const results = {};

  for (const folder of folders) {
    const dir = path.resolve(process.cwd(), 'public', 'images', folder);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const filenameWithoutExt = path.parse(file).name;
      const publicId = `kaftan/${folder}/${filenameWithoutExt}`;

      try {
        console.log(`Uploading ${folder}/${file} -> ${publicId}...`);
        const res = await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          overwrite: true,
          resource_type: 'image'
        });

        results[`/images/${folder}/${file}`] = {
          public_id: res.public_id,
          secure_url: res.secure_url,
          width: res.width,
          height: res.height,
          bytes: res.bytes,
          format: res.format
        };
        console.log(`  ✓ Uploaded: ${res.public_id} (${res.width}x${res.height}, ${res.bytes} bytes)`);
      } catch (err) {
        console.error(`  ✗ Failed to upload ${file}:`, err.message);
      }
    }
  }

  const outPath = path.resolve(process.cwd(), 'scripts', 'cloudinary_manifest.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nManifest saved to ${outPath}. Total uploaded: ${Object.keys(results).length}`);
}

uploadAll().catch(err => {
  console.error('Fatal upload error:', err);
  process.exit(1);
});

