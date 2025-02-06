'use client';

import * as React from "react";
import { Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSchedules } from "@/lib/hooks/use-schedules";
import { cn } from "@/lib/utils";

const dayTypes = [
  { value: '', label: 'All Days' },
  { value: 'HAFTAICI', label: 'Weekdays' },
  { value: 'CUMARTESI', label: 'Saturday' },
  { value: 'PAZAR', label: 'Sunday' },
];

const directions = [
  { value: '', label: 'All Directions' },
  { value: 'GIDIS', label: 'Campus → Metro' },
  { value: 'DONUS', label: 'Metro → Campus' },
];

export function ScheduleFilter() {
  const [dayType, setDayType] = React.useState('');
  const [direction, setDirection] = React.useState('');
  const { refetch } = useSchedules({ dayType, direction });

  const selectedDayType = dayTypes.find(d => d.value === dayType)?.label || 'All Days';
  const selectedDirection = directions.find(d => d.value === direction)?.label || 'All Directions';

  const handleFilterChange = (type: 'day' | 'direction', value: string) => {
    if (type === 'day') {
      setDayType(value);
    } else {
      setDirection(value);
    }
    refetch();
  };

  const hasFilters = dayType || direction;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className={cn(
            "h-4 w-4",
            hasFilters && "text-primary"
          )} />
          <span>Filter</span>
          {hasFilters && (
            <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {(dayType ? 1 : 0) + (direction ? 1 : 0)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Day Type</DropdownMenuLabel>
        <DropdownMenuGroup>
          {dayTypes.map((day) => (
            <DropdownMenuItem
              key={day.value}
              onClick={() => handleFilterChange('day', day.value)}
              className="flex items-center justify-between"
            >
              {day.label}
              {day.value === dayType && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Direction</DropdownMenuLabel>
        <DropdownMenuGroup>
          {directions.map((dir) => (
            <DropdownMenuItem
              key={dir.value}
              onClick={() => handleFilterChange('direction', dir.value)}
              className="flex items-center justify-between"
            >
              {dir.label}
              {dir.value === direction && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 