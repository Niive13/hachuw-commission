<?php

namespace App\Services\ImageStorage;

use Illuminate\Http\UploadedFile;

interface ImageStorageService
{
    /**
     * Store uploaded file, return relative path.
     */
    public function store(UploadedFile $file, string $directory): string;

    /**
     * Replace existing file, return new relative path.
     */
    public function replace(UploadedFile $file, string $directory, string $oldPath): string;

    /**
     * Delete file by relative path.
     */
    public function delete(string $path): bool;

    /**
     * Get public URL for a given relative path.
     */
    public function url(?string $path): ?string;
}