import fs from 'fs';

let content = fs.readFileSync('src/pages/index.astro', 'utf8');

content = content.replace(/men-s-fall-wardrobe/g, 'mens-fashion');
content = content.replace(/women-s-fall-wardrobe/g, 'womens-fashion');

// Fix trends
content = content.replace(/'trends'/g, "'trends-and-aesthetics'");
content = content.replace(/\/category\/trends/g, "/category/trends-and-aesthetics");
content = content.replace(/trendSlugs = \['trends-and-aesthetics', 'viral-footwear', 'pop-culture-and-aesthetics'\];/g, "trendSlugs = ['trends-and-aesthetics'];");

fs.writeFileSync('src/pages/index.astro', content);
console.log('Fixed index.astro slugs');
