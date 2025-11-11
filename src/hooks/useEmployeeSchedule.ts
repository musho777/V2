import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { employeeScheduleService } from '@/services/employee-schedule.service';
import type { AssignEmployeeScheduleRequest } from '@/types/employee-schedule.types';

/**
 * Custom hook to manage employee schedule operations
 * Handles fetching, assigning, and updating employee schedules
 */
export const useEmployeeSchedule = (employeeId: number) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employee schedule
  const {
    data: schedule,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['employee-schedule', employeeId],
    queryFn: () =>
      firstValueFrom(employeeScheduleService.getEmployeeSchedule(employeeId)),
    enabled: !!employeeId,
    retry: false,
  });

  /**
   * Assign a new schedule to the employee (POST)
   */
  const assignSchedule = async (
    scheduleData: AssignEmployeeScheduleRequest,
  ): Promise<boolean> => {
    setIsAssigning(true);
    setError(null);

    try {
      await firstValueFrom(
        employeeScheduleService.assignSchedule(scheduleData),
      );
      await refetch();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to assign schedule';
      setError(errorMessage);
      console.error('Failed to assign schedule:', err);
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  /**
   * Update an existing employee schedule (PUT)
   */
  const updateSchedule = async (
    scheduleData: AssignEmployeeScheduleRequest,
  ): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    try {
      await firstValueFrom(
        employeeScheduleService.updateEmployeeSchedule(scheduleData),
      );
      await refetch();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update schedule';
      setError(errorMessage);
      console.error('Failed to update schedule:', err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Check if the employee has a schedule assigned
   */
  const hasSchedule = !!schedule;

  return {
    // Data
    schedule,
    hasSchedule,

    // Loading states
    isLoading,
    isAssigning,
    isUpdating,

    // Error state
    error,

    // Actions
    assignSchedule,
    updateSchedule,
    refetch,
  };
};
