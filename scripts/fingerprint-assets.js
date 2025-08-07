#!/usr/bin/env node

/**
 * Asset Fingerprinting Script
 * Generates hash-based filenames for long-term caching
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AssetFingerprinter {
    constructor(options = {}) {
        this.distDir = options.distDir || './dist';
        this.manifestPath = options.manifestPath || path.join(this.distDir, 'assets-manifest.json');
        this.assetPatterns = options.assetPatterns || [
            '**/*.css',
            '**/*.js',
            '**/*.jpg',
            '**/*.jpeg',
            '**/*.png',
            '**/*.webp',
            '**/*.avif',
            '**/*.svg',
            '**/*.woff',
            '**/*.woff2'
        ];
        this.manifest = {};
    }

    /**
     * Generate hash for file content
     */
    generateHash(filePath) {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    }

    /**
     * Fingerprint a single file
     */
    fingerprintFile(filePath) {
        const relativePath = path.relative(this.distDir, filePath);
        const ext = path.extname(filePath);
        const basename = path.basename(filePath, ext);
        const dirname = path.dirname(filePath);
        
        const hash = this.generateHash(filePath);
        const fingerprintedName = `${basename}.${hash}${ext}`;
        const fingerprintedPath = path.join(dirname, fingerprintedName);
        
        // Copy file with fingerprinted name
        fs.copyFileSync(filePath, fingerprintedPath);
        
        // Update manifest
        const relativeOriginal = '/' + relativePath.replace(/\\/g, '/');
        const relativeFingerprinted = '/' + path.relative(this.distDir, fingerprintedPath).replace(/\\/g, '/');
        
        this.manifest[relativeOriginal] = relativeFingerprinted;
        
        console.log(`✓ Fingerprinted: ${relativeOriginal} → ${relativeFingerprinted}`);
        
        return fingerprintedPath;
    }

    /**
     * Find all asset files matching patterns
     */
    findAssetFiles() {
        const glob = require('glob');
        const files = [];
        
        this.assetPatterns.forEach(pattern => {
            const matches = glob.sync(path.join(this.distDir, pattern), {
                ignore: [
                    '**/node_modules/**',
                    '**/*.map',
                    '**/assets-manifest.json'
                ]
            });
            files.push(...matches);
        });
        
        return [...new Set(files)]; // Remove duplicates
    }

    /**
     * Update HTML files to reference fingerprinted assets
     */
    updateHTMLReferences() {
        const glob = require('glob');
        const htmlFiles = glob.sync(path.join(this.distDir, '**/*.html'));
        
        htmlFiles.forEach(htmlFile => {
            let content = fs.readFileSync(htmlFile, 'utf8');
            let updated = false;
            
            Object.entries(this.manifest).forEach(([original, fingerprinted]) => {
                const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                if (content.includes(original)) {
                    content = content.replace(regex, fingerprinted);
                    updated = true;
                }
            });
            
            if (updated) {
                fs.writeFileSync(htmlFile, content);
                console.log(`✓ Updated references in: ${path.relative(this.distDir, htmlFile)}`);
            }
        });
    }

    /**
     * Update CSS files to reference fingerprinted assets
     */
    updateCSSReferences() {
        const glob = require('glob');
        const cssFiles = glob.sync(path.join(this.distDir, '**/*.css'));
        
        cssFiles.forEach(cssFile => {
            let content = fs.readFileSync(cssFile, 'utf8');
            let updated = false;
            
            Object.entries(this.manifest).forEach(([original, fingerprinted]) => {
                // Update url() references
                const urlRegex = new RegExp(`url\\(['"]?${original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]?\\)`, 'g');
                if (content.match(urlRegex)) {
                    content = content.replace(urlRegex, `url('${fingerprinted}')`);
                    updated = true;
                }
            });
            
            if (updated) {
                fs.writeFileSync(cssFile, content);
                console.log(`✓ Updated CSS references in: ${path.relative(this.distDir, cssFile)}`);
            }
        });
    }

    /**
     * Generate cache headers configuration
     */
    generateCacheHeaders() {
        let headers = `# Asset Fingerprinting Cache Headers
# Generated on ${new Date().toISOString()}

# Fingerprinted assets - 1 year cache
`;
        
        Object.values(this.manifest).forEach(fingerprintedPath => {
            headers += `${fingerprintedPath}
  Cache-Control: public, max-age=31536000, immutable

`;
        });
        
        headers += `# HTML files - no cache
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# Service worker - no cache
/sw.js
  Cache-Control: public, max-age=0, must-revalidate

# API routes - no cache
/api/*
  Cache-Control: private, no-cache, no-store, must-revalidate
`;
        
        const headersPath = path.join(this.distDir, '_headers-fingerprinted');
        fs.writeFileSync(headersPath, headers);
        console.log(`✓ Generated cache headers: ${headersPath}`);
    }

    /**
     * Save manifest file
     */
    saveManifest() {
        const manifestContent = JSON.stringify(this.manifest, null, 2);
        fs.writeFileSync(this.manifestPath, manifestContent);
        console.log(`✓ Saved asset manifest: ${this.manifestPath}`);
    }

    /**
     * Main fingerprinting process
     */
    async run() {
        console.log('🚀 Starting asset fingerprinting...\n');
        
        try {
            // Find all asset files
            const assetFiles = this.findAssetFiles();
            console.log(`Found ${assetFiles.length} asset files to fingerprint\n`);
            
            // Fingerprint each file
            const fingerprintedFiles = assetFiles.map(file => this.fingerprintFile(file));
            
            console.log('\n📝 Updating file references...');
            
            // Update HTML references
            this.updateHTMLReferences();
            
            // Update CSS references
            this.updateCSSReferences();
            
            console.log('\n💾 Finalizing...');
            
            // Save manifest
            this.saveManifest();
            
            // Generate cache headers
            this.generateCacheHeaders();
            
            console.log(`\n✅ Asset fingerprinting complete!`);
            console.log(`   - Fingerprinted: ${assetFiles.length} files`);
            console.log(`   - Manifest saved: ${this.manifestPath}`);
            console.log(`   - Cache headers: ${path.join(this.distDir, '_headers-fingerprinted')}`);
            
        } catch (error) {
            console.error('❌ Fingerprinting failed:', error);
            process.exit(1);
        }
    }
}

// CLI execution
if (require.main === module) {
    const fingerprinter = new AssetFingerprinter({
        distDir: process.argv[2] || './dist'
    });
    
    fingerprinter.run();
}

module.exports = AssetFingerprinter;
