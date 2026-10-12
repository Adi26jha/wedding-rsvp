"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield, KeyRound, ArrowRight } from "lucide-react";
import { MandalaCrest } from "@/components/decorative/MandalaCrest";
import { GoldDivider } from "@/components/decorative/GoldDivider";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Test credentials against admin API
      const res = await fetch("/api/admin/rsvps", {
        headers: {
          "x-admin-key": password,
          "x-admin-email": adminEmail || "admin@priyaljustin.com",
        },
      });

      if (!res.ok) {
        setError("Invalid access credentials. Please verify your passcode.");
        setIsLoading(false);
        return;
      }

      // Store in session storage & cookie for subsequent requests
      sessionStorage.setItem("wedding_admin_key", password);
      sessionStorage.setItem("wedding_admin_email", adminEmail || "admin@priyaljustin.com");
      document.cookie = `admin_session=${password}; path=/; max-age=86400; SameSite=Strict`;

      router.push("/admin");
    } catch {
      setError("Unable to authenticate. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-ivory-50 border border-gold-300 rounded-3xl p-6 sm:p-8 shadow-luxe text-center relative overflow-hidden">
        <MandalaCrest size="sm" className="mx-auto mb-2" />

        <h1 className="font-serif text-2xl sm:text-3xl text-maroon-900 font-normal">
          Priyal &amp; Justin
        </h1>
        <p className="font-sans text-xs uppercase tracking-widest text-gold-700 mt-0.5">
          Wedding Portal Administration
        </p>

        <GoldDivider variant="diamond" className="my-4" />

        <div className="flex items-center justify-center gap-1.5 text-xs text-charcoal-500 mb-6 bg-ivory-200/60 py-1.5 px-3 rounded-full border border-gold-200 w-fit mx-auto">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Restricted to Authorized Hosts Only</span>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label
              htmlFor="adminEmail"
              className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-700"
            >
              Host / Admin Email (For Audit Trail)
            </label>
            <input
              id="adminEmail"
              type="email"
              placeholder="e.g. priyal@example.com / justin@example.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-100 border border-gold-300 text-charcoal-900 placeholder-charcoal-400 text-xs focus:outline-none focus:ring-2 focus:ring-maroon-100"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-700"
            >
              Security Passcode <span className="text-maroon-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-600">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                required
                placeholder="Enter admin passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-ivory-100 border border-gold-300 text-charcoal-900 placeholder-charcoal-400 text-xs focus:outline-none focus:ring-2 focus:ring-maroon-100"
              />
            </div>
            <p className="text-[10px] text-charcoal-400 mt-1">
              Default passcode: <code className="bg-ivory-200 px-1 py-0.5 rounded text-charcoal-700">corbett2026admin</code>
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] py-3 px-6 rounded-full bg-gradient-to-r from-maroon-800 to-maroon-700 text-ivory-50 text-xs font-sans font-semibold tracking-wider uppercase shadow-luxe hover:shadow-luxe-hover flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying Access...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Access Admin Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
