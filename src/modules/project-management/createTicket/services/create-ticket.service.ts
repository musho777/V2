import { API_CONFIG } from '@/config/api.config';
import type { ProjectsResponse } from '@/modules/project/projects/types/project.types';
import type { CreateTicketData } from '@/modules/project-management/tickets/types/ticket.types';
import { httpClient } from '@/utils/httpClient';

const BASE_URL = API_CONFIG.BASE_URL;

export const createTicketService = {
  getEnabledProjects: async (name?: string): Promise<ProjectsResponse> => {
    const response = await httpClient.get<ProjectsResponse>(
      `${BASE_URL}/pm/project/enabled`,
      {
        params: { name },
      },
    );
    return response;
  },

  getEnabledSubprojects: async (
    projectId?: string,
    name?: string,
  ): Promise<ProjectsResponse> => {
    const response = await httpClient.get<ProjectsResponse>(
      `${BASE_URL}/pm/subproject/enabled`,
      {
        params: { projectId, name },
      },
    );
    return response;
  },

  getEnabledAssignees: async (
    subprojectId?: string,
    name?: string,
  ): Promise<ProjectsResponse> => {
    const response = await httpClient.get<ProjectsResponse>(
      `${BASE_URL}/pm/membership/enabled-assignees`,
      {
        params: { subprojectId, name },
      },
    );
    return response;
  },

  getTrackers: async (): Promise<ProjectsResponse> => {
    const response = await httpClient.get<ProjectsResponse>(
      `${BASE_URL}/pm/tracker`,
    );
    return response;
  },

  getPriorities: async (): Promise<ProjectsResponse> => {
    const response = await httpClient.get<ProjectsResponse>(
      `${BASE_URL}/pm/priority`,
    );
    return response;
  },

  getStatuses: async (): Promise<ProjectsResponse> => {
    const response = await httpClient.get<ProjectsResponse>(
      `${BASE_URL}/pm/status`,
    );
    return response;
  },

  getEnabledWatchers: async (
    subprojectId?: string,
    name?: string,
  ): Promise<ProjectsResponse> => {
    const response = await httpClient.get<ProjectsResponse>(
      `${BASE_URL}/pm/membership/enabled-users`,
      {
        params: { subprojectId, name },
      },
    );
    return response;
  },

  getParentTasks: async (
    subprojectId: string,
    idOrTitle?: string,
  ): Promise<ProjectsResponse> => {
    const response = await httpClient.get<ProjectsResponse>(
      `${BASE_URL}/pm/ticket/parent-tasks`,
      {
        params: { subprojectId, idOrTitle },
      },
    );
    return response;
  },

  createTicket: async (data: CreateTicketData): Promise<void> => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('projectId', String(data.projectId));
    formData.append('subprojectId', String(data.subprojectId));
    formData.append('statusId', String(data.statusId));
    formData.append('trackerId', String(data.trackerId));
    formData.append('priorityId', String(data.priorityId));
    formData.append('progress', String(data.progress));

    if (data.parentTaskId !== undefined) {
      formData.append('parentTaskId', String(data.parentTaskId));
    }
    if (data.estimatedHours !== undefined) {
      formData.append('estimatedHours', String(data.estimatedHours));
    }
    if (data.estimatedMinutes !== undefined) {
      formData.append('estimatedMinutes', String(data.estimatedMinutes));
    }
    if (data.startDate) {
      formData.append('startDate', data.startDate);
    }
    if (data.dueDate) {
      formData.append('dueDate', data.dueDate);
    }
    if (data.assigneeUserIds && data.assigneeUserIds.length > 0) {
      data.assigneeUserIds.forEach((id) => {
        formData.append('assigneeUserIds', String(id));
      });
    }
    if (data.assigneeTeamIds && data.assigneeTeamIds.length > 0) {
      data.assigneeTeamIds.forEach((id) => {
        formData.append('assigneeTeamIds', String(id));
      });
    }
    if (data.watcherIds && data.watcherIds.length > 0) {
      data.watcherIds.forEach((id) => {
        formData.append('watcherIds', String(id));
      });
    }
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    await httpClient.post(`${BASE_URL}/pm/ticket`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getTicketById: async (ticketId: string): Promise<any> => {
    const response = await httpClient.get(`${BASE_URL}/pm/ticket/${ticketId}`);
    return response;
  },

  updateTicket: async (
    ticketId: string,
    data: CreateTicketData,
  ): Promise<void> => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('projectId', String(data.projectId));
    formData.append('subprojectId', String(data.subprojectId));
    formData.append('statusId', String(data.statusId));
    formData.append('trackerId', String(data.trackerId));
    formData.append('priorityId', String(data.priorityId));
    formData.append('progress', String(data.progress));

    if (data.parentTaskId !== undefined) {
      formData.append('parentTaskId', String(data.parentTaskId));
    }
    if (data.estimatedHours !== undefined) {
      formData.append('estimatedHours', String(data.estimatedHours));
    }
    if (data.estimatedMinutes !== undefined) {
      formData.append('estimatedMinutes', String(data.estimatedMinutes));
    }
    if (data.startDate) {
      formData.append('startDate', data.startDate);
    }
    if (data.dueDate) {
      formData.append('dueDate', data.dueDate);
    }
    if (data.assigneeUserIds && data.assigneeUserIds.length > 0) {
      data.assigneeUserIds.forEach((id) => {
        formData.append('assigneeUserIds', String(id));
      });
    }
    if (data.assigneeTeamIds && data.assigneeTeamIds.length > 0) {
      data.assigneeTeamIds.forEach((id) => {
        formData.append('assigneeTeamIds', String(id));
      });
    }
    if (data.watcherIds && data.watcherIds.length > 0) {
      data.watcherIds.forEach((id) => {
        formData.append('watcherIds', String(id));
      });
    }
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    await httpClient.put(`${BASE_URL}/pm/ticket/${ticketId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
