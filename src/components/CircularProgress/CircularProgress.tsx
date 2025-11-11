'use client';

import React from 'react';

import type { ProgressProps } from 'antd';
import { Progress } from 'antd';

import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface CircularProgressProps extends Omit<ProgressProps, 'type'> {
  percent: number;
  size?: number;
  showPercentage?: boolean;
  showRightLabel?: boolean;
  whiteText?: boolean;
  strokeColor?: string | { [key: string]: string };
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percent,
  size = 50,
  showPercentage = true,
  showRightLabel = false,
  whiteText = false,
  strokeColor = {
    '0%': '#1890ff',
    '100%': '#52c41a',
  },
  ...props
}) => {
  return (
    <div className={styles.progressContainer}>
      <Progress
        type="circle"
        percent={percent}
        size={size}
        strokeColor={strokeColor}
        format={
          showPercentage
            ? (value) => (
                <Typography
                  variant="body3"
                  as="span"
                  className={styles.progressText}
                >
                  {value}%
                </Typography>
              )
            : () => null
        }
        {...props}
      />
      {showRightLabel && (
        <Typography
          variant="body2"
          as="span"
          className={`${styles.rightLabel} ${whiteText ? styles.whiteText : ''}`}
        >
          {percent}%
        </Typography>
      )}
    </div>
  );
};
