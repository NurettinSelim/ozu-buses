import { useQuery } from '@tanstack/react-query';
import type { Schedule } from '@/types/schedule';

interface ScheduleFilters {
  direction?: string;
  dayType?: string;
}

async function fetchSchedules(filters: ScheduleFilters = {}): Promise<Schedule[]> {
  const searchParams = new URLSearchParams();
  
  if (filters.direction) {
    searchParams.set('direction', filters.direction);
  }
  if (filters.dayType) {
    searchParams.set('dayType', filters.dayType);
  }

  const queryString = searchParams.toString();
  const url = `/api/schedules${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch schedules');
  }
  
  return response.json();
}

export function useSchedules(filters: ScheduleFilters = {}) {
  return useQuery({
    queryKey: ['schedules', filters],
    queryFn: () => fetchSchedules(filters),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });
} 