#!/usr/bin/env node

/**
 * CSS and JS Optimization Script
 * Minifies CSS and JavaScript files for production
 */

const fs = require('fs');
const path = require('path');

// Simple CSS minifier
function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove excess whitespace
        .replace(/\s+/g, ' ')
        // Remove whitespace around colons and semicolons
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        // Remove whitespace around braces
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        // Remove whitespace around commas
        .replace(/\s*,\s*/g, ',')
        // Remove trailing semicolons before closing braces
        .replace(/;}/g, '}')
        // Remove leading/trailing whitespace
        .trim();
}

// Simple JS minifier (basic)
function minifyJS(js) {
    return js
        // Remove single-line comments (but preserve URLs)
        .replace(/(?<!:)\/\/.*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove excess whitespace
        .replace(/\s+/g, ' ')
        // Remove whitespace around operators
        .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
        // Trim
        .trim();
}

function optimizeFile(filePath, type) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const originalSize = content.length;
        
        let optimizedContent;
        if (type === 'css') {
            optimizedContent = minifyCSS(content);
        } else if (type === 'js') {
            optimizedContent = minifyJS(content);
        } else {
            console.log(`⚠️  Unsupported file type: ${type}`);
            return;
        }
        
        const optimizedSize = optimizedContent.length;
        const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        
        // Create minified version
        const ext = path.extname(filePath);
        const minPath = filePath.replace(ext, `.min${ext}`);
        fs.writeFileSync(minPath, optimizedContent);
        
        console.log(`✅ ${path.basename(filePath)}: ${originalSize} → ${optimizedSize} bytes (${savings}% smaller)`);
        console.log(`   Minified version: ${path.basename(minPath)}`);
        
    } catch (error) {
        console.error(`❌ Error optimizing ${filePath}:`, error.message);
    }
}

// Files to optimize
const files = [
    // CSS files
    { path: './assets/css/styles.css', type: 'css' },
    { path: './shared/css/common.css', type: 'css' },
    { path: './resources/assets/css/resources.css', type: 'css' },
    { path: './projects/assets/css/projects.css', type: 'css' },
    
    // JavaScript files
    { path: './assets/js/main.js', type: 'js' },
    { path: './shared/js/common.js', type: 'js' },
    { path: './shared/js/utils.js', type: 'js' },
    { path: './resources/assets/js/resources.js', type: 'js' },
    { path: './projects/assets/js/projects.js', type: 'js' },
    { path: './assets/js/contact-form.js', type: 'js' }
];

console.log('🚀 Starting optimization process...\n');

let totalOriginal = 0;
let totalOptimized = 0;

files.forEach(file => {
    const fullPath = path.resolve(file.path);
    if (fs.existsSync(fullPath)) {
        const originalSize = fs.readFileSync(fullPath, 'utf8').length;
        optimizeFile(fullPath, file.type);
        
        const minExt = path.extname(fullPath);
        const minPath = fullPath.replace(minExt, `.min${minExt}`);
        if (fs.existsSync(minPath)) {
            const optimizedSize = fs.readFileSync(minPath, 'utf8').length;
            totalOriginal += originalSize;
            totalOptimized += optimizedSize;
        }
    } else {
        console.log(`⚠️  File not found: ${file.path}`);
    }
    console.log('');
});

const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
console.log(`📊 Total optimization results:`);
console.log(`   Original: ${totalOriginal} bytes`);
console.log(`   Optimized: ${totalOptimized} bytes`);
console.log(`   Total savings: ${totalSavings}%`);
console.log(`\n✨ Optimization complete!`);
