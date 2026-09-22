<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminKategoriController extends Controller
{
    public function index(): JsonResponse
    {
        $kategoris = Kategori::ordered()->get()->map(fn ($k) => [
            'id_kategori' => $k->id_kategori,
            'nama'        => $k->nama,
            'slug'        => $k->slug,
            'urutan'      => $k->urutan,
            'status'      => $k->status,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $kategoris,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama'   => ['required', 'string', 'max:50'],
            'slug'   => ['required', 'string', 'max:50', 'regex:/^[a-z0-9_]+$/', 'unique:mst_kategori,slug'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'status' => ['sometimes', 'integer', 'in:0,1'],
        ], [
            'slug.regex'  => 'Slug hanya boleh huruf kecil, angka, dan underscore.',
            'slug.unique' => 'Slug sudah dipakai.',
        ]);

        $kategori = Kategori::create([
            'nama'   => $validated['nama'],
            'slug'   => $validated['slug'],
            'urutan' => $validated['urutan'] ?? 0,
            'status' => $validated['status'] ?? 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dibuat.',
            'data'    => [
                'id_kategori' => $kategori->id_kategori,
                'nama'        => $kategori->nama,
                'slug'        => $kategori->slug,
                'urutan'      => $kategori->urutan,
                'status'      => $kategori->status,
            ],
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $kategori = Kategori::find($id);

        if (! $kategori) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'nama'   => ['sometimes', 'string', 'max:50'],
            'slug'   => ['sometimes', 'string', 'max:50', 'regex:/^[a-z0-9_]+$/', Rule::unique('mst_kategori', 'slug')->ignore($kategori->id_kategori, 'id_kategori')],
            'urutan' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', 'integer', 'in:0,1'],
        ], [
            'slug.regex'  => 'Slug hanya boleh huruf kecil, angka, dan underscore.',
            'slug.unique' => 'Slug sudah dipakai.',
        ]);

        $kategori->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diperbarui.',
            'data'    => [
                'id_kategori' => $kategori->id_kategori,
                'nama'        => $kategori->nama,
                'slug'        => $kategori->slug,
                'urutan'      => $kategori->urutan,
                'status'      => $kategori->status,
            ],
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $kategori = Kategori::find($id);

        if (! $kategori) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        // Cek apakah masih dipakai catalog.
        $count = $kategori->catalogItems()->where('status', 1)->count();

        if ($count > 0) {
            return response()->json([
                'success' => false,
                'message' => "Tidak bisa hapus kategori: masih dipakai oleh {$count} catalog.",
            ], 422);
        }

        // Soft delete kategori.
        $kategori->update(['status' => 0]);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}