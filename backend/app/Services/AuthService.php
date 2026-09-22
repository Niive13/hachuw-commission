<?php

namespace App\Services;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Attempt login admin, return [admin, token].
     *
     * @throws ValidationException
     */
    public function login(string $username, string $password): array
    {
        /** @var Admin|null $admin */
        $admin = Admin::active()->where('username', $username)->first();

        // Pesan error generik (jangan bocorkan mana yang salah: username atau password).
        if (! $admin || ! Hash::check($password, $admin->password)) {
            throw ValidationException::withMessages([
                'username' => ['Username atau password salah.'],
            ]);
        }

        // Hapus token lama (opsional: satu sesi aktif saja).
        // Kalau mau multi-device, comment baris ini.
        $admin->tokens()->delete();

        // Buat token baru.
        $token = $admin->createToken('admin-token')->plainTextToken;

        return [$admin, $token];
    }

    /**
     * Revoke current access token.
     */
    public function logout(Admin $admin): void
    {
        $token = $admin->currentAccessToken();

        if ($token) {
            $token->delete();
        }
    }
}
