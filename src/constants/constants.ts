export const PROJECT_STATUS = {
  all: { value: 'all', label: 'All', color: '' },
  active: { value: 'active', label: 'Active', color: 'green' },
  disabled: { value: 'disabled', label: 'Disabled', color: 'red' },
};

export const ROLE_COLORS: Record<
  string,
  | 'blue-light'
  | 'pink-light'
  | 'orange-light'
  | 'green-light'
  | 'yellow-light'
  | 'red-light'
  | 'purple-light'
> = {
  GENERAL_MANAGER: 'blue-light',
  'General Manager': 'blue-light',
  HR_MANAGER: 'pink-light',
  'HR Manager': 'pink-light',
  ACCOUNTING_STAFF: 'orange-light',
  'Accounting Staff': 'orange-light',
  LEGAL_STAFF: 'green-light',
  Lawyer: 'green-light',
  TEAM_HEAD: 'yellow-light',
  'Team Head': 'yellow-light',
  BRANCH_HEAD: 'blue-light',
  'Branch Head': 'blue-light',
  DEPARTMENT_HEAD: 'red-light',
  'Department Head': 'red-light',
  TEAM_MEMBER: 'purple-light',
  'Team member': 'purple-light',
};

export const OCCUPATION_COLOR = 'orange-light' as const;

export const TICKET_APPOINTMENT_FREQUENCY_OPTIONS = [
  { label: 'One time', value: 'One-time' },
  { label: 'Daily', value: 'Daily' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
];

export const WEEKDAY_OPTIONS = [
  { label: 'Sunday', value: '0' },
  { label: 'Monday', value: '1' },
  { label: 'Tuesday', value: '2' },
  { label: 'Wednesday', value: '3' },
  { label: 'Thursday', value: '4' },
  { label: 'Friday', value: '5' },
  { label: 'Saturday', value: '6' },
];

export interface TrackerConfig {
  color:
    | 'blue-light'
    | 'pink-light'
    | 'green-light'
    | 'red-light'
    | 'purple-light';
  icon: string;
}

export const TRACKER_CONFIG: Record<string, TrackerConfig> = {
  Task: { color: 'blue-light', icon: 'TaskIcon' },
  Suggestion: { color: 'pink-light', icon: 'SuggestionIcon' },
  Support: { color: 'green-light', icon: 'SupportIcon' },
  Bug: { color: 'red-light', icon: 'BugIcon' },
  Feature: { color: 'purple-light', icon: 'FeatureIcon' },
};

export const STATUS_COLORS: Record<
  string,
  | '#BDBDBD'
  | '#2D6CDF'
  | '#F4A261'
  | '#27AE60'
  | '#4F4F4F'
  | '#E63946'
  | '#7367F0'
> = {
  'To Do': '#BDBDBD',
  'In Progress': '#2D6CDF',
  Waiting: '#F4A261',
  Resolved: '#27AE60',
  Closed: '#4F4F4F',
  Rejected: '#E63946',
  Reopen: '#7367F0',
};

export interface PriorityConfig {
  color: 'orange-light' | 'blue-light' | 'green-light' | 'red-light';
  icon: string;
}

export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  Low: { color: 'orange-light', icon: 'LowPriorityIcon' },
  Medium: { color: 'blue-light', icon: 'NormalPriorityIcon' },
  High: { color: 'green-light', icon: 'HighPriorityIcon' },
  Urgent: { color: 'red-light', icon: 'UrgentIcon' },
};

export const PROGRESS_OPTIONS = [
  { value: 0, label: '0%' },
  { value: 10, label: '10%' },
  { value: 20, label: '20%' },
  { value: 30, label: '30%' },
  { value: 40, label: '40%' },
  { value: 50, label: '50%' },
  { value: 60, label: '60%' },
  { value: 70, label: '70%' },
  { value: 80, label: '80%' },
  { value: 90, label: '90%' },
  { value: 100, label: '100%' },
];

export const HOURS_OPTIONS = Array.from({ length: 100 }, (_, i) => ({
  value: i,
  label: i.toString(),
}));

export const MINUTES_OPTIONS = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: i.toString(),
}));

export const DEFAULT_PRESET_COLORS = [
  '#E63946',
  '#2D6CDF',
  '#28A745',
  '#FFC107',
  '#6F42C1',
  '#FD7E14',
  '#6C757D',
  '#000000',
  '#FFFFFF',
];
