'use client';

import React from 'react';

import { Card } from 'antd';

import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface AdditionalInfoItem {
  label: string;
  value: string;
}

export interface AdditionalInfoSidebarProps {
  department?: string;
  branch?: string;
  team?: string;
  role?: string;
  occupation?: string;
  timezone?: string;
  calendarOfHolidays?: string;
  commissions?: string;
  officeLocation?: string;
}

export const AdditionalInfoSidebar: React.FC<AdditionalInfoSidebarProps> = ({
  department,
  branch,
  team,
  role,
  occupation,
  timezone,
  calendarOfHolidays,
  commissions,
  officeLocation,
}) => {
  const infoItems: AdditionalInfoItem[] = [
    { label: 'Department', value: department || '-' },
    { label: 'Branch', value: branch || '-' },
    { label: 'Team', value: team || '-' },
    { label: 'Role', value: role || '-' },
    { label: 'Occupation', value: occupation || '-' },
    { label: 'Time zone', value: timezone || '-' },
    { label: 'Calendar of Holidays', value: calendarOfHolidays || '-' },
    { label: 'Comissions', value: commissions || '-' },
    { label: 'Office location', value: officeLocation || '-' },
  ];

  return (
    <Card className={styles.sidebar}>
      <h3 className={styles.title}>
        <Typography variant="body1">Additional information</Typography>
      </h3>
      <div className={styles.divider} />
      <div className={styles.infoList}>
        {infoItems.map((item, index) => (
          <div key={index} className={styles.infoItem}>
            <span className={styles.label}>
              <Typography variant="label">{item.label}</Typography>
            </span>
            <span className={styles.value}>
              <Typography variant="body5">{item.value}</Typography>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
