# Resilio Tech Website

A modern, professional website for Resilio Tech - an expert SRE consulting company that transforms infrastructure from fragile to fortress-strong.

## 🚀 Features

- **Modern Design**: Clean, professional B2B tech company aesthetic
- **Responsive**: Mobile-first design that works on all devices
- **Performance Optimized**: Fast loading with SEO optimization
- **Interactive**: Smooth scrolling, animations, and form handling
- **Accessible**: Semantic HTML and proper ARIA labels

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with proper SEO structure
- **CSS3**: Modern CSS with custom properties and flexbox/grid
- **Vanilla JavaScript**: Performance-focused, no external dependencies
- **SVG Graphics**: Scalable vector graphics for crisp visuals

## 📁 Project Structure

```
resiliotech.com/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   └── main.js         # JavaScript functionality
│   └── images/
│       ├── logo.svg        # Company logo
│       ├── hero-illustration.svg
│       ├── about-illustration.svg
│       └── favicon.svg     # Favicon
├── README.md               # This file
└── LICENSE                 # License information
```

## 🎨 Design System

### Colors
- **Primary**: #2563eb (Professional Blue)
- **Secondary**: #1e293b (Dark Gray)
- **Accent**: #06b6d4 (Cyan)
- **Text**: #1e293b (Primary), #64748b (Secondary)
- **Background**: #ffffff, #f8fafc (Light)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Scale**: Responsive typography with CSS custom properties

### Components
- Responsive navigation with mobile menu
- Hero section with call-to-action
- Service cards with hover effects
- Contact form with validation
- Footer with organized links

## 🚀 Getting Started

1. **Clone or download** the repository
2. **Open** `index.html` in a web browser
3. **Deploy** to your preferred hosting platform

### Local Development

For local development with live reload, you can use any static server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Customization

### Updating Content

1. **Company Information**: Edit the content in `index.html`
2. **Styling**: Modify CSS custom properties in `:root` selector
3. **Images**: Replace SVG files in `assets/images/`

### Adding New Sections

1. Add HTML structure in `index.html`
2. Add corresponding styles in `assets/css/styles.css`
3. Update navigation links if needed

### Form Integration

The contact form is set up with client-side validation. To integrate with a backend:

1. Update the `handleFormSubmission()` function in `main.js`
2. Replace the simulation with actual API calls
3. Configure your backend to handle form submissions

## 🎯 SEO Features

- Semantic HTML structure
- Meta tags for social sharing
- Structured data (JSON-LD)
- Optimized images with alt text
- Fast loading performance
- Mobile-friendly design

## 🔒 Security Features

- No external dependencies (security by design)
- Form validation to prevent malicious input
- Proper CORS handling for API calls
- CSP-ready structure

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