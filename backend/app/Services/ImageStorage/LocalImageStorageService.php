<?php

namespace App\Services\ImageStorage;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LocalImageStorageService implements ImageStorageService
{
    /**
     * Disk yang dipakai (dari config/filesystems.php).
     * Kita pakai disk 'public'.
     */
    protected string $disk = 'public';

    public function store(UploadedFile $file, string $directory): string
    {
        $directory = trim($directory, '/');

        // Generate nama file unik, pertahankan extension asli.
        $filename = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();

        // Simpan file, return path relatif seperti 'catalog-covers/abc-123.jpg'.
        $path = $file->storeAs($directory, $filename, $this->disk);

        return $path;
    }

    public function replace(UploadedFile $file, string $directory, string $oldPath): string
    {
        // Hapus file lama kalau ada.
        if ($oldPath) {
            $this->delete($oldPath);
        }

        // Simpan file baru.
        return $this->store($file, $directory);
    }

    public function delete(string $path): bool
    {
        if (! $path) {
            return false;
        }

        // Cek file ada sebelum hapus (untuk hindari warning).
        if (Storage::disk($this->disk)->exists($path)) {
            return Storage::disk($this->disk)->delete($path);
        }

        return false;
    }

    public function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        // Return URL lengkap: http://127.0.0.1:8000/storage/...
        return asset('storage/' . $path);
    }
}