# Deployment Guide for Intelical

## GitHub Pages Setup

This guide will help you deploy the Intelical app to GitHub Pages.

### Prerequisites

The repository now includes:
- ✅ Built application files in the `dist/` folder
- ✅ GitHub Actions workflow for automatic deployment
- ✅ Proper Vite configuration with base path `/intelical/`

### Steps to Deploy

1. **Merge this PR to the `main` branch**
   - Once merged, the GitHub Actions workflow will automatically trigger

2. **Enable GitHub Pages in Repository Settings**
   - Go to your repository on GitHub: `https://github.com/chromex21/intelical`
   - Click on **Settings** tab
   - Scroll down to **Pages** section in the left sidebar
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Wait for Deployment**
   - The GitHub Actions workflow will automatically build and deploy
   - You can monitor progress in the **Actions** tab
   - Deployment typically takes 1-2 minutes

4. **Access Your App**
   - Once deployed, visit: `https://chromex21.github.io/intelical/`
   - The app should load with the full calendar interface

### Manual Deployment (Alternative)

If you prefer to deploy manually or the automatic workflow doesn't work:

1. Go to Repository Settings → Pages
2. Set **Source** to "Deploy from a branch"
3. Select branch: `main`
4. Select folder: `/ (root)` or create a `docs` folder and select that
5. Click Save

### Troubleshooting

**Issue: Page shows README instead of app**
- Check that GitHub Pages source is set to GitHub Actions or the correct branch/folder
- Verify the `dist/` folder contains `index.html` and `assets/` folder
- Check that the GitHub Actions workflow completed successfully

**Issue: 404 errors for assets**
- Verify the `base` path in `vite.config.js` matches your repository name
- Current setting: `base: '/intelical/'`

**Issue: App not loading**
- Check browser console for errors
- Verify the deployed files are accessible at the GitHub Pages URL
- Clear browser cache and try again

### Rebuilding the App

If you make changes to the source code:

```bash
# Install dependencies (first time only)
npm install

# Build the application
npm run build

# Commit the updated dist folder
git add dist/
git commit -m "Rebuild application"
git push
```

The GitHub Actions workflow will automatically deploy the updated files.

### Development

To work on the app locally:

```bash
# Start development server
npm run dev

# View at http://localhost:5173/intelical/
```

## Support

If you encounter any issues, check:
1. GitHub Actions workflow logs
2. Browser console for JavaScript errors
3. GitHub Pages settings in repository
