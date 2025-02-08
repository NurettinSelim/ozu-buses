import { NextResponse } from 'next/server';
import { getSchedules } from '@/lib/services/iett';
import { getShuttleSchedules } from '@/lib/services/shuttle';
import { sortByTime } from '@/lib/time';
export async function GET() {
  try {
    const schedules = await getSchedules("ÇM44", "(-1) ");
    const shuttleSchedules = await getShuttleSchedules();
    return NextResponse.json(sortByTime([...schedules, ...shuttleSchedules]));
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
} 