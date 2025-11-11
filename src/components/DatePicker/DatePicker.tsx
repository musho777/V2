'use client';

import React, { useState } from 'react';

import type { DatePickerProps as AntDatePickerProps } from 'antd';
import { DatePicker as AntDatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';

import {
  ArrowDownIcon,
  CalendarIcon,
  DatePickerLeftArrow,
  DatePickerRightArrow,
} from '@/components/Icons';
import { Typography } from '@/components/Typography';

import './datepicker-global.css';
import styles from './styles.module.scss';

const { RangePicker: AntRangePicker } = AntDatePicker;

export interface DatePickerProps extends Omit<AntDatePickerProps, 'picker'> {
  className?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
  error?: string;
}

export interface RangePickerComponentProps
  extends Omit<RangePickerProps, 'picker'> {
  className?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  className,
  label,
  width = 140,
  height = 38,
  format = 'MMMM YYYY',
  error,
  ...props
}) => {
  const pickerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={styles.datePickerWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntDatePicker
        className={`${styles.datePicker} ${className || ''}`}
        style={pickerStyle}
        prefix={<CalendarIcon />}
        suffixIcon={<ArrowDownIcon />}
        superPrevIcon={null}
        superNextIcon={null}
        prevIcon={<DatePickerLeftArrow />}
        nextIcon={<DatePickerRightArrow />}
        format={format}
        inputReadOnly
        renderExtraFooter={undefined}
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

export const RangePicker: React.FC<RangePickerComponentProps> = ({
  className,
  label,
  width = 180,
  height = 38,
  format = 'DD/MM/YYYY',
  value,
  onChange,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState<'from' | 'to'>('from');
  const [internalValue, setInternalValue] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(value as [Dayjs | null, Dayjs | null] | null);

  const pickerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={styles.datePickerWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntRangePicker
        className={`${styles.datePicker} ${styles.rangePickerSingle} ${
          className || ''
        }`}
        style={pickerStyle}
        prefix={<CalendarIcon />}
        suffixIcon={<ArrowDownIcon />}
        separator={
          <Typography as="span" variant="body2" className={styles.separator}>
            -
          </Typography>
        }
        superPrevIcon={null}
        superNextIcon={null}
        prevIcon={<DatePickerLeftArrow />}
        nextIcon={<DatePickerRightArrow />}
        format={format}
        value={internalValue}
        onOpenChange={(open) => {
          // Reset to "from" tab when opening the picker
          if (open) {
            setActiveTab('from');
          }
        }}
        onCalendarChange={(dates) => {
          // Auto-switch to "To" tab after selecting "From" date
          if (activeTab === 'from' && dates && dates[0]) {
            setActiveTab('to');
          }
        }}
        onChange={(dates, dateStrings) => {
          setInternalValue(dates);
          if (onChange) {
            onChange(dates, dateStrings);
          }
        }}
        inputReadOnly
        renderExtraFooter={undefined}
        panelRender={(panelNode) => (
          <div className={styles.rangePickerPanel}>
            <div className={styles.rangePanelTabs}>
              <button
                onClick={() => setActiveTab('from')}
                className={`${styles.tabButton} ${
                  activeTab === 'from' ? styles.active : ''
                }`}
              >
                <Typography variant="body2" as="span">
                  From
                </Typography>
              </button>
              <button
                onClick={() => setActiveTab('to')}
                className={`${styles.tabButton} ${
                  activeTab === 'to' ? styles.active : ''
                }`}
              >
                <Typography variant="body2" as="span">
                  To
                </Typography>
              </button>
            </div>
            {panelNode}
          </div>
        )}
        {...props}
      />
    </div>
  );
};
