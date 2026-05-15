import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');
const HTML_FILE = path.resolve(__dirname, '../index.html');

async function updateReferences() {
  const files = await glob('**/*.{tsx,ts,css}', { cwd: SRC_DIR, absolute: true });
  files.push(HTML_FILE);
  
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      
      const newContent = content
        .replace(/\.png/g, '.webp')
        .replace(/\.jpg/g, '.webp')
        .replace(/\.jpeg/g, '.webp');
        
      if (content !== newContent) {
        await fs.writeFile(file, newContent, 'utf-8');
        console.log(`Updated references in: ${path.relative(path.resolve(__dirname, '..'), file)}`);
      }
    } catch (err) {
      console.error(`Error updating ${file}:`, err);
    }
  }
}

updateReferences();
