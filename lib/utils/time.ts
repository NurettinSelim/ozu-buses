import { Schedule } from "@/types/schedule";

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getTimeUntil(targetTime: string): number {
  const currentMinutes = getCurrentTimeInMinutes();
  const targetMinutes = timeToMinutes(targetTime);
  
  if (targetMinutes < currentMinutes) {
    // If target time is earlier than current time, assume it's for the next day
    return (24 * 60 - currentMinutes) + targetMinutes;
  }
  
  return targetMinutes - currentMinutes;
}

export function formatTimeUntil(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} dakika`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} saat`;
  }
  
  return `${hours} saat ${remainingMinutes} dakika`;
} 

export function sortByTime(schedules: Schedule[]): Schedule[] {
  return schedules.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}