'use client';

import React from 'react';

import { Card } from 'antd';

import { CustomSegmented } from '@/components/Segmented/CustomSegmented';
import type { ProfileTabType } from '@/types/profile.types';

import styles from './styles.module.scss';

export interface ProfileTabsProps {
  activeTab: ProfileTabType['key'];
  onTabChange: (tab: ProfileTabType['key']) => void;
}

const tabs = [
  { label: 'Contacts', value: 'contacts' },
  { label: 'Addresses', value: 'addresses' },
  { label: 'Languages', value: 'languages' },
  { label: 'Skills', value: 'skills' },
];

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Card className={styles.profileTabs}>
      <CustomSegmented
        currentView={activeTab}
        onChange={(value) => onTabChange(value as ProfileTabType['key'])}
        options={tabs}
      />
    </Card>
  );
};
