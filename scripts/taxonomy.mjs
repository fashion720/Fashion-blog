import fs from 'fs';
import path from 'path';

const basePath = 'src/content/categories';
const postsPath = 'src/content/posts';

const taxonomyMap = {
    'aesthetic-and-lifestyle-visuals': 'trends-and-aesthetics',
    'pop-culture-and-aesthetics': 'trends-and-aesthetics',
    'trends': 'trends-and-aesthetics',
    
    'denim-and-basics-trends': 'denim-and-basics',
    'jeans-styles': 'denim-and-basics',
    'basics-layering': 'denim-and-basics',
    
    'diy-and-custom': 'diy-and-upcycling',
    'custom-apparel': 'diy-and-upcycling',
    
    'back-to-school': 'campus-style',
    'campus-style': 'campus-style',
    'school-gear-and-essentials': 'campus-style',
    
    'bags': 'accessories-and-footwear',
    'trending-accessories': 'accessories-and-footwear',
    'viral-footwear': 'accessories-and-footwear',
    'jewelry-and-layering': 'accessories-and-footwear',
    
    'women-s-fall-wardrobe': 'womens-fashion',
    'seasonal-fashion': 'womens-fashion',
    'men-s-fall-wardrobe': 'mens-fashion'
};

const newCategories = {
    'trends-and-aesthetics': { name: 'Trends & Aesthetics', description: 'Explore the latest fashion trends, aesthetics, and cultural shifts in style.' },
    'denim-and-basics': { name: 'Denim & Basics', description: 'Foundational wardrobe pieces, denim styles, and how to layer them.' },
    'diy-and-upcycling': { name: 'DIY & Upcycling', description: 'Creative guides for upcycling, customizing, and repairing your clothes.' },
    'campus-style': { name: 'Campus Style', description: 'Practical and stylish outfit ideas for college and high school.' },
    'accessories-and-footwear': { name: 'Accessories & Footwear', description: 'Elevate your looks with the right shoes, bags, and jewelry.' },
    'womens-fashion': { name: 'Women\'s Fashion', description: 'Seasonal style inspiration and outfit guides for women.' },
    'mens-fashion': { name: 'Men\'s Fashion', description: 'Seasonal style inspiration and outfit guides for men.' }
};

// Create new categories
for (const [slug, data] of Object.entries(newCategories)) {
    const content = `name: ${data.name}\ndescription: ${data.description}\ncolor: "#000000"\n`;
    fs.writeFileSync(path.join(basePath, `${slug}.yaml`), content);
}

// Update posts
const posts = fs.readdirSync(postsPath).filter(p => p.endsWith('.mdx'));
for (const post of posts) {
    const postPath = path.join(postsPath, post);
    let content = fs.readFileSync(postPath, 'utf8');
    
    let updated = false;
    for (const [oldCat, newCat] of Object.entries(taxonomyMap)) {
        if (content.includes(`- ${oldCat}`)) {
            content = content.replace(new RegExp(`- ${oldCat}`, 'g'), `- ${newCat}`);
            updated = true;
        }
    }
    
    // Deduplicate categories in frontmatter
    if (updated) {
        const catMatch = content.match(/categories:\n((?:- .*\n)+)/);
        if (catMatch) {
            const catList = catMatch[1].split('\n').filter(c => c.trim() !== '');
            const uniqueCats = [...new Set(catList)];
            content = content.replace(catMatch[1], uniqueCats.join('\n') + '\n');
        }
        fs.writeFileSync(postPath, content);
    }
}

// Delete old categories and prepare redirects
let redirects = '';
for (const oldCat of Object.keys(taxonomyMap)) {
    const newCat = taxonomyMap[oldCat];
    const oldPath = path.join(basePath, `${oldCat}.yaml`);
    if (fs.existsSync(oldPath) && oldCat !== newCat) {
        fs.unlinkSync(oldPath);
    }
    if (oldCat !== newCat) {
        redirects += `/category/${oldCat}/ /category/${newCat}/ 301\n`;
    }
}

fs.writeFileSync('public/_redirects', redirects, { flag: 'a' });
console.log('Taxonomy updated and redirects added.');
