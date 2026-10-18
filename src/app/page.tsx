import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { OurStorySection } from "@/components/sections/OurStorySection";
import { EventScheduleSection } from "@/components/sections/EventScheduleSection";
import { VenueSection } from "@/components/sections/VenueSection";
import { RsvpWizard } from "@/components/sections/rsvp/RsvpWizard";
import { FooterSection } from "@/components/sections/FooterSection";
import { MusicPlayerToggle } from "@/components/audio/MusicPlayerToggle";
import { RoyalDoorIntro } from "@/components/intro/RoyalDoorIntro";

import { SmoothScrollProvider } from "@/components/scroll/SmoothScrollProvider";
import { ScrollProgressBar } from "@/components/scroll/ScrollProgressBar";
import { DrawDivider } from "@/components/decorative/DrawDivider";
import { CustomGoldCursor } from "@/components/delight/CustomGoldCursor";

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const familyParam =
    typeof resolvedSearchParams.family === "string"
      ? resolvedSearchParams.family
      : undefined;

  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-ivory text-charcoal-900 selection:bg-maroon-700 selection:text-ivory-50 relative">
        {/* Luxury Gold Dust Pointer Cursor (desktop only) */}
        <CustomGoldCursor />

        {/* Top Gold Scroll Progress Indicator */}
        <ScrollProgressBar />

        {/* Opening Ceremonial Royal Palace Doors Sequence (Shows once per session) */}
        <RoyalDoorIntro />

        {/* Ambient Instrumental Shehnai Audio Player Toggle */}
        <MusicPlayerToggle />

        {/* 1. Hero Section */}
        <HeroSection familyGreeting={familyParam} />

        {/* Ornamental Self-Drawing Section Divider */}
        <div className="py-4 bg-[#FAF7F2]">
          <DrawDivider />
        </div>

        {/* 2. Our Story / Welcome Message */}
        <OurStorySection />

        {/* Ornamental Self-Drawing Section Divider */}
        <div className="py-4 bg-ivory">
          <DrawDivider />
        </div>

        {/* 3. Event Schedule (Haldi, Cocktail & Ring, Chooda, Wedding) */}
        <EventScheduleSection />

        {/* 4. Venue & Accommodation Details */}
        <VenueSection />

        {/* 5. Core Multi-Step RSVP Flow */}
        <RsvpWizard initialFamilyParam={familyParam} />

        {/* 6. Footer & Emergency Contact Information */}
        <FooterSection />
      </main>
    </SmoothScrollProvider>
  );
}
