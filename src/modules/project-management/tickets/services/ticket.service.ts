import { httpClient } from '@/utils/httpClient';

import type { Ticket } from '../types/ticket.types';

const BASE_URL = 'https://crm-dev-api.simplego.am';

export interface TicketsQueryParams {
  projectId?: number;
  projectIds?: number[];
  page?: number;
  size?: number;
  sort?: string | string[];
  title?: string;
  status?: string;
  priority?: string;
  assignmentFilter?: string;
  search?: string;
  id?: string;
  trackerIds?: number[];
  statusIds?: number[];
  priorityIds?: number[];
  subprojectIds?: number[];
  assigneeUserIds?: number[];
  connectionFilters?: string[];
  createdByIds?: number[];
  createdDateFrom?: string;
  createdDateTo?: string;
}

export interface TicketsResponse {
  content: Ticket[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TicketCounts {
  assignedToMe?: number;
  assignedToMeNew?: number;
  assignedToMyTeam?: number;
  assignedToMyTeamNew?: number;
  watcher?: number;
  watcherNew?: number;
}

export const ticketService = {
  /**
   * Get paginated list of tickets
   * @param params - Query parameters
   * @param params.projectId - Filter by project ID
   * @param params.projectIds - Filter by multiple project IDs
   * @param params.page - Zero-based page index (default: 0)
   * @param params.size - Page size (default: 10)
   * @param params.sort - Sorting criteria in format: property,(asc|desc). Multiple sort criteria supported.
   * @param params.title - Filter by ticket title
   * @param params.status - Filter by ticket status
   * @param params.priority - Filter by ticket priority
   * @param params.assignmentFilter - Filter by assignment type (onlyAssignee, onlyAssigneeNew, onlyTeam, onlyTeamNew, onlyWatcher, onlyWatcherNew)
   * @param params.search - Search by ticket ID
   */
  getTickets: async (params?: TicketsQueryParams): Promise<TicketsResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append('page', String(params?.page ?? 0));
    queryParams.append('size', String(params?.size ?? 10));

    if (params?.projectId !== undefined) {
      queryParams.append('projectId', String(params.projectId));
    }

    if (params?.projectIds && params.projectIds.length > 0) {
      params.projectIds.forEach((id) => {
        queryParams.append('projectIds', String(id));
      });
    }

    if (params?.trackerIds && params.trackerIds.length > 0) {
      params.trackerIds.forEach((id) => {
        queryParams.append('trackerIds', String(id));
      });
    }

    if (params?.statusIds && params.statusIds.length > 0) {
      params.statusIds.forEach((id) => {
        queryParams.append('statusIds', String(id));
      });
    }

    if (params?.priorityIds && params.priorityIds.length > 0) {
      params.priorityIds.forEach((id) => {
        queryParams.append('priorityIds', String(id));
      });
    }

    if (params?.subprojectIds && params.subprojectIds.length > 0) {
      params.subprojectIds.forEach((id) => {
        queryParams.append('subprojectIds', String(id));
      });
    }

    if (params?.assigneeUserIds && params.assigneeUserIds.length > 0) {
      params.assigneeUserIds.forEach((id) => {
        queryParams.append('assigneeUserIds', String(id));
      });
    }

    if (params?.createdByIds && params.createdByIds.length > 0) {
      params.createdByIds.forEach((id) => {
        queryParams.append('createdByIds', String(id));
      });
    }

    if (params?.title) {
      queryParams.append('title', params.title);
    }
    console.log(params.connectionFilters);
    if (params?.connectionFilters && params?.connectionFilters.length) {
      params.connectionFilters.forEach((id) => {
        console.log(id, 'is');
        queryParams.append('connectionFilters', id);
      });
    }

    if (params?.status) {
      queryParams.append('status', params.status);
    }

    if (params?.priority) {
      queryParams.append('priority', params.priority);
    }

    if (params?.assignmentFilter) {
      queryParams.append(params.assignmentFilter, 'true');
    }

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    if (params?.id) {
      queryParams.append('id', params.id);
    }

    if (params?.createdDateFrom) {
      queryParams.append('createdDateFrom', params.createdDateFrom);
    }

    if (params?.createdDateTo) {
      queryParams.append('createdDateTo', params.createdDateTo);
    }

    if (params?.sort) {
      const sortArray = Array.isArray(params.sort)
        ? params.sort
        : [params.sort];
      sortArray.forEach((sortParam) => {
        queryParams.append('sort', sortParam);
      });
    }

    const response = await httpClient.get<TicketsResponse>(
      `${BASE_URL}/pm/ticket?${queryParams.toString()}`,
    );
    return response;
  },

  /**
   * Get a single ticket by ID
   * @param id - Ticket ID
   */
  getTicketById: async (id: number): Promise<Ticket> => {
    const response = await httpClient.get<Ticket>(
      `${BASE_URL}/pm/ticket/${id}`,
    );
    return response;
  },

  /**
   * Get ticket counts by assignment type
   * @param projectId - Optional project ID to filter counts
   */
  getTicketCounts: async (projectId?: number): Promise<TicketCounts> => {
    const queryParams = new URLSearchParams();
    if (projectId !== undefined) {
      queryParams.append('projectId', String(projectId));
    }
    const response = await httpClient.get<TicketCounts>(
      `${BASE_URL}/pm/ticket/counts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
    );
    return response;
  },
};
