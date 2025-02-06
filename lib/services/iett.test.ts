import { expect, test, describe } from "bun:test";
import { getSchedules } from './iett';

describe('IETT API', () => {
  test('should fetch schedules for ÇM44-1', async () => {
    try {
      console.log('Fetching schedules for ÇM44-1...');
      const schedules = await getSchedules('ÇM44');
      console.log('Success! Schedules:', JSON.stringify(schedules, null, 2));
      expect(schedules).toBeDefined();
      expect(Array.isArray(schedules)).toBe(true);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  });
}); 