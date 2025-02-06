import type {
  IettScheduleResponse,
  Schedule,
} from '@/types/iett';
import { iettAPI, IettApiError } from './iett-client';

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
    route_code: schedule.SHATKODU,
    route_name: schedule.HATADI,
    direction: schedule.SYON === 'G' ? 'GIDIS' : 'DONUS',
    day_type: schedule.SGUNTIPI === 'I' ? 'HAFTAICI' : 
              schedule.SGUNTIPI === 'C' ? 'CUMARTESI' : 'PAZAR',
    departure_time: schedule.DT,
    route_marker: schedule.GUZERGAH_ISARETI,
  };
}

export async function getSchedules(code: string): Promise<Schedule[]> {
  try {
    const response = await iettAPI<IettScheduleResponse[]>(
      'PlanlananSeferSaati',
      'GetPlanlananSeferSaati',
      { HatKodu: code }
    );
    return response.map(mapIettSchedule);
  } catch (error) {
    if (error instanceof IettApiError) {
      throw new ServiceUnavailableError(error.message);
    }
    throw new RouteNotFoundError(code);
  }
}