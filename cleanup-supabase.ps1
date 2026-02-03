# Simple Supabase Cleanup Script
Write-Host "🧹 Starting Supabase Cleanup..." -ForegroundColor Cyan

# Count files
$files = Get-ChildItem -Path "src" -Include *.ts,*.tsx -Recurse -File | Where-Object { $_.FullName -notmatch "node_modules|\.git|integrations" }
Write-Host "Found $($files.Count) files" -ForegroundColor Yellow

$modified = 0
foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        $original = $content
        
        # Replace import statement
        $content = $content -replace 'import type \{ Tables \} from "@/integrations/supabase/types";', 'import type { JenisKerja, PosisiKerja, Kumiai, Perusahaan, Program, Siswa, SiswaMagang } from "@/types";'
        
        # Replace Tables types
        $content = $content -replace "Tables<'jenis_kerja'>", "JenisKerja"
        $content = $content -replace "Tables<'posisi_kerja'>", "PosisiKerja"
        $content = $content -replace "Tables<'kumiai'>", "Kumiai"
        $content = $content -replace "Tables<'perusahaan'>", "Perusahaan"
        $content = $content -replace "Tables<'program'>", "Program"
        $content = $content -replace "Tables<'siswa'>", "Siswa"
        $content = $content -replace "Tables<'siswa_magang'>", "SiswaMagang"
        
        if ($content -ne $original) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $modified++
            Write-Host "✓ $($file.Name)" -ForegroundColor Green
        }
    } catch {
        Write-Host "✗ Error in $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`n✅ Modified $modified files" -ForegroundColor Cyan
