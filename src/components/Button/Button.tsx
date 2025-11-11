'use client';

import React from 'react';

import type { ButtonProps as AntButtonProps } from 'antd';
import { Button as AntButton } from 'antd';

import styles from './styles.module.scss';

export interface ButtonProps extends AntButtonProps {
  className?: string;
  buttonType?:
    | 'primary'
    | 'action'
    | 'warning'
    | 'error'
    | 'success'
    | 'defaultWhite';
  variant?: 'dashed' | 'outlined' | 'text' | 'link';
  width?: number | string;
  height?: number | string;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  buttonType,
  variant,
  type,
  width,
  height,
  style,
  ...props
}) => {
  // If type="primary" is used, also apply custom primary class
  const customClass = buttonType
    ? `ant-btn-${buttonType}`
    : type === 'primary'
      ? 'ant-btn-primary'
      : '';
  const variantClass = variant ? styles[variant] : '';

  const buttonStyle = {
    ...style,
    ...(width && {
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    ...(height && {
      minHeight: typeof height === 'number' ? `${height}px` : height,
    }),
  };

  return (
    <AntButton
      type={type}
      className={`${styles.button} ${customClass} ${variantClass} ${className || ''}`}
      style={buttonStyle}
      {...props}
    />
  );
};
