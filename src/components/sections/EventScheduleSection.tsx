"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Clock, MapPin, CalendarPlus, Navigation } from "lucide-react";
import { DrawDivider } from "../decorative/DrawDivider";
import { HaldiIcon, SangeetIcon, WeddingIcon } from "../decorative/EventIcons";

interface EventItem {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  time: string;
  attire: string;
  description: string;
  icon: React.ReactNode;
  tagColor: string;
  accentColor: string;
  badgeBg: string;
}

const EVENTS: EventItem[] = [
  {
    id: "haldi",
    name: "Haldi Ceremony",
    subtitle: "Pithi & Turmeric Blessings",
    date: "Saturday, 21st November 2026",
    time: "1:00 PM Onwards",
    attire: "Sunshine Yellow, Ochre & Floral Pastels",
    description:
      "A joyful afternoon of fragrant turmeric paste, flower showers, refreshing welcome coolers, and traditional folk music to invoke auspicious beginnings.",
    icon: <HaldiIcon className="w-6 h-6 text-amber-700" />,
    tagColor: "bg-amber-100/90 text-amber-950 border-amber-300",
    accentColor: "border-l-amber-500",
    badgeBg: "bg-amber-500/15",
  },
  {
    id: "sangeet",
    name: "Sangeet & Musical Night",
    subtitle: "Rhythm, Cocktails & Starlight",
    date: "Saturday, 21st November 2026",
    time: "7:00 PM Onwards",
    attire: "Indo-Western Glamour, Royal Emerald & Deep Jewel Tones",
    description:
      "An electric evening of choreographed family dance battles, cocktails, lavish barbecue, and dancing late into the night under the Corbett canopy.",
    icon: <SangeetIcon className="w-6 h-6 text-emerald-800" />,
    tagColor: "bg-emerald-100/90 text-emerald-950 border-emerald-300",
    accentColor: "border-l-emerald-600",
    badgeBg: "bg-emerald-600/15",
  },
  {
    id: "wedding",
    name: "The Wedding & Phere",
    subtitle: "Sacred Vows & Eternal Union",
    date: "Sunday, 22nd November 2026",
    time: "Evening Celebrations",
    attire: "Regal Indian Traditional (Ivory, Crimson & Antique Gold)",
    description:
      "The ceremonial Baraat procession, exchange of fragrant Varmala garlands, and sacred fire pheras as Priyal and Justin bind their lives in sacred union.",
    icon: <WeddingIcon className="w-6 h-6 text-maroon-800" />,
    tagColor: "bg-maroon-100/90 text-maroon-950 border-maroon-300",
    accentColor: "border-l-maroon-700",
    badgeBg: "bg-maroon-700/15",
  },
];

const MAPS_URL = "https://maps.google.com/?q=Corbett+Adventure+Resort+Bail+Parao+Uttarakhand";

