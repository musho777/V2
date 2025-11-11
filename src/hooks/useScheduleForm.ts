import { useEffect, useState } from 'react';

import type {
  AssignEmployeeScheduleRequest,
  EmployeeScheduleResponse,
} from '@/types/employee-schedule.types';

export interface ScheduleFormData {
  salaryType: string;
  timezone: number;
  effectiveDate: string;
  currency: number;
  salaryAmount: string;
  mondaySchedule: number;
  tuesdaySchedule: number;
  wednesdaySchedule: number;
  thursdaySchedule: number;
  fridaySchedule: number;
  saturdaySchedule: number;
  sundaySchedule: number;
  shiftRatesOption: string;
  overtime: string;
  night: string;
  weekend: string;
  holiday: string;
}

const getInitialFormData = (): ScheduleFormData => ({
  salaryType: '',
  timezone: 0,
  effectiveDate: '',
  currency: 0,
  salaryAmount: '',
  mondaySchedule: 0,
  tuesdaySchedule: 0,
  wednesdaySchedule: 0,
  thursdaySchedule: 0,
  fridaySchedule: 0,
  saturdaySchedule: 0,
  sundaySchedule: 0,
  shiftRatesOption: 'use-schedule',
  overtime: '10',
  night: '10',
  weekend: '10',
  holiday: '10',
});

/**
 * Custom hook to manage schedule form state and validation
 */
export const useScheduleForm = (
  initialData?: EmployeeScheduleResponse | null,
  isOpen?: boolean,
) => {
  const [formData, setFormData] =
    useState<ScheduleFormData>(getInitialFormData());

  // Pre-fill form data when modal opens with existing schedule data
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        salaryType: initialData.salaryType === 'FIXED' ? 'fixed' : 'hourly',
        timezone: initialData.timezone.id,
        effectiveDate: initialData.effectiveDate || '',
        currency: initialData.moneyUnitId || 0,
        salaryAmount: initialData.salaryAmount?.toString() || '',
        mondaySchedule: initialData.workScheduleForMonday?.id || 0,
        tuesdaySchedule: initialData.workScheduleForTuesday?.id || 0,
        wednesdaySchedule: initialData.workScheduleForWednesday?.id || 0,
        thursdaySchedule: initialData.workScheduleForThursday?.id || 0,
        fridaySchedule: initialData.workScheduleForFriday?.id || 0,
        saturdaySchedule: initialData.workScheduleForSaturday?.id || 0,
        sundaySchedule: initialData.workScheduleForSunday?.id || 0,
        shiftRatesOption: initialData.isOwnRates
          ? 'set-custom'
          : 'use-schedule',
        overtime: initialData.overtimeRate?.toString() || '10',
        night: initialData.nightRate?.toString() || '10',
        weekend: initialData.weekendRate?.toString() || '10',
        holiday: initialData.holidayRate?.toString() || '10',
      });
    }
  }, [isOpen, initialData]);

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  /**
   * Update a single form field
   */
  const updateField = <K extends keyof ScheduleFormData>(
    field: K,
    value: ScheduleFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Validate form data
   */
  const isFormValid = () => {
    return (
      formData.salaryType &&
      formData.timezone &&
      formData.effectiveDate &&
      formData.currency &&
      formData.salaryAmount
    );
  };

  /**
   * Convert form data to API request format
   */
  const toRequestData = (
    employeeId: number,
    scheduleId?: number,
  ): AssignEmployeeScheduleRequest => {
    const isOwnRates = formData.shiftRatesOption === 'set-custom';

    return {
      employeeId,
      timezoneId: formData.timezone,
      workScheduleForMondayId: formData.mondaySchedule,
      workScheduleForTuesdayId: formData.tuesdaySchedule,
      workScheduleForWednesdayId: formData.wednesdaySchedule,
      workScheduleForThursdayId: formData.thursdaySchedule,
      workScheduleForFridayId: formData.fridaySchedule,
      workScheduleForSaturdayId: formData.saturdaySchedule,
      workScheduleForSundayId: formData.sundaySchedule,
      salaryType: formData.salaryType === 'fixed' ? 'FIXED' : 'HOURLY',
      salaryAmount: parseFloat(formData.salaryAmount),
      moneyUnitId: formData.currency,
      effectiveDate: formData.effectiveDate,
      isOwnRates,
      ...(isOwnRates && {
        overtimeRate: parseFloat(formData.overtime),
        nightRate: parseFloat(formData.night),
        weekendRate: parseFloat(formData.weekend),
        holidayRate: parseFloat(formData.holiday),
      }),
      isKeepWorkingHourPerDay: true,
      ...(scheduleId && { id: scheduleId }),
    };
  };

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    isFormValid,
    toRequestData,
  };
};
