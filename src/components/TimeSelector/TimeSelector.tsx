'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { LocalizationProvider, StaticTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { Button } from '@/components/Button';
import { ClockIcon } from '@/components/Icons';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';

import styles from './styles.module.scss';

export type TimeFormat = '12' | '24';

export interface TimeSelectorValue {
  startTime: string;
  endTime?: string;
}

export interface TimeSelectorProps {
  value?: TimeSelectorValue;
  onChange?: (value: TimeSelectorValue) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  singleTime?: boolean;
  timeFormat?: TimeFormat;
  onTimeFormatChange?: (format: TimeFormat) => void;
  disabled?: boolean;
  allowDisabled?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  name?: string;
  required?: boolean;
  showFormatSelector?: boolean;
}

const TIME_FORMAT_OPTIONS = [
  { value: '12', label: '12 hour' },
  { value: '24', label: '24 hour' },
];

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  label = 'Select Time',
  placeholder = 'Select time',
  error,
  singleTime = false,
  timeFormat = '24',
  onTimeFormatChange,
  disabled = false,
  allowDisabled = false,
  width = '100%',
  height = 38,
  className = '',
  required = false,
  showFormatSelector = true,
}) => {
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [internalTimeFormat, setInternalTimeFormat] =
    useState<TimeFormat>(timeFormat);
  const [openPicker, setOpenPicker] = useState<'start' | 'end' | null>(null);

  // Sync internal state with value prop
  useEffect(() => {
    if (!value) {
      setStartTime(null);
      setEndTime(null);
      return;
    }

    if (value.startTime) {
      const parsedStartTime = dayjs(value.startTime, 'HH:mm');
      if (parsedStartTime.isValid()) {
        setStartTime(parsedStartTime);
      }
    } else {
      setStartTime(null);
    }

    if (!singleTime && value.endTime) {
      const parsedEndTime = dayjs(value.endTime, 'HH:mm');
      if (parsedEndTime.isValid()) {
        setEndTime(parsedEndTime);
      }
    } else if (singleTime) {
      setEndTime(null);
    }
  }, [value, singleTime]);

  // Sync internal time format with prop
  useEffect(() => {
    setInternalTimeFormat(timeFormat);
  }, [timeFormat]);

  const handleFormatChange = useCallback(
    (format: string) => {
      const newFormat = format as TimeFormat;
      setInternalTimeFormat(newFormat);
      onTimeFormatChange?.(newFormat);
    },
    [onTimeFormatChange],
  );

  const openTimePicker = useCallback(() => {
    if (!disabled) {
      setOpenPicker('start');
    }
  }, [disabled]);

  const closeTimePicker = useCallback(() => {
    setOpenPicker(null);
  }, []);

  const handleSubmit = useCallback(() => {
    const formattedStartTime = startTime ? startTime.format('HH:mm') : '';
    const formattedEndTime = endTime ? endTime.format('HH:mm') : '';

    const payload: TimeSelectorValue = { startTime: formattedStartTime };
    if (!singleTime) {
      payload.endTime = formattedEndTime;
    }

    onChange?.(payload);
    closeTimePicker();
  }, [startTime, endTime, singleTime, onChange, closeTimePicker]);

  const getDisplayValue = useCallback(() => {
    const format = internalTimeFormat === '12' ? 'hh:mm A' : 'HH:mm';

    if (singleTime) {
      return startTime ? startTime.format(format) : '';
    }

    if (startTime && endTime) {
      return `${startTime.format(format)} - ${endTime.format(format)}`;
    }

    return '';
  }, [startTime, endTime, singleTime, internalTimeFormat]);

  const inputStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const isSubmitDisabled =
    allowDisabled && (!startTime || (!singleTime && !endTime));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`${styles.timeSelectorWrapper} ${className}`}>
        <div className={styles.inputRow}>
          <div className={styles.inputContainer} style={{ flex: 1 }}>
            <Input
              label={label}
              placeholder={placeholder}
              value={getDisplayValue()}
              onClick={openTimePicker}
              readOnly
              height={48}
              disabled={disabled}
              required={required}
              status={error ? 'error' : undefined}
              suffix={
                <div className={styles.iconWrapper}>
                  <ClockIcon />
                </div>
              }
              style={inputStyle}
            />
          </div>

          {showFormatSelector && (
            <div className={styles.formatSelector}>
              <Select
                label="&#8206;"
                width={120}
                height={height}
                value={internalTimeFormat}
                onChange={handleFormatChange}
                options={TIME_FORMAT_OPTIONS}
                disabled={disabled}
              />
            </div>
          )}
        </div>
        {error && <span className={styles.errorText}>{error}</span>}

        <Modal
          open={Boolean(openPicker)}
          onCancel={closeTimePicker}
          title={''}
          width="400px"
          showFooter={false}
        >
          <div className={styles.modalContent}>
            {!singleTime && (
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${
                    openPicker === 'start' ? styles.active : ''
                  }`}
                  onClick={() => setOpenPicker('start')}
                >
                  Start time
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${
                    openPicker === 'end' ? styles.active : ''
                  }`}
                  onClick={() => setOpenPicker('end')}
                >
                  End time
                </button>
              </div>
            )}

            <div className={styles.pickerContainer}>
              <StaticTimePicker
                key={openPicker}
                value={openPicker === 'start' ? startTime : endTime}
                onChange={(newValue: Dayjs | null) =>
                  openPicker === 'start'
                    ? setStartTime(newValue)
                    : setEndTime(newValue)
                }
                ampm={internalTimeFormat === '12'}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '& .MuiClock-clock': {
                    backgroundColor: '#EFF2F9',
                  },
                }}
                slotProps={{
                  actionBar: { actions: [] },
                  toolbar: { hidden: true },
                }}
                slots={{
                  leftArrowIcon: () => null,
                  rightArrowIcon: () => null,
                }}
              />
            </div>

            <div className={styles.actionRow}>
              <Button onClick={closeTimePicker} buttonType="defaultWhite">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                buttonType="primary"
                disabled={isSubmitDisabled}
              >
                Ok
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </LocalizationProvider>
  );
};
