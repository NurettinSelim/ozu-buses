import { describe, expect, test, beforeEach, mock } from "bun:test";
import { GET } from "./route";
import type { Schedule } from '@/types/iett';
import { getSchedules } from '@/lib/services/iett';

// Mock IETT API response
const mockSchedules: Schedule[] = [
  {
    route_code: 'ÇM44',
    route_name: 'NİŞANTEPE - ÇEKMEKÖY METRO/ PROF.DR. FERİHA ÖZ HAS',
    direction: 'GIDIS',
    day_type: 'HAFTAICI',
    departure_time: '19:35',
    route_marker: '(-1) '
  },
  {
    route_code: 'ÇM44',
    route_name: 'NİŞANTEPE - ÇEKMEKÖY METRO/ PROF.DR. FERİHA ÖZ HAS',
    direction: 'GIDIS',
    day_type: 'PAZAR',
    departure_time: '14:50',
    route_marker: '(-1) '
  },
  {
    route_code: 'ÇM44',
    route_name: 'NİŞANTEPE - ÇEKMEKÖY METRO/ PROF.DR. FERİHA ÖZ HAS',
    direction: 'GIDIS',
    day_type: 'PAZAR',
    departure_time: '12:00',
    route_marker: undefined
  }
];

describe("ÇM44 Schedules API", () => {
  beforeEach(() => {
    // Mock getSchedules function before each test
    mock.module('@/lib/services/iett', () => ({
      getSchedules: () => Promise.resolve(mockSchedules)
    }));
  });

  const isValidSchedule = (schedule: Schedule) => {
    return (
      typeof schedule.route_code === 'string' &&
      typeof schedule.route_name === 'string' &&
      ['GIDIS', 'DONUS'].includes(schedule.direction) &&
      ['HAFTAICI', 'CUMARTESI', 'PAZAR'].includes(schedule.day_type) &&
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(schedule.departure_time) && // HH:mm format
      schedule.route_marker === '(-1) ' // Only (-1) routes
    );
  };

  test("should return only (-1) routes when no filters are applied", async () => {
    const req = new Request("http://localhost:3000/api/schedules/cm44");
    const response = await GET(req);
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2); // Only two (-1) routes in mock data
    expect(data.every(isValidSchedule)).toBe(true);
    expect(data.every((schedule: Schedule) => schedule.route_marker === '(-1) ')).toBe(true);
  });

  test("should return only (-1) routes when filtered by direction", async () => {
    const req = new Request("http://localhost:3000/api/schedules/cm44?direction=gidis");
    const response = await GET(req);
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.every(isValidSchedule)).toBe(true);
    expect(data.every((schedule: Schedule) => 
      schedule.direction === "GIDIS" && 
      schedule.route_marker === '(-1) '
    )).toBe(true);
  });

  test("should return only (-1) routes when filtered by day type", async () => {
    const req = new Request("http://localhost:3000/api/schedules/cm44?dayType=haftaici");
    const response = await GET(req);
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.every(isValidSchedule)).toBe(true);
    expect(data.every((schedule: Schedule) => 
      schedule.day_type === "HAFTAICI" &&
      schedule.route_marker === '(-1) '
    )).toBe(true);
  });

  test("should return only (-1) routes when filtered by both direction and day type", async () => {
    const req = new Request(
      "http://localhost:3000/api/schedules/cm44?direction=gidis&dayType=haftaici"
    );
    const response = await GET(req);
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.every(isValidSchedule)).toBe(true);
    expect(data.every((schedule: Schedule) => 
      schedule.direction === "GIDIS" && 
      schedule.day_type === "HAFTAICI" &&
      schedule.route_marker === '(-1) '
    )).toBe(true);
  });

  test("should handle IETT API errors gracefully", async () => {
    // Mock API error
    mock.module('@/lib/services/iett', () => ({
      getSchedules: () => Promise.reject(new Error('IETT API Error'))
    }));

    const req = new Request("http://localhost:3000/api/schedules/cm44");
    const response = await GET(req);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

}); 