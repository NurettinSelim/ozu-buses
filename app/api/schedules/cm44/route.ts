import { NextResponse } from 'next/server';
import type { Schedule } from '@/types/iett';
import { getSchedules } from '@/lib/services/iett';

// Helper function to convert time string to minutes for sorting
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export async function GET(
  req: Request
) {
  try {
    // Get schedules from IETT API
    const allSchedules = await getSchedules('ÇM44');

    // Filter only (-1) routes
    let filteredSchedules = allSchedules.filter(
      schedule => schedule.route_marker === '(-1) '
    );

    // Apply additional filters from query parameters
    const { searchParams } = new URL(req.url);
    const direction = searchParams.get('direction');
    const dayType = searchParams.get('dayType');

    if (direction) {
      filteredSchedules = filteredSchedules.filter(
        schedule => schedule.direction.toLowerCase() === direction.toLowerCase()
      );
    }

    if (dayType) {
      filteredSchedules = filteredSchedules.filter(
        schedule => schedule.day_type.toLowerCase() === dayType.toLowerCase()
      );
    }

    // Sort schedules by departure time
    filteredSchedules.sort((a, b) => timeToMinutes(a.departure_time) - timeToMinutes(b.departure_time));

    return NextResponse.json(filteredSchedules);
  } catch (error) {
    console.error('Error fetching ÇM44 schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
} 