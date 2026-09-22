<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class PublicSettingController extends Controller
{
    /**
     * Return setting yang boleh diakses publik.
     * Saat ini: commission_status.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'commission_status' => Setting::get('commission_status', 'open'),
            ],
        ]);
    }
}