"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminKpiCards } from "@/components/admin/AdminKpiCards";
import { AdminRsvpTable } from "@/components/admin/AdminRsvpTable";
import { MandalaCrest } from "@/components/decorative/MandalaCrest";
import { GoldDivider } from "@/components/decorative/GoldDivider";
import {
  Lock,
  LogOut,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  History,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rsvps" | "audit">("rsvps");
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const key = sessionStorage.getItem("wedding_admin_key");
    if (!key) {
      router.push("/admin/login");
      return;
    }
    setAdminKey(key);
    loadData(key);
  }, [router]);

  const loadData = async (key: string) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/rsvps", {
        headers: { "x-admin-key": key },
      });

      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem("wedding_admin_key");
          router.push("/admin/login");
          return;
        }
        setFetchError("Failed to fetch RSVPs");
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      setData(json);
    } catch {
      setFetchError("Network error while connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("wedding_admin_key");
    sessionStorage.removeItem("wedding_admin_email");
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-ivory-100 flex flex-col items-center justify-center p-4">
        <MandalaCrest size="sm" className="mb-4" />
        <p className="font-serif text-xl text-maroon-900">Loading Wedding RSVPs...</p>
        <span className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mt-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100/90 text-charcoal-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-ivory-50 border border-gold-300 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MandalaCrest size="sm" className="w-14 h-14 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-sans tracking-widest text-gold-700 font-semibold block">
                Executive Host Portal &bull; Corbett 2026
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-maroon-900 font-medium">
                Priyal &amp; Justin&apos;s Wedding Roster
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-gold-100 text-charcoal-700 text-xs font-sans font-medium flex items-center gap-1.5 border border-gold-300 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </Link>

            <button
              onClick={() => adminKey && loadData(adminKey)}
              className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-gold-100 text-charcoal-700 text-xs font-sans font-medium flex items-center gap-1.5 border border-gold-300 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-maroon-100 hover:bg-maroon-200 text-maroon-900 text-xs font-sans font-medium flex items-center gap-1.5 border border-maroon-300 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {fetchError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{fetchError}</span>
          </div>
        )}

        {/* KPI Metrics Cards */}
        {data.metrics && <AdminKpiCards metrics={data.metrics} />}

        {/* Tab Toggle: RSVPs vs Audit Logs */}
        <div className="flex items-center gap-2 border-b border-gold-300/80 pb-1">
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`px-4 py-2 rounded-t-xl text-xs font-sans font-medium transition-all ${
              activeTab === "rsvps"
                ? "bg-ivory-50 border-t border-l border-r border-gold-400 text-maroon-900 font-semibold shadow-xs"
                : "text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            Confirmed RSVPs &amp; Guest IDs
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-t-xl text-xs font-sans font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "audit"
                ? "bg-ivory-50 border-t border-l border-r border-gold-400 text-maroon-900 font-semibold shadow-xs"
                : "text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            <History className="w-3.5 h-3.5 text-gold-600" />
            <span>Security Audit Trail ({data.recentAuditLogs?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: RSVPs Table */}
        {activeTab === "rsvps" && (
          <AdminRsvpTable rsvps={data.rsvps || []} adminKey={adminKey || ""} />
        )}

        {/* Tab 2: Audit Logs Table */}
        {activeTab === "audit" && (
          <div className="bg-ivory-50 border border-gold-300/80 rounded-2xl overflow-hidden shadow-sm p-4">
            <div className="mb-4">
              <h3 className="font-serif text-lg font-semibold text-maroon-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Immutable Access Audit Trail
              </h3>
              <p className="text-xs text-charcoal-500 font-sans mt-0.5">
                Every Aadhaar decryption event, CSV export, and administrative action is cryptographically tracked.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-ivory-200/80 border-b border-gold-300 text-charcoal-600 uppercase font-sans text-[10px]">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Admin Identity</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Target Attendee</th>
                    <th className="py-2.5 px-3">Origin IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-200/50">
                  {(!data.recentAuditLogs || data.recentAuditLogs.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-charcoal-400">
                        No audit actions logged yet.
                      </td>
                    </tr>
                  ) : (
                    data.recentAuditLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-ivory-100/60 font-mono text-[11px]">
                        <td className="py-2.5 px-3 text-charcoal-500 font-sans">
                          {new Date(log.timestamp).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })}
                        </td>
                        <td className="py-2.5 px-3 text-maroon-900 font-semibold font-sans">
                          {log.admin_email}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-gold-100 text-gold-900 font-semibold text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-charcoal-600">
                          {log.target_attendee_id ? log.target_attendee_id.slice(0, 12) + "..." : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-charcoal-400">
                          {log.ip_address || "127.0.0.1"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
