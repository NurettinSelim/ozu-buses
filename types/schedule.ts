export type ScheduleType = "shuttle" | "iett";
export type ScheduleDirection = "campus-to-metro" | "metro-to-campus";

export interface Schedule {
  type: ScheduleType;
  time: string;
  isWeekend: boolean;
  direction?: ScheduleDirection;
} 