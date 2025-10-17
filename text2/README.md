# Text2 - AI-Powered Digital Platform

![Text2 Logo](https://lh3.googleusercontent.com/p/AF1QipMAH2F9BWWLSU14YABENNfSIUDTinGdHOO3wC-S=s1360-w1360-h1020-rw)

## 🌟 Overview

Text2 is a comprehensive AI-powered digital platform that combines chat, design, translation, and various digital tools in a modern, Windows-inspired interface. Built with a focus on user experience and beautiful design, Text2 serves as a central hub for AI-powered applications and social media integration.

## 🚀 Features

### Core Applications
- **Chat AI** - Intelligent conversational AI assistant
- **Img Design** - AI-powered image design and editing tools
- **Translate** - Multi-language translation service
- **Podcast** - Audio content platform
- **Create QR Code** - QR code generation tool
- **Read HTML** - HTML file reader and analyzer
- **Love Match** - Love fortune telling application
- **Text Correction** - Vietnamese and English spelling correction

### Research & Development Apps
- **Magic IMG** - Advanced image manipulation
- **Image Compression** - File size optimization
- **Translation Tools** - Enhanced translation features
- **Document Management** - File handling and processing
- **Read All Files** - Universal file reader
- **Text2 TTS** - Text-to-speech conversion
- **Weather** - Weather information service
- **ADS** - Advertising platform

### Social Media Integration
- **Facebook** - Official page and community groups
- **YouTube** - Multiple channels (Home, Vietnam, Magic, Tech)
- **TikTok** - Vietnam and Magic channels
- **Instagram** - Official account
- **Twitter/X** - Company and CEO accounts
- **Threads** - Social media presence

## 🎨 Design Features

### Modern UI/UX
- **Windows-inspired Interface** - Familiar taskbar and sidebar design
- **Responsive Design** - Optimized for all device sizes
- **Dark Theme** - Eye-friendly dark color scheme
- **Smooth Animations** - Fluid transitions and hover effects
- **PWA Support** - Progressive Web App capabilities

### Interactive Elements
- **Real-time Clock** - Live time display
- **Search Functionality** - AI-powered search with Gemini integration
- **Sidebar Navigation** - Collapsible menu with social media links
- **Notification System** - Popup notifications and settings
- **Install Prompt** - PWA installation support

## 🛠 Technical Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Interactive functionality
- **PWA Features** - Service worker, manifest, offline support

### AI Integration
- **Google Gemini API** - AI-powered search responses
- **Keyword Recognition** - Predefined responses for common queries
- **Multi-language Support** - Vietnamese and English

### Performance
- **Lazy Loading** - Optimized image loading
- **Caching** - Service worker for offline functionality
- **Compression** - Optimized assets and code
- **SEO Optimized** - Meta tags and structured data

## 📱 PWA Features

### Installation
- **Install Prompt** - Native app-like installation
- **Offline Support** - Cached content for offline use
- **Background Sync** - Data synchronization
- **Auto Updates** - Automatic version updates

### Capabilities
- **Push Notifications** - Real-time notifications
- **App-like Experience** - Full-screen mode
- **Home Screen Icon** - Custom app icon
- **Splash Screen** - Loading screen

## 🔧 Configuration

### Environment Variables
```javascript
const GEMINI_API_KEY = 'AIzaSyDhqRnOubyuq9G1DcsajtWXgVrqnxFH0So';
```

### Service Worker
- **Caching Strategy** - Network-first with cache fallback
- **Background Sync** - Offline data synchronization
- **Update Management** - Automatic update detection

## 📁 Project Structure

```
text2/
├── index.html              # Main homepage
├── README.md              # This file
├── manifest.json          # PWA manifest
├── service-worker.js      # Service worker
├── style.css             # External styles (if used)
├── favicon.ico           # Site icon
├── logoc.jpg             # Logo image
├── media/                # Media assets
│   ├── icon/
│   ├── post-img/
│   └── thumnel.png
├── app/                  # Application subdirectories
│   ├── ads/
│   ├── doc/
│   ├── love/
│   ├── podcast/
│   ├── sua-loi-chinh-ta/
│   └── text-corr/
├── nav/                  # Navigation assets
├── post/                 # Blog posts
└── src/                  # Source files
    └── helo.html         # Introduction iframe
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with PWA support
- Internet connection for AI features
- HTTPS environment for PWA features

### Installation
1. Clone or download the repository
2. Open `index.html` in a web browser
3. For PWA features, serve via HTTPS
4. Click "Install" button to add to home screen

### Development
1. Modify `index.html` for content changes
2. Update CSS styles in the `<style>` section
3. Modify JavaScript in the `<script>` sections
4. Test PWA features with local HTTPS server

## 🎯 Key Features Explained

### AI Search Integration
```javascript
// Gemini API integration for intelligent responses
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: formattedMessage }] }]
  })
});
```

### Responsive Design
- **Mobile-first approach** with breakpoints at 768px, 600px, and 480px
- **Flexible grid system** for app icons
- **Touch-friendly** interface elements
- **Optimized typography** for readability

### Social Media Management
- **Dropdown menus** for organized social links
- **Platform-specific icons** and branding
- **External link handling** with proper target attributes
- **Responsive social media sections**

## 🔒 Security Features

- **HTTPS enforcement** for PWA features
- **Content Security Policy** considerations
- **XSS protection** through proper input sanitization
- **Secure API key handling**

## 📊 Analytics & SEO

### Google Analytics
- **GA4 Integration** - Event tracking
- **PWA Installation** tracking
- **User engagement** metrics

### SEO Optimization
- **Meta tags** for social sharing
- **Structured data** (JSON-LD)
- **Canonical URLs**
- **Open Graph** and Twitter Card support

## 🤝 Contributing

### Development Guidelines
1. Maintain the Windows-inspired design theme
2. Ensure responsive design across all devices
3. Test PWA features thoroughly
4. Follow existing code structure and naming conventions
5. Update documentation for new features

### Code Style
- **Consistent indentation** (2 spaces)
- **Semantic HTML** structure
- **Modular CSS** organization
- **ES6+ JavaScript** features

## 📞 Contact & Support

- **CEO**: Hoa Nhat Anh
- **Email**: team@text2.click
- **Website**: https://text2.click
- **Company**: 504 Media

## 📄 License

© 2024 Text2 - All rights reserved

---

**Text2** - We made a difference with AI tools, chat, and digital services.

*Built with ❤️ by the Text2 Team* 
