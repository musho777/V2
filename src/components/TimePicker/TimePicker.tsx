'use client';

import React from 'react';

import type { TimePickerProps as AntTimePickerProps } from 'antd';
import { TimePicker as AntTimePicker } from 'antd';

import { Typography } from '@/components/Typography';

import './timepicker-global.css';
import styles from './styles.module.scss';

export interface TimePickerProps extends AntTimePickerProps {
  className?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  className,
  label,
  width = 180,
  height = 38,
  format = 'HH:mm',
  ...props
}) => {
  const pickerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={styles.timePickerWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntTimePicker
        className={`${styles.timePicker} ${className || ''}`}
        style={pickerStyle}
        format={format}
        {...props}
      />
    </div>
  );
};
