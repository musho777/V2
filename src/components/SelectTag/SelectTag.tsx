'use client';

import React from 'react';

import { CloseIcon } from '../Icons/CloseIcon';
import { CloseIconBlue } from '../Icons/CloseIconBlue';

import styles from './styles.module.scss';

export type SelectTagType = 'primary' | 'action' | 'default';

export interface SelectTagProps {
  className?: string;
  type?: SelectTagType;
  children: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
}

export const SelectTag: React.FC<SelectTagProps> = ({
  className,
  type = 'default',
  children,
  onClose,
  closable = true,
}) => {
  const CloseIconComponent = type === 'default' ? CloseIconBlue : CloseIcon;

  return (
    <div className={`${styles.selectTag} ${styles[type]} ${className || ''}`}>
      <span className={styles.text}>{children}</span>
      {closable && (
        <div className={styles.closeIcon} onClick={onClose}>
          <CloseIconComponent />
        </div>
      )}
    </div>
  );
};
