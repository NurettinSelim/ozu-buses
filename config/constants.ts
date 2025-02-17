import { ScheduleDirection } from "@/types/schedule";

export const DIRECTION_LABELS = {
  [ScheduleDirection.CAMPUS_TO_METRO]: "Campus → Metro",
  [ScheduleDirection.METRO_TO_CAMPUS]: "Metro → Campus",
} as const;

export const LOCATION_INFO = {
  [ScheduleDirection.CAMPUS_TO_METRO]: {
    from: 'Özyeğin University',
    to: 'Çekmeköy Metro'
  },
  [ScheduleDirection.METRO_TO_CAMPUS]: {
    from: 'Çekmeköy Metro',
    to: 'Özyeğin University'
  }
}

export const DIRECTIONS = Object.values(ScheduleDirection);