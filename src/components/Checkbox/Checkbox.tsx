'use client';

import React from 'react';

import type { CheckboxProps as AntCheckboxProps } from 'antd';
import { Checkbox as AntCheckbox } from 'antd';

import { Typography } from '@/components/Typography';

import styles from './styles.module.scss';

export interface CheckboxProps extends AntCheckboxProps {
  className?: string;
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  label,
  children,
  ...props
}) => {
  return (
    <div className={styles.checkboxWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntCheckbox
        className={`${styles.checkbox} ${className || ''}`}
        {...props}
      >
        {children}
      </AntCheckbox>
    </div>
  );
};
