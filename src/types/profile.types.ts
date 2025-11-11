// Import for internal use
import type { UserAddress as Address } from '@/modules/profile/types/address.types';

export type PriorityLevel = 'highest' | 'high' | 'medium' | 'low';

export type LanguageProficiency =
  | 'Native'
  | 'Elementary (A1)'
  | 'Pre-Intermediate (A2)'
  | 'Intermediate (B1)'
  | 'Upper Intermediate (B2)'
  | 'Advanced (C1)'
  | 'Proficiency (C2)';

export type SkillLevel = 'Junior' | 'Middle' | 'Senior' | 'Expert';

export interface ContactItem {
  id: number;
  value: string;
  priority: PriorityLevel;
  isActive: boolean;
}

export interface EmailAddress extends ContactItem {
  email: string;
}

export interface PhoneNumber extends ContactItem {
  number: string;
}

// Re-export from module for backward compatibility
export type { UserAddress as Address } from '@/modules/profile/types/address.types';

export interface Language {
  id: number;
  name: string;
  proficiency: LanguageProficiency;
  priority: PriorityLevel;
  isActive: boolean;
}

export interface Skill {
  id: number;
  name: string;
  level: SkillLevel;
  isActive: boolean;
}

export interface Schedule {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  status: 'online' | 'offline';
  isVerified: boolean;

  // Additional Information
  department?: string;
  branch?: string;
  team?: string;
  role?: string;
  occupation?: string;
  timezone?: string;
  calendarOfHolidays?: string;
  commissions?: string;
  officeLocation?: string;

  // Contact Information
  emailAddresses: EmailAddress[];
  mobilePhoneNumbers: PhoneNumber[];
  phoneNumbers: PhoneNumber[];

  // Addresses
  addresses: Address[];

  // Languages
  languages: Language[];

  // Skills
  skills: Skill[];

  // Schedules
  schedules?: Schedule[];
}

export interface ProfileTabType {
  key: 'contacts' | 'addresses' | 'languages' | 'skills' | 'schedules';
  label: string;
}
