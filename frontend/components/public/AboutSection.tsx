import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { SITE } from "@/lib/constants/site";

export function AboutSection() {
  // Split by double newline to render paragraphs
  const paragraphs = SITE.creator.bio.split("\n\n");

  return (
    <Section className="pb-6 sm:pb-8">
      <Card className="p-6 sm:p-10">
        <h2 className="font-display text-2xl font-bold text-ink-800 sm:text-3xl">
          About Me
        </h2>
        <div className="mt-2 h-1 w-12 rounded-full bg-blush-300" />

        <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-600">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </Card>
    </Section>
  );
}