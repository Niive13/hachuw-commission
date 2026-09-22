<?php

namespace Database\Seeders;

use App\Models\CatalogItem;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // ILLUSTRATION
            [
                'kategori' => 'ILLUSTRATION',
                'nama'     => 'Headshot',
                'price'    => 50000.00,
            ],
            [
                'kategori' => 'ILLUSTRATION',
                'nama'     => 'Half Body',
                'price'    => 100000.00,
            ],
            [
                'kategori' => 'ILLUSTRATION',
                'nama'     => 'Full Body',
                'price'    => 150000.00,
            ],
            [
                'kategori' => 'ILLUSTRATION',
                'nama'     => 'Couple',
                'price'    => 200000.00,
            ],

            // PNGTUBER
            [
                'kategori' => 'PNGTUBER',
                'nama'     => 'PNGTuber Commission',
                'price'    => 250000.00,
            ],

            // CUSTOM EMOTE
            [
                'kategori' => 'CUSTOM_EMOTE',
                'nama'     => 'Custom Emote',
                'price'    => 25000.00,
            ],
        ];

        foreach ($items as $item) {
            CatalogItem::updateOrCreate(
                [
                    'kategori' => $item['kategori'],
                    'nama'     => $item['nama'],
                ],
                [
                    'price'       => $item['price'],
                    'status'      => 1,
                    'cover_image' => null, // akan diisi via admin panel nanti
                ]
            );
        }

        $this->command->info('✅ ' . count($items) . ' catalog item berhasil di-seed.');
        $this->command->info('   Illustration: 4 item');
        $this->command->info('   PNGTuber: 1 item');
        $this->command->info('   Custom Emote: 1 item');
    }
}