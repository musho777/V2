export interface ProjectInterface {
  value: string;
  label: string;
}

export interface TeamTableRow {
  key: string;
  name: string;
  description: string;
  branchHeadName: string;
  status: 'Active' | 'Disabled';
}
