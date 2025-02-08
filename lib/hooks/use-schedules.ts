import { useQuery } from "@tanstack/react-query";
import { Schedule } from "@/types/schedule";

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

export function useSchedules(options: UseSchedulesOptions = {}) {
  return useQuery<Schedule[]>({
    queryKey: ["schedules", options],
    queryFn: () => fetchSchedules(options),
  });
} 