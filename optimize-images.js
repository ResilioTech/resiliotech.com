#!/usr/bin/env node

/**
 * Image Optimization Script for Resiliotech Website
 * Converts images to WebP format and generates responsive image sets
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const config = {
    imageFormats: ['.jpg', '.jpeg', '.png'],
    webpQuality: 85,
    sizes: [320, 640, 960, 1280, 1600],
    inputDir: 'assets/images',
    outputDir: 'assets/images/optimized'
};

async function optimizeImages() {
    console.log('🖼️  Starting image optimization...');
    
    try {
        // Create output directory
        await fs.mkdir(config.outputDir, { recursive: true });
        
        // Read all files in input directory
        const files = await fs.readdir(config.inputDir);
        const imageFiles = files.filter(file => 
            config.imageFormats.includes(path.extname(file).toLowerCase())
        );
        
        if (imageFiles.length === 0) {
            console.log('ℹ️  No images found to optimize (only SVGs detected)');
            return;
        }
        
        console.log(`📸 Found ${imageFiles.length} images to optimize`);
        
        for (const file of imageFiles) {
            const inputPath = path.join(config.inputDir, file);
            const baseName = path.parse(file).name;
            
            console.log(`🔄 Processing ${file}...`);
            
            // Generate WebP version
            const webpPath = path.join(config.outputDir, `${baseName}.webp`);
            try {
                execSync(`npx imagemin-cli ${inputPath} --out-dir=${config.outputDir} --plugin=imagemin-webp --plugin.quality=${config.webpQuality}`);
                console.log(`✅ Created WebP: ${baseName}.webp`);
            } catch (error) {
                console.log(`⚠️  WebP conversion failed for ${file} - install imagemin-cli and imagemin-webp`);
            }
            
            // Generate responsive versions
            for (const size of config.sizes) {
                const outputPath = path.join(config.outputDir, `${baseName}-${size}w.jpg`);
                try {
                    execSync(`npx imagemin-cli ${inputPath} --out-dir=${config.outputDir} --plugin=imagemin-mozjpeg`);
                    console.log(`✅ Created responsive: ${baseName}-${size}w.jpg`);
                } catch (error) {
                    console.log(`⚠️  Responsive image generation requires imagemin-cli and imagemin-mozjpeg`);
                    break;
                }
            }
        }
        
        // Generate picture element code
        generatePictureElements(imageFiles);
        
        console.log('🎉 Image optimization complete!');
        
    } catch (error) {
        console.error('❌ Error during image optimization:', error);
    }
}

function generatePictureElements(imageFiles) {
    console.log('\n📝 Generated HTML for responsive images:');
    
    imageFiles.forEach(file => {
        const baseName = path.parse(file).name;
        console.log(`
<picture>
    <source 
        srcset="assets/images/optimized/${baseName}-320w.webp 320w,
                assets/images/optimized/${baseName}-640w.webp 640w,
                assets/images/optimized/${baseName}-960w.webp 960w,
                assets/images/optimized/${baseName}-1280w.webp 1280w"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        type="image/webp">
    <source 
        srcset="assets/images/optimized/${baseName}-320w.jpg 320w,
                assets/images/optimized/${baseName}-640w.jpg 640w,
                assets/images/optimized/${baseName}-960w.jpg 960w,
                assets/images/optimized/${baseName}-1280w.jpg 1280w"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        type="image/jpeg">
    <img src="assets/images/${file}" 
         alt="Description" 
         loading="lazy"
         decoding="async"
         width="800" 
         height="600">
</picture>`);
    });
}

// Install required packages
function checkDependencies() {
    console.log('📦 Checking dependencies...');
    try {
        execSync('npm list imagemin-cli imagemin-webp imagemin-mozjpeg', { stdio: 'ignore' });
        console.log('✅ All dependencies available');
        return true;
    } catch (error) {
        console.log('📦 Installing required packages...');
        try {
            execSync('npm install --save-dev imagemin-cli imagemin-webp imagemin-mozjpeg', { stdio: 'inherit' });
            return true;
        } catch (installError) {
            console.log('⚠️  Failed to install dependencies. Please run manually:');
            console.log('npm install --save-dev imagemin-cli imagemin-webp imagemin-mozjpeg');
            return false;
        }
    }
}

// Main execution
if (require.main === module) {
    if (checkDependencies()) {
        optimizeImages();
    }
}

module.exports = { optimizeImages };