export const EventScheduleSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMobileCard, setActiveMobileCard] = useState(0);

  // Self-drawing vertical gold line progress for desktop
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 80%"],
  });

  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const downloadIcs = (eventKey: string) => {
    window.location.href = `/api/calendar?event=${eventKey}`;
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const cardWidth = e.currentTarget.offsetWidth * 0.85;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveMobileCard(Math.min(EVENTS.length - 1, Math.max(0, index)));
  };

  return (
    <section id="schedule-section" className="py-24 px-4 bg-[#FAF4E8] relative overflow-hidden">
      {/* Background Subtle Leaf Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#C9A24B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] uppercase tracking-[0.35em] text-gold-700 font-sans font-semibold mb-2"
          >
            Wedding Itinerary
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl sm:text-6xl text-maroon-900 font-normal tracking-tight"
          >
            Ceremonies &amp; Celebrations
          </motion.h2>

          {/* Self-drawing divider */}
          <DrawDivider variant="lotus" />

          <p className="text-xs sm:text-sm text-charcoal-600 max-w-xl mx-auto font-sans leading-relaxed">
            Please join us across two unforgettable days of tradition, warmth, and festivity at Corbett Adventure Resort.
          </p>
        </div>

        {/* ======================================================== */}
        {/* 1. DESKTOP VIEW: Self-Drawing Vertical Gold Timeline Line */}
        {/* ======================================================== */}
        <div ref={containerRef} className="hidden md:block relative pl-12 sm:pl-16 space-y-12 my-8">
          {/* Background Track Line */}
          <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-gold-300/30" />

          {/* Animated Self-Drawing Gold Progress Line */}
          <motion.div
            className="absolute left-6 top-6 w-[2px] bg-gradient-to-b from-[#C9A24B] via-[#ECC876] to-[#FFE8A3] origin-top shadow-[0_0_12px_rgba(201,162,75,0.7)]"
            style={{
              height: "calc(100% - 48px)",
              scaleY: lineHeight,
            }}
          />

          {EVENTS.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30, rotateX: 6 }}
              whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`relative bg-ivory-50 rounded-[28px] p-8 shadow-luxe border-2 border-gold-300/80 hover:border-gold-400 hover:shadow-luxe-hover transition-all duration-300 border-l-8 ${event.accentColor}`}
            >
              {/* Timeline Node Point on the Vertical Line */}
              <div className="absolute -left-12 sm:-left-16 top-8 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FAF4E8] border-2 border-gold-500 shadow-sm flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-gold-600 to-gold-300 animate-pulse" />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border ${event.tagColor}`}>
                      {event.icon}
                      <span>{event.subtitle}</span>
                    </span>
                    <span className="text-[11px] font-sans uppercase tracking-widest text-gold-700 font-bold">
                      Day {index === 2 ? "2" : "1"}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-maroon-900 font-medium tracking-tight">
                    {event.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs sm:text-sm text-charcoal-700 font-sans">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gold-600" />
                      <span className="font-bold text-charcoal-900">{event.date}</span>
                      <span className="text-gold-400">&bull;</span>
                      <span className="font-semibold text-maroon-800">{event.time}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-charcoal-600 font-sans leading-relaxed">
                    {event.description}
                  </p>

                  <div className="inline-block bg-ivory-200/70 rounded-xl px-4 py-2 text-xs text-charcoal-800 border border-gold-300/60 mt-1">
                    <strong className="text-maroon-900">Dress Code: </strong>
                    <span>{event.attire}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
                  <button
                    onClick={() => downloadIcs(event.id)}
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-ivory-100 hover:bg-gold-100 text-maroon-900 border border-gold-400/80 text-xs font-sans font-semibold transition-all shadow-sm active:scale-95"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-gold-600" />
                    <span>Add to Calendar</span>
                  </button>

                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-ivory-50 hover:bg-ivory-200 text-charcoal-700 border border-charcoal-300 text-xs font-sans font-semibold transition-all shadow-sm active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-maroon-700" />
                    <span>Open in Maps</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* 2. MOBILE VIEW: Horizontal Snap-Scroll Carousel with Dots */}
        {/* ======================================================== */}
        <div className="block md:hidden">
          <div
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-4 -mx-4 px-4 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {EVENTS.map((event, index) => (
              <div
                key={event.id}
                className={`snap-center shrink-0 w-[88vw] max-w-[340px] bg-ivory-50 rounded-[28px] p-6 shadow-luxe border-2 border-gold-300/80 border-l-6 ${event.accentColor} flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${event.tagColor}`}>
                      {event.icon}
                      <span>{event.subtitle}</span>
                    </span>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-gold-700 font-bold">
                      Day {index === 2 ? "2" : "1"}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-maroon-900 font-medium">
                    {event.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-charcoal-700 font-sans">
                    <Clock className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <span className="font-bold">{event.date}</span>
                  </div>
                  <span className="text-xs font-semibold text-maroon-800 block">
                    {event.time}
                  </span>

                  <p className="text-xs text-charcoal-600 font-sans leading-relaxed">
                    {event.description}
                  </p>

                  <div className="bg-ivory-200/70 rounded-xl p-2.5 text-[11px] text-charcoal-800 border border-gold-300/60">
                    <strong className="text-maroon-900">Dress Code: </strong>
                    <span>{event.attire}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-5">
                  <button
                    onClick={() => downloadIcs(event.id)}
                    type="button"
                    className="py-2.5 px-3 rounded-full bg-ivory-100 border border-gold-400 text-maroon-900 text-[11px] font-sans font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CalendarPlus className="w-3 h-3 text-gold-600" />
                    <span>Calendar</span>
                  </button>

                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-full bg-ivory-50 border border-charcoal-300 text-charcoal-700 text-[11px] font-sans font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MapPin className="w-3 h-3 text-maroon-700" />
                    <span>Maps</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel Pagination Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {EVENTS.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeMobileCard === i
                    ? "w-7 bg-maroon-800 shadow-xs"
                    : "w-2 bg-gold-400/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Global Itinerary Download Button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => downloadIcs("all")}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-ivory-50 border-2 border-gold-400/80 text-maroon-900 hover:bg-gold-50 text-xs sm:text-sm font-sans font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CalendarPlus className="w-4 h-4 text-gold-600" />
            <span>Download Full Itinerary (.ics for Apple &amp; Google Calendar)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
