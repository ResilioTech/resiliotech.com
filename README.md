# Resilio Tech Website 🚀

A modern, high-performance static website for Resilio Tech - showcasing DevOps expertise, cloud solutions, and technical resources.

## 🌟 Features

### Core Functionality
- **Responsive Design** - Optimized for all devices and screen sizes
- **Performance Optimized** - 33% smaller file sizes, minified assets
- **Progressive Web App** - Service worker, offline support, installable
- **SEO Optimized** - Structured data, meta tags, sitemap
- **Contact Form** - Formspree integration with spam protection
- **Resource Hub** - Filterable technical articles and tutorials
- **Project Showcase** - Interactive project gallery
- **Tech Stack Display** - Animated technology icons

### Technical Features
- **Modern CSS** - CSS Grid, Flexbox, Custom Properties
- **Vanilla JavaScript** - No dependencies, optimized performance  
- **Lazy Loading** - Images and content loaded on demand
- **Intersection Observer** - Smooth animations and loading
- **Service Worker** - Offline functionality and caching
- **Minified Assets** - Production-optimized CSS/JS files

## 🚀 Quick Start

### Prerequisites
- Node.js (for build process)
- Web server or hosting platform

### Local Development
```bash
# Clone the repository
git clone https://github.com/shivam-neer-shah/resiliotech.git
cd resiliotech

# Start the development server with 404 support
node server.js
# or (rename package.json.dev to package.json first)
# npm start
```

Visit `http://localhost:8000` to view the website.

### 🎯 Server Features
- ✅ Custom 404.html page handling
- 🔧 Smart .html extension resolution  
- 📂 Directory index.html serving
- 🛡️ Security protection against directory traversal

### Production Build
```bash
# Create optimized production build
chmod +x build-prod.sh
./build-prod.sh

# Deploy contents of build/ directory to your server
```

## 📁 Project Structure

```
resiliotech.com/
├── index.html              # Main homepage
├── thank-you.html          # Contact form success page
├── 404.html               # Custom 404 error page
├── offline.html           # Offline page for PWA
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine directives
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker
├── build-prod.sh          # Production build script
├── optimize.js            # Asset optimization script
├── assets/                # Main site assets
│   ├── css/
│   │   ├── styles.css     # Main stylesheet
│   │   └── styles.min.css # Minified version
│   ├── js/
│   │   ├── main.js        # Main functionality
│   │   ├── main.min.js    # Minified version
│   │   ├── contact-form.js # Contact form handling
│   │   └── contact-form.min.js
│   └── images/            # Logo, favicon, tech icons
├── resources/             # Resource/blog section
│   ├── index.html
│   └── assets/
│       ├── css/
│       └── js/
├── projects/              # Projects showcase
│   ├── index.html
│   └── assets/
│       ├── css/
│       └── js/
└── shared/                # Shared components and assets
    ├── components/        # Reusable HTML components
    ├── css/              # Common styles
    └── js/               # Shared JavaScript modules
```

## ⚙️ Configuration

