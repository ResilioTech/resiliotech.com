#!/bin/bash

# Production Build Script for resiliotech.com
# Optimizes website for production deployment with minification and compression

set -e  # Exit on any error

echo "🚀 Building resiliotech.com for production..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the correct directory
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Error: Please run this script from the website root directory${NC}"
    exit 1
fi

# Check if Node.js is available for optimization
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Skipping JS/CSS optimization.${NC}"
    OPTIMIZE=false
else
    OPTIMIZE=true
fi

# Create build directory
echo -e "${BLUE}📁 Creating build directory...${NC}"
mkdir -p build
rm -rf build/*

# Copy all files to build directory (exclude build dir itself and git files)
echo -e "${BLUE}📋 Copying files...${NC}"
find . -maxdepth 1 -type f -not -name ".*" -not -name "build.sh" -exec cp {} build/ \;
find . -maxdepth 1 -type d -not -name "." -not -name ".git" -not -name "build" -exec cp -r {} build/ \;

cd build

# Remove development and documentation files
echo -e "${BLUE}🧹 Cleaning up build directory...${NC}"
rm -f README.md DEPLOYMENT.md OPTIMIZATION.md CONTACT_SETUP.md NETLIFY_FORMS_SETUP.md
rm -f optimize.js
rm -f .gitignore .DS_Store
find . -name ".DS_Store" -delete 2>/dev/null || true

# Optimize CSS and JS if Node.js is available
if [ "$OPTIMIZE" = true ]; then
    echo -e "${BLUE}⚡ Running CSS/JS optimization...${NC}"
    if [ -f "../optimize.js" ]; then
        node ../optimize.js
        
        # Replace references with minified versions in HTML
        echo -e "${BLUE}🔄 Updating references to minified files...${NC}"
        find . -name "*.html" -type f -exec sed -i '' \
            -e 's/assets\/css\/styles\.css/assets\/css\/styles.min.css/g' \
            -e 's/shared\/css\/common\.css/shared\/css\/common.min.css/g' \
            -e 's/resources\/assets\/css\/resources\.css/resources\/assets\/css\/resources.min.css/g' \
            -e 's/projects\/assets\/css\/projects\.css/projects\/assets\/css\/projects.min.css/g' \
            -e 's/assets\/js\/main\.js/assets\/js\/main.min.js/g' \
            -e 's/shared\/js\/common\.js/shared\/js\/common.min.js/g' \
            -e 's/shared\/js\/utils\.js/shared\/js\/utils.min.js/g' \
            -e 's/resources\/assets\/js\/resources\.js/resources\/assets\/js\/resources.min.js/g' \
            -e 's/projects\/assets\/js\/projects\.js/projects\/assets\/js\/projects.min.js/g' \
            -e 's/assets\/js\/contact-form\.js/assets\/js\/contact-form.min.js/g' {} \;
        
        # Remove non-minified versions to save space
        find . -name "*.css" -not -name "*.min.css" -delete
        find . -name "*.js" -not -name "*.min.js" -not -name "sw.js" -delete
    else
        echo -e "${YELLOW}⚠️  optimize.js not found. Skipping minification.${NC}"
    fi
fi

# Optimize HTML files (remove comments and extra whitespace)
echo -e "${BLUE}🎯 Optimizing HTML files...${NC}"
find . -name "*.html" -type f -exec sed -i '' \
    -e 's/<!--[^[]*-->//g' \
    -e 's/<!--\[if[^]]*\]>[^<]*<!\[endif\]-->//g' \
    -e '/^[[:space:]]*$/d' {} \;

# Optimize service worker (remove comments and compress)
if [ -f "sw.js" ]; then
    echo -e "${BLUE}🔧 Optimizing service worker...${NC}"
    sed -i '' \
        -e 's/\/\/.*$//g' \
        -e 's/\/\*.*\*\///g' \
        -e '/^[[:space:]]*$/d' sw.js
fi

# Create gzipped versions for faster serving
echo -e "${BLUE}📦 Creating compressed versions...${NC}"
find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" -o -name "*.xml" \) \
    -exec gzip -9 -k {} \;

# Generate build report
echo -e "${GREEN}📊 Build Report:${NC}"
ORIGINAL_SIZE=$(du -sh ../. --exclude=build --exclude=.git 2>/dev/null | cut -f1 || echo "N/A")
BUILD_SIZE=$(du -sh . | cut -f1)
echo -e "   Original size: ${ORIGINAL_SIZE}"
echo -e "   Build size: ${BUILD_SIZE}"

# Count optimized files
CSS_COUNT=$(find . -name "*.min.css" | wc -l)
JS_COUNT=$(find . -name "*.min.js" | wc -l)
GZIP_COUNT=$(find . -name "*.gz" | wc -l)

echo -e "${GREEN}🎯 Optimization Summary:${NC}"
echo -e "   ✅ CSS files minified: ${CSS_COUNT}"
echo -e "   ✅ JS files minified: ${JS_COUNT}"
echo -e "   ✅ Files compressed: ${GZIP_COUNT}"

# Validate critical files exist
echo -e "${BLUE}🔍 Validating build...${NC}"
CRITICAL_FILES=(
    "index.html"
    "sitemap.xml"
    "robots.txt"
    "manifest.json"
    "sw.js"
)

VALIDATION_FAILED=false
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Critical file missing: $file${NC}"
        VALIDATION_FAILED=true
    else
        echo -e "${GREEN}✅ $file${NC}"
    fi
done

if [ "$VALIDATION_FAILED" = true ]; then
    echo -e "${RED}❌ Build validation failed!${NC}"
    exit 1
fi

cd ..

echo -e "${GREEN}✅ Production build complete!${NC}"
echo -e "${BLUE}📁 Optimized files are ready in the build/ directory${NC}"
echo -e "${YELLOW}💡 Upload the contents of build/ directory to your web server${NC}"
