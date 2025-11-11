'use client';

import React, { useState } from 'react';

import type { ColorPickerProps as AntColorPickerProps } from 'antd';
import { ColorPicker as AntColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';

import { Typography } from '@/components/Typography';

import './colorpicker-global.css';
import styles from './styles.module.scss';

export interface ColorPickerProps extends AntColorPickerProps {
  className?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
  showText?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  className,
  label,
  width = 180,
  height = 38,
  showText = true,
  value,
  onChange,
  ...props
}) => {
  const [color, setColor] = useState<AntColorPickerProps['value']>(
    value || '#1677ff',
  );

  const pickerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const handleChange = (newColor: Color, hex: string) => {
    setColor(newColor);
    if (onChange) {
      onChange(newColor, hex);
    }
  };

  return (
    <div className={styles.colorPickerWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntColorPicker
        className={`${styles.colorPicker} ${className || ''}`}
        style={pickerStyle}
        value={color}
        onChange={handleChange}
        showText={showText}
        {...props}
      />
    </div>
  );
};
