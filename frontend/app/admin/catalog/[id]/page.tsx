import type { Metadata } from "next";
import { CatalogImageClient } from "./CatalogImageClient";

export const metadata: Metadata = {
  title: "Manage Images — Admin",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CatalogImagePage({ params }: PageProps) {
  const { id } = await params;
  return <CatalogImageClient catalogId={Number(id)} />;
}