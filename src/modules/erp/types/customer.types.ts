export interface AddressForm {
  id: string;
  street: string;
  building: string;
  apartment: string;
  roomNumber: string;
  entrance: string;
  floor: string;
  comment: string;
}

export interface PhoneForm {
  id: string;
  phoneNumber: string;
  comment: string;
}

export interface CustomerFormData {
  organizationName: string;
  passportNumber: string;
  issueDate: string;
  issuedBy: string;
  registrationAddress: string;
  socialCardNumber: string;
  notificationAddress: string;
  email: string;
  erpExternalId: string;
  taxId: string;
  locationAddress: string;
  birthDate: string;
}

export type PassportType =
  | 'ARMENIAN_PASSPORT'
  | 'ARMENIAN_ID'
  | 'FOREIGN_PASSPORT';

export type DocumentType =
  | 'armenian_passport'
  | 'armenian_id'
  | 'foreign_passport';

export type ClientType = '1' | '2' | '3'; // 1: Individual Entrepreneur, 2: Legal Entity, 3: Physical Person

export interface EditState {
  [key: string]: boolean;
}

export interface CustomerTypeInfo {
  id: number;
  name: string;
}
