import fs from 'fs';
import path from 'path';

const postsPath = 'src/content/posts';
const posts = fs.readdirSync(postsPath).filter(p => p.endsWith('.mdx'));

const clickbaitPhrases = [
    /insanely cute/gi,
    /genius/gi,
    /you need to try/gi,
    /ultimate/gi,
    /secret hacks/gi,
    /must-have/gi,
    /that actually work/gi,
    /everyone screenshots/gi,
    /that look insanely expensive/gi,
    /that aren'?t boring/gi,
    /that aren'?t basic/gi,
    /that never look sloppy/gi,
    /without looking basic/gi,
    /that look effortlessly cool/gi,
    /you need in your wardrobe/gi
];

for (const post of posts) {
    const postPath = path.join(postsPath, post);
    let content = fs.readFileSync(postPath, 'utf8');
    
    const titleMatch = content.match(/^title:\s*(.*)$/m);
    if (titleMatch) {
        let originalTitle = titleMatch[1];
        // Strip quotes if any
        let title = originalTitle.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        
        let changed = false;
        for (const regex of clickbaitPhrases) {
            if (regex.test(title)) {
                title = title.replace(regex, '').replace(/\s+/g, ' ').trim();
                changed = true;
            }
        }
        
        // Clean up any trailing prepositions or spaces left behind
        title = title.replace(/ (for|to|that)$/i, '').trim();
        // Capitalize first letter of words
        title = title.replace(/\b\w/g, c => c.toUpperCase());
        
        if (changed) {
            content = content.replace(/^title:\s*(.*)$/m, `title: "${title}"`);
            fs.writeFileSync(postPath, content, 'utf8');
            console.log(`Updated title: ${title}`);
        }
    }
}
console.log('Clickbait titles cleaned.');
