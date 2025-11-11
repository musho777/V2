'use client';

import { useState } from 'react';

import { AdditionalInfoSidebar } from '@/components/AdditionalInfoSidebar';
import { PageTabs } from '@/components/PageTabs';
import { ProfileHeader } from '@/components/ProfileHeader';
import {
  AddressesSegment,
  ContactsSegment,
  LanguagesSegment,
  SchedulesSegment,
  SkillsSegment,
} from '@/components/ProfileSegments';
import type { UserProfile as NewUserProfile } from '@/types/profile.types';

import styles from './ProfileView.module.scss';

interface ProfileViewProps {
  profile: NewUserProfile;
  canEdit?: boolean;
  onEdit?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  canEdit = false,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState('contacts');

  const tabs = [
    {
      key: 'contacts',
      label: 'Contacts',
      children: <ContactsSegment userId={profile.id} canEdit={canEdit} />,
    },
    {
      key: 'addresses',
      label: 'Addresses',
      children: <AddressesSegment userId={profile.id} canEdit={canEdit} />,
    },
    {
      key: 'languages',
      label: 'Languages',
      children: <LanguagesSegment userId={profile.id} canEdit={canEdit} />,
    },
    {
      key: 'skills',
      label: 'Skills',
      children: <SkillsSegment userId={profile.id} canEdit={canEdit} />,
    },
    {
      key: 'schedules',
      label: 'Schedules',
      children: <SchedulesSegment canEdit={canEdit} employeeId={profile.id} />,
    },
  ];

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader
        firstName={profile.firstName}
        lastName={profile.lastName}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
        status={profile.status}
        isVerified={profile.isVerified}
        onEdit={onEdit}
        canEdit={canEdit}
      />
      <div className={styles.profileLayout}>
        <PageTabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
        <aside className={styles.sidebar}>
          <AdditionalInfoSidebar
            department={profile.department}
            branch={profile.branch}
            team={profile.team}
            role={profile.role}
            occupation={profile.occupation}
            timezone={profile.timezone}
            calendarOfHolidays={profile.calendarOfHolidays}
            commissions={profile.commissions}
            officeLocation={profile.officeLocation}
          />
        </aside>
      </div>
    </div>
  );
};
