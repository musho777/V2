'use client';

import React from 'react';

import type { SwitchProps as AntSwitchProps } from 'antd';
import { Switch as AntSwitch } from 'antd';

import { Typography } from '@/components/Typography';

import './switch-global.css';
import styles from './styles.module.scss';

export interface SwitchProps extends AntSwitchProps {
  className?: string;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  className,
  label,
  ...props
}) => {
  return (
    <div className={styles.switchWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntSwitch className={`${styles.switch} ${className || ''}`} {...props} />
    </div>
  );
};
