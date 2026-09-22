import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { MarqueeSection } from "@/components/public/MarqueeSection";
import { SocialSection } from "@/components/public/SocialSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <MarqueeSection />
      <SocialSection />
    </>
  );
}