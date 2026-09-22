<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::updateOrCreate(
            ['username' => 'hachuw'],
            [
                'password' => 'hachuw123', // akan otomatis di-hash oleh cast 'hashed'
                'status'   => 1,
            ]
        );

        $this->command->info('✅ Admin default dibuat:');
        $this->command->info('   Username: hachuw');
        $this->command->info('   Password: hachuw123');
        $this->command->warn('   ⚠️  Ganti password ini setelah login pertama!');
    }
}