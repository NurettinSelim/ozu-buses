'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSchedules } from "@/lib/hooks/use-schedules";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, Navigation } from "lucide-react";
import { useEffect, useState } from "react";

type DayType = 'HAFTAICI' | 'CUMARTESI' | 'PAZAR';
type Direction = 'GIDIS' | 'DONUS';

const dayTypeOrder: DayType[] = ['HAFTAICI', 'CUMARTESI', 'PAZAR'];
const dayTypeLabels: Record<DayType, string> = {
  'HAFTAICI': 'Weekdays',
  'CUMARTESI': 'Saturdays',
  'PAZAR': 'Sundays'
};

const directionLabels: Record<Direction, string> = {
  'GIDIS': 'Campus → Metro',
  'DONUS': 'Metro → Campus'
};

function getCurrentDayType(): DayType {
  const day = new Date().getDay();
  if (day === 0) return 'PAZAR';
  if (day === 6) return 'CUMARTESI';
  return 'HAFTAICI';
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function ScheduleTable() {
  const { data: schedules, isLoading, error } = useSchedules();
  const [currentDayType, setCurrentDayType] = useState<DayType>(getCurrentDayType());
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInMinutes());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeInMinutes());
      setCurrentDayType(getCurrentDayType());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Time</TableHead>
              <TableHead className="w-[120px]">Direction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load schedules. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Group schedules by day type
  const groupedSchedules = dayTypeOrder.reduce((acc, dayType) => {
    const daySchedules = schedules?.filter(s => s.day_type === dayType) || [];
    acc[dayType] = daySchedules;
    return acc;
  }, {} as Record<DayType, typeof schedules>);

  return (
    <div className="space-y-6">
      {dayTypeOrder.map(dayType => {
        const daySchedules = groupedSchedules[dayType];
        if (!daySchedules?.length) return null;

        const isCurrentDayType = dayType === currentDayType;

        // Find the first next departure for the current day
        const nextDepartureIndex = isCurrentDayType ? 
          daySchedules.findIndex(schedule => timeToMinutes(schedule.departure_time) > currentTime) : -1;

        return (
          <div key={dayType} className="rounded-md border">
            <div className={`px-4 py-2 border-b ${isCurrentDayType ? 'bg-primary/10' : 'bg-muted/50'}`}>
              <h3 className="font-medium flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${isCurrentDayType ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{dayTypeLabels[dayType]}</span>
                {isCurrentDayType && <span className="text-xs bg-primary text-primary-foreground rounded-full px-2">Today</span>}
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Time</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span>Direction</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daySchedules.map((schedule, index) => {
                  const isNextDeparture = index === nextDepartureIndex;

                  return (
                    <TableRow 
                      key={`${schedule.route_code}-${schedule.direction}-${schedule.departure_time}-${index}`}
                      className={`group ${isNextDeparture ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                    >
                      <TableCell className={`font-medium ${isNextDeparture ? 'text-primary' : 'text-foreground'}`}>
                        {schedule.departure_time}
                        {isNextDeparture && <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2">Next</span>}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          schedule.direction === 'GIDIS' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {directionLabels[schedule.direction as Direction]}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
} 