'use client';

import type { UserProfile } from '@/types/profile.types';

import { ProfileView } from '../components/ProfileView';
import { useProfilePermissions } from '../hooks/useProfilePermissions';

import styles from './ProfilePage.module.scss';

interface ProfilePageProps {
  userId?: number;
  canEdit?: boolean;
}

// TODO: Replace with actual API call
const mockProfile: UserProfile = {
  id: 1,
  firstName: 'Ghazaryan',
  lastName: 'Samvel',
  username: 'samvel',
  avatarUrl: undefined,
  status: 'online',
  isVerified: true,
  department: 'Sales',
  branch: 'Yerevan',
  team: 'Yerevan 1',
  role: 'Department Head',
  occupation: 'Sales',
  timezone: 'UTC at UTC+04:00',
  calendarOfHolidays: 'Armenian Holidays',
  commissions: 'Fixed Salary',
  officeLocation: 'Yerevan, Zavaryan 57/4',
  emailAddresses: [
    {
      id: 1,
      value: 'samvel.ghazaryan@company.com',
      email: 'samvel.ghazaryan@company.com',
      priority: 'highest',
      isActive: true,
    },
    {
      id: 2,
      value: 'samvel@personal.com',
      email: 'samvel@personal.com',
      priority: 'medium',
      isActive: false,
    },
  ],
  mobilePhoneNumbers: [
    {
      id: 1,
      value: '+374 99 123 456',
      number: '+374 99 123 456',
      priority: 'highest',
      isActive: true,
    },
  ],
  phoneNumbers: [
    {
      id: 1,
      value: '+374 10 123 456',
      number: '+374 10 123 456',
      priority: 'high',
      isActive: true,
    },
  ],
  addresses: [
    {
      id: 1,
      addressType: {
        id: 1,
        name: 'Home',
      },
      address1: 'Teryan 123, Apt 45',
      city: 'Yerevan',
      zip: '0001',
      country: 'Armenia',
      fullAddress: 'Yerevan, Teryan 123, Apt 45',
      status: true,
    },
    {
      id: 2,
      addressType: {
        id: 3,
        name: 'Work',
      },
      address1: 'Zavaryan 57/4',
      city: 'Yerevan',
      zip: '0002',
      country: 'Armenia',
      fullAddress: 'Yerevan, Zavaryan 57/4',
      status: true,
    },
  ],
  languages: [
    {
      id: 1,
      name: 'Armenian',
      proficiency: 'Native',
      priority: 'highest',
      isActive: true,
    },
    {
      id: 2,
      name: 'English',
      proficiency: 'Advanced (C1)',
      priority: 'high',
      isActive: true,
    },
    {
      id: 3,
      name: 'Russian',
      proficiency: 'Intermediate (B1)',
      priority: 'medium',
      isActive: true,
    },
  ],
  skills: [
    {
      id: 1,
      name: 'Sales Management',
      level: 'Expert',
      isActive: true,
    },
    {
      id: 2,
      name: 'CRM Systems',
      level: 'Senior',
      isActive: true,
    },
    {
      id: 3,
      name: 'Team Leadership',
      level: 'Expert',
      isActive: true,
    },
  ],
  schedules: [],
};

export default function ProfilePage({
  userId,
  canEdit: canEditProp,
}: ProfilePageProps) {
  // TODO: Implement proper loading, error states, and API fetching
  // const { data: profile, isLoading, error } = useUserProfile(userId);

  const handleEdit = () => {
    // TODO: Implement edit functionality
  };

  // Use userId from URL or default to 1 for /profile route
  const actualUserId = userId ?? mockProfile.id;
  const profileWithActualId = { ...mockProfile, id: actualUserId };

  // Use canEdit from prop (from API accessToAction) if provided,
  // otherwise fall back to useProfilePermissions
  const { canEdit: canEditFromHook } = useProfilePermissions(actualUserId);
  const canEdit = canEditProp ?? canEditFromHook;

  return (
    <div className={styles.pageContainer}>
      <ProfileView
        profile={profileWithActualId}
        canEdit={canEdit}
        onEdit={handleEdit}
      />
    </div>
  );
}
