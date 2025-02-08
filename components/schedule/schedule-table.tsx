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
import { ScheduleDirection } from "@/types/schedule";
import { timeToMinutes, getCurrentTimeInMinutes } from "@/lib/utils/time";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const directionLabels: Record<ScheduleDirection, string> = {
  'campus-to-metro': 'Campus → Metro',
  'metro-to-campus': 'Metro → Campus'
};

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Service</TableHead>
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

  const filteredSchedules = schedules?.filter(s => s.isWeekend === showWeekend) || [];
  
  const groupedSchedules = {
    'campus-to-metro': {
      shuttle: filteredSchedules.filter(s => s.direction === 'campus-to-metro' && s.type === 'shuttle'),
      iett: filteredSchedules.filter(s => s.direction === 'campus-to-metro' && s.type === 'iett')
    },
    'metro-to-campus': {
      shuttle: filteredSchedules.filter(s => s.direction === 'metro-to-campus' && s.type === 'shuttle'),
      iett: filteredSchedules.filter(s => s.direction === 'metro-to-campus' && s.type === 'iett')
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['campus-to-metro', 'metro-to-campus'] as const).map((direction) => {
          const directionSchedules = groupedSchedules[direction];
          const allSchedules = [...directionSchedules.shuttle, ...directionSchedules.iett].sort((a, b) => 
            timeToMinutes(a.time) - timeToMinutes(b.time)
          );
          const nextDepartureIndex = currentDayType === showWeekend ? 
            allSchedules.findIndex(schedule => timeToMinutes(schedule.time) > currentTime) : -1;

          return (
            <div key={direction} className="bg-white/90 rounded-lg p-4 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-primary">{directionLabels[direction]}</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Time</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground">Service</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSchedules.map((schedule, index) => {
                    const isNextDeparture = index === nextDepartureIndex;
                    const minutesUntil = isNextDeparture ? 
                      timeToMinutes(schedule.time) - currentTime : null;

                    return (
                      <TableRow 
                        key={`${schedule.time}-${index}`}
                        className={cn(
                          "hover:bg-secondary/50 border-border",
                          isNextDeparture && 'bg-secondary'
                        )}
                      >
                        <TableCell className={cn(
                          "font-medium text-foreground/80",
                          isNextDeparture && 'text-foreground'
                        )}>
                          <div className="flex items-center gap-2">
                            {schedule.time}
                            {isNextDeparture && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                Next ({minutesUntil}m)
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "bg-white",
                              schedule.type === 'shuttle' 
                                ? 'text-primary border-primary/30' 
                                : 'text-muted-foreground border-muted'
                            )}
                          >
                            {schedule.type === 'shuttle' ? 'Shuttle' : 'IETT'}
                          </Badge>
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