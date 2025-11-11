'use client';

import React, { useState } from 'react';

import { Radio } from 'antd';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal/Modal';
import { RadioGroup } from '@/components/RadioGroup/RadioGroup';
import { Select } from '@/components/Select/Select';
import { useTimezones } from '@/hooks/useTimezones';
import { useWorkSchedules } from '@/hooks/useWorkSchedules';
import type { AssignEmployeeScheduleRequest } from '@/types/employee-schedule.types';
import { toSelectOptions } from '@/utils/utils';

import styles from './styles.module.scss';

export interface ScheduleFormData {
  salaryType: string;
  timezone: number;
  effectiveDate: string;
  currency: number;
  salaryAmount: string;
  mondaySchedule: number;
  tuesdaySchedule: number;
  wednesdaySchedule: number;
  thursdaySchedule: number;
  fridaySchedule: number;
  saturdaySchedule: number;
  sundaySchedule: number;
  shiftRatesOption: string;
  overtime?: string;
  night?: string;
  weekend?: string;
  holiday?: string;
}

export interface AssignScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (scheduleData: AssignEmployeeScheduleRequest) => void;
  loading?: boolean;
  employeeId: number;
}

export const AssignScheduleModal: React.FC<AssignScheduleModalProps> = ({
  open,
  onClose,
  onAssign,
  loading = false,
  employeeId,
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    salaryType: '',
    timezone: 0,
    effectiveDate: '',
    currency: 0,
    salaryAmount: '',
    mondaySchedule: 0,
    tuesdaySchedule: 0,
    wednesdaySchedule: 0,
    thursdaySchedule: 0,
    fridaySchedule: 0,
    saturdaySchedule: 0,
    sundaySchedule: 0,
    shiftRatesOption: 'use-schedule',
    overtime: '',
    night: '',
    weekend: '',
    holiday: '',
  });

  const [timezoneDropdownOpen, setTimezoneDropdownOpen] = useState(false);
  const [scheduleDropdownOpen, setScheduleDropdownOpen] = useState(false);

  const { data: timezonesData } = useTimezones(timezoneDropdownOpen);
  const { data: workSchedulesData } = useWorkSchedules(
    open || scheduleDropdownOpen,
  );

  const handleAssign = () => {
    const isOwnRates = formData.shiftRatesOption === 'set-custom';

    const requestData: AssignEmployeeScheduleRequest = {
      employeeId,
      timezoneId: formData.timezone,
      workScheduleForMondayId: formData.mondaySchedule,
      workScheduleForTuesdayId: formData.tuesdaySchedule,
      workScheduleForWednesdayId: formData.wednesdaySchedule,
      workScheduleForThursdayId: formData.thursdaySchedule,
      workScheduleForFridayId: formData.fridaySchedule,
      workScheduleForSaturdayId: formData.saturdaySchedule,
      workScheduleForSundayId: formData.sundaySchedule,
      salaryType: formData.salaryType === 'fixed' ? 'FIXED' : 'HOURLY',
      salaryAmount: parseFloat(formData.salaryAmount),
      moneyUnitId: formData.currency,
      effectiveDate: formData.effectiveDate,
      isOwnRates,
      ...(isOwnRates && {
        overtimeRate: formData.overtime ? parseFloat(formData.overtime) : 10,
        nightRate: formData.night ? parseFloat(formData.night) : 10,
        weekendRate: formData.weekend ? parseFloat(formData.weekend) : 10,
        holidayRate: formData.holiday ? parseFloat(formData.holiday) : 10,
      }),
      isKeepWorkingHourPerDay: true,
    };

    onAssign(requestData);
    setFormData({
      salaryType: '',
      timezone: 0,
      effectiveDate: '',
      currency: 0,
      salaryAmount: '',
      mondaySchedule: 0,
      tuesdaySchedule: 0,
      wednesdaySchedule: 0,
      thursdaySchedule: 0,
      fridaySchedule: 0,
      saturdaySchedule: 0,
      sundaySchedule: 0,
      shiftRatesOption: 'use-schedule',
      overtime: '',
      night: '',
      weekend: '',
      holiday: '',
    });
  };

  const handleCancel = (e?: React.MouseEvent<HTMLElement>) => {
    setFormData({
      salaryType: '',
      timezone: 0,
      effectiveDate: '',
      currency: 0,
      salaryAmount: '',
      mondaySchedule: 0,
      tuesdaySchedule: 0,
      wednesdaySchedule: 0,
      thursdaySchedule: 0,
      fridaySchedule: 0,
      saturdaySchedule: 0,
      sundaySchedule: 0,
      shiftRatesOption: 'use-schedule',
      overtime: '',
      night: '',
      weekend: '',
      holiday: '',
    });
    onClose();
    if (e) {
      e.stopPropagation();
    }
  };

  const isFormValid = () => {
    return (
      formData.salaryType &&
      formData.timezone &&
      formData.effectiveDate &&
      formData.currency &&
      formData.salaryAmount
    );
  };

  const salaryTypeOptions = [
    { value: 'fixed', label: 'Fixed Salary' },
    { value: 'hourly', label: 'Hourly Rate' },
  ];

  const timezoneOptions = timezonesData ? toSelectOptions(timezonesData) : [];

  const currencyOptions = [
    { value: 1, label: 'AMD' },
    { value: 2, label: 'USD' },
    { value: 3, label: 'EUR' },
  ];

  const scheduleOptions = workSchedulesData
    ? toSelectOptions(workSchedulesData)
    : [];

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleAssign}
      title="Assign Schedule"
      submitButtonText="Assign"
      closeButtonText="Cancel"
      submitButtonDisabled={!isFormValid()}
      loading={loading}
      width={578}
      showFooter={true}
    >
      <div className={styles.scheduleModalContent}>
        <div className={styles.row}>
          <Select
            label="Salary type"
            placeholder="Select salary type"
            options={salaryTypeOptions}
            value={formData.salaryType}
            onChange={(value) =>
              setFormData({ ...formData, salaryType: value as string })
            }
            width={120}
            height={48}
          />
          <Input
            label="Salary amount"
            type="number"
            placeholder="Enter salary amount"
            value={formData.salaryAmount}
            onChange={(e) =>
              setFormData({ ...formData, salaryAmount: e.target.value })
            }
            height={48}
            width={250}
          />
          <Select
            label="Currency"
            placeholder="Select currency"
            options={currencyOptions}
            value={formData.currency}
            onChange={(value) =>
              setFormData({ ...formData, currency: value as number })
            }
            width={120}
            height={48}
          />
        </div>

        <div className={styles.row}>
          <Select
            label="Time zone"
            placeholder="Select time zone"
            options={timezoneOptions}
            value={formData.timezone}
            onChange={(value) =>
              setFormData({ ...formData, timezone: value as number })
            }
            onDropdownVisibleChange={setTimezoneDropdownOpen}
            width={250}
            height={48}
          />
          <Input
            label="Effective date"
            type="date"
            value={formData.effectiveDate}
            onChange={(e) =>
              setFormData({ ...formData, effectiveDate: e.target.value })
            }
            height={48}
            width={250}
          />
        </div>

        <div className={styles.row}>
          <Select
            label="Monday's Schedule"
            placeholder="Select schedule"
            options={scheduleOptions}
            value={formData.mondaySchedule}
            onChange={(value) =>
              setFormData({ ...formData, mondaySchedule: value as number })
            }
            onDropdownVisibleChange={setScheduleDropdownOpen}
            width={250}
            height={48}
          />
          <Select
            label="Tuesday's Schedule"
            placeholder="Select schedule"
            options={scheduleOptions}
            value={formData.tuesdaySchedule}
            onChange={(value) =>
              setFormData({ ...formData, tuesdaySchedule: value as number })
            }
            onDropdownVisibleChange={setScheduleDropdownOpen}
            width={250}
            height={48}
          />
        </div>

        <div className={styles.row}>
          <Select
            label="Wednesday's Schedule"
            placeholder="Select schedule"
            options={scheduleOptions}
            value={formData.wednesdaySchedule}
            onChange={(value) =>
              setFormData({ ...formData, wednesdaySchedule: value as number })
            }
            onDropdownVisibleChange={setScheduleDropdownOpen}
            width={250}
            height={48}
          />
          <Select
            label="Thursday's Schedule"
            placeholder="Select schedule"
            options={scheduleOptions}
            value={formData.thursdaySchedule}
            onChange={(value) =>
              setFormData({ ...formData, thursdaySchedule: value as number })
            }
            onDropdownVisibleChange={setScheduleDropdownOpen}
            width={250}
            height={48}
          />
        </div>

        <div className={styles.row}>
          <Select
            label="Friday's Schedule"
            placeholder="Select schedule"
            options={scheduleOptions}
            value={formData.fridaySchedule}
            onChange={(value) =>
              setFormData({ ...formData, fridaySchedule: value as number })
            }
            onDropdownVisibleChange={setScheduleDropdownOpen}
            width={250}
            height={48}
          />
          <Select
            label="Saturday's Schedule"
            placeholder="Select schedule"
            options={scheduleOptions}
            value={formData.saturdaySchedule}
            onChange={(value) =>
              setFormData({ ...formData, saturdaySchedule: value as number })
            }
            onDropdownVisibleChange={setScheduleDropdownOpen}
            width={250}
            height={48}
          />
        </div>

        <div className={styles.row}>
          <Select
            label="Sunday's Schedule"
            placeholder="Select schedule"
            options={scheduleOptions}
            value={formData.sundaySchedule}
            onChange={(value) =>
              setFormData({ ...formData, sundaySchedule: value as number })
            }
            onDropdownVisibleChange={setScheduleDropdownOpen}
            width={250}
            height={48}
          />
        </div>

        <div className={styles.shiftRatesSection}>
          <RadioGroup
            value={formData.shiftRatesOption}
            onChange={(e) =>
              setFormData({ ...formData, shiftRatesOption: e.target.value })
            }
            direction="vertical"
          >
            <Radio value="use-schedule">
              Out of shift rates of the schedule.
            </Radio>
            <Radio value="set-custom">Set new out of shift rates</Radio>
          </RadioGroup>

          {formData.shiftRatesOption === 'set-custom' && (
            <div className={styles.customRatesInputs}>
              <div className={styles.row}>
                <Input
                  label="Overtime"
                  type="number"
                  value={formData.overtime}
                  onChange={(e) =>
                    setFormData({ ...formData, overtime: e.target.value })
                  }
                  height={48}
                  width={120}
                />
                <Input
                  label="Night"
                  type="number"
                  value={formData.night}
                  onChange={(e) =>
                    setFormData({ ...formData, night: e.target.value })
                  }
                  height={48}
                  width={120}
                />
                <Input
                  label="Weekend"
                  type="number"
                  value={formData.weekend}
                  onChange={(e) =>
                    setFormData({ ...formData, weekend: e.target.value })
                  }
                  height={48}
                  width={120}
                />
                <Input
                  label="Holiday"
                  type="number"
                  value={formData.holiday}
                  onChange={(e) =>
                    setFormData({ ...formData, holiday: e.target.value })
                  }
                  height={48}
                  width={120}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
