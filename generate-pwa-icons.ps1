# Generate simple PWA icons using .NET
Add-Type -AssemblyName System.Drawing

$publicDir = "$PSScriptRoot\public"
$sizes = @(192, 256, 512)

foreach ($size in $sizes) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill with blue background
    $graphics.Clear([System.Drawing.Color]::FromArgb(59, 130, 246))
    
    # Draw "I" text
    $font = New-Object System.Drawing.Font("Arial", [math]::Floor($size * 0.6), [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $graphics.DrawString("I", $font, $brush, (New-Object System.Drawing.RectangleF(0, 0, $size, $size)), $stringFormat)
    
    # Save as PNG
    $filename = "icon-$($size)x$($size).png"
    $filepath = Join-Path $publicDir $filename
    $bitmap.Save($filepath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "Generated $filename"
    
    $graphics.Dispose()
    $bitmap.Dispose()
    $font.Dispose()
    $brush.Dispose()
}

Write-Host "Icon generation complete!"
