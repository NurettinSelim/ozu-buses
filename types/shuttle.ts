type ShuttleScheduleTitle = "HAFTA İÇİ" | "HAFTA SONU";

export interface ShuttleScheduleTime {
  key: number;
  title_tr: ShuttleScheduleTitle;
  title_en: string;
  data: string[];
}

export interface ShuttleSchedule {
  key: number;
  id: string;
  title_tr: string;
  title_en: string;
  data: ShuttleScheduleTime[];
}

export interface ShuttleApiResponse {
  status: number;
  show_dates: boolean;
  data: ShuttleSchedule[];
} 