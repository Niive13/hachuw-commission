<?php

namespace App\Http\Requests\Queue;

use App\Models\QueueEntry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQueueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_display_name' => ['sometimes', 'string', 'max:100'],
            'id_catalogItem'        => ['sometimes', 'integer', 'exists:mst_catalogItem,id_catalogItem'],
            'queue_status'          => ['sometimes', Rule::in(QueueEntry::STATUS)],
            'order_date'            => ['sometimes', 'date'],
            'estimated_completion'  => ['nullable', 'date'],
            'public_note'           => ['nullable', 'string', 'max:1000'],
            'status'                => ['sometimes', 'integer', 'in:0,1'],
        ];
    }
}