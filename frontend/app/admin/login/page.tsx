"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BffError } from "@/services/bff.service";
import { authClientService } from "@/services/auth.client.service";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Kalau sudah login, langsung redirect ke dashboard.
  useEffect(() => {
    authClientService
      .me()
      .then((admin) => {
        if (admin) router.replace("/admin");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authClientService.login(username, password);
      router.replace("/admin");
    } catch (e) {
      if (e instanceof BffError) {
        if (e.status === 422) {
          const msg =
            e.errors?.username?.[0] ??
            e.errors?.password?.[0] ??
            "Username atau password salah.";
          setError(msg);
        } else if (e.status === 429) {
          setError("Terlalu banyak percobaan. Coba lagi sebentar.");
        } else {
          setError(e.message);
        }
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50">
        <p className="text-sm text-ink-400">Memeriksa sesi...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-100 via-blush-50 to-lavender-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold text-blush-500">
            Hachuw 🌸
          </h1>
          <p className="mt-1 text-sm text-ink-400">Admin Panel Login</p>
        </div>

        {/* Card */}
        <form
          onSubmit={onSubmit}
          className="rounded-round border border-blush-100 bg-white p-6 shadow-card sm:p-8"
        >
          {/* Error */}
          {error && (
            <div className="mb-5 rounded-soft border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {/* Username */}
          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              disabled={loading}
              className="w-full rounded-soft border border-blush-200 bg-cream-50 px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:bg-white focus:ring-4 focus:ring-blush-100 disabled:opacity-60"
              placeholder="Masukkan username"
            />
          </label>

          {/* Password */}
          <label className="mb-6 block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
              className="w-full rounded-soft border border-blush-200 bg-cream-50 px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:bg-white focus:ring-4 focus:ring-blush-100 disabled:opacity-60"
              placeholder="Masukkan password"
            />
          </label>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </Button>

          <p className="mt-5 text-center text-xs text-ink-400">
            Halaman ini hanya untuk Hachuw. Admin panel tidak muncul di
            public site.
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-ink-400">
          <a href="/" className="hover:text-blush-500">
            ← Kembali ke public site
          </a>
        </p>
      </div>
    </div>
  );
}