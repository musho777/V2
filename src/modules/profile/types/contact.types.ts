// API Schema Types (matching Swagger)
export interface ContactType {
  id: number;
  default?: boolean;
}

export interface ContactPriority {
  id: number;
  priority: string;
  default?: boolean;
}

export interface ContactRequest {
  userContactId?: number;
  contact?: string;
  priority?: ContactPriority;
  status?: boolean;
}

export interface UserContactsRequest {
  userId: number;
  contactType: ContactType;
  contacts: ContactRequest[];
}

export interface OwnContactRequest {
  id?: number;
  userContactId?: number;
  contact?: string;
  priority?: ContactPriority;
  status?: boolean;
  deleted?: boolean;
}

export interface OwnContactsRequest {
  contactType: ContactType;
  contacts: OwnContactRequest[];
}

export interface UserContactDTO {
  userId: number;
  contactId: number;
  contactTypeId: number;
  contactTypeName: string;
  contact: string;
  priorityId: number;
  priorityName: string;
  status: boolean;
}

// Frontend Display Types
export interface UserContact {
  id: number;
  contactType: {
    id: number;
    name: string;
  };
  contact: string;
  priority: {
    id: number;
    name: string;
  };
  status: boolean;
}

// Form Types
export interface ContactFormValues {
  contactTypeId: number;
  contact: string;
  priorityId: number;
  status: boolean;
}
