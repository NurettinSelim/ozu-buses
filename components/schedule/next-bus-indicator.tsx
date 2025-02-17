'use client';

import { useEffect, useState } from "react";
import { Schedule, ScheduleDirection } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DIRECTION_LABELS, DIRECTIONS, LOCATION_INFO } from "@/config/constants";
import { normalizeTimeForSort, minutesToTime, formatTimeUntil, getCurrentTimeInMinutes } from "@/lib/utils/time";

interface NextBusIndicatorProps {
  schedules: Schedule[];
}

interface NextDepartureInfo {
  time: string | null;
  timeUntil: string;
  isUrgent: boolean;
}

export function NextBusIndicator({ schedules }: NextBusIndicatorProps) {
  const [departures, setDepartures] = useState<Record<ScheduleDirection, NextDepartureInfo>>({
    [ScheduleDirection.CAMPUS_TO_METRO]: { time: null, timeUntil: '', isUrgent: false },
    [ScheduleDirection.METRO_TO_CAMPUS]: { time: null, timeUntil: '', isUrgent: false}
  });

  useEffect(() => {
    const updateNextDepartures = () => {
      const currentTime = getCurrentTimeInMinutes();
      const normalizedCurrentTime = normalizeTimeForSort(minutesToTime(currentTime));
      const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

      const newDepartures = { ...departures };

      DIRECTIONS.forEach((direction) => {
        const directionSchedules = schedules
          .filter((s) => s.isWeekend === isWeekend && s.direction === direction);

        let nextSchedule: Schedule | undefined;
        const nextTime = directionSchedules
          .find((s) => {
            const normalizedScheduleTime = normalizeTimeForSort(s.time);
            if (normalizedScheduleTime > normalizedCurrentTime) {
              nextSchedule = s;
              return true;
            }
            return false;
          });

        if (nextSchedule && nextTime) {
          const normalizedScheduleTime = normalizeTimeForSort(nextSchedule.time);
          const minutesUntil = normalizedScheduleTime - normalizedCurrentTime;
          
          newDepartures[direction] = {
            time: nextSchedule.time,
            timeUntil: formatTimeUntil(minutesUntil),
            isUrgent: minutesUntil <= 10,
          };
        } else {
          newDepartures[direction] = {
            time: null,
            timeUntil: "No more departures today",
            isUrgent: false,
          };
        }
      });

      setDepartures(newDepartures);
    };

    updateNextDepartures();
    const interval = setInterval(updateNextDepartures, 60000);
    return () => clearInterval(interval);
  }, [schedules]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {DIRECTIONS.map((direction) => {
        const departure = departures[direction];
        
        return (
          <Card 
            key={direction}
            className={cn(
              "w-full transition-colors duration-300",
              departure.isUrgent ? "border-primary" : !departure.time && "bg-muted"
            )}
          >
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: departure.isUrgent ? [0, 15, -15, 0] : 0 }}
                      transition={{ duration: 0.5, repeat: departure.isUrgent ? Infinity : 0, repeatDelay: 1 }}
                    >
                      <Clock className={cn(
                        "h-5 w-5 transition-colors",
                        departure.isUrgent ? "text-primary" : "text-muted-foreground"
                      )} />
                    </motion.div>
                    <h3 className="text-lg font-semibold">{DIRECTION_LABELS[direction]}</h3>
                  </div>
                  <AnimatePresence mode="wait">
                    {departure.time && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <Badge 
                          variant={departure.isUrgent ? "default" : "secondary"}
                          className={cn(
                            "text-sm px-3 py-1",
                            departure.isUrgent && "animate-pulse"
                          )}
                        >
                          {departure.time}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">{LOCATION_INFO[direction].from}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                    <span className="text-muted-foreground">{LOCATION_INFO[direction].to}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      "transition-colors",
                      departure.isUrgent ? "text-primary font-medium" : "text-muted-foreground"
                    )}>
                      {departure.timeUntil}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 