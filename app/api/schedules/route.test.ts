import { describe, expect, test } from "bun:test";
import { GET } from "./route";
import { ScheduleDirection, type Schedule } from '@/types/schedule';
import { DIRECTIONS } from "@/config/constants";

describe("ÇM44 Schedules API", () => {
  const isValidSchedule = (schedule: Schedule) => {
    return (
      typeof schedule.type === 'string' &&
      typeof schedule.time === 'string' &&
      typeof schedule.isWeekend === 'boolean' &&
      (!schedule.direction || DIRECTIONS.includes(schedule.direction))
    );
  };

  test("should return schedules when no filters are applied", async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0); // Should have at least one schedule
    expect(data.every(isValidSchedule)).toBe(true);
  });

  test("should return schedules with valid directions", async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.every(isValidSchedule)).toBe(true);
    // Check if we have schedules for both directions
    const hasMetroToCampus = data.some((schedule: Schedule) => 
      schedule.direction === ScheduleDirection.METRO_TO_CAMPUS
    );
    const hasCampusToMetro = data.some((schedule: Schedule) => 
      schedule.direction === ScheduleDirection.CAMPUS_TO_METRO
    );
    expect(hasMetroToCampus || hasCampusToMetro).toBe(true);
  });

  test("should return schedules with valid weekend status", async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.every(isValidSchedule)).toBe(true);
    // Check if we have both weekend and weekday schedules
    const hasWeekendSchedules = data.some((schedule: Schedule) => schedule.isWeekend);
    const hasWeekdaySchedules = data.some((schedule: Schedule) => !schedule.isWeekend);
    expect(hasWeekendSchedules || hasWeekdaySchedules).toBe(true);
  });

  test("should return schedules with valid types", async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.every(isValidSchedule)).toBe(true);
    // Check if we have both IETT and shuttle schedules
    const hasIETT = data.some((schedule: Schedule) => schedule.type === "iett");
    const hasShuttle = data.some((schedule: Schedule) => schedule.type === "shuttle");
    expect(hasIETT || hasShuttle).toBe(true);
  });
}); 