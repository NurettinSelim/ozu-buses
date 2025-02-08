'use client';

import { useState } from "react";
import { Schedule } from "@/types/schedule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleFilterProps {
  schedules: Schedule[];
  onFilterChange: (dayType: string, direction: string) => void;
}

export function ScheduleFilter({ onFilterChange }: ScheduleFilterProps) {
  const [dayType, setDayType] = useState("weekday");
  const [direction, setDirection] = useState("all");

  const handleDayTypeChange = (value: string) => {
    setDayType(value);
    onFilterChange(value, direction);
  };

  const handleDirectionChange = (value: string) => {
    setDirection(value);
    onFilterChange(dayType, value);
  };

  return (
    <div className="flex gap-4">
      <Select value={dayType} onValueChange={handleDayTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select day type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekday">Weekday</SelectItem>
          <SelectItem value="weekend">Weekend</SelectItem>
        </SelectContent>
      </Select>

      <Select value={direction} onValueChange={handleDirectionChange}>
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
  );
} 