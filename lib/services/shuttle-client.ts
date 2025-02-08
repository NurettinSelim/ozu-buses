import { ShuttleApiResponse } from "@/types/shuttle";

const SHUTTLE_API_BASE_URL = "https://my.ozyegin.edu.tr/api/v1.4-2/shuttle";

export class ShuttleClient {
  static async getSchedules(direction: 26 | 27): Promise<ShuttleApiResponse> {
    const response = await fetch(`${SHUTTLE_API_BASE_URL}/${direction}`, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shuttle schedules: ${response.statusText}`);
    }

    return response.json();
  }
} 