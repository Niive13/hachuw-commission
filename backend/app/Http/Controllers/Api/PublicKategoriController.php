<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\JsonResponse;

class PublicKategoriController extends Controller
{
    public function index(): JsonResponse
    {
        $kategoris = Kategori::active()->ordered()->get()->map(fn ($k) => [
            'id_kategori' => $k->id_kategori,
            'nama'        => $k->nama,
            'slug'        => $k->slug,
            'urutan'      => $k->urutan,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $kategoris,
        ]);
    }
}