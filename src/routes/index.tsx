import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FeaturedItems } from "@/components/landing/FeaturedItems";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { Testimonials } from "@/components/landing/Testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bholenath Chai & Snacks Center — Har Sip Mein Bhakti aur Swad" },
      { name: "description", content: "Authentic Indian chai and snacks served with love and devotion. Order masala chai, kulhad chai, samosas, and more from Bholenath Chai & Snacks Center." },
      { property: "og:title", content: "Bholenath Chai & Snacks Center" },
      { property: "og:description", content: "Har Sip Mein Bhakti aur Swad — Premium chai & snacks with a spiritual touch." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedItems />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
