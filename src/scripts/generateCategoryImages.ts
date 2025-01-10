import { searchUnsplashImage, downloadImage, ensureDirectoryExists } from '../lib/utils/imageUtils.js';
import { CATEGORY_LIST } from '../lib/constants/categories.js';
import path from 'path';

const SEARCH_TERMS = {
  All: 'oil and gas technology',
  Drilling: 'oil drilling rig technology',
  Exploration: 'oil exploration seismic',
  Production: 'oil production platform',
  Reservoir: 'oil reservoir engineering',
  DigitalOilfield: 'digital oilfield technology',
  IoT: 'industrial iot sensors',
  Cybersecurity: 'cybersecurity technology',
  AI: 'artificial intelligence technology',
  DataAnalytics: 'data analytics visualization',
  Sustainability: 'sustainable energy technology',
  Other: 'industrial technology'
};

async function generateCategoryImages() {
  const publicDir = path.join(process.cwd(), 'public', 'images');
  await ensureDirectoryExists(publicDir);

  const categories = ['All', ...CATEGORY_LIST];

  for (const category of categories) {
    const searchTerm = SEARCH_TERMS[category];
    const imagePath = path.join(publicDir, `${category.toLowerCase()}.jpg`);

    try {
      console.log(`Fetching image for ${category}...`);
      const imageUrl = await searchUnsplashImage(searchTerm);
      
      if (imageUrl) {
        await downloadImage(imageUrl, imagePath);
        console.log(`✓ Generated image for ${category}`);
      } else {
        console.error(`✗ No image found for ${category}`);
      }
    } catch (error) {
      console.error(`✗ Error generating image for ${category}:`, error);
    }
  }
}

generateCategoryImages().catch(console.error);