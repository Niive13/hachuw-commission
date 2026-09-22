import { SOCIAL_LINKS } from "@/lib/constants/social-links";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-blush-100 bg-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Brand */}
          <div>
            <p className="font-display text-xl font-bold text-blush-500">
              Hachuw 🌸
            </p>
            <p className="mt-1 text-sm text-ink-400">
              Freelance Illustrator
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-400 shadow-soft transition-all hover:scale-110 hover:shadow-hover ${social.color}`}
              >
                <SocialIcon name={social.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} Hachuw. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}