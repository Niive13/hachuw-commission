<?php

namespace App\Http\Requests\Queue;

use App\Models\QueueEntry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQueueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_display_name' => ['required', 'string', 'max:100'],
            'id_catalogItem'        => ['required', 'integer', 'exists:mst_catalogItem,id_catalogItem'],
            'queue_status'          => ['required', Rule::in(QueueEntry::STATUS)],
            'order_date'            => ['required', 'date'],
            'estimated_completion'  => ['nullable', 'date', 'after_or_equal:order_date'],
            'public_note'           => ['nullable', 'string', 'max:1000'],
            'status'                => ['sometimes', 'integer', 'in:0,1'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_display_name.required' => 'Nama customer wajib diisi.',
            'customer_display_name.max'      => 'Nama customer maksimal 100 karakter.',
            'id_catalogItem.required'        => 'Catalog wajib dipilih.',
            'id_catalogItem.exists'          => 'Catalog tidak ditemukan.',
            'queue_status.required'          => 'Status queue wajib dipilih.',
            'queue_status.in'                => 'Status queue tidak valid.',
            'order_date.required'            => 'Tanggal order wajib diisi.',
            'order_date.date'                => 'Tanggal order tidak valid.',
            'estimated_completion.after_or_equal' => 'Estimasi selesai harus setelah atau sama dengan tanggal order.',
        ];
    }
}