#!/usr/bin/env node

/**
 * Asset Optimization Script
 * Minifies CSS, JS, and optimizes images for production
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

class AssetOptimizer {
    constructor(options = {}) {
        this.distDir = options.distDir || './dist';
        this.stats = {
            css: { original: 0, optimized: 0, savings: 0 },
            js: { original: 0, optimized: 0, savings: 0 },
            images: { original: 0, optimized: 0, savings: 0 }
        };
    }

    /**
     * Optimize CSS files
     */
    async optimizeCSS() {
        const glob = require('glob');
        const postcss = require('postcss');
        const autoprefixer = require('autoprefixer');
        const cssnano = require('cssnano');
        
        const cssFiles = glob.sync(path.join(this.distDir, '**/*.css'), {
            ignore: ['**/node_modules/**']
        });
        
        console.log(`\n📄 Optimizing ${cssFiles.length} CSS files...`);
        
        const processor = postcss([
            autoprefixer(),
            cssnano({
                preset: ['default', {
                    discardComments: { removeAll: true },
                    normalizeWhitespace: true,
                    mergeLonghand: true,
                    mergeRules: true
                }]
            })
        ]);
        
        for (const cssFile of cssFiles) {
            try {
                const originalContent = fs.readFileSync(cssFile, 'utf8');
                const originalSize = Buffer.byteLength(originalContent, 'utf8');
                
                const result = await processor.process(originalContent, {
                    from: cssFile,
                    to: cssFile
                });
                
                const optimizedSize = Buffer.byteLength(result.css, 'utf8');
                const savings = originalSize - optimizedSize;
                
                fs.writeFileSync(cssFile, result.css);
                
                this.stats.css.original += originalSize;
                this.stats.css.optimized += optimizedSize;
                this.stats.css.savings += savings;
                
                console.log(`  ✓ ${path.relative(this.distDir, cssFile)} - ${this.formatBytes(savings)} saved`);
                
            } catch (error) {
                console.error(`  ❌ Error optimizing ${cssFile}:`, error.message);
            }
        }
    }

    /**
     * Optimize JavaScript files
     */
    async optimizeJS() {
        const glob = require('glob');
        const { minify } = require('terser');
        
        const jsFiles = glob.sync(path.join(this.distDir, '**/*.js'), {
            ignore: ['**/node_modules/**', '**/*.min.js']
        });
        
        console.log(`\n⚡ Optimizing ${jsFiles.length} JavaScript files...`);
        
        for (const jsFile of jsFiles) {
            try {
                const originalContent = fs.readFileSync(jsFile, 'utf8');
                const originalSize = Buffer.byteLength(originalContent, 'utf8');
                
                const result = await minify(originalContent, {
                    compress: {
                        drop_console: process.env.NODE_ENV === 'production',
                        drop_debugger: true,
                        pure_funcs: ['console.log', 'console.info'],
                        passes: 2
                    },
                    mangle: {
                        toplevel: true,
                        safari10: true
                    },
                    format: {
                        comments: false
                    },
                    sourceMap: false
                });
                
                if (result.error) {
                    throw result.error;
                }
                
                const optimizedSize = Buffer.byteLength(result.code, 'utf8');
                const savings = originalSize - optimizedSize;
                
                fs.writeFileSync(jsFile, result.code);
                
                this.stats.js.original += originalSize;
                this.stats.js.optimized += optimizedSize;
                this.stats.js.savings += savings;
                
                console.log(`  ✓ ${path.relative(this.distDir, jsFile)} - ${this.formatBytes(savings)} saved`);
                
            } catch (error) {
                console.error(`  ❌ Error optimizing ${jsFile}:`, error.message);
            }
        }
    }

    /**
     * Optimize images
     */
    async optimizeImages() {
        const glob = require('glob');
        const imagemin = require('imagemin');
        const imageminWebp = require('imagemin-webp');
        const imageminAvif = require('imagemin-avif');
        
        const imageFiles = glob.sync(path.join(this.distDir, '**/*.{jpg,jpeg,png}'), {
            ignore: ['**/node_modules/**']
        });
        
        console.log(`\n🖼️  Optimizing ${imageFiles.length} images...`);
        
        for (const imageFile of imageFiles) {
            try {
                const originalStats = fs.statSync(imageFile);
                const originalSize = originalStats.size;
                
                // Generate WebP version
                const webpBuffer = await imagemin.buffer(fs.readFileSync(imageFile), {
                    plugins: [
                        imageminWebp({ quality: 85 })
                    ]
                });
                
                const webpFile = imageFile.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                fs.writeFileSync(webpFile, webpBuffer);
                
                // Generate AVIF version (if available)
                try {
                    const avifBuffer = await imagemin.buffer(fs.readFileSync(imageFile), {
                        plugins: [
                            imageminAvif({ quality: 80 })
                        ]
                    });
                    
                    const avifFile = imageFile.replace(/\.(jpg|jpeg|png)$/i, '.avif');
                    fs.writeFileSync(avifFile, avifBuffer);
                    
                    console.log(`  ✓ ${path.relative(this.distDir, imageFile)} - WebP: ${this.formatBytes(webpBuffer.length)}, AVIF: ${this.formatBytes(avifBuffer.length)}`);
                } catch (avifError) {
                    console.log(`  ✓ ${path.relative(this.distDir, imageFile)} - WebP: ${this.formatBytes(webpBuffer.length)}`);
                }
                
                this.stats.images.original += originalSize;
                this.stats.images.optimized += webpBuffer.length;
                this.stats.images.savings += (originalSize - webpBuffer.length);
                
            } catch (error) {
                console.error(`  ❌ Error optimizing ${imageFile}:`, error.message);
            }
        }
    }

    /**
     * Generate critical CSS
     */
    async generateCriticalCSS() {
        console.log('\n🎯 Generating critical CSS...');
        
        try {
            const critical = require('critical');
            const glob = require('glob');
            
            const htmlFiles = glob.sync(path.join(this.distDir, '*.html'));
            
            for (const htmlFile of htmlFiles) {
                const fileName = path.basename(htmlFile, '.html');
                
                await critical.generate({
                    inline: true,
                    base: this.distDir,
                    src: path.relative(this.distDir, htmlFile),
                    dest: htmlFile,
                    width: 1300,
                    height: 900,
                    penthouse: {
                        blockJSRequests: false,
                    },
                    ignore: {
                        atrule: ['@font-face'],
                    }
                });
                
                console.log(`  ✓ Critical CSS inlined: ${fileName}.html`);
            }
        } catch (error) {
            console.warn('  ⚠️  Critical CSS generation skipped:', error.message);
        }
    }

    /**
     * Create performance budget report
     */
    generatePerformanceBudget() {
        const budgets = {
            'index.html': { js: 150000, css: 50000, images: 500000 }, // bytes
            'consulting/index.html': { js: 100000, css: 40000, images: 300000 },
            'projects/index.html': { js: 120000, css: 45000, images: 400000 }
        };
        
        console.log('\n📊 Performance Budget Analysis...');
        
        const glob = require('glob');
        
        Object.entries(budgets).forEach(([page, budget]) => {
            const pagePath = path.join(this.distDir, page);
            
            if (fs.existsSync(pagePath)) {
                const content = fs.readFileSync(pagePath, 'utf8');
                
                // Calculate actual sizes
                const jsSizes = this.calculateAssetSizes(content, /src="([^"]*\.js[^"]*)"/g);
                const cssSizes = this.calculateAssetSizes(content, /href="([^"]*\.css[^"]*)"/g);
                const imgSizes = this.calculateAssetSizes(content, /src="([^"]*\.(jpg|jpeg|png|webp|avif)[^"]*)"/g);
                
                console.log(`\n  📄 ${page}:`);
                console.log(`    JS: ${this.formatBytes(jsSizes)} / ${this.formatBytes(budget.js)} ${jsSizes > budget.js ? '❌' : '✅'}`);
                console.log(`    CSS: ${this.formatBytes(cssSizes)} / ${this.formatBytes(budget.css)} ${cssSizes > budget.css ? '❌' : '✅'}`);
                console.log(`    Images: ${this.formatBytes(imgSizes)} / ${this.formatBytes(budget.images)} ${imgSizes > budget.images ? '❌' : '✅'}`);
            }
        });
    }

    /**
     * Calculate total size of assets referenced in HTML
     */
    calculateAssetSizes(htmlContent, regex) {
        let totalSize = 0;
        let match;
        
        while ((match = regex.exec(htmlContent)) !== null) {
            const assetPath = path.join(this.distDir, match[1]);
            if (fs.existsSync(assetPath)) {
                totalSize += fs.statSync(assetPath).size;
            }
        }
        
        return totalSize;
    }

    /**
     * Format bytes to human readable
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    /**
     * Print optimization summary
     */
    printSummary() {
        console.log('\n📈 Optimization Summary:');
        console.log('─'.repeat(50));
        
        ['css', 'js', 'images'].forEach(type => {
            const stat = this.stats[type];
            if (stat.original > 0) {
                const percentage = ((stat.savings / stat.original) * 100).toFixed(1);
                console.log(`${type.toUpperCase().padEnd(8)} ${this.formatBytes(stat.original).padEnd(8)} → ${this.formatBytes(stat.optimized).padEnd(8)} (${percentage}% saved)`);
            }
        });
        
        const totalOriginal = Object.values(this.stats).reduce((sum, stat) => sum + stat.original, 0);
        const totalSavings = Object.values(this.stats).reduce((sum, stat) => sum + stat.savings, 0);
        const totalPercentage = totalOriginal > 0 ? ((totalSavings / totalOriginal) * 100).toFixed(1) : '0';
        
        console.log('─'.repeat(50));
        console.log(`TOTAL    ${this.formatBytes(totalOriginal).padEnd(8)} → ${this.formatBytes(totalOriginal - totalSavings).padEnd(8)} (${totalPercentage}% saved)`);
    }

    /**
     * Main optimization process
     */
    async run() {
        console.log('🚀 Starting asset optimization...');
        
        try {
            await this.optimizeCSS();
            await this.optimizeJS();
            await this.optimizeImages();
            await this.generateCriticalCSS();
            
            this.generatePerformanceBudget();
            this.printSummary();
            
            console.log('\n✅ Asset optimization complete!');
            
        } catch (error) {
            console.error('❌ Optimization failed:', error);
            process.exit(1);
        }
    }
}

// CLI execution
if (require.main === module) {
    const optimizer = new AssetOptimizer({
        distDir: process.argv[2] || './dist'
    });
    
    optimizer.run();
}

module.exports = AssetOptimizer;
