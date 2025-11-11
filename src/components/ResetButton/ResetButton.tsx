'use client';

import React from 'react';

import type { ButtonProps as AntButtonProps } from 'antd';
import { Button as AntButton } from 'antd';

import { ResetIcon } from '../Icons/ResetIcon';
import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface ResetButtonProps extends Omit<AntButtonProps, 'onClick'> {
  className?: string;
  onReset: () => void;
  height?: number;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  className,
  height,
  onReset,
  ...props
}) => {
  return (
    <AntButton
      type="link"
      onClick={onReset}
      className={`${styles.resetButton} ${className || ''}`}
      style={{ minHeight: height ? `${height}px` : undefined, ...props.style }}
      {...props}
    >
      <ResetIcon />
      <Typography variant="buttonText" as="span">
        {props.children || 'Reset'}
      </Typography>
    </AntButton>
  );
};
