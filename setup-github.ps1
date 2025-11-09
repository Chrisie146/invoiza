# GitHub Pages Setup Script
# This script helps you set up and deploy to GitHub Pages

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "GitHub Pages Deployment Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Git is installed" -ForegroundColor Green

# Check if already initialized
if (Test-Path ".git") {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
} else {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Update vite.config.ts:" -ForegroundColor White
Write-Host "   Set base: '/your-repo-name/' (replace with your actual repo name)" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Update public/manifest.json:" -ForegroundColor White
Write-Host "   Set start_url: '/your-repo-name/'" -ForegroundColor Yellow
Write-Host "   Set scope: '/your-repo-name/'" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Commit and push:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Yellow
Write-Host "   git commit -m 'Initial commit - Invoice Manager PWA'" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Enable GitHub Pages:" -ForegroundColor White
Write-Host "   - Go to repository Settings > Pages" -ForegroundColor Yellow
Write-Host "   - Source: GitHub Actions" -ForegroundColor Yellow
Write-Host "   - Save" -ForegroundColor Yellow
Write-Host ""
Write-Host "6. Your app will be live at:" -ForegroundColor White
Write-Host "   https://YOUR_USERNAME.github.io/YOUR_REPO/" -ForegroundColor Green
Write-Host ""
Write-Host "See GITHUB_PAGES.md for detailed instructions!" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to add and commit files
$commit = Read-Host "Would you like to add and commit all files now? (y/n)"
if ($commit -eq "y" -or $commit -eq "Y") {
    Write-Host ""
    Write-Host "Adding files to git..." -ForegroundColor Yellow
    git add .
    
    Write-Host "Committing files..." -ForegroundColor Yellow
    git commit -m "Initial commit - Invoice & Quote Manager PWA"
    
    Write-Host ""
    Write-Host "✓ Files committed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now add your GitHub remote:" -ForegroundColor Cyan
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Yellow
    Write-Host "git push -u origin main" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Skipped commit. Run these commands when ready:" -ForegroundColor Yellow
    Write-Host "git add ." -ForegroundColor White
    Write-Host "git commit -m 'Initial commit'" -ForegroundColor White
    Write-Host ""
}
