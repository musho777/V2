import { useState } from 'react';

import { useTimezones } from '@/hooks/useTimezones';
import { useWorkSchedules } from '@/hooks/useWorkSchedules';
import { toSelectOptions } from '@/utils/utils';

/**
 * Custom hook to manage schedule dropdown options
 * Handles fetching timezones and work schedules with lazy loading
 */
export const useScheduleOptions = (isModalOpen: boolean) => {
  const [timezoneDropdownOpen, setTimezoneDropdownOpen] = useState(false);
  const [scheduleDropdownOpen, setScheduleDropdownOpen] = useState(false);

  // Fetch timezones only when dropdown is opened
  const { data: timezonesData } = useTimezones(timezoneDropdownOpen);

  // Fetch work schedules when modal or dropdown is opened
  const { data: workSchedulesData } = useWorkSchedules(
    isModalOpen || scheduleDropdownOpen,
  );

  // Salary type options
  const salaryTypeOptions = [
    { value: 'fixed', label: 'Fixed Salary' },
    { value: 'hourly', label: 'Hourly Rate' },
  ];

  // Currency options
  const currencyOptions = [
    { value: 1, label: 'AMD' },
    { value: 2, label: 'USD' },
    { value: 3, label: 'EUR' },
  ];

  // Transform API data to select options
  const timezoneOptions = timezonesData ? toSelectOptions(timezonesData) : [];
  const scheduleOptions = workSchedulesData
    ? toSelectOptions(workSchedulesData)
    : [];

  return {
    // Options
    salaryTypeOptions,
    currencyOptions,
    timezoneOptions,
    scheduleOptions,

    // Dropdown state handlers
    setTimezoneDropdownOpen,
    setScheduleDropdownOpen,
  };
};
