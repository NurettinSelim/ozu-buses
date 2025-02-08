'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchedules } from "@/lib/hooks/use-schedules";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { ScheduleDirection } from "@/types/schedule";
import { timeToMinutes, getCurrentTimeInMinutes } from "@/lib/time";

const directionLabels: Record<ScheduleDirection, string> = {
  'campus-to-metro': 'Campus → Metro',
  'metro-to-campus': 'Metro → Campus'
};

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function ScheduleTable() {
  const { data: schedules, isLoading, error } = useSchedules();
  const [currentDayType, setCurrentDayType] = useState<boolean>(isWeekend());
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInMinutes());
  const [selectedDirection, setSelectedDirection] = useState<string>("all");

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeInMinutes());
      setCurrentDayType(isWeekend());
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

  // Filter schedules based on selected direction
  const filteredSchedules = schedules?.filter(schedule => 
    selectedDirection === "all" || schedule.direction === selectedDirection
  ) || [];

  // Group schedules by day type
  const groupedSchedules = [true, false].reduce((acc, isWeekend) => {
    const daySchedules = filteredSchedules?.filter(s => s.isWeekend === isWeekend) || [];
    acc[isWeekend.toString()] = daySchedules;
    return acc;
  }, {} as Record<string, typeof schedules>);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={selectedDirection} onValueChange={setSelectedDirection}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value="campus-to-metro">Campus to Metro</SelectItem>
            <SelectItem value="metro-to-campus">Metro to Campus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {[true, false].map(isWeekend => {
        const daySchedules = groupedSchedules[isWeekend.toString()];
        if (!daySchedules?.length) return null;

        const isCurrentDayType = isWeekend === currentDayType;

        // Find the first next departure for the current day
        const nextDepartureIndex = isCurrentDayType ? 
          daySchedules.findIndex(schedule => timeToMinutes(schedule.time) > currentTime) : -1;

        return (
          <div key={isWeekend.toString()} className="rounded-md border">
            <div className={`px-4 py-2 border-b ${isCurrentDayType ? 'bg-primary/10' : 'bg-muted/50'}`}>
              <h3 className="font-medium flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${isCurrentDayType ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{isWeekend ? 'Weekend' : 'Weekday'}</span>
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
                      key={`${schedule.type}-${schedule.direction}-${schedule.time}-${index}`}
                      className={`group ${isNextDeparture ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                    >
                      <TableCell className={`font-medium ${isNextDeparture ? 'text-primary' : 'text-foreground'}`}>
                        {schedule.time}
                        {isNextDeparture && <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2">Next</span>}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          schedule.direction === 'campus-to-metro' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                            {directionLabels[schedule.direction as ScheduleDirection]}
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