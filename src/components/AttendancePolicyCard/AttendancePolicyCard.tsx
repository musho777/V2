'use client';

import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Typography } from '@/components/Typography';
import type { AttendancePolicy } from '@/types/attendance-policy.types';

import styles from './styles.module.scss';

export interface AttendancePolicyCardProps {
  policy: AttendancePolicy;
  onEdit?: (policy: AttendancePolicy) => void;
  onDelete?: (policy: AttendancePolicy) => void;
}

export const AttendancePolicyCard: React.FC<AttendancePolicyCardProps> = ({
  policy,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Typography variant="h3" className={styles.cardTitle}>
          Policy #{policy.id}
        </Typography>
      </div>

      <div className={styles.cardDivider} />

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Daily acceptable minutes:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            {policy.dailyAcceptableMinutes} min
          </Typography>
        </div>

        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Daily unacceptable minutes:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            {policy.dailyUnacceptableMinutes} min
          </Typography>
        </div>

        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Monthly acceptable minutes:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            {policy.monthlyAcceptableMinutes} min
          </Typography>
        </div>

        <div className={styles.infoRow}>
          <Typography variant="label" as="span" className={styles.label}>
            Monthly unacceptable minutes:
          </Typography>
          <Typography variant="body2" as="span" className={styles.value}>
            {policy.monthlyUnacceptableMinutes} min
          </Typography>
        </div>
      </div>

      <div className={styles.cardDivider} />

      <div className={styles.cardFooter}>
        <button
          className={styles.actionButton}
          onClick={() => onEdit?.(policy)}
          aria-label="Edit policy"
        >
          <EditOutlined className={styles.icon} />
        </button>
        <button
          className={styles.actionButton}
          onClick={() => onDelete?.(policy)}
          aria-label="Delete policy"
        >
          <DeleteOutlined className={styles.icon} />
        </button>
      </div>
    </div>
  );
};
