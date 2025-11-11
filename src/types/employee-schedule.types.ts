export type SalaryType = 'FIXED' | 'HOURLY';

export interface WorkSchedule {
  id: number;
  name: string;
}

export interface EmployeeScheduleResponse {
  id: number;
  memberId: number;
  timezone: {
    id: number;
    name: string;
  };
  workScheduleForMonday: WorkSchedule;
  workScheduleForTuesday: WorkSchedule;
  workScheduleForWednesday: WorkSchedule;
  workScheduleForThursday: WorkSchedule;
  workScheduleForFriday: WorkSchedule;
  workScheduleForSaturday: WorkSchedule;
  workScheduleForSunday: WorkSchedule;
  salaryType: SalaryType;
  salaryAmount: number;
  moneyUnitId: number;
  moneyUnitName: string;
  moneyUnitSymbol: string;
  effectiveDate: string;
  isOwnRates: boolean;
  overtimeRate: number | null;
  nightRate: number | null;
  weekendRate: number | null;
  holidayRate: number | null;
  scheduleStatus: {
    status: 'Current' | 'Upcoming';
  };
  isKeepWorkingHourPerDay: boolean;
}

export interface AssignEmployeeScheduleRequest {
  employeeId: number;
  timezoneId: number;
  workScheduleForMondayId: number;
  workScheduleForTuesdayId: number;
  workScheduleForWednesdayId: number;
  workScheduleForThursdayId: number;
  workScheduleForFridayId: number;
  workScheduleForSaturdayId: number;
  workScheduleForSundayId: number;
  salaryType: SalaryType;
  salaryAmount: number;
  moneyUnitId: number;
  effectiveDate: string;
  salaryEffectiveDate?: string;
  isOwnRates: boolean;
  overtimeRate?: number;
  nightRate?: number;
  weekendRate?: number;
  holidayRate?: number;
  isKeepWorkingHourPerDay: boolean;
}

export interface AssignEmployeeScheduleResponse {
  id: number;
  employeeId: number;
  timezoneId: number;
  workScheduleForMondayId: number;
  workScheduleForTuesdayId: number;
  workScheduleForWednesdayId: number;
  workScheduleForThursdayId: number;
  workScheduleForFridayId: number;
  workScheduleForSaturdayId: number;
  workScheduleForSundayId: number;
  salaryType: SalaryType;
  salaryAmount: number;
  moneyUnitId: number;
  effectiveDate: string;
  salaryEffectiveDate: string;
  isOwnRates: boolean;
  overtimeRate?: number;
  nightRate?: number;
  weekendRate?: number;
  holidayRate?: number;
  isKeepWorkingHourPerDay: boolean;
}
