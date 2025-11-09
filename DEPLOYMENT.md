# Quick Deployment Commands

## Test PWA Locally

```powershell
# Build and preview
npm run build
npm run preview
```

Then open http://localhost:4173 in Chrome to test PWA features.

## Deploy to Vercel (Recommended)

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login and deploy (first time)
vercel

# Deploy to production
vercel --prod
```

Your app will be live at: https://your-app.vercel.app

## Deploy to Netlify

### Option 1: Drag & Drop
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder to the upload area

### Option 2: CLI
```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Deploy to Firebase

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (first time only)
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Add to git and push:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/invoice-app.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: main, folder: /dist
   - Save

4. Update `vite.config.ts` base path:
```typescript
export default defineConfig({
  base: '/invoice-app/', // Your repo name
  plugins: [react()],
})
```

5. Rebuild and push:
```powershell
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git push
```

## After Deployment

1. **Test PWA Features**:
   - Open Chrome DevTools > Application tab
   - Check Service Worker is registered
   - Check Manifest is loaded
   - Test "Add to Home Screen"

2. **Run Lighthouse Audit**:
   - Open Chrome DevTools > Lighthouse
   - Select "Progressive Web App"
   - Generate report
   - Aim for 90+ score

3. **Create App Icons**:
   - Visit https://www.pwabuilder.com/imageGenerator
   - Upload your 512x512 logo
   - Download generated icons
   - Replace files in `public/` folder
   - Update `manifest.json` icon paths

4. **Package for Play Store** (Optional):
```powershell
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Initialize TWA project
bubblewrap init --manifest https://your-app.vercel.app/manifest.json

# Build Android app
bubblewrap build
```

See `PLAYSTORE_GUIDE.md` for full Play Store deployment instructions.

## Environment-Specific Builds

### Development
```powershell
npm run dev
```

### Production Preview
```powershell
npm run build
npm run preview
```

### Production Build Only
```powershell
npm run build
```

The `dist/` folder contains your production-ready files.

## Troubleshooting

**Service Worker not updating?**
```powershell
# Clear cache and rebuild
rm -r dist
npm run build
```

**Icons not showing?**
- Make sure icon files exist in `public/` folder
- Check paths in `manifest.json` match actual files
- Icons must be square PNG files
- Clear browser cache and reload

**Install prompt not appearing?**
- Must be on HTTPS (or localhost)
- Service worker must be registered
- Manifest must be valid
- User hasn't previously dismissed prompt

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `vercel` | Deploy to Vercel |
| `netlify deploy --prod` | Deploy to Netlify |
| `firebase deploy` | Deploy to Firebase |

## Next Steps

1. ✅ PWA setup complete
2. 🎨 Create custom app icons
3. 🚀 Deploy to production (HTTPS)
4. 📱 Test on mobile devices
5. 🏪 (Optional) Submit to Play Store
