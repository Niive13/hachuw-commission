<?php

namespace Database\Seeders;

use App\Models\CatalogItem;
use App\Models\QueueEntry;
use Illuminate\Database\Seeder;

class QueueSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus queue lama (untuk re-seed yang bersih).
        QueueEntry::query()->delete();

        $catalogs = CatalogItem::active()->get()->keyBy('nama');

        $items = [
            [
                'queue_number'            => 1,
                'customer_display_name'   => 'A-chan',
                'catalog_nama'            => 'Full Body',
                'queue_status'            => 'SKETCH',
                'order_date'              => now()->subDays(3),
                'estimated_completion'    => now()->addDays(5),
                'public_note'             => 'Karakter original, theme: spring 🌸',
            ],
            [
                'queue_number'            => 2,
                'customer_display_name'   => 'B-kun',
                'catalog_nama'            => 'Custom Emote',
                'queue_status'            => 'WAITING',
                'order_date'              => now()->subDays(1),
                'estimated_completion'    => now()->addDays(7),
                'public_note'             => '3 emote untuk Discord server',
            ],
            [
                'queue_number'            => 3,
                'customer_display_name'   => 'C-san',
                'catalog_nama'            => 'PNGTuber Commission',
                'queue_status'            => 'RENDERING',
                'order_date'              => now()->subDays(5),
                'estimated_completion'    => now()->addDays(2),
                'public_note'             => 'Vtuber model, pastel theme',
            ],
            [
                'queue_number'            => 4,
                'customer_display_name'   => 'D-chan',
                'catalog_nama'            => 'Half Body',
                'queue_status'            => 'REVISION',
                'order_date'              => now()->subDays(7),
                'estimated_completion'    => now()->addDays(3),
                'public_note'             => 'Revisi warna rambut',
            ],
            [
                'queue_number'            => 5,
                'customer_display_name'   => 'E-kun',
                'catalog_nama'            => 'Headshot',
                'queue_status'            => 'COMPLETED',
                'order_date'              => now()->subDays(14),
                'estimated_completion'    => now()->subDays(7),
                'public_note'             => 'Sudah selesai, terima kasih! ♡',
            ],
        ];

        foreach ($items as $item) {
            $catalog = $catalogs->get($item['catalog_nama']);

            if (! $catalog) {
                $this->command->warn("Catalog '{$item['catalog_nama']}' tidak ditemukan, skip.");
                continue;
            }

            QueueEntry::create([
                'queue_number'          => $item['queue_number'],
                'customer_display_name' => $item['customer_display_name'],
                'id_catalogItem'        => $catalog->id_catalogItem,
                'queue_status'          => $item['queue_status'],
                'order_date'            => $item['order_date'],
                'estimated_completion'  => $item['estimated_completion'],
                'public_note'           => $item['public_note'],
                'status'                => 1,
            ]);
        }

        $this->command->info('✅ 5 queue dummy berhasil di-seed.');
    }
}