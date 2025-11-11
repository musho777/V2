import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { employeeScheduleService } from '@/services/employee-schedule.service';

export const useWorkSchedules = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['work-schedules', 'enabled'],
    queryFn: () =>
      firstValueFrom(employeeScheduleService.getEnabledWorkSchedules()),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
