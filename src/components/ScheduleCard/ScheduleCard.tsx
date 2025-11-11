'use client';

import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Typography } from '@/components/Typography';
import type { Schedule } from '@/types/schedule.types';

import styles from './styles.module.scss';

export interface ScheduleCardProps {
  schedule: Schedule;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Typography variant="h3" className={styles.cardTitle}>
          {schedule.name}
        </Typography>
      </div>

      <div className={styles.cardDivider} />

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Description:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            {schedule.description}
          </Typography>
        </div>

        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Working status:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            {schedule.workingStatus === 'WORKING' ? 'Working' : 'Day Off'}
          </Typography>
        </div>

        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Shift time:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            {schedule.shiftStartTime} - {schedule.shiftEndTime}
          </Typography>
        </div>

        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Break time:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            {schedule.breakStartTime} - {schedule.breakEndTime}
          </Typography>
        </div>

        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Night hours:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            {schedule.nightStartTime} - {schedule.nightEndTime}
          </Typography>
        </div>

        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Rates:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            OT: {schedule.overtimeRate}% | Night: {schedule.nightRate}% |
            Weekend: {schedule.weekendRate}% | Holiday: {schedule.holidayRate}%
          </Typography>
        </div>
      </div>

      <div className={styles.cardDivider} />

      <div className={styles.cardFooter}>
        <button
          className={styles.actionButton}
          onClick={() => onEdit?.(schedule)}
          aria-label="Edit schedule"
        >
          <EditOutlined className={styles.icon} />
        </button>
        <button
          className={styles.actionButton}
          onClick={() => onDelete?.(schedule)}
          aria-label="Delete schedule"
        >
          <DeleteOutlined className={styles.icon} />
        </button>
      </div>
    </div>
  );
};