### Contact Form Setup
1. **Create Formspree Account**: Sign up at [formspree.io](https://formspree.io)
2. **Get Form Endpoint**: Create a new form and copy the endpoint
3. **Update Form Action**: Replace `YOUR_FORM_ID` in `index.html` line 476:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. **Configure Redirect**: Update the success redirect URL:
   ```html
   <input type="hidden" name="_next" value="https://yourdomain.com/thank-you.html">
   ```

### PWA Configuration
Update `manifest.json` with your domain and details:
```json
{
  "name": "Your Company Name",
  "short_name": "YourCo",
  "start_url": "https://yourdomain.com/",
  "scope": "https://yourdomain.com/"
}
```

### Analytics Setup
Add your Google Analytics tracking ID in the HTML files:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 🛠️ Customization

### Colors and Branding
Update CSS custom properties in `assets/css/styles.css`:
```css
:root {
  --primary-color: #6366f1;      /* Your brand primary */
  --primary-light: #818cf8;      /* Lighter variant */
  --accent-color: #f59e0b;       /* Accent color */
  --text-primary: #1f2937;       /* Main text */
  --background: #ffffff;         /* Background */
}
```

### Content Updates
- **Logo**: Replace `assets/images/logo.svg` with your logo
- **Favicon**: Replace `assets/images/favicon.svg` 
- **Tech Stack**: Update tech icons in `assets/images/`
- **Copy**: Update text content in HTML files
- **Projects**: Modify `shared/js/projects-data.js`
- **Resources**: Update `shared/js/resources-data.js`

### Adding New Pages
1. Create HTML file in root or subdirectory
2. Include common components:
   ```html
   <div id="header-placeholder"></div>
   <div id="navigation-placeholder"></div>
   <!-- Your content -->
   <div id="footer-placeholder"></div>
   ```
3. Add loading script:
   ```html
   <script src="./shared/js/component-loader.js"></script>
   ```

## 📈 Performance Features

### Optimizations Applied
- **33% smaller file sizes** through minification
- **Lazy loading** for images and content
- **Service worker caching** for offline access
- **Gzip compression** support
- **Critical CSS inlined** for faster rendering
- **Preloading** of critical resources

### Build Process
The production build automatically:
- Minifies CSS and JavaScript files
- Removes debug code and comments  
- Creates gzipped versions for faster serving
- Updates HTML references to minified assets
- Validates critical files exist

### Performance Monitoring
Track Core Web Vitals:
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms  
- **CLS** (Cumulative Layout Shift) < 0.1

## 🔧 Development

### Code Quality
- **No external dependencies** - Pure vanilla JavaScript
- **Modern CSS** - Grid, Flexbox, custom properties
- **Semantic HTML** - Accessible markup structure
- **Progressive Enhancement** - Works without JavaScript

### Browser Support
- **Modern browsers**: Chrome 80+, Firefox 72+, Safari 13+, Edge 80+
- **Fallbacks provided** for older browsers
- **Mobile optimized** for iOS and Android

### Testing
```bash
# Test locally with 404 support
node server.js

# Test production build
./build-prod.sh
cd build && node ../server.js
```

## 🚀 Deployment

### Static Hosting Platforms

#### Netlify
1. Connect your GitHub repository
2. Set build command: `./build-prod.sh`
3. Set publish directory: `build`
4. Deploy automatically on push

#### Vercel
1. Import your GitHub repository
2. Set build command: `chmod +x build-prod.sh && ./build-prod.sh`
3. Set output directory: `build`
4. Deploy

#### GitHub Pages
1. Push your code to GitHub
2. Go to Settings > Pages
3. Select source branch
4. Your site will be available at `username.github.io/repository`

#### Traditional Web Hosting
1. Run `./build-prod.sh`
2. Upload contents of `build/` directory to your server
3. Configure gzip compression on your server
4. Set up proper cache headers

### Server Configuration

#### Nginx
```nginx
# Gzip compression
gzip on;
gzip_types text/css application/javascript application/json;

# Cache static assets
location ~* \.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### Apache (.htaccess)
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css application/javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

## 🔒 Security

### Implemented Features
- **HTTPS enforcement** via redirects
- **Content Security Policy** headers
- **XSS protection** via proper escaping
- **Spam protection** on contact form
- **No external dependencies** reducing attack surface

### Recommendations
- Enable HTTPS on your hosting platform
- Set up security headers:
  ```
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  ```

## 📊 Analytics & Monitoring

### Google Analytics
Track important events:
- Contact form submissions
- Resource downloads
- Project link clicks
- Search queries

### Performance Monitoring
Use tools like:
- **Google PageSpeed Insights**
- **GTmetrix**
- **WebPageTest**
- **Lighthouse** (built into Chrome)

## 🐛 Troubleshooting

### Common Issues

**Contact form not working:**
- Check Formspree endpoint URL
- Verify form method is POST
- Check browser console for errors

**Images not loading:**
- Verify image paths are correct
- Check file extensions match
- Ensure images exist in assets/images/

**JavaScript errors:**
- Check browser console
- Verify all script files are loaded
- Check for typos in file names

**Styles not applying:**
- Clear browser cache
- Check CSS file paths
- Verify minified files exist after build

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test locally: `node server.js`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## � Support

For questions or support:
- **Website**: [resiliotech.com](https://resiliotech.com)
- **Email**: contact@resiliotech.com
- **GitHub Issues**: [Create an issue](https://github.com/shivam-neer-shah/resiliotech/issues)

## 🎯 Roadmap

### Future Enhancements
- [ ] Blog/CMS integration
- [ ] Advanced search functionality
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced analytics dashboard
- [ ] API integrations
- [ ] E-commerce capabilities

---

**Built with ❤️ by Resilio Tech** | **Made in 2024** | **Optimized for Performance**

## 📈 Performance Features

- Minimal CSS and JavaScript
- Optimized images (SVG format)
- Lazy loading for images
- Throttled scroll events
- Preloading of critical resources

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is a custom website for Resilio Tech. For suggestions or improvements:

1. Create an issue describing the enhancement
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## 📞 Contact

- **Website**: [resiliotech.com](https://resiliotech.com)
- **Email**: contact@resiliotech.com
- **Blog**: [blogs.resiliotech.com](https://blogs.resiliotech.com)

---

**Built with ❤️ for bulletproof infrastructure and zero-downtime dreams.**