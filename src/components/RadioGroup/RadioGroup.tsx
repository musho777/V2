'use client';

import React from 'react';

import type { RadioGroupProps as AntRadioGroupProps } from 'antd';
import { Radio } from 'antd';

import { Typography } from '../Typography';

import styles from './styles.module.scss';

const { Group: AntRadioGroup } = Radio;

export interface RadioGroupProps extends AntRadioGroupProps {
  className?: string;
  label?: string;
  direction?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  className,
  label,
  direction = 'horizontal',
  ...props
}) => {
  return (
    <div className={styles.radioGroupWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntRadioGroup
        className={`${styles.radioGroup} ${direction === 'vertical' ? styles.vertical : styles.horizontal} ${className || ''}`}
        {...props}
      />
    </div>
  );
};
