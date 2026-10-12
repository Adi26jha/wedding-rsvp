"use client";

import React from "react";
import { Users, UserCheck, UserX, Sun, Moon, Sparkles } from "lucide-react";

interface KpiMetrics {
  totalResponses: number;
  totalAttendingResponses: number;
  totalConfirmedGuests: number;
  totalDeclined: number;
  haldiCount: number;
  sangeetCount: number;
  weddingCount: number;
}

interface AdminKpiCardsProps {
  metrics: KpiMetrics;
}

export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      {/* Total Responses */}
      <div className="bg-ivory-50 border border-gold-300/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-charcoal-400 mb-2">
          <span className="text-[10px] uppercase font-sans tracking-wider font-semibold">
            Total RSVPs
          </span>
          <Users className="w-4 h-4 text-gold-600" />
        </div>
        <p className="font-serif text-3xl font-medium text-maroon-900 leading-none">
          {metrics.totalResponses}
        </p>
        <span className="text-[10px] text-charcoal-500 font-sans mt-1 block">
          Families responded
        </span>
      </div>

      {/* Confirmed Guests */}
      <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-emerald-800 mb-2">
          <span className="text-[10px] uppercase font-sans tracking-wider font-semibold">
            Confirmed Guests
          </span>
          <UserCheck className="w-4 h-4 text-emerald-700" />
        </div>
        <p className="font-serif text-3xl font-medium text-emerald-950 leading-none">
          {metrics.totalConfirmedGuests}
        </p>
        <span className="text-[10px] text-emerald-700 font-sans mt-1 block">
          Attending members
        </span>
      </div>

      {/* Declined */}
      <div className="bg-charcoal-50 border border-charcoal-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-charcoal-500 mb-2">
          <span className="text-[10px] uppercase font-sans tracking-wider font-semibold">
            Declined
          </span>
          <UserX className="w-4 h-4 text-charcoal-600" />
        </div>
        <p className="font-serif text-3xl font-medium text-charcoal-800 leading-none">
          {metrics.totalDeclined}
        </p>
        <span className="text-[10px] text-charcoal-500 font-sans mt-1 block">
          Warm wishes sent
        </span>
      </div>

      {/* Haldi Headcount */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-amber-800 mb-2">
          <span className="text-[10px] uppercase font-sans tracking-wider font-semibold">
            Haldi Guests
          </span>
          <Sun className="w-4 h-4 text-amber-600" />
        </div>
        <p className="font-serif text-3xl font-medium text-amber-950 leading-none">
          {metrics.haldiCount}
        </p>
        <span className="text-[10px] text-amber-700 font-sans mt-1 block">
          Nov 21, 1:00 PM
        </span>
      </div>

      {/* Sangeet Headcount */}
      <div className="bg-emerald-50/60 border border-emerald-300 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-emerald-800 mb-2">
          <span className="text-[10px] uppercase font-sans tracking-wider font-semibold">
            Sangeet Guests
          </span>
          <Moon className="w-4 h-4 text-emerald-700" />
        </div>
        <p className="font-serif text-3xl font-medium text-emerald-950 leading-none">
          {metrics.sangeetCount}
        </p>
        <span className="text-[10px] text-emerald-700 font-sans mt-1 block">
          Nov 21, 7:00 PM
        </span>
      </div>

      {/* Wedding Headcount */}
      <div className="bg-maroon-50/80 border border-maroon-300 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-maroon-800 mb-2">
          <span className="text-[10px] uppercase font-sans tracking-wider font-semibold">
            Wedding Phere
          </span>
          <Sparkles className="w-4 h-4 text-maroon-700" />
        </div>
        <p className="font-serif text-3xl font-medium text-maroon-950 leading-none">
          {metrics.weddingCount}
        </p>
        <span className="text-[10px] text-maroon-700 font-sans mt-1 block">
          Nov 22, Evening
        </span>
      </div>
    </div>
  );
};
