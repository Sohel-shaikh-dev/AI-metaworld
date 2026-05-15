import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');

async function optimizeImages() {
  console.log('Starting image optimization...');
  
  // Find all png, jpg, jpeg files in public directory
  const files = await glob('**/*.{png,jpg,jpeg}', { cwd: PUBLIC_DIR, absolute: true });
  
  console.log(`Found ${files.length} images to optimize.`);

  for (const file of files) {
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    const dirname = path.dirname(file);
    
    // Some icons/logos might be too small to compress heavily, but we convert all to WebP
    const webpPath = path.join(dirname, `${basename}.webp`);
    
    try {
      console.log(`Converting: ${path.relative(PUBLIC_DIR, file)}`);
      
      await sharp(file)
        .webp({ quality: 80, effort: 6 })
        .toFile(webpPath);
        
      console.log(`  -> Saved as ${path.relative(PUBLIC_DIR, webpPath)}`);
      
      // Optionally delete the old file
      await fs.unlink(file);
      console.log(`  -> Deleted original ${path.relative(PUBLIC_DIR, file)}`);
      
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
  
  console.log('Finished image optimization!');
}

optimizeImages();
