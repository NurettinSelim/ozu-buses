'use client';

import { useEffect, useState } from "react";
import { Schedule } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface NextBusIndicatorProps {
  schedules: Schedule[];
}

export function NextBusIndicator({ schedules }: NextBusIndicatorProps) {
  const [nextDeparture, setNextDeparture] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  useEffect(() => {
    const updateNextDeparture = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      const isWeekend = now.getDay() === 0 || now.getDay() === 6;
      const todaySchedules = schedules.filter((s) => s.isWeekend === isWeekend);

      const next = todaySchedules
        .map((s) => {
          const [hours, minutes] = s.time.split(":").map(Number);
          return hours * 60 + minutes;
        })
        .find((time) => time > currentTime);

      if (next) {
        const hours = Math.floor(next / 60);
        const minutes = next % 60;
        setNextDeparture(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
        
        const minutesUntil = next - currentTime;
        setTimeUntilNext(`${minutesUntil} minutes`);
      } else {
        setNextDeparture(null);
        setTimeUntilNext("No more departures today");
      }
    };

    updateNextDeparture();
    const interval = setInterval(updateNextDeparture, 60000);
    return () => clearInterval(interval);
  }, [schedules]);

  return (
    <Card className={cn("w-full", !nextDeparture && "bg-muted")}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Next Departure</span>
        </div>
        <div className="flex items-center gap-2">
          {nextDeparture ? (
            <>
              <Badge variant="outline">{nextDeparture}</Badge>
              <span className="text-sm text-muted-foreground">in {timeUntilNext}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">{timeUntilNext}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 