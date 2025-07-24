#!/usr/bin/env node

/**
 * Simple HTTP Server with Custom 404 Support
 * Serves static files and redirects to 404.html for missing pages
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.xml': 'application/xml'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

function serveFile(res, filePath, statusCode = 200) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', filePath, err);
            serve404(res);
            return;
        }
        
        const mimeType = getMimeType(filePath);
        res.writeHead(statusCode, {
            'Content-Type': mimeType,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}

function serve404(res) {
    const notFoundPath = path.join(__dirname, '404.html');
    
    fs.readFile(notFoundPath, (err, data) => {
        if (err) {
            // Fallback if 404.html doesn't exist
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>404 - Not Found</title></head>
                <body>
                    <h1>404 - Page Not Found</h1>
                    <p>The requested page could not be found.</p>
                    <a href="/">Go Home</a>
                </body>
                </html>
            `);
            return;
        }
        
        res.writeHead(404, { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // Remove query string and clean up path
    pathname = decodeURIComponent(pathname);
    
    // Security: prevent directory traversal
    if (pathname.includes('..')) {
        serve404(res);
        return;
    }
    
    // Default to index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // If path doesn't have extension, try adding .html
    if (!path.extname(pathname)) {
        // First try with .html extension
        const htmlPath = path.join(__dirname, pathname + '.html');
        if (fs.existsSync(htmlPath)) {
            serveFile(res, htmlPath);
            return;
        }
        
        // Then try as directory with index.html
        const indexPath = path.join(__dirname, pathname, 'index.html');
        if (fs.existsSync(indexPath)) {
            serveFile(res, indexPath);
            return;
        }
    }
    
    const filePath = path.join(__dirname, pathname);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`404: ${pathname} not found`);
            serve404(res);
            return;
        }
        
        // Check if it's a directory
        fs.stat(filePath, (err, stats) => {
            if (err) {
                serve404(res);
                return;
            }
            
            if (stats.isDirectory()) {
                // Try to serve index.html from the directory
                const indexPath = path.join(filePath, 'index.html');
                fs.access(indexPath, fs.constants.F_OK, (err) => {
                    if (err) {
                        serve404(res);
                    } else {
                        serveFile(res, indexPath);
                    }
                });
            } else {
                // Serve the file
                serveFile(res, filePath);
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🔍 Custom 404 page: 404.html`);
    console.log('');
    console.log('✨ Features:');
    console.log('   • Custom 404.html page for missing routes');
    console.log('   • Automatic .html extension resolution');
    console.log('   • Directory index.html serving');
    console.log('   • Security protection against directory traversal');
    console.log('');
    console.log('🧪 Test your 404 page:');
    console.log(`   http://localhost:${PORT}/test`);
    console.log(`   http://localhost:${PORT}/nonexistent`);
    console.log(`   http://localhost:${PORT}/anything/missing`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
