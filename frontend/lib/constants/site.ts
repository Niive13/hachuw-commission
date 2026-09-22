export const SITE = {
  name: "Hachuw",
  title: "Hachuw — Freelance Illustrator",
  description:
    "Portfolio dan commission informasi untuk Hachuw, freelance illustrator.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  creator: {
    name: "Hachuw",
    role: "Freelance Illustrator",
    bio: "Halooo! 💖 Terima kasih banyak sudah mampir ke halaman commission-ku! Perkenalkan, aku Hachuw, seorang freelance illustrator. Website ini berisi portofolio serta informasi lengkap mengenai jasa ilustrasi yang aku tawarkan. Sebelum melakukan pemesanan, silakan baca halaman Rules terlebih dahulu untuk mengetahui apa ilustrasi yang bisa aku kerjakan. Setelah itu, jangan lupa membaca TOS (Terms of Service) agar proses commission berjalan dengan nyaman untuk kita berdua. Kalau ingin melihat contoh hasil karya dan daftar harga, kamu bisa langsung membuka menu Portfolio. Terima kasih sudah meluangkan waktu untuk mengunjungi halaman ini. Semoga kamu menemukan informasi yang kamu butuhkan, dan semoga kita bisa bekerja sama! ♡",
  },
} as const;