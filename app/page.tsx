import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HighlightsSection } from "@/components/landing/HighlightsSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { SpeakersSection } from "@/components/landing/SpeakersSection";
import { WhatYouWillLearnSection } from "@/components/landing/WhatYouWillLearnSection";
import { ScheduleSection } from "@/components/landing/ScheduleSection";
import { TicketPreviewSection } from "@/components/landing/TicketPreviewSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBanner } from "@/components/landing/CtaBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HighlightsSection />
        <AboutSection />
        <SpeakersSection />
        <WhatYouWillLearnSection />
        <ScheduleSection />
        <TicketPreviewSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
