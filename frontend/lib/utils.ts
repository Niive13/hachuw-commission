export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format harga — kalau price_max ada, tampil sebagai range.
 * Contoh:
 *   formatRupiahRange(50000, null)     → "Rp 50.000"
 *   formatRupiahRange(10000, 30000)    → "Rp 10.000 - 30.000"
 */
export function formatRupiahRange(
  price: number,
  price_max: number | null | undefined,
): string {
  if (price_max !== null && price_max !== undefined && price_max > price) {
    return `${formatRupiah(price)} - ${formatRupiah(price_max)}`;
  }
  return formatRupiah(price);
}