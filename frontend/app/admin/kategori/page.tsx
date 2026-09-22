import type { Metadata } from "next";
import { KategoriAdminClient } from "./KategoriAdminClient";

export const metadata: Metadata = {
  title: "Kategori — Admin",
};

export default function AdminKategoriPage() {
  return <KategoriAdminClient />;
}