import fs from 'fs';
import path from 'path';

const projectDir = path.join(process.cwd(), 'pages'); // aho pages zawe ziri

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  if (!content.includes('export const runtime = \'edge\'')) {
    const newContent = `export const runtime = 'edge';\n${content}`;
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(projectDir);
console.log('All routes processed!');
