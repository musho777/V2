'use client';

import type { ReactNode } from 'react';
import React, { memo } from 'react';

import { Button } from '../Button';
import { EmptyIllustration } from '../Icons';
import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionBtnText?: string;
  onAction?: () => void;
  accessToAction?: boolean;
  actionBtnIcon?: ReactNode;
  className?: string;
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionBtnText,
  accessToAction,
  actionBtnIcon,
  onAction,
  className,
}) => {
  return (
    <div className={`${styles.emptyState} ${className || ''}`}>
      <EmptyIllustration />
      <Typography variant="heading4">{title}</Typography>
      {description && (
        <div className={styles.description}>
          <Typography variant="body1" className={styles.descriptionText}>
            {description}
          </Typography>
        </div>
      )}
      {accessToAction && onAction && actionBtnText && (
        <Button onClick={onAction} buttonType="action" icon={actionBtnIcon}>
          {actionBtnText}
        </Button>
      )}
    </div>
  );
};

export const EmptyState = memo(EmptyStateComponent);
export default EmptyState;
