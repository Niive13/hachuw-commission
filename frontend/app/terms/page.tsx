import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { TOS_SECTIONS, PAYMENT_METHODS } from "@/lib/constants/tos";
import { PaymentMethodCard } from "@/components/public/PaymentMethodCard";
import { BackButton } from "@/components/layout/BackButton";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Syarat dan ketentuan commission Hachuw. Baca dengan teliti sebelum memesan.",
};

export default function TermsPage() {
  return (
    <>
      <Section className="pt-8">
        <BackButton />
      </Section>
      {/* Header */}
      <Section className="pb-8 pt-16 text-center sm:pt-20">
        <h1 className="font-display text-4xl font-bold text-ink-800 sm:text-5xl">
          Terms of Service
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-blush-300" />
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-400">
          Dengan melakukan commission, kamu dianggap sudah membaca dan
          menyetujui TOS di bawah ini ♡
        </p>
      </Section>

      {/* TOS Sections */}
      <Section className="pb-12">
        <div className="space-y-6">
          {TOS_SECTIONS.map((section, idx) => (
            <Card key={section.title} className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-100 font-display text-sm font-bold text-blush-500">
                  {idx + 1}
                </span>
                <h2 className="font-display text-xl font-bold text-ink-800 sm:text-2xl">
                  {section.title}
                </h2>
              </div>

              <ul className="mt-5 space-y-3">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-600"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blush-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* Payment */}
      <Section className="pb-20">
        <Card className="border-lavender-200 bg-lavender-50 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender-200 font-display text-sm font-bold text-lavender-500">
              💳
            </span>
            <h2 className="font-display text-xl font-bold text-ink-800 sm:text-2xl">
              Payment
            </h2>
          </div>

          <p className="mt-4 text-sm text-ink-600">
            Pembayaran bisa melalui:
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PAYMENT_METHODS.map((method) => (
              <PaymentMethodCard
                key={method.name}
                name={method.name}
                logo={method.logo}
              />
            ))}
          </div>
        </Card>
      </Section>
    </>
  );
}