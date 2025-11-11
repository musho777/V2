import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { attendancePolicyService } from '@/services/attendance-policy.service';
import type {
  CreateAttendancePolicyRequest,
  UpdateAttendancePolicyRequest,
} from '@/types/attendance-policy.types';

export const useAttendancePolicies = () => {
  return useQuery({
    queryKey: ['attendancePolicies'],
    queryFn: () =>
      firstValueFrom(attendancePolicyService.getAttendancePolicies()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAttendancePolicyById = (id: number | null) => {
  return useQuery({
    queryKey: ['attendancePolicy', id],
    queryFn: () =>
      id
        ? firstValueFrom(attendancePolicyService.getAttendancePolicyById(id))
        : null,
    enabled: !!id,
  });
};

export const useCreateAttendancePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttendancePolicyRequest) =>
      firstValueFrom(attendancePolicyService.createAttendancePolicy(data)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['attendancePolicies'] });
    },
  });
};

export const useUpdateAttendancePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAttendancePolicyRequest) =>
      firstValueFrom(attendancePolicyService.updateAttendancePolicy(data)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['attendancePolicies'] });
    },
  });
};

export const useDeleteAttendancePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      firstValueFrom(attendancePolicyService.deleteAttendancePolicy(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['attendancePolicies'] });
    },
  });
};
