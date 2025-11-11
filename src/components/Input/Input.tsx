'use client';

import React, { useState } from 'react';

import type { InputProps as AntInputProps } from 'antd';
import { Input as AntInput } from 'antd';

import { EyeClosedIcon, EyeOpenIcon, SearchIcon } from '@/components/Icons';
import { Typography } from '@/components/Typography';

import styles from './styles.module.scss';

export interface InputProps extends AntInputProps {
  className?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
  showSearch?: boolean;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  className,
  label,
  width,
  height = 48,
  showSearch = false,
  type,
  error,
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const inputStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const isPasswordInput = type === 'password';
  const isSearchInput = type === 'search' || showSearch;

  const getSuffix = () => {
    if (isSearchInput) {
      return (
        <div className={styles.searchIconWrapper}>
          <SearchIcon />
        </div>
      );
    }

    if (isPasswordInput) {
      return (
        <div
          className={styles.eyeIconWrapper}
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </div>
      );
    }

    return props.suffix;
  };

  return (
    <div className={styles.inputWrapper}>
      <div className="gap-2 flex flex-col mb-1">
        {label && (
          <Typography variant="label" as="label" className={styles.label}>
            {label}
            {props.required && (
              <Typography as="span" variant="label" style={{ color: 'red' }}>
                {' '}
                *
              </Typography>
            )}
          </Typography>
        )}
        <AntInput
          className={`${styles.input} ${className || ''}`}
          style={inputStyle}
          type={
            isPasswordInput && passwordVisible
              ? 'text'
              : isSearchInput
                ? 'text'
                : type
          }
          suffix={getSuffix()}
          status={error ? 'error' : undefined}
          {...props}
        />
      </div>
      {error && (
        <Typography variant="body4" as="div" className={styles.error}>
          {error}
        </Typography>
      )}
    </div>
  );
};
