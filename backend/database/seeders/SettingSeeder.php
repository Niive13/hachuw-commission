<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            [
                'key'         => 'commission_status',
                'value'       => 'open',
                'description' => 'Status commission: open / closed',
            ],
        ];

        foreach ($defaults as $item) {
            Setting::updateOrCreate(
                ['key' => $item['key']],
                [
                    'value'       => $item['value'],
                    'description' => $item['description'],
                ],
            );
        }

        $this->command->info('✅ ' . count($defaults) . ' setting default dibuat.');
    }
}