import { Schedule } from "@/types/schedule";

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function sortByTime(schedules: Schedule[]): Schedule[] {
  return schedules.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}

export function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}