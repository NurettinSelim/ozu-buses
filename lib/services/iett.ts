import type {
  IettScheduleResponse,
} from '@/types/iett';
import { iettAPI, IettApiError } from './iett-client';
import { ScheduleDirection, type Schedule } from '@/types/schedule';

// Custom error classes
export class IettServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IettServiceError';
  }
}

export class RouteNotFoundError extends IettServiceError {
  constructor(routeCode: string) {
    super(`Route not found: ${routeCode}`);
    this.name = 'RouteNotFoundError';
  }
}

export class ServiceUnavailableError extends IettServiceError {
  constructor(message: string) {
    super(`Service unavailable: ${message}`);
    this.name = 'ServiceUnavailableError';
  }
}

function mapIettSchedule(schedule: IettScheduleResponse): Schedule {
  return {
    type: 'iett',
    time: schedule.DT,
    isWeekend: schedule.SGUNTIPI !== 'I',
    direction: schedule.SYON === 'G' ? ScheduleDirection.CAMPUS_TO_METRO : ScheduleDirection.METRO_TO_CAMPUS,
  };
}

export async function getSchedules(code: string, marker?: string): Promise<Schedule[]> {
  try {
    const response = await iettAPI<IettScheduleResponse[]>(
      'PlanlananSeferSaati',
      'GetPlanlananSeferSaati',
      { HatKodu: code }
    );
    return response.filter(schedule => marker ? schedule.GUZERGAH_ISARETI === marker : true)
      .filter(schedule => schedule.SGUNTIPI === 'I' || schedule.SGUNTIPI === 'P')
      .map(mapIettSchedule);
  } catch (error) {
    if (error instanceof IettApiError) {
      throw new ServiceUnavailableError(error.message);
    }
    throw new RouteNotFoundError(code);
  }
}