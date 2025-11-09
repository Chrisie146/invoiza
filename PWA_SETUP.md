# PWA Installation & Setup Guide

## Your app is now PWA-enabled! 🎉

### What's Been Added:

1. **Service Worker** (`public/sw.js`) - Enables offline functionality and caching
2. **Web Manifest** (`public/manifest.json`) - Defines app metadata and icons
3. **PWA Registration** - Auto-registers service worker on load
4. **Meta Tags** - Added PWA-specific meta tags to index.html

### How Users Can Install:

#### On Mobile (Android/iOS):
1. Open the app in Chrome/Safari
2. Look for "Add to Home Screen" prompt
3. Or tap browser menu > "Install app" or "Add to Home Screen"
4. App icon will appear on home screen like a native app

#### On Desktop (Chrome/Edge):
1. Open the app in Chrome or Edge
2. Look for install icon (⊕) in address bar
3. Click "Install Invoice & Quote Manager"
4. App will open in its own window

### Testing PWA Locally:

```powershell
npm run build
npm run preview
```

Then open http://localhost:4173 in your browser.

### PWA Features:

✅ **Installable** - Add to home screen on mobile/desktop  
✅ **Offline-capable** - Service worker caches assets  
✅ **Standalone mode** - Runs in its own window  
✅ **Fast loading** - Cached resources load instantly  
✅ **Responsive** - Works on all screen sizes  

### Before Deploying to Production:

#### 1. Create App Icons
You need to create actual PNG icons. Use one of these tools:

- **PWABuilder Image Generator**: https://www.pwabuilder.com/imageGenerator
- **RealFaviconGenerator**: https://realfavicongenerator.net/

Upload a 512x512 PNG of your app logo, and it will generate all required sizes.

Required sizes:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

Place the generated icons in the `public/` folder.

#### 2. Update Manifest
Edit `public/manifest.json`:
- Update `name` and `short_name` if needed
- Update `theme_color` to match your brand color
- Add actual icon paths (replace placeholders)

#### 3. Deploy to HTTPS
PWAs require HTTPS. Deploy to:
- **Vercel** (recommended): `npm install -g vercel && vercel`
- **Netlify**: Drag & drop the `dist` folder
- **Firebase Hosting**: `npm install -g firebase-tools`
- **GitHub Pages**: Enable in repository settings

#### 4. Test PWA Score
After deploying, test your PWA:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Click "Generate report"

Aim for a score of 90+ before publishing.

### Publishing to Google Play Store:

See `PLAYSTORE_GUIDE.md` for detailed instructions on packaging your PWA as an Android app using Trusted Web Activity (TWA).

Quick steps:
1. Deploy PWA to production (HTTPS required)
2. Install Bubblewrap: `npm install -g @bubblewrap/cli`
3. Initialize: `bubblewrap init --manifest https://yourdomain.com/manifest.json`
4. Build: `bubblewrap build`
5. Sign and upload to Play Console

### Troubleshooting:

**Install button doesn't appear:**
- Make sure you're using HTTPS (or localhost for testing)
- Check service worker is registered (DevTools > Application > Service Workers)
- Verify manifest.json is accessible at `/manifest.json`

**App doesn't work offline:**
- Build and preview the production version
- Check service worker status in DevTools
- Clear cache and reload

**Icons not showing:**
- Make sure icon files exist in `public/` folder
- Check file names match manifest.json paths
- Icons must be square PNG files

### Next Steps:

1. ✅ PWA setup complete
2. 🎨 Create and add app icons (currently using placeholder SVG)
3. 🚀 Deploy to production hosting
4. 📱 Test installation on mobile devices
5. 🏪 (Optional) Submit to Google Play Store

Need help? Check the official guides:
- PWA Documentation: https://web.dev/progressive-web-apps/
- Bubblewrap CLI: https://github.com/GoogleChromeLabs/bubblewrap
- PWABuilder: https://www.pwabuilder.com/
