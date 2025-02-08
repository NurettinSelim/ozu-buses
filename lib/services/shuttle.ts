import { Schedule, ScheduleDirection } from "@/types/schedule";
import { ShuttleClient } from "./shuttle-client";
import { ShuttleSchedule } from "@/types/shuttle";

export async function getShuttleSchedules(): Promise<Schedule[]> {
  const response = await Promise.all([
    ShuttleClient.getSchedules(27),
    ShuttleClient.getSchedules(26),
  ]);
  const campusToMetro = response[0];
  const metroToCampus = response[1];

  return [
    ...campusToMetro.data.flatMap((schedule) => mapShuttleSchedule(schedule, 'campus-to-metro')),
    ...metroToCampus.data.flatMap((schedule) => mapShuttleSchedule(schedule, 'metro-to-campus')),
  ];
}

function mapShuttleSchedule(schedule: ShuttleSchedule, direction: ScheduleDirection): Schedule[] {
  return schedule.data.flatMap((scheduleTime) => 
    scheduleTime.data.map((time) => ({
      type: 'shuttle',
      time,
      isWeekend: scheduleTime.title_tr === 'HAFTA SONU',
      direction,
    }))
  );
}
