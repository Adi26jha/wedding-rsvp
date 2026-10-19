"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Calendar,
  Phone,
  Mail,
  Shield,
  FileSpreadsheet,
  FileText,
  ExternalLink,
  Lock,
  Loader2,
} from "lucide-react";

interface AttendeeView {
  id: string;
  fullName: string;
  ageGroup: "adult" | "child";
  documentName?: string;
  documentType?: string;
  documentSize?: number;
  hasDocument: boolean;
}

interface RsvpView {
  id: string;
  primaryContactName: string;
  mobileNumber: string;
  email?: string | null;
  attendanceStatus: "attending" | "declined";
  attendingEvents: string[];
  guestCount: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  attendees: AttendeeView[];
}

interface AdminRsvpTableProps {
  rsvps: RsvpView[];
  adminKey: string;
}

export const AdminRsvpTable: React.FC<AdminRsvpTableProps> = ({ rsvps, adminKey }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filtered List
  const filteredRsvps = rsvps.filter((r) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      r.primaryContactName.toLowerCase().includes(search) ||
      r.mobileNumber.includes(search) ||
      r.attendees.some((a) => a.fullName.toLowerCase().includes(search));

    const matchesStatus =
      statusFilter === "all" || r.attendanceStatus === statusFilter;

    const matchesEvent =
      eventFilter === "all" ||
      r.attendingEvents.includes(eventFilter) ||
      (eventFilter === "cocktail" && r.attendingEvents.includes("sangeet"));

    return matchesSearch && matchesStatus && matchesEvent;
  });

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleViewDocument = (attendeeId: string) => {
    // Open decrypted document in secure tab
    window.open(
      `/api/admin/document?attendeeId=${attendeeId}&key=${encodeURIComponent(adminKey)}`,
      "_blank"
    );
  };

  const handleDownloadDocument = async (attendeeId: string, customFileName?: string) => {
    try {
      setDownloadingId(attendeeId);
      const url = `/api/admin/document?attendeeId=${attendeeId}&download=true&key=${encodeURIComponent(adminKey)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Unable to download document. Attendee record not found or error occurred.");
        return;
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("content-disposition");
      let downloadName = customFileName;
      if (!downloadName && contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) {
          downloadName = match[1];
        }
      }
      if (!downloadName) {
        downloadName = `aadhaar-${attendeeId.slice(0, 8)}.jpg`;
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download document. Please check your network connection.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAllFamilyDocs = (attendees: AttendeeView[]) => {
    attendees.forEach((att, idx) => {
      setTimeout(() => {
        handleDownloadDocument(att.id, att.documentName);
      }, idx * 400);
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const triggerExport = () => {
    const url = `/api/admin/export`;
    fetch(url, {
      headers: { "x-admin-key": adminKey },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `priyal-justin-wedding-rsvps-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => console.error("Export error:", err));
  };

  return (
    <div className="space-y-4">
      {/* Search, Filters, and Export Toolbar */}
      <div className="bg-ivory-50 border border-gold-300/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gold-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search family name, attendee, or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-100/70 border border-gold-300 text-charcoal-900 placeholder-charcoal-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-100"
            />
          </div>

          {/* Export Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={triggerExport}
              className="px-4 py-2.5 rounded-xl bg-ivory-100 hover:bg-gold-100/70 border border-gold-400 text-maroon-900 text-xs font-sans font-medium flex items-center gap-1.5 transition-all shadow-sm"
              title="Download attendee list as CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-gold-600" />
              <span>Export Roster CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-charcoal-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-ivory-100 border border-gold-300 rounded-lg px-2.5 py-1 text-charcoal-800 text-xs focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="attending">Joyfully Attending</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-charcoal-500 font-medium">Event:</span>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-ivory-100 border border-gold-300 rounded-lg px-2.5 py-1 text-charcoal-800 text-xs focus:outline-none"
            >
              <option value="all">All Events</option>
              <option value="haldi">Haldi</option>
              <option value="cocktail">Cocktail &amp; Ring</option>
              <option value="chooda">Chooda Ceremony</option>
              <option value="wedding">The Wedding</option>
            </select>
          </div>

          <span className="text-charcoal-400 ml-auto font-sans text-[11px]">
            Showing {filteredRsvps.length} of {rsvps.length} records
          </span>
        </div>
      </div>

      {/* RSVP Records Table */}
      <div className="bg-ivory-50 border border-gold-300/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory-200/80 border-b border-gold-300 text-charcoal-600 uppercase font-sans tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Family / Contact</th>
                <th className="py-3.5 px-3 font-semibold">Mobile &bull; Email</th>
                <th className="py-3.5 px-3 font-semibold">Status</th>
                <th className="py-3.5 px-3 font-semibold">Guests</th>
                <th className="py-3.5 px-3 font-semibold">Events</th>
                <th className="py-3.5 px-3 font-semibold">Date</th>
                <th className="py-3.5 px-3 font-semibold text-center">ID Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-200/50">
              {filteredRsvps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-400 font-sans">
                    No RSVP records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRsvps.map((rsvp) => {
                  const isExpanded = expandedRowId === rsvp.id;
                  const isAttending = rsvp.attendanceStatus === "attending";

                  return (
                    <React.Fragment key={rsvp.id}>
                      <tr
                        onClick={() => toggleRow(rsvp.id)}
                        className={`hover:bg-ivory-100/70 cursor-pointer transition-colors ${
                          isExpanded ? "bg-ivory-100/90" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 font-medium text-charcoal-900">
                          <span className="font-serif text-sm font-semibold text-maroon-900 block">
                            {rsvp.primaryContactName}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-charcoal-700">
                          <span className="font-mono text-xs block">+91 {rsvp.mobileNumber}</span>
                          {rsvp.email && (
                            <span className="text-[11px] text-charcoal-400 block truncate max-w-[140px]">
                              {rsvp.email}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isAttending
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-charcoal-100 text-charcoal-700 border-charcoal-300"
                            }`}
                          >
                            {isAttending ? "Attending" : "Declined"}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-charcoal-800">
                          {isAttending ? rsvp.guestCount : "—"}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1 max-w-[160px]">
                            {rsvp.attendingEvents.map((evt) => (
                              <span
                                key={evt}
                                className="px-1.5 py-0.5 bg-ivory-200/90 rounded text-[9px] uppercase font-sans font-medium text-maroon-800 border border-gold-300/40"
                              >
                                {evt}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-charcoal-400 font-sans text-[11px]">
                          {new Date(rsvp.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(rsvp.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gold-200/50 text-charcoal-500"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-maroon-800" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row for Attendee Document Details */}
                      {isExpanded && (
                        <tr className="bg-ivory-100/50">
                          <td colSpan={7} className="p-4 sm:p-5 border-t border-gold-200/60">
                            <div className="space-y-3 max-w-3xl">
                              <div className="flex items-center justify-between pb-1">
                                <h5 className="font-serif text-sm font-semibold text-maroon-900 flex items-center gap-1.5">
                                  <Shield className="w-3.5 h-3.5 text-gold-600" />
                                  Attendee Aadhaar Documents ({rsvp.attendees.length})
                                </h5>
                                {rsvp.attendees.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadAllFamilyDocs(rsvp.attendees)}
                                    className="text-[11px] font-sans text-maroon-800 hover:text-maroon-900 font-semibold flex items-center gap-1 underline underline-offset-2"
                                    title="Download all family Aadhaar documents sequentially"
                                  >
                                    <Download className="w-3 h-3" />
                                    Download All Family IDs
                                  </button>
                                )}
                              </div>

                              {rsvp.attendees.length === 0 ? (
                                <p className="text-xs text-charcoal-500 italic">
                                  No attendees recorded for this entry.
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {rsvp.attendees.map((att, idx) => (
                                    <div
                                      key={att.id || idx}
                                      className="p-3 bg-white rounded-xl border border-gold-300/70 shadow-xs flex items-center justify-between gap-2"
                                    >
                                      <div className="overflow-hidden mr-1">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-semibold text-charcoal-900 text-xs truncate">
                                            {att.fullName}
                                          </span>
                                          <span className="text-[10px] text-charcoal-400 uppercase">
                                            ({att.ageGroup})
                                          </span>
                                        </div>
                                        <span className="text-[11px] text-emerald-800 flex items-center gap-1 mt-0.5 truncate">
                                          <FileText className="w-3 h-3 shrink-0" />
                                          <span className="truncate">
                                            {att.documentName || "Aadhaar Card Attached"}
                                          </span>
                                          {att.documentSize && (
                                            <span className="text-charcoal-400">
                                              ({formatFileSize(att.documentSize)})
                                            </span>
                                          )}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => handleViewDocument(att.id)}
                                          className="px-2.5 py-1.5 rounded-lg bg-gold-100 hover:bg-gold-200 border border-gold-400 text-maroon-900 text-[11px] font-sans font-medium flex items-center gap-1 transition-all shadow-2xs"
                                          title="View decrypted document in browser"
                                        >
                                          <ExternalLink className="w-3 h-3 text-gold-700" />
                                          <span>View</span>
                                        </button>

                                        <button
                                          type="button"
                                          disabled={downloadingId === att.id}
                                          onClick={() => handleDownloadDocument(att.id, att.documentName)}
                                          className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 text-emerald-950 text-[11px] font-sans font-semibold flex items-center gap-1 transition-all shadow-2xs disabled:opacity-60 disabled:cursor-wait"
                                          title="Download decrypted Aadhaar file"
                                        >
                                          {downloadingId === att.id ? (
                                            <Loader2 className="w-3 h-3 text-emerald-700 animate-spin" />
                                          ) : (
                                            <Download className="w-3 h-3 text-emerald-700" />
                                          )}
                                          <span>{downloadingId === att.id ? "Downloading..." : "Download"}</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Notes */}
                              {rsvp.notes && (
                                <div className="p-2.5 rounded-lg bg-gold-50/70 border border-gold-200/60 text-xs text-charcoal-700">
                                  <strong className="text-maroon-900">Notes / Requests: </strong>
                                  {rsvp.notes}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
