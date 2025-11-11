'use client';

import React from 'react';

import { Switch } from 'antd';

import type { TagType } from '@/components/Tag';
import { Tag } from '@/components/Tag';
import { Typography } from '@/components/Typography';
import type { PriorityLevel } from '@/types/profile.types';

import styles from './styles.module.scss';

export interface ContactItemProps {
  value: string;
  priority: PriorityLevel;
  isActive: boolean;
  onToggle?: (isActive: boolean) => void;
  canEdit?: boolean;
}

const priorityColorMap: Record<PriorityLevel, TagType> = {
  highest: 'blue',
  high: 'green',
  medium: 'orange',
  low: 'yellow',
};

export const ContactItem: React.FC<ContactItemProps> = ({
  value,
  priority,
  isActive,
  onToggle,
  canEdit = false,
}) => {
  return (
    <div
      className={`${styles.contactItem} ${!isActive ? styles.inactive : ''}`}
    >
      <Typography variant="body2" as="span" className={styles.contactValue}>
        {value}
      </Typography>

      <div className={styles.contactActions}>
        <Tag
          tagType={priorityColorMap[priority]}
          className={styles.priorityTag}
        >
          <Typography variant="body3" as="span">
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Typography>
        </Tag>

        {canEdit && (
          <Switch
            checked={isActive}
            onChange={onToggle}
            size="small"
            className={styles.switch}
          />
        )}
      </div>
    </div>
  );
};
