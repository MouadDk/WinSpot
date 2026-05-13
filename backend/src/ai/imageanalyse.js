const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const JimpModule = require('jimp');
const Jimp = JimpModule.Jimp || JimpModule.default || JimpModule;

const DATASET_FILE = path.join(__dirname, 'finetuning_dataset.jsonl');

/**
 * Image Cleaning: Enlarges 2x and forces high contrast to read tiny white text
 */
async function preprocessForOCR(imagePath) {
    const tempPath = path.join(__dirname, `temp_${path.basename(imagePath)}`);
    try {
        const image = await Jimp.read(imagePath);
        image.scale(2).greyscale().contrast(1).normalize();
        await image.write(tempPath);
        return tempPath;
    } catch (error) {
        console.error(`Jimp failed to process ${imagePath}:`, error.message);
        return imagePath; 
    }
}

/**
 * TASK 1: STRICT TEXT EXTRACTION (Using Tesseract.js)
 */
async function extractTextWithTesseract(imagePath) {
    const cleanImagePath = await preprocessForOCR(imagePath);
    const worker = await createWorker('eng');
    
    try {
        // PSM 11 looks for scattered text/stickers
        await worker.setParameters({
            tessedit_pageseg_mode: '11', 
        });

        const { data } = await worker.recognize(cleanImagePath);
        
        if (!data || !data.words) return [];

        const cleanWords = data.words
            // Locked in at >40% confidence based on successful tag extraction
            .filter(word => word.confidence > 40)
            .map(word => word.text.trim())
            // Drop random 1-2 character mistakes
            .filter(text => text.length >= 3)
            // Ensure it contains actual letters, numbers, or tag symbols
            .filter(text => /[a-zA-Z0-9@#]/.test(text));

        return cleanWords;
        
    } catch (error) {
        console.error(`Tesseract Error:`, error.message);
        return [];
    } finally {
        await worker.terminate();
        // Clean up temp file
        if (fs.existsSync(cleanImagePath) && cleanImagePath !== imagePath) {
            fs.unlinkSync(cleanImagePath); 
        }
    }
}

/**
 * TASK 2: SCENE DETECTION (Using local LLaVA)
 */
async function detectRestaurantScene(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        const systemPrompt = `
        Analyze this image and determine if the location is a restaurant, cafe, pub, or food establishment.
        Return ONLY a JSON object with a single boolean key. Do not include markdown.
        {
          "is_restaurant": true
        }`;

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llava', 
                prompt: systemPrompt,
                images: [base64Image],
                format: 'json', 
                stream: false
            })
        });

        if (!response.ok) throw new Error(`Ollama Error: ${response.statusText}`);

        const data = await response.json();
        const result = JSON.parse(data.response);
        return result.is_restaurant || false;

    } catch (error) {
        console.error(`LLaVA Error on ${imagePath}:`, error.message);
        return false;
    }
}

/**
 * Saves the result to a JSON Lines (.jsonl) file for Fine-Tuning.
 */
function saveForFineTuning(imagePath, visibleText, isRestaurant) {
    const dataRow = {
        image: imagePath,
        conversations: [
            { from: "human", value: "Extract the visible text and determine if this is a restaurant." },
            { from: "gpt", value: JSON.stringify({ visible_text: visibleText, is_restaurant: isRestaurant }) }
        ]
    };
    fs.appendFileSync(DATASET_FILE, JSON.stringify(dataRow) + '\n');
}

/**
 * MAIN PIPELINE
 */
async function processImage(imagePath) {
    console.log(`\n--- Processing: ${path.basename(imagePath)} ---`);
    
    if (!fs.existsSync(imagePath)) {
        console.warn(`File not found: ${imagePath}`);
        return null;
    }

    console.log("1. Reading text pixels (Tesseract)...");
    const textArray = await extractTextWithTesseract(imagePath);
    
    console.log("2. Analyzing room environment (LLaVA)...");
    const isRestaurant = await detectRestaurantScene(imagePath); 
    
    const finalResult = {
        visible_text: textArray,
        is_restaurant: isRestaurant
    };

    console.log("Result:", finalResult);
    saveForFineTuning(imagePath, textArray, isRestaurant);
    console.log("✅ Saved to fine-tuning dataset.");

    return finalResult;
}

/**
 * TEST SUITE
 */
async function runTests() {
    const testFiles = [
        "C:\\Users\\Mouad\\Downloads\\images.png",
        "C:\\Users\\Mouad\\Downloads\\images.jpg",
        "C:\\Users\\Mouad\\Downloads\\images1.png"
    ];

    for (const file of testFiles) {
        await processImage(file);
    }
    
    console.log(`\n🎉 All done! Check ${DATASET_FILE} for your training data.`);
}

// Execute if run directly
const isMainModule = require.main === module;
if (isMainModule) {
    runTests();
}

module.exports = { processImage };