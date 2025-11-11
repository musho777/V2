'use client';

import React, { useEffect, useState } from 'react';

import { ColorPicker as AntColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';

import { DEFAULT_PRESET_COLORS } from '@/constants/constants';

import styles from './styles.module.scss';

export interface ColorPickerWithPresetsProps {
  className?: string;
  label?: string;
  value?: string;
  onChange?: (color: string) => void;
  presetColors?: string[];
}

export const ColorPickerWithPresets: React.FC<ColorPickerWithPresetsProps> = ({
  className,
  label,
  value = '#2D6CDF',
  onChange,
  presetColors = DEFAULT_PRESET_COLORS,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(value);
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onChange?.(color);
  };

  const handlePickerChange = (color: Color, hex: string) => {
    setSelectedColor(hex);
    onChange?.(hex);
  };

  useEffect(() => {
    setSelectedColor(value);
  }, [value]);

  return (
    <div className={`${styles.colorPickerWrapper} ${className || ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.colorContainer}>
        <div className={styles.presetColors}>
          {presetColors.map((color) => (
            <div
              key={color}
              className={`${styles.colorBox} ${
                selectedColor === color ? styles.selected : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            >
              {selectedColor === color && (
                <span className={styles.checkmark}>✓</span>
              )}
            </div>
          ))}
        </div>
        <AntColorPicker
          value={selectedColor}
          onChange={handlePickerChange}
          showText={false}
          className={styles.colorPicker}
        />
      </div>
    </div>
  );
};
