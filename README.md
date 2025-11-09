# Invoice & Quote Manager 📱

A professional Progressive Web App (PWA) for managing invoices, quotes, and customer statements with SARS-compliant tax invoice generation.

## ✨ Features

- 📄 **Invoice & Quote Management** - Create, edit, and manage invoices and quotes
- 👥 **Customer Management** - Track customers with auto-incrementing customer numbers
- 📊 **Reports** - Sales reports and VAT reports with date filtering
- 💼 **Customer Statements** - Generate detailed statements with aging reports
- 🎨 **Brand Customization** - Customize primary and secondary colors
- 📱 **PWA-Enabled** - Install on mobile and desktop, works offline
- 🏪 **Play Store Ready** - Can be packaged for Google Play Store
- 🇿🇦 **SARS Compliant** - Generates valid tax invoices for South Africa
- 💾 **Local Storage** - All data stored locally on your device
- 📤 **Multiple Sharing Options** - Email, copy, download, and native share

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 PWA Installation

The app can be installed on any device:

### Desktop (Chrome, Edge)
1. Open the app in your browser
2. Look for the install icon (⊕) in the address bar
3. Click "Install" to add to your desktop

### Mobile (Android, iOS)
1. Open the app in Chrome/Safari
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"
4. App icon will appear on your home screen

**See `PWA_SETUP.md` for detailed installation and testing instructions.**

## 🏪 Google Play Store Deployment

This PWA can be packaged as an Android app for the Play Store using Trusted Web Activity (TWA).

**See `PLAYSTORE_GUIDE.md` for step-by-step deployment instructions.**

Quick overview:
1. Deploy PWA to production (HTTPS required)
2. Install Bubblewrap CLI: `npm install -g @bubblewrap/cli`
3. Generate Android package: `bubblewrap init --manifest https://yourdomain.com/manifest.json`
4. Build APK: `bubblewrap build`
5. Sign and upload to Google Play Console

## 🎨 Before Deploying

1. **Create App Icons** - Replace placeholder icons with your logo
   - Use [PWABuilder](https://www.pwabuilder.com/imageGenerator) or [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Generate icons in sizes: 72, 96, 128, 144, 152, 192, 384, 512 pixels
   - Place PNG files in `public/` folder

2. **Update Manifest** - Edit `public/manifest.json`
   - Update app name and description
   - Adjust theme colors to match your brand
   - Add actual icon file paths

3. **Deploy to HTTPS** - Choose a hosting provider:
   - **Vercel** (recommended): `npm i -g vercel && vercel`
   - **Netlify**: Drag & drop `dist` folder
   - **Firebase**: `npm i -g firebase-tools && firebase deploy`
   - **GitHub Pages**: Enable in repository settings

## 📦 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **jsPDF** - PDF generation
- **Lucide React** - Icons
- **Service Workers** - PWA offline support

## 📋 Features in Detail

### Invoices & Quotes
- Auto-incrementing document numbers (INV-001, QUO-001)
- Line item management with quantity, rate, and amount
- Automatic VAT calculation (15%)
- Status tracking (draft, sent, paid, overdue)
- Due date management
- SARS-compliant tax invoice format

### Customers
- Auto-incrementing customer numbers (CUS-001)
- Company and individual details
- VAT and registration numbers
- Contact information
- Full CRUD operations

### Customer Statements
- Date range filtering
- Unpaid invoices only option
- Aging report (Current, 1-30, 31-60, 61-90, 90+ days)
- Multiple sharing options

### Reports
- Sales Report: Revenue summary, top customers, monthly breakdown
- VAT Report: VAT collected, paid vs pending, monthly VAT

### Business Settings
- Company branding (logo upload)
- Contact information
- Banking details (for invoices)
- VAT and registration numbers
- Brand color customization

### PDF Export
- Professional PDF generation
- Company branding on all documents
- Banking details on invoices
- Multiple sharing methods (Email, Copy, Download, Share)

## 🔒 Data Storage

All data is stored locally using browser localStorage. No data is sent to any server.

## 📄 License

This project is private and proprietary.

## 🙋 Support

For issues or questions, see the documentation files:
- `PWA_SETUP.md` - PWA installation and testing
- `PLAYSTORE_GUIDE.md` - Google Play Store deployment
- `DEPLOYMENT.md` - Deployment commands and hosting options
- `GITHUB_PAGES.md` - GitHub Pages deployment guide
- `PROJECT_SETUP_COMPLETE.md` - Development setup details

