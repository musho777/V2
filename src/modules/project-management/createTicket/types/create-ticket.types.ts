export interface CreateTicketQueryParams {
  name?: string;
  status?: boolean;
  page?: number;
  size?: number;
  sort?: string | string[];
}
