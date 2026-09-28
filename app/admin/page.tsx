import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { dbService } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminPage() {
  // STRICT CONFIDENTIAL GUARD: Zero-bypass server enforcement.
  // Redirects immediately to /login if no valid admin session token is found.
  await requireAdminSession();

  const eventConfig = dbService.getEventConfig();
  const stats = dbService.getAdminStats();
  const tickets = dbService.getTickets();
  const profiles = dbService.getProfiles();
  const registrations = dbService.getRegistrations();
  const payments = dbService.getRegistrations().map((r) => ({
    id: `pay_${r.id}`,
    registrationId: r.id,
    userId: r.userId,
    paymentMethod: r.paymentMethod || "upi",
    upiReference: r.upiReference || (r.paymentMethod === "cash_at_desk" ? "CASH_AT_DESK" : "DIRECT_UPI"),
    amount: r.amount,
    currency: "INR",
    status: (r.status === "confirmed" ? "paid" : "pending") as "paid" | "pending",
    createdAt: r.createdAt,
    paidAt: r.updatedAt,
  }));
  const teams = dbService.getTeams();
  const submissions = dbService.getSubmissions();
  const announcements = dbService.getAllAnnouncements();
  const resources = dbService.getAllResources();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminDashboardClient
            eventConfig={eventConfig}
            stats={stats}
            tickets={tickets}
            profiles={profiles}
            registrations={registrations}
            payments={payments}
            teams={teams}
            submissions={submissions}
            announcements={announcements}
            resources={resources}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
