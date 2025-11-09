# Trusted Web Activity (TWA) for Play Store

This guide will help you package the PWA as an Android app for the Google Play Store using TWA (Trusted Web Activity).

## Prerequisites

1. Install [Android Studio](https://developer.android.com/studio)
2. Install [Node.js](https://nodejs.org/) (already installed)
3. Java Development Kit (JDK 11 or higher)

## Steps to Create Android App

### 1. Install Bubblewrap CLI

```powershell
npm install -g @bubblewrap/cli
```

### 2. Initialize TWA Project

```powershell
bubblewrap init --manifest https://yourdomain.com/manifest.json
```

Or run locally after deploying:

```powershell
bubblewrap init --manifest http://localhost:5173/manifest.json
```

### 3. Build the Android App

```powershell
bubblewrap build
```

This will generate an APK file in the `app-release-bundle` folder.

### 4. Configure Digital Asset Links

For production, you need to verify domain ownership. Create a file at:
`https://yourdomain.com/.well-known/assetlinks.json`

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.yourcompany.invoicemanager",
    "sha256_cert_fingerprints": ["YOUR_APP_FINGERPRINT"]
  }
}]
```

### 5. Sign the APK

Generate a keystore:

```powershell
keytool -genkey -v -keystore invoice-manager.keystore -alias invoice-manager -keyalg RSA -keysize 2048 -validity 10000
```

### 6. Test the App

```powershell
bubblewrap install
```

### 7. Prepare for Play Store

1. Update `twa-manifest.json` with:
   - App name
   - Package name (e.g., `com.yourcompany.invoicemanager`)
   - Version code and name
   - Icons (512x512 required)
   - Screenshots

2. Build release bundle:

```powershell
bubblewrap build --release
```

3. Upload the `.aab` file to Google Play Console

## Alternative: PWABuilder

Use [PWABuilder](https://www.pwabuilder.com/) for a simpler approach:

1. Visit https://www.pwabuilder.com/
2. Enter your deployed PWA URL
3. Click "Package for Stores"
4. Download the Android package
5. Sign and upload to Play Store

## App Requirements for Play Store

- ✅ HTTPS deployment (required for PWA)
- ✅ Valid manifest.json
- ✅ Service worker registered
- ✅ Icons (512x512, 192x192 minimum)
- ✅ Screenshots (phone and tablet)
- Privacy Policy URL
- App description and store listing details

## Testing Before Submission

1. Deploy your app to a hosting service (Vercel, Netlify, etc.)
2. Test PWA features using Chrome DevTools > Application
3. Verify install prompt works on mobile Chrome
4. Test offline functionality
5. Check manifest validation at: https://manifest-validator.appspot.com/

## Deployment Hosting Options

- **Vercel**: `npm install -g vercel` then `vercel`
- **Netlify**: Drag & drop `dist` folder
- **Firebase**: `npm install -g firebase-tools`
- **GitHub Pages**: Configure in repository settings

## Important Notes

- Your PWA must be deployed on HTTPS
- Service worker must be accessible at root level
- Update the `start_url` in manifest.json to your actual domain
- Keep the app updated (TWA updates automatically when PWA updates)
