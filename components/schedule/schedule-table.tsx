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
import { Clock, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { timeToMinutes, getCurrentTimeInMinutes } from "@/lib/utils/time";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DIRECTION_LABELS, DIRECTIONS } from "@/config/constants";
import { ScheduleDirection } from "@/types/schedule";


function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function ScheduleTable() {
  const { data: schedules, isLoading, error, refetch } = useSchedules();
  const [currentDayType, setCurrentDayType] = useState<boolean>(isWeekend());
  const [showWeekend, setShowWeekend] = useState<boolean>(isWeekend());
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInMinutes());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeInMinutes());
      setCurrentDayType(isWeekend());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
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

  if (!schedules?.length) {
    return (
      <Alert>
        <AlertDescription>
          No schedules available for today.
        </AlertDescription>
      </Alert>
    );
  }

  const filteredSchedules = schedules?.filter(s => s.isWeekend === showWeekend) || [];
  
  const groupedSchedules = {
    [ScheduleDirection.CAMPUS_TO_METRO]: {
      shuttle: filteredSchedules.filter(s => s.direction === ScheduleDirection.CAMPUS_TO_METRO && s.type === 'shuttle'),
      iett: filteredSchedules.filter(s => s.direction === ScheduleDirection.CAMPUS_TO_METRO && s.type === 'iett')
    },
    [ScheduleDirection.METRO_TO_CAMPUS]: {
      shuttle: filteredSchedules.filter(s => s.direction === ScheduleDirection.METRO_TO_CAMPUS && s.type === 'shuttle'),
      iett: filteredSchedules.filter(s => s.direction === ScheduleDirection.METRO_TO_CAMPUS && s.type === 'iett')
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-primary">Bus Schedule</h2>
          <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-1.5 shadow-sm">
            <span className="text-sm text-muted-foreground">Weekday</span>
            <Switch 
              checked={showWeekend}
              onCheckedChange={setShowWeekend}
            />
            <span className="text-sm text-muted-foreground">Weekend</span>
          </div>
          {currentDayType === showWeekend && (
            <Badge variant="outline" className="bg-secondary text-secondary-foreground">Today</Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-white/80 hover:bg-white transition-colors shadow-sm"
          onClick={() => refetch()}
        >
          <RefreshCw className="h-4 w-4 text-primary" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {DIRECTIONS.map((direction) => {
          const directionSchedules = groupedSchedules[direction];
          const allSchedules = [...directionSchedules.shuttle, ...directionSchedules.iett].sort((a, b) => 
            timeToMinutes(a.time) - timeToMinutes(b.time)
          );

          return (
            <div key={direction} className="bg-white/90 rounded-lg p-4 lg:p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-primary">{DIRECTION_LABELS[direction]}</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px] sm:w-[140px]">Time</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead className="text-right w-[100px] sm:w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSchedules.map((schedule, index) => {
                    const timeInMinutes = timeToMinutes(schedule.time);
                    const isPassed = timeInMinutes < currentTime;
                    const isNext = !isPassed && (index === 0 || (allSchedules[index - 1] && timeToMinutes(allSchedules[index - 1].time) < currentTime));

                    return (
                      <TableRow
                        key={`${schedule.time}-${schedule.direction}`}
                        className={cn(
                          "hover:bg-muted/50 transition-colors",
                          isPassed && "opacity-50"
                        )}
                      >
                        <TableCell className="font-medium py-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {schedule.time}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{DIRECTION_LABELS[direction]}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <div className="flex flex-col items-end gap-1.5">
                            {isNext && (
                              <Badge variant="secondary">Next</Badge>
                            )}
                            <Badge variant={isPassed ? "outline" : "default"}>
                              {isPassed ? "Departed" : "Scheduled"}
                            </Badge>
                          </div>
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
    </div>
  );
} 