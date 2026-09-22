import type { Metadata } from "next";
import { ArtworkAdminClient } from "./ArtworkAdminClient";

export const metadata: Metadata = {
  title: "Artwork — Admin",
};

export default function AdminArtworkPage() {
  return <ArtworkAdminClient />;
}