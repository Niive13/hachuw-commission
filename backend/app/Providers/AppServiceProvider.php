<?php

namespace App\Providers;

use App\Services\ImageStorage\ImageStorageService;
use App\Services\ImageStorage\LocalImageStorageService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind interface ke implementasi.
        // Nanti kalau mau ganti ke S3/Cloudinary, cukup ubah baris ini.
        $this->app->bind(ImageStorageService::class, LocalImageStorageService::class);
    }

    public function boot(): void
    {
        //
    }
}