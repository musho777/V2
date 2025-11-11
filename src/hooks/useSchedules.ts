import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { scheduleService } from '@/services/schedule.service';
import type {
  CreateScheduleRequest,
  ScheduleSearchParams,
  UpdateScheduleRequest,
  WorkingStatus,
} from '@/types/schedule.types';

export const useSchedules = (params?: ScheduleSearchParams) => {
  return useQuery({
    queryKey: ['schedules', params],
    queryFn: () => firstValueFrom(scheduleService.getSchedules(params)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useScheduleById = (id: number | null) => {
  return useQuery({
    queryKey: ['schedule', id],
    queryFn: () =>
      id ? firstValueFrom(scheduleService.getScheduleById(id)) : null,
    enabled: !!id,
  });
};

export const useEnabledSchedules = () => {
  return useQuery({
    queryKey: ['schedules', 'enabled'],
    queryFn: () => firstValueFrom(scheduleService.getEnabledSchedules()),
    staleTime: 1000 * 60 * 5,
  });
};

export const useWorkingStatuses = () => {
  return useQuery<WorkingStatus[]>({
    queryKey: ['schedules', 'working-statuses'],
    queryFn: () => firstValueFrom(scheduleService.getWorkingStatuses()),
    staleTime: 1000 * 60 * 60, // 1 hour - statuses don't change often
  });
};

export const useScheduleUsage = (id: number | null) => {
  return useQuery({
    queryKey: ['schedule', 'usage', id],
    queryFn: () =>
      id ? firstValueFrom(scheduleService.getScheduleUsage(id)) : null,
    enabled: !!id,
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) =>
      firstValueFrom(scheduleService.createSchedule(data)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateScheduleRequest) =>
      firstValueFrom(scheduleService.updateSchedule(data)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      firstValueFrom(scheduleService.deleteSchedule(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
};
