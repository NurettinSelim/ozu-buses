import { getShuttleSchedules } from './shuttle';

describe('getShuttleSchedules', () => {
  it('should fetch real shuttle schedules', async () => {
    const result = await getShuttleSchedules();
    console.log('\n=== Shuttle Schedules Result ===');
    console.log(JSON.stringify(result, null, 2));
  }, 30000); // Increased timeout for real API call
}); 