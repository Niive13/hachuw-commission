<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCatalogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama'        => ['sometimes', 'string', 'max:150'],
            'deskripsi'   => ['nullable', 'string', 'max:2000'],  // ← tambah
            'id_kategori' => ['sometimes', 'integer', 'exists:mst_kategori,id_kategori'],
            'price'       => ['sometimes', 'numeric', 'min:0', 'max:9999999999.99'],
            'price_max'   => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'status'      => ['sometimes', 'integer', 'in:0,1'],
            'cover_image' => [
                'nullable',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'max:5120',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.max'           => 'Nama maksimal 150 karakter.',
            'deskripsi.max'      => 'Deskripsi maksimal 2000 karakter.',
            'id_kategori.exists' => 'Kategori tidak ditemukan.',
            'price.numeric'      => 'Harga harus berupa angka.',
            'price_max.numeric'  => 'Harga max harus berupa angka.',
            'cover_image.image'  => 'Cover harus berupa file gambar.',
            'cover_image.mimes'  => 'Format cover harus jpg, jpeg, png, webp, atau gif.',
            'cover_image.max'    => 'Ukuran cover maksimal 5 MB.',
        ];
    }
}