# GitHub Pages Deployment Guide

## Method 1: Using GitHub Actions (Recommended)

### Step 1: Create GitHub Repository

```powershell
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Invoice & Quote Manager PWA"

# Create main branch
git branch -M main
```

### Step 2: Create Repository on GitHub

1. Go to https://github.com/new
2. Create a new repository (e.g., `invoice-manager`)
3. Don't initialize with README (you already have one)
4. Click "Create repository"

### Step 3: Push to GitHub

```powershell
# Add remote (replace with your username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/invoice-manager.git

# Push to GitHub
git push -u origin main
```

### Step 4: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. Save

### Step 6: Update Vite Config

Update `vite.config.ts` to set the base path:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/invoice-manager/', // Replace with your repo name
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
```

### Step 7: Deploy

```powershell
# Commit the workflow and config changes
git add .
git commit -m "Add GitHub Pages deployment"
git push
```

GitHub Actions will automatically build and deploy your app!

Your app will be available at: `https://YOUR_USERNAME.github.io/invoice-manager/`

---

## Method 2: Manual Deployment (Alternative)

If you prefer manual deployment without GitHub Actions:

### Step 1: Install gh-pages

```powershell
npm install --save-dev gh-pages
```

### Step 2: Add Deploy Script to package.json

Add this to the `"scripts"` section in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Step 3: Update vite.config.ts

Same as Method 1 - set the `base` path to your repo name.

### Step 4: Deploy

```powershell
npm run deploy
```

This will build and push to the `gh-pages` branch.

### Step 5: Enable GitHub Pages

1. Go to Settings > Pages
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / (root)
4. Save

---

## After Deployment

### Update Service Worker and Manifest

After deployment, you may need to update URLs:

**In `public/manifest.json`:**
```json
{
  "start_url": "/invoice-manager/",
  "scope": "/invoice-manager/"
}
```

**Note**: The service worker will automatically work with the base path from Vite config.

### Test Your Deployed App

1. Visit your GitHub Pages URL
2. Open Chrome DevTools > Application
3. Check Service Worker is registered
4. Check Manifest is loaded correctly
5. Test "Add to Home Screen" functionality

### Custom Domain (Optional)

To use a custom domain:

1. Go to Settings > Pages > Custom domain
2. Enter your domain (e.g., `invoices.yourdomain.com`)
3. Add CNAME record in your DNS:
   - Type: CNAME
   - Name: invoices
   - Value: YOUR_USERNAME.github.io
4. Wait for DNS propagation
5. Enable "Enforce HTTPS"

Update manifest.json start_url to your custom domain.

---

## Troubleshooting

**404 Error on refresh?**
- This is normal for SPAs on GitHub Pages
- The app uses client-side routing, so it loads from root

**Service Worker not working?**
- GitHub Pages enforces HTTPS automatically ✓
- Check that manifest.json paths are correct
- Clear browser cache and try again

**Build fails in GitHub Actions?**
- Check Node version in workflow (should be 18+)
- Make sure package-lock.json is committed
- Check build logs in Actions tab

**Assets not loading?**
- Verify `base` in vite.config.ts matches repo name
- Must include leading and trailing slashes: `/repo-name/`

---

## Update Existing Deployment

```powershell
# Make changes to your code
git add .
git commit -m "Update app"
git push
```

With GitHub Actions (Method 1), it deploys automatically on push!

With gh-pages (Method 2):
```powershell
npm run deploy
```

---

## Important Notes

✅ **HTTPS**: GitHub Pages automatically provides HTTPS (required for PWA)  
✅ **Free**: Completely free for public repositories  
✅ **Custom Domain**: Supported with HTTPS  
✅ **Automatic Deployment**: With GitHub Actions, every push deploys  

⚠️ **Public Repositories Only**: Free tier requires public repo (or upgrade to GitHub Pro for private repos)

---

## Quick Commands Reference

```powershell
# First time setup
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# Updates (Method 1 - GitHub Actions)
git add .
git commit -m "Update message"
git push

# Updates (Method 2 - gh-pages)
npm run deploy
```

Your app will be live at: `https://USERNAME.github.io/REPO/`
