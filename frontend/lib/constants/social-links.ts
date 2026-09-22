export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "X",
    url: "https://x.com/hachu_w",
    icon: "x",
    color: "hover:text-ink-900",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/hachu_w/",
    icon: "instagram",
    color: "hover:text-blush-500",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/raihanun.a.hanan",
    icon: "facebook",
    color: "hover:text-info",
  },
  {
    name: "Discord",
    url: "https://discord.com/users/800943996180496385",
    icon: "discord",
    color: "hover:text-lavender-500",
  },
  {
    name: "Trakteer",
    url: "https://trakteer.id/Hachuw",
    icon: "trakteer",
    color: "hover:text-danger",
  },
  {
    name: "VGen",
    url: "https://vgen.co/hachu_w",
    icon: "vgen",
    color: "hover:text-success",
  },
];