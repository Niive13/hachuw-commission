export interface TosSection {
  title: string;
  items: string[];
}

export const TOS_SECTIONS: TosSection[] = [
  {
    title: "Terms Of Service",
    items: [
      "Pembayaran dilakukan setelah sketsa, bisa DP/full payment.",
      "Bebas melakukan revisi di saat sketsa.",
      "Maksimal revisi setelah sketsa 4x.",
      "Jika revisi mengubah seluruh konsep awal akan ditambahkan biaya tambahan.",
      "Pengerjaan 3-10 hari tergantung kesulitan.",
      "Pengiriman gambar melalui Email/Gdrive.",
      "Untuk komersial harga menjadi 2 kali lipat.",
      "Dibuat dalam kanvas rasio 1:1, bisa request.",
      "Extra Character 2 kali lipat.",
      "Commercial harga 2x lipat.",
    ],
  },
  {
    title: "Terms Of Service Emote",
    items: [
      "Gambar langsung dikirim hasil jadi tanpa sketsa.",
      "Pengerjaan 1-5 hari.",
      "Pembayaran dilakukan setelah saya mengirim 3 progress emote, DP/full payment.",
      "Revisi maksimal 2x per emote.",
      "Size 500px.",
      "Pengiriman gambar melalui GDrive/Email.",
      "Include membership.",
      "Penggunaan emote untuk printing/merch dikenakan biaya 50%.",
    ],
  },
];

export interface PaymentMethod {
  name: string;
  logo: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: "Bank Mandiri", logo: "/payment/mandiri.svg" },
  { name: "DANA",         logo: "/payment/dana.svg" },
  { name: "ShopeePay",    logo: "/payment/shopeepay.svg" },
  { name: "GoPay",        logo: "/payment/gopay.svg" },
];