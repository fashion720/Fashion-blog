import fs from 'fs';

let content = fs.readFileSync('src/components/Header.astro', 'utf8');

content = content.replace(/men-s-fall-wardrobe/g, 'mens-fashion');
content = content.replace(/women-s-fall-wardrobe/g, 'womens-fashion');

// Fix trends
content = content.replace(/'trends'/g, "'trends-and-aesthetics'");
content = content.replace(/\/category\/trends/g, "/category/trends-and-aesthetics");
content = content.replace(/denim-and-basics-trends/g, "denim-and-basics");

fs.writeFileSync('src/components/Header.astro', content);
console.log('Fixed Header.astro slugs');
