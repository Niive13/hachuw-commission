<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class StoreCatalogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama'        => ['required', 'string', 'max:150'],
            'deskripsi'   => ['nullable', 'string', 'max:2000'],  // ← tambah
            'id_kategori' => ['required', 'integer', 'exists:mst_kategori,id_kategori'],
            'price'       => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
            'price_max'   => ['nullable', 'numeric', 'min:0', 'gte:price', 'max:9999999999.99'],
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
            'nama.required'        => 'Nama wajib diisi.',
            'nama.max'             => 'Nama maksimal 150 karakter.',
            'id_kategori.required' => 'Kategori wajib dipilih.',
            'id_kategori.exists'   => 'Kategori tidak ditemukan.',
            'deskripsi.max'        => 'Deskripsi maksimal 2000 karakter.',
            'price.required'       => 'Harga wajib diisi.',
            'price.numeric'        => 'Harga harus berupa angka.',
            'price.min'            => 'Harga tidak boleh negatif.',
            'price_max.numeric'    => 'Harga max harus berupa angka.',
            'price_max.gte'        => 'Harga max harus lebih besar atau sama dengan harga min.',
            'cover_image.image'    => 'Cover harus berupa file gambar.',
            'cover_image.mimes'    => 'Format cover harus jpg, jpeg, png, webp, atau gif.',
            'cover_image.max'      => 'Ukuran cover maksimal 5 MB.',
        ];
    }
}