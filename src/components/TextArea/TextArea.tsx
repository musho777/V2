'use client';

import React from 'react';

import { Input } from 'antd';
import type { TextAreaProps as AntTextAreaProps } from 'antd/es/input';

import { Typography } from '@/components/Typography';

import styles from './styles.module.scss';

const { TextArea: AntTextArea } = Input;

export interface TextAreaProps extends AntTextAreaProps {
  className?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  className,
  label,
  width = 390,
  height = 89,
  style,
  error,
  ...props
}) => {
  const textAreaStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    minHeight: typeof height === 'number' ? `${height}px` : height,
    maxHeight: '120px',
    borderRadius: '8px',
    border: '1px solid rgba(212, 216, 221, 1)',
    ...style,
  };

  return (
    <div className={styles.textAreaWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntTextArea
        className={`${styles.textArea} ${className || ''}`}
        style={textAreaStyle}
        status={error ? 'error' : undefined}
        {...props}
      />
      {error && (
        <Typography variant="body4" as="div" className={styles.error}>
          {error}
        </Typography>
      )}
    </div>
  );
};
