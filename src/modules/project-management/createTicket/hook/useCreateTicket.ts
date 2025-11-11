import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { notificationService } from '@/components/Notification/Notification';

import type { CreateTicketData } from '../../tickets/types/ticket.types';
import { createTicketService } from '../services/create-ticket.service';

export const useCreateTicketMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketData) =>
      createTicketService.createTicket(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tickets'] });
      message.success('Ticket created successfully');
      onSuccessCallback?.();
    },
    onError: (error: unknown) => {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to create ticket';

      notificationService.error({
        message: 'Error',
        description: errorMessage,
      });
    },
  });
};

export const useEnabledProjects = (enabled: boolean = true, name?: string) => {
  return useQuery({
    queryKey: ['pm', 'projects', 'enabled', name],
    queryFn: () => createTicketService.getEnabledProjects(name),
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

export const useEnabledSubprojects = (
  projectId?: string,
  name?: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['pm', 'subprojects', 'enabled', projectId, name],
    queryFn: () => createTicketService.getEnabledSubprojects(projectId, name),
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

export const useEnabledAssignees = (
  subprojectId?: string,
  name?: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['pm', 'assignees', 'enabled', subprojectId, name],
    queryFn: () => createTicketService.getEnabledAssignees(subprojectId, name),
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

export const useTrackers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['pm', 'trackers'],
    queryFn: () => createTicketService.getTrackers(),
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

export const usePriorities = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['pm', 'priorities'],
    queryFn: () => createTicketService.getPriorities(),
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

export const useStatuses = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['pm', 'statuses'],
    queryFn: () => createTicketService.getStatuses(),
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

export const useEnabledWatchers = (
  subprojectId?: string,
  name?: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['pm', 'watchers', 'enabled', subprojectId, name],
    queryFn: () => createTicketService.getEnabledWatchers(subprojectId, name),
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

export const useParentTasks = (
  subprojectId: string,
  enabled: boolean = true,
  idOrTitle?: string,
) => {
  return useQuery({
    queryKey: ['pm', 'parent-tasks', subprojectId, idOrTitle],
    queryFn: () => createTicketService.getParentTasks(subprojectId, idOrTitle),
    enabled: enabled && !!subprojectId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

export const useTicketById = (ticketId?: string) => {
  return useQuery({
    queryKey: ['pm', 'ticket', ticketId],
    queryFn: () => createTicketService.getTicketById(ticketId!),
    enabled: !!ticketId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateTicketMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: string;
      data: CreateTicketData;
    }) => createTicketService.updateTicket(ticketId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tickets'] });
      void queryClient.invalidateQueries({ queryKey: ['pm', 'ticket'] });
      message.success('Ticket updated successfully');
      onSuccessCallback?.();
    },
    onError: (error: unknown) => {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to update ticket';

      notificationService.error({
        message: 'Error',
        description: errorMessage,
      });
    },
  });
};
