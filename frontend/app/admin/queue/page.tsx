import type { Metadata } from "next";
import { QueueAdminClient } from "./QueueAdminClient";

export const metadata: Metadata = {
  title: "Queue — Admin",
};

export default function AdminQueuePage() {
  return <QueueAdminClient />;
}