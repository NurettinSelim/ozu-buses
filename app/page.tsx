import { ScheduleTable } from "@/components/schedule/schedule-table";
import { NextBusIndicator } from "@/components/schedule/next-bus-indicator";
import { ScheduleFilter } from "@/components/schedule/schedule-filter";
import { Navbar } from "@/components/layout/navbar";
import { Bus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="container py-6">
        <div className="space-y-6">
          {/* Title and Description */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">ÇM44 Bus Schedule</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time schedules for Özyeğin University students
            </p>
          </div>

          {/* Next Bus Indicators */}
          <div className="w-full">
            <NextBusIndicator />
          </div>

          {/* Schedule Section */}
          <section className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-base font-semibold text-card-foreground">Today's Schedule</h2>
              <ScheduleFilter />
            </div>
            <div className="p-4">
              <ScheduleTable />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card">
        <div className="container py-4">
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
