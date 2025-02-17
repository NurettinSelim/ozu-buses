import { useQuery } from "@tanstack/react-query";
import { Schedule } from "@/types/schedule";
import { useEffect } from "react";

interface UseSchedulesOptions {
  direction?: string;
  isWeekend?: boolean;
}

async function fetchSchedules(options: UseSchedulesOptions = {}): Promise<Schedule[]> {
  const { direction, isWeekend } = options;
  const params = new URLSearchParams();
  
  if (direction) {
    params.set("direction", direction);
  }
  if (typeof isWeekend === "boolean") {
    params.set("isWeekend", String(isWeekend));
  }

  const queryString = params.toString();
  const url = `/api/schedules${queryString ? `?${queryString}` : ""}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }
  
  return response.json();
}

function getNextDayTimestamp(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

export function useSchedules(options: UseSchedulesOptions = {}) {
  const query = useQuery<Schedule[]>({
    queryKey: ["schedules", options],
    queryFn: () => fetchSchedules(options),
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep unused data in cache for 24 hours
  });

  useEffect(() => {
    // Set up timer to refetch when day changes
    const now = new Date();
    const msUntilNextDay = getNextDayTimestamp() - now.getTime();
    
    const timer = setTimeout(() => {
      query.refetch();
    }, msUntilNextDay);

    return () => clearTimeout(timer);
  }, [query]);

  return query;
} 