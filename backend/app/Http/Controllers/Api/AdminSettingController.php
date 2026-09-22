<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminSettingController extends Controller
{
    /**
     * List semua setting.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::orderBy('key')->get()->map(fn ($s) => [
            'key'         => $s->key,
            'value'       => $s->value,
            'description' => $s->description,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $settings,
        ]);
    }

    /**
     * Update single setting by key.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key'   => ['required', 'string', Rule::exists('mst_setting', 'key')],
            'value' => ['required', 'string', 'max:255'],
        ]);

        Setting::where('key', $validated['key'])->update([
            'value' => $validated['value'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Setting berhasil diperbarui.',
            'data'    => [
                'key'   => $validated['key'],
                'value' => $validated['value'],
            ],
        ]);
    }
}