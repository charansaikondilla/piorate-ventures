/**
 * Image Optimization Script
 * 
 * This script optimizes F1 car animation frames for web delivery
 * Run: node scripts/optimize-images.js
 * 
 * Requirements: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/f1car-zip');
const OUTPUT_DIR = path.join(__dirname, '../public/f1car-zip-optimized');
const FRAME_COUNT = 40;

// Optimization settings
const JPEG_QUALITY = 80; // 80% quality (good balance)
const WEBP_QUALITY = 80;
const MAX_WIDTH = 1920; // Max width for 1080p
const MAX_HEIGHT = 1080;

async function optimizeImages() {
    console.log('🚀 Starting image optimization...\n');

    try {
        // Create output directory
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        
        let totalOriginalSize = 0;
        let totalOptimizedSize = 0;
        let processedCount = 0;

        // Process each frame
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const frameNum = i.toString().padStart(3, '0');
            const inputPath = path.join(INPUT_DIR, `ezgif-frame-${frameNum}.jpg`);
            const outputJpgPath = path.join(OUTPUT_DIR, `ezgif-frame-${frameNum}.jpg`);
            const outputWebpPath = path.join(OUTPUT_DIR, `ezgif-frame-${frameNum}.webp`);

            try {
                // Check if input file exists
                const stats = await fs.stat(inputPath);
                totalOriginalSize += stats.size;

                // Get image metadata
                const metadata = await sharp(inputPath).metadata();
                
                // Optimize JPEG
                await sharp(inputPath)
                    .resize(MAX_WIDTH, MAX_HEIGHT, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({
                        quality: JPEG_QUALITY,
                        progressive: true, // Progressive JPEG loads faster
                        mozjpeg: true // Use mozjpeg for better compression
                    })
                    .toFile(outputJpgPath);

                // Create WebP version
                await sharp(inputPath)
                    .resize(MAX_WIDTH, MAX_HEIGHT, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .webp({
                        quality: WEBP_QUALITY,
                        effort: 6 // 0-6, higher = better compression but slower
                    })
                    .toFile(outputWebpPath);

                // Get optimized sizes
                const jpgStats = await fs.stat(outputJpgPath);
                const webpStats = await fs.stat(outputWebpPath);
                totalOptimizedSize += jpgStats.size;

                processedCount++;
                
                const originalKB = (stats.size / 1024).toFixed(1);
                const jpgKB = (jpgStats.size / 1024).toFixed(1);
                const webpKB = (webpStats.size / 1024).toFixed(1);
                const jpgSavings = ((1 - jpgStats.size / stats.size) * 100).toFixed(1);
                const webpSavings = ((1 - webpStats.size / stats.size) * 100).toFixed(1);

                console.log(`✅ Frame ${frameNum}: ${originalKB}KB → ${jpgKB}KB (JPEG, -${jpgSavings}%) | ${webpKB}KB (WebP, -${webpSavings}%)`);

            } catch (error) {
                console.error(`❌ Error processing frame ${frameNum}:`, error.message);
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 OPTIMIZATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`Frames processed: ${processedCount}/${FRAME_COUNT}`);
        console.log(`Original total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Optimized JPEG size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Total savings: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%`);
        console.log(`\n✨ Optimized images saved to: ${OUTPUT_DIR}`);
        console.log('\n💡 Next steps:');
        console.log('1. Review optimized images for quality');
        console.log('2. Replace original images with optimized versions');
        console.log('3. Update frameLoader.ts to use WebP with JPEG fallback');

    } catch (error) {
        console.error('❌ Optimization failed:', error);
        process.exit(1);
    }
}

// Run optimization
if (require.main === module) {
    optimizeImages().then(() => {
        console.log('\n✅ Optimization complete!');
    }).catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { optimizeImages };
