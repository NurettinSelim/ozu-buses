"use client";

import { NextBusIndicator } from "@/components/schedule/next-bus-indicator";
import { ScheduleTable } from "@/components/schedule/schedule-table";
import { Navbar } from "@/components/layout/navbar";
import { Bus } from "lucide-react";
import { useSchedules } from "@/lib/hooks/use-schedules";

export default function HomePage() {
  const { data: schedules = [] } = useSchedules();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Title and Description */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">ÇM44 Bus Schedule</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Real-time schedules for Özyeğin University&apos;s students
            </p>
          </div>

          {/* Next Bus Indicators */}
          <div className="w-full">
            <NextBusIndicator schedules={schedules} />
          </div>

          {/* Schedule Section */}
          <section className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-4 border-b bg-muted/50">
              <h2 className="text-base sm:text-lg font-semibold text-card-foreground">Today&apos;s Schedule</h2>
            </div>
            <div className="p-3 sm:p-4 lg:p-6">
              <ScheduleTable />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card">
        <div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-card-foreground">
              <Bus className="h-4 w-4" />
              <span className="font-medium">ÖzÜ Bus Tracker</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span>Built by</span>
              <a
                href="https://github.com/nurettinselim"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
              >
                nurettinselim
              </a>
              <span>·</span>
              <span>© 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
