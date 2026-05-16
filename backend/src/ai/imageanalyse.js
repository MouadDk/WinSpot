import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { classifyRestaurantImage, extractImageText } from '../services/huggingFaceVision.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATASET_FILE = path.join(__dirname, 'finetuning_dataset.jsonl');

function saveForFineTuning(imageUrl, visibleText, restaurantResult) {
  const dataRow = {
    image: imageUrl,
    conversations: [
      { from: 'human', value: 'Extract the visible text and determine if this is a restaurant.' },
      {
        from: 'gpt',
        value: JSON.stringify({
          visible_text: visibleText,
          is_restaurant: restaurantResult.isRestaurant,
          restaurant_confidence: restaurantResult.confidence
        })
      }
    ]
  };

  fs.appendFileSync(DATASET_FILE, `${JSON.stringify(dataRow)}\n`);
}

export async function processImage(imageUrl) {
  if (!imageUrl) {
    throw new Error('processImage requires a public image URL.');
  }

  console.log(`\n--- Processing Cloudinary image: ${imageUrl} ---`);

  const [visibleText, restaurantResult] = await Promise.all([
    extractImageText(imageUrl),
    classifyRestaurantImage(imageUrl)
  ]);

  const finalResult = {
    visible_text: visibleText,
    is_restaurant: restaurantResult.isRestaurant,
    restaurant_confidence: restaurantResult.confidence
  };

  console.log('AI verification result:', finalResult);
  saveForFineTuning(imageUrl, visibleText, restaurantResult);

  return finalResult;
}

export default { processImage };
