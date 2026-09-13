import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

function replaceInFiles(dir, oldStr, newStr, ext) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) return;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
        const filePath = path.join(fullPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            replaceInFiles(path.join(dir, file), oldStr, newStr, ext);
        } else if (file.endsWith(ext)) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(oldStr)) {
                // Regex replace all occurrences
                content = content.split(oldStr).join(newStr);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    }
}

replaceInFiles('src/content/posts', 'author: sara-khan', 'author: editorial-team', '.mdx');
replaceInFiles('src/pages', 'Sara Khan', 'Outfit Edits Editorial Team', '.astro');
replaceInFiles('src/pages', 'sara-khan', 'editorial-team', '.astro');
console.log('Done.');
