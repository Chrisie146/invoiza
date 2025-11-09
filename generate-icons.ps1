# PWA Icon Generator Script
# This script creates placeholder icons for the PWA
# Replace these with actual app icons for production

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "Creating placeholder PWA icons..." -ForegroundColor Green

# Create a simple SVG icon (you should replace this with your actual logo)
$svgContent = @"
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#3B82F6"/>
  <text x="50%" y="50%" font-size="200" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="bold">IQ</text>
</svg>
"@

$svgPath = "public/icon-temp.svg"
$svgContent | Out-File -FilePath $svgPath -Encoding utf8

Write-Host "Created temporary SVG icon at $svgPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: To generate actual PNG icons, you need to:" -ForegroundColor Cyan
Write-Host "1. Design your app icon (512x512 PNG recommended)" -ForegroundColor White
Write-Host "2. Use an online tool like:" -ForegroundColor White
Write-Host "   - https://www.pwabuilder.com/imageGenerator" -ForegroundColor Green
Write-Host "   - https://realfavicongenerator.net/" -ForegroundColor Green
Write-Host "3. Place generated icons in the 'public' folder" -ForegroundColor White
Write-Host ""
Write-Host "Required icon sizes: $($sizes -join ', ') pixels" -ForegroundColor Yellow
