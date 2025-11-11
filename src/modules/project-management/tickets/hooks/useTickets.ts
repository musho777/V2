import { useQuery } from '@tanstack/react-query';

import type { TicketsQueryParams } from '../services/ticket.service';
import { ticketService } from '../services/ticket.service';

export const useTickets = (
  params?: TicketsQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketService.getTickets(params),
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useTicketById = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getTicketById(id),
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useTicketCounts = (
  projectId?: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['ticketCounts', projectId],
    queryFn: () => ticketService.getTicketCounts(projectId),
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
