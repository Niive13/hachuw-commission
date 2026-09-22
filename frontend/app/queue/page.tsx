import type { Metadata } from "next";
import { QueueClient } from "./QueueClient";

export const metadata: Metadata = {
  title: "Queue",
  description:
    "Daftar antrian commission Hachuw yang sedang dikerjakan.",
};

export default function QueuePage() {
  return <QueueClient />;
}