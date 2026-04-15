import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FeaturedItems } from "@/components/landing/FeaturedItems";
import { StudentsMoment } from "@/components/landing/StudentsMoment";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { OurPromises } from "@/components/landing/OurPromises";
import { Testimonials } from "@/components/landing/Testimonials";
import { AdminSection } from "@/components/AdminSection";
import { InquiriesSection } from "@/components/InquiriesSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bholenath Chai & Snacks Center — KJ College Yewalewadi" },
      { name: "description", content: "Your favourite campus chai stall at KJ College, Yewalewadi, Pune. Fresh masala chai, kulhad chai, samosas, vada pav and more at student-friendly prices." },
      { property: "og:title", content: "Bholenath Chai & Snacks Center — KJ College Yewalewadi" },
      { property: "og:description", content: "Har Sip Mein Bhakti aur Swad — Premium chai & snacks at KJ College campus." },
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
      <StudentsMoment />
      <OurPromises />
      <WhyChooseUs />
      <Testimonials />
      <AdminSection />
      <InquiriesSection />
    </>
  );
}
