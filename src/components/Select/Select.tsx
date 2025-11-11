'use client';

import type { ReactNode } from 'react';
import React, { useRef, useState } from 'react';

import type { SelectProps as AntSelectProps } from 'antd';
import { Checkbox, Select as AntSelect } from 'antd';

import { ArrowDownIcon } from '@/components/Icons';
import { Typography } from '@/components/Typography';

import { SelectTag } from '../SelectTag';

import './select-global.css';
import styles from './styles.module.scss';

export interface SelectProps extends AntSelectProps {
  className?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
  icon?: ReactNode;
  showTags?: boolean;
  name?: string;
  tagType?: 'primary' | 'action' | 'default';
  error?: string;
  required?: boolean;
  debounceDelay?: number;
  onDropdownVisibleChange?: (open: boolean) => void;
}

export const Select: React.FC<SelectProps> = ({
  className,
  label,
  width = 180,
  height = 38,
  icon,
  mode,
  maxTagCount,
  showTags = false,
  tagType = 'default',
  value,
  onChange,
  placeholder,
  options,
  error,
  debounceDelay = 500,
  ...props
}) => {
  const [selectedValues, setSelectedValues] = useState<unknown[]>(
    Array.isArray(value) ? value : value !== undefined ? [value] : [],
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (value === undefined || value === null) {
      setSelectedValues([]);
    } else if (Array.isArray(value)) {
      setSelectedValues(value);
    } else {
      setSelectedValues([value]);
    }
  }, [value]);

  const selectStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const prefixIcon = icon ? (
    <div className={styles.prefixIcon}>{icon}</div>
  ) : undefined;

  const maxTagCountValue =
    mode === 'multiple' ? (showTags ? 0 : 0) : maxTagCount;
  const maxTagPlaceholder =
    mode === 'multiple'
      ? (omittedValues: unknown[]) => (
          <Typography
            variant="body2"
            as="span"
            className={styles.selectedCount}
          >
            Selected {showTags ? selectedValues.length : omittedValues.length}
          </Typography>
        )
      : undefined;

  const handleChange = (newValue: unknown) => {
    setSelectedValues(Array.isArray(newValue) ? newValue : [newValue]);
    if (onChange) {
      onChange(newValue, [] as AntSelectProps['options']);
    }
  };

  const handleRemoveTag = (valueToRemove: unknown) => {
    const newValues = selectedValues.filter((v) => v !== valueToRemove);
    setSelectedValues(newValues);
    if (onChange) {
      onChange(newValues, [] as AntSelectProps['options']);
    }
  };

  const optionRender =
    mode === 'multiple'
      ? (option: { value?: unknown; label?: React.ReactNode }) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <div className={styles.checkboxOption}>
              <Checkbox checked={isSelected} />
              <Typography variant="body2" as="span">
                {option.label}
              </Typography>
            </div>
          );
        }
      : undefined;

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    if (onChange) {
      onChange([], [] as AntSelectProps['options']);
    }
  };

  const handleSearch = (searchValue: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (props.onSearch) {
        props.onSearch(searchValue);
      }
    }, debounceDelay);
  };

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.selectWrapper}>
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
        <div className={styles.selectContainer}>
          {prefixIcon}
          <AntSelect
            className={`${styles.select} ${icon ? styles.withIcon : ''} ${className || ''}`}
            style={selectStyle}
            suffixIcon={<ArrowDownIcon />}
            mode={mode}
            maxTagCount={maxTagCountValue}
            placeholder={placeholder}
            maxTagPlaceholder={maxTagPlaceholder}
            value={selectedValues}
            onChange={handleChange}
            options={options}
            optionRender={optionRender}
            allowClear={false}
            status={error ? 'error' : undefined}
            {...props}
            onSearch={props.showSearch ? handleSearch : props.onSearch}
            onDropdownVisibleChange={props.onDropdownVisibleChange}
          />
          {mode === 'multiple' && selectedValues.length > 0 && (
            <button
              className={styles.clearButton}
              onClick={handleClearAll}
              type="button"
            >
              ×
            </button>
          )}
        </div>
      </div>
      {error && (
        <Typography variant="body4" as="div" className={styles.error}>
          {error}
        </Typography>
      )}

      {showTags && mode === 'multiple' && selectedValues.length > 0 && (
        <div className={styles.tagsContainer}>
          {selectedValues.map((val) => {
            const option = options?.find((opt) => opt.value === val);
            return (
              <SelectTag
                key={String(val)}
                type={tagType}
                onClose={() => handleRemoveTag(val)}
              >
                {option?.label || String(val)}
              </SelectTag>
            );
          })}
        </div>
      )}
    </div>
  );
};
