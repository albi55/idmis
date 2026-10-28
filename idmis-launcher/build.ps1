# Builds IDMIS.exe: the launcher that starts the IDMIS database and server (..\server) and opens
# the sign-in page. The pages are served from ..\idms at run time, so changes there need no rebuild;
# rebuild only after changing Launcher.cs.
# Uses the C# compiler that ships with Windows (.NET Framework 4.x) - nothing to install.

$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$site = (Resolve-Path (Join-Path $here '..\idms')).Path
$out  = Join-Path $here '..\IDMIS.exe'
$csc  = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
if (-not (Test-Path $csc)) { $csc = Join-Path $env:WINDIR 'Microsoft.NET\Framework\v4.0.30319\csc.exe' }

# App icon from the CRAD logo (PNG-in-ICO, 256x256).
Add-Type -AssemblyName System.Drawing
$ico = Join-Path $here 'idmis.ico'
$src = [System.Drawing.Image]::FromFile((Join-Path $site 'assets\logo-crad.png'))
$bmp = New-Object System.Drawing.Bitmap 256, 256
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'
$g.Clear([System.Drawing.Color]::Transparent)
$scale = [Math]::Min(256 / $src.Width, 256 / $src.Height)
$w = [int]($src.Width * $scale); $h = [int]($src.Height * $scale)
$g.DrawImage($src, [int]((256 - $w) / 2), [int]((256 - $h) / 2), $w, $h)
$g.Dispose(); $src.Dispose()
$ms = New-Object System.IO.MemoryStream
$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
$png = $ms.ToArray()
$fs = [System.IO.File]::Create($ico)
$bw = New-Object System.IO.BinaryWriter $fs
$bw.Write([UInt16]0); $bw.Write([UInt16]1); $bw.Write([UInt16]1)          # header: 1 image
$bw.Write([byte]0); $bw.Write([byte]0); $bw.Write([byte]0); $bw.Write([byte]0)  # 256x256, no palette
$bw.Write([UInt16]1); $bw.Write([UInt16]32); $bw.Write([UInt32]$png.Length); $bw.Write([UInt32]22)
$bw.Write($png); $bw.Close()

$rsp = Join-Path $here 'build.rsp'
@(
    '/nologo', '/target:winexe', '/optimize+', '/platform:anycpu', '/codepage:65001',
    "/out:`"$out`"", "/win32icon:`"$ico`"",
    '/reference:System.Windows.Forms.dll', '/reference:System.Drawing.dll', '/reference:System.Management.dll',
    "`"$(Join-Path $here 'Launcher.cs')`""
) | Set-Content -Encoding utf8 $rsp

& $csc "@$rsp"
if ($LASTEXITCODE -ne 0) { throw "Build failed" }
Remove-Item $rsp
Write-Host "Built $((Resolve-Path $out).Path)."
