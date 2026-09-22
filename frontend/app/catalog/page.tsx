import type { Metadata } from "next";
import { CatalogClient } from "./CatalogClient";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Daftar commission illustration, PNGTuber, dan custom emote Hachuw.",
};

export default function CatalogPage() {
  return <CatalogClient />;
}