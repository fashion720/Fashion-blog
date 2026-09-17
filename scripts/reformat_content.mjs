import fs from 'fs';
import path from 'path';

const postsPath = 'src/content/posts';
const posts = fs.readdirSync(postsPath).filter(p => p.endsWith('.mdx'));

function cleanFilenameForAltText(filePath) {
    const filename = filePath.split('/').pop().split('.')[0];
    return filename.replace(/-/g, ' ').replace(/pinterest optimized \d+/g, '').trim();
}

for (const post of posts) {
    const postPath = path.join(postsPath, post);
    let content = fs.readFileSync(postPath, 'utf8');

    // 1. Remove generic internal links like [sneakers](/posts/...) or [loafers](/posts/...)
    // Only remove links that are 1-2 words.
    content = content.replace(/\[([^\]]{1,15})\]\(\/posts\/[^\)]+\)/g, '$1');

    // 2. Remove "Look X: " or "**Look X:**" from headings
    content = content.replace(/##\s*\*\*(?:Look \d+: |Outfit \d+: )?(.*?)\*\*/g, '## $1');
    content = content.replace(/##\s*(?:Look \d+: |Outfit \d+: )(.*?)/g, '## $1');

    // 3. Remove repetitive FAQs if they exist
    // Find "## Frequently Asked Questions" or "## FAQs" and delete until "## "
    if (content.includes('## Frequently Asked') || content.includes('## FAQ')) {
        content = content.replace(/## Frequently Asked(?:.|\n)*?(?=##|$)/gi, '');
        content = content.replace(/## FAQ(?:.|\n)*?(?=##|$)/gi, '');
    }
    
    // 4. Inject Image Alt Text
    // Match ![](/images/...)
    content = content.replace(/!\[\]\((.*?)\)/g, (match, imagePath) => {
        let altText = cleanFilenameForAltText(imagePath) || post.replace('.mdx', '').replace(/-/g, ' ');
        return `![${altText}](${imagePath})`;
    });

    // 5. Remove repetitive clickbait from content body
    const buzzwords = [
        /insanely cute/gi, /genius hack/gi, /you need to try this/gi, 
        /ultimate guide/gi, /secret hacks/gi, /must-have/gi
    ];
    for (const word of buzzwords) {
        content = content.replace(word, 'great');
    }

    // 6. Rewrite repetitive conclusions
    // Replace "Finding Your Own Style for Class Days" or similar conclusion headings
    content = content.replace(/## Finding Your Own Style.*?(\n|$)/gi, '## The Editorial Takeaway\n');
    content = content.replace(/## Conclusion.*?(\n|$)/gi, '## The Editorial Takeaway\n');

    fs.writeFileSync(postPath, content, 'utf8');
}

console.log('Content reformatted, alt text added, FAQs and bad links removed.');
