export type ScheduleType = "shuttle" | "iett";

export enum ScheduleDirection {
  CAMPUS_TO_METRO = "campus-to-metro",
  METRO_TO_CAMPUS = "metro-to-campus",
}

export interface Schedule {
  type: ScheduleType;
  time: string;
  isWeekend: boolean;
  direction?: ScheduleDirection;
} 