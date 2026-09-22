import type { Metadata } from "next";
import { CatalogAdminClient } from "./CatalogAdminClient";

export const metadata: Metadata = {
  title: "Catalog — Admin",
};

export default function AdminCatalogPage() {
  return <CatalogAdminClient />;
}