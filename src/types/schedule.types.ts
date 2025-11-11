export type WorkingStatus = 'WORKING' | 'DAY_OFF';

export interface Schedule {
  id: number;
  name: string;
  description: string;
  workingStatus: WorkingStatus;
  status: boolean;
  shiftStartTime: string;
  shiftEndTime: string;
  breakStartTime: string;
  breakEndTime: string;
  nightStartTime: string;
  nightEndTime: string;
  overtimeRate: number;
  nightRate: number;
  weekendRate: number;
  holidayRate: number;
}

export interface CreateScheduleRequest {
  name: string;
  description: string;
  workingStatus: WorkingStatus;
  shiftStartTime: string;
  shiftEndTime: string;
  breakStartTime: string;
  breakEndTime: string;
  nightStartTime: string;
  nightEndTime: string;
  overtimeRate: number;
  nightRate: number;
  weekendRate: number;
  holidayRate: number;
}

export interface UpdateScheduleRequest extends CreateScheduleRequest {
  id: number;
}

export interface ScheduleSearchParams {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ScheduleResponse {
  content: Schedule[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
