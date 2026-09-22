<?php

namespace App\Console\Commands;

use App\Models\CatalogItem;
use App\Models\PortfolioImage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupImages extends Command
{
    protected $signature = 'hachuw:cleanup-images
                            {--dry-run : Tampilkan file yang akan dihapus, tanpa menghapus}
                            {--force : Lewati konfirmasi}';

    protected $description = 'Hapus file gambar yang sudah soft-deleted (status=0) dari storage.';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $force  = (bool) $this->option('force');

        $this->info('🧹 Scanning file gambar yang sudah soft-deleted...');
        $this->newLine();

        // ============================================================
        // 1. CATALOG COVERS (status=0)
        // ============================================================
        $this->line('📁 <fg=yellow>Catalog Covers</>');

        $coversToDelete = CatalogItem::where('status', 0)
            ->whereNotNull('cover_image')
            ->where('cover_image', '!=', '')
            ->pluck('cover_image')
            ->filter()
            ->unique()
            ->values();

        $coversFound = 0;
        foreach ($coversToDelete as $path) {
            if (Storage::disk('public')->exists($path)) {
                $coversFound++;
                $this->line("   - {$path}");
                if (! $dryRun) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $this->line("   Total: <fg=cyan>{$coversFound}</> file");
        $this->newLine();

        // ============================================================
        // 2. PORTFOLIO IMAGES (status=0)
        // ============================================================
        $this->line('📁 <fg=yellow>Portfolio Images</>');

        $portfolioToDelete = PortfolioImage::where('status', 0)
            ->whereNotNull('image_url')
            ->where('image_url', '!=', '')
            ->pluck('image_url')
            ->filter()
            ->unique()
            ->values();

        $portfolioFound = 0;
        foreach ($portfolioToDelete as $path) {
            if (Storage::disk('public')->exists($path)) {
                $portfolioFound++;
                $this->line("   - {$path}");
                if (! $dryRun) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $this->line("   Total: <fg=cyan>{$portfolioFound}</> file");
        $this->newLine();

        // ============================================================
        // 3. ORPHAN FILES (file tanpa referensi di DB)
        // ============================================================
        $this->line('📁 <fg=yellow>Orphan Files (tanpa referensi di DB)</>');

        // Kumpulkan semua path yang masih direferensi (status=1).
        $validCovers = CatalogItem::where('status', 1)
            ->whereNotNull('cover_image')
            ->pluck('cover_image')
            ->filter()
            ->toArray();

        $validPortfolio = PortfolioImage::where('status', 1)
            ->whereNotNull('image_url')
            ->pluck('image_url')
            ->filter()
            ->toArray();

        $validArtworks = \App\Models\Artwork::whereNotNull('image_url')
            ->pluck('image_url')
            ->filter()
            ->toArray();

        $allValidPaths = array_merge($validCovers, $validPortfolio, $validArtworks);

        // Scan folder untuk cari file yang tidak direferensi.
        $folders = ['catalog-covers', 'portfolio-images', 'artworks'];
        $orphanCount = 0;

        foreach ($folders as $folder) {
            if (! Storage::disk('public')->exists($folder)) {
                continue;
            }

            $files = Storage::disk('public')->files($folder);

            foreach ($files as $file) {
                if (! in_array($file, $allValidPaths, true)) {
                    $orphanCount++;
                    $this->line("   - {$file}");
                    if (! $dryRun) {
                        Storage::disk('public')->delete($file);
                    }
                }
            }
        }

        $this->line("   Total: <fg=cyan>{$orphanCount}</> file");
        $this->newLine();

        // ============================================================
        // SUMMARY
        // ============================================================
        $total = $coversFound + $portfolioFound + $orphanCount;

        if ($dryRun) {
            $this->info("🔍 DRY RUN: {$total} file akan dihapus.");
            $this->line('   Jalankan tanpa --dry-run untuk menghapus.');
        } else {
            $this->info("✅ Selesai: {$total} file dihapus.");
        }

        return self::SUCCESS;
    }
}