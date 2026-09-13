import fs from 'fs';
import path from 'path';

const postsPath = 'src/content/posts';
const postsFiles = fs.readdirSync(postsPath).filter(p => p.endsWith('.mdx'));

let allPosts = [];

for (const file of postsFiles) {
    const content = fs.readFileSync(path.join(postsPath, file), 'utf8');
    const titleMatch = content.match(/^title:\s*['"]?(.*?)['"]?$/m);
    const title = titleMatch ? titleMatch[1] : file.replace('.mdx', '');
    
    const catMatch = content.match(/categories:\n((?:- .*\n)+)/);
    const categories = catMatch ? catMatch[1].split('\n').filter(c => c.trim().startsWith('-')).map(c => c.replace('- ', '').trim()) : [];
    
    allPosts.push({
        file,
        title,
        slug: file.replace('.mdx', ''),
        categories,
        content
    });
}

for (const post of allPosts) {
    let newContent = post.content;
    
    // Find 2-3 related posts based on categories
    let related = allPosts.filter(p => 
        p.file !== post.file && 
        p.categories.some(c => post.categories.includes(c))
    );
    
    // Shuffle and pick 3
    related.sort(() => 0.5 - Math.random());
    let selected = related.slice(0, 3);
    
    if (selected.length > 0) {
        let relatedSection = `\n\n### More Editorial Guides\n\nIf you found this guide helpful, you might also want to explore:\n\n`;
        for (const rel of selected) {
            relatedSection += `- [${rel.title}](/posts/${rel.slug})\n`;
        }
        
        // Append before the final Takeaway if it exists, otherwise at the end
        if (newContent.includes('## The Editorial Takeaway')) {
            newContent = newContent.replace('## The Editorial Takeaway', relatedSection + '\n## The Editorial Takeaway');
        } else {
            newContent += relatedSection;
        }
    }
    
    fs.writeFileSync(path.join(postsPath, post.file), newContent, 'utf8');
}

console.log('Internal linking (Related Guides) injected.');
