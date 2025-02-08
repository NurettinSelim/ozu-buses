'use client';

import { useEffect, useState } from "react";
import { Schedule, ScheduleDirection } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NextBusIndicatorProps {
  schedules: Schedule[];
}

const directionLabels: Record<ScheduleDirection, string> = {
  'campus-to-metro': 'Campus → Metro',
  'metro-to-campus': 'Metro → Campus'
};

const locationInfo: Record<ScheduleDirection, { from: string; to: string }> = {
  'campus-to-metro': {
    from: 'Özyeğin University',
    to: 'Çekmeköy-Sancaktepe Metro'
  },
  'metro-to-campus': {
    from: 'Çekmeköy-Sancaktepe Metro',
    to: 'Özyeğin University'
  }
};

interface NextDepartureInfo {
  time: string | null;
  timeUntil: string;
  isUrgent: boolean;
}

export function NextBusIndicator({ schedules }: NextBusIndicatorProps) {
  const [departures, setDepartures] = useState<Record<ScheduleDirection, NextDepartureInfo>>({
    'campus-to-metro': { time: null, timeUntil: '', isUrgent: false },
    'metro-to-campus': { time: null, timeUntil: '', isUrgent: false}
  });

  useEffect(() => {
    const updateNextDepartures = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;
      const isWeekend = now.getDay() === 0 || now.getDay() === 6;

      const newDepartures = { ...departures };

      (['campus-to-metro', 'metro-to-campus'] as const).forEach((direction) => {
        const directionSchedules = schedules
          .filter((s) => s.isWeekend === isWeekend && s.direction === direction);

        let nextSchedule: Schedule | undefined;
        const nextTime = directionSchedules
          .find((s) => {
            const [hours, minutes] = s.time.split(":").map(Number);
            const time = hours * 60 + minutes;
            if (time > currentTime) {
              nextSchedule = s;
              return true;
            }
            return false;
          });

        if (nextSchedule && nextTime) {
          const [hours, minutes] = nextSchedule.time.split(":").map(Number);
          const nextTimeInMinutes = hours * 60 + minutes;
          const minutesUntil = nextTimeInMinutes - currentTime;
          
          newDepartures[direction] = {
            time: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
            timeUntil: `${minutesUntil} minutes`,
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
      {(['campus-to-metro', 'metro-to-campus'] as const).map((direction) => {
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
                    <h3 className="text-lg font-semibold">{directionLabels[direction]}</h3>
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
                    <span className="text-muted-foreground">{locationInfo[direction].from}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                    <span className="text-muted-foreground">{locationInfo[direction].to}</span>
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