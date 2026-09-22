import { Section } from "@/components/ui/Section";
import { SOCIAL_LINKS } from "@/lib/constants/social-links";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function SocialSection() {
  return (
    <Section className="pb-20">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-ink-800 sm:text-3xl">
          Find Me On
        </h2>
        <p className="mt-2 text-sm text-ink-400">
          Let&apos;s stay connected ♡
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 rounded-round border border-blush-100 bg-white/80 p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-blush-200 hover:shadow-hover"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-cream-100 text-ink-600 transition-colors group-hover:bg-blush-100 ${social.color}`}
            >
              <SocialIcon name={social.icon} className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-ink-600">
              {social.name}
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}