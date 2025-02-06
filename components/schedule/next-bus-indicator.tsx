'use client';

import { useEffect, useState } from 'react';
import { useSchedules } from '@/lib/hooks/use-schedules';
import { Card } from "@/components/ui/card";
import { Clock, MapPin, ArrowRight } from "lucide-react";

type DayType = 'HAFTAICI' | 'CUMARTESI' | 'PAZAR';
type Direction = 'GIDIS' | 'DONUS';

function getCurrentDayType(): DayType {
  const day = new Date().getDay();
  if (day === 0) return 'PAZAR';
  if (day === 6) return 'CUMARTESI';
  return 'HAFTAICI';
}

function formatTimeLeft(minutes: number): string {
  if (minutes < 1) return 'Now';
  if (minutes === 1) return '1m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

interface NextDeparture {
  time: string;
  timeLeft: number | null;
  dayType: DayType;
  direction: Direction;
}

export function NextBusIndicator() {
  const { data: schedules } = useSchedules();
  const [nextToMetro, setNextToMetro] = useState<NextDeparture | null>(null);
  const [nextToCampus, setNextToCampus] = useState<NextDeparture | null>(null);
  const [currentDayType, setCurrentDayType] = useState<DayType>(getCurrentDayType());

  useEffect(() => {
    function findNextDeparture(schedules: any[], direction: Direction): NextDeparture | null {
      if (!schedules?.length) return null;

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const currentDayType = getCurrentDayType();

      // Get schedules for the current day type
      const todaySchedules = schedules.filter(s => 
        s.direction === direction && 
        s.day_type === currentDayType
      );

      // Find the next departure for today
      const nextToday = todaySchedules.find(schedule => {
        const [hours, minutes] = schedule.departure_time.split(':').map(Number);
        const departureMinutes = hours * 60 + minutes;
        return departureMinutes > currentTime;
      });

      if (nextToday) {
        const [hours, minutes] = nextToday.departure_time.split(':').map(Number);
        const departureMinutes = hours * 60 + minutes;
        return {
          time: nextToday.departure_time,
          timeLeft: departureMinutes - currentTime,
          dayType: currentDayType,
          direction
        };
      }

      // If no more departures today, find the first departure for the next day
      const nextDayType = getNextDayType(currentDayType);
      const nextDaySchedules = schedules.filter(s => 
        s.direction === direction && 
        s.day_type === nextDayType
      );

      if (nextDaySchedules.length) {
        return {
          time: nextDaySchedules[0].departure_time,
          timeLeft: null,
          dayType: nextDayType,
          direction
        };
      }

      return null;
    }

    function getNextDayType(currentDay: DayType): DayType {
      switch (currentDay) {
        case 'HAFTAICI':
          return new Date().getDay() === 5 ? 'CUMARTESI' : 'HAFTAICI';
        case 'CUMARTESI':
          return 'PAZAR';
        case 'PAZAR':
          return 'HAFTAICI';
      }
    }

    function updateNextDepartures() {
      if (!schedules?.length) return;
      setCurrentDayType(getCurrentDayType());
      setNextToCampus(findNextDeparture(schedules, 'DONUS'));
      setNextToMetro(findNextDeparture(schedules, 'GIDIS'));
    }

    updateNextDepartures();
    const interval = setInterval(updateNextDepartures, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [schedules]);

  if (!nextToMetro && !nextToCampus) return null;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
      <div className="relative p-6">
        <div className="grid gap-8 sm:grid-cols-2">
          {nextToCampus && (
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-muted-foreground">Metro</p>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">Campus</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-card-foreground">{nextToCampus.time}</p>
                    <span className="text-sm font-medium text-primary">
                      {nextToCampus.timeLeft ? `(${formatTimeLeft(nextToCampus.timeLeft)})` : ''}
                    </span>
                  </div>
                  {!nextToCampus.timeLeft && (
                    <p className="text-sm text-muted-foreground">
                      Next {nextToCampus.dayType === 'HAFTAICI' ? 'Weekday' : 
                           nextToCampus.dayType === 'CUMARTESI' ? 'Saturday' : 'Sunday'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {nextToMetro && (
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-muted-foreground">Campus</p>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">Metro</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-card-foreground">{nextToMetro.time}</p>
                    <span className="text-sm font-medium text-primary">
                      {nextToMetro.timeLeft ? `(${formatTimeLeft(nextToMetro.timeLeft)})` : ''}
                    </span>
                  </div>
                  {!nextToMetro.timeLeft && (
                    <p className="text-sm text-muted-foreground">
                      Next {nextToMetro.dayType === 'HAFTAICI' ? 'Weekday' : 
                           nextToMetro.dayType === 'CUMARTESI' ? 'Saturday' : 'Sunday'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 