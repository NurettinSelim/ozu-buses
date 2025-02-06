export interface IettScheduleResponse {
  SHATKODU: string;
  HATADI: string;
  SGUZERGAH: string;
  SYON: 'G' | 'D';
  SGUNTIPI: 'I' | 'C' | 'P';
  DT: string;
  GUZERGAH_ISARETI?: string;
}


export interface Schedule {
  route_code: string;
  route_name: string;
  direction: string;
  day_type: string;
  departure_time: string;
  route_marker?: string;
}
