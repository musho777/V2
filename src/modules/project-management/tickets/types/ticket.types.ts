export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface CreatedBy {
  id: string;
  name: string;
  email?: string;
}

export interface Ticket {
  id: number;
  uuid: string;
  title: string;
  assignees: Assignee[];
  priority: 'Low' | 'Normal' | 'High' | 'Urgent' | 'Immediate';
  status:
    | 'New'
    | 'In Progress'
    | 'Resolved'
    | 'Closed'
    | 'Feedback'
    | 'Rejected';
  progress: number;
  startDate: string;
  dueDate: string;
  tracker: string;
  createdBy: CreatedBy;
  subtasks: number;
}

export interface CreateTicketData {
  title: string;
  description: string;
  projectId: number;
  subprojectId: number;
  statusId: number;
  trackerId: number;
  priorityId: number;
  progress: number;
  parentTaskId?: number;
  estimatedHours?: number;
  estimatedMinutes?: number;
  startDate?: string;
  dueDate?: string;
  assigneeUserIds?: number[];
  assigneeTeamIds?: number[];
  watcherIds?: number[];
  attachments?: File[];
}
