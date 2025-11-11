'use client';

import React from 'react';

import { Radio } from 'antd';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal/Modal';
import { RadioGroup } from '@/components/RadioGroup/RadioGroup';
import { Select } from '@/components/Select/Select';
import { useScheduleForm } from '@/hooks/useScheduleForm';
import { useScheduleOptions } from '@/hooks/useScheduleOptions';
import type {
  AssignEmployeeScheduleRequest,
  EmployeeScheduleResponse,
} from '@/types/employee-schedule.types';

import styles from './styles.module.scss';

export interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (scheduleData: AssignEmployeeScheduleRequest) => void;
  loading?: boolean;
  employeeId: number;
  initialData?: EmployeeScheduleResponse | null;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  open,
  onClose,
  onUpdate,
  loading = false,
  employeeId,
  initialData,
}) => {
  // Form state management
  const { formData, updateField, isFormValid, toRequestData } = useScheduleForm(
    initialData,
    open,
  );

  // Dropdown options
  const {
    salaryTypeOptions,
    currencyOptions,
    timezoneOptions,
    scheduleOptions,
    setTimezoneDropdownOpen,
    setScheduleDropdownOpen,
  } = useScheduleOptions(open);

  const handleUpdate = () => {
    const requestData = toRequestData(employeeId, initialData?.id);
    onUpdate(requestData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleUpdate}
      title="Edit Schedule"
      submitButtonText="Update"
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
            onChange={(value) => updateField('salaryType', value as string)}
            width={120}
            height={48}
          />
          <Input
            label="Salary amount"
            type="number"
            placeholder="Enter salary amount"
            value={formData.salaryAmount}
            onChange={(e) => updateField('salaryAmount', e.target.value)}
            height={48}
            width={250}
          />
          <Select
            label="Currency"
            placeholder="Select currency"
            options={currencyOptions}
            value={formData.currency}
            onChange={(value) => updateField('currency', value as number)}
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
            onChange={(value) => updateField('timezone', value as number)}
            onDropdownVisibleChange={setTimezoneDropdownOpen}
            width={250}
            height={48}
          />
          <Input
            label="Effective date"
            type="date"
            value={formData.effectiveDate}
            onChange={(e) => updateField('effectiveDate', e.target.value)}
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
            onChange={(value) => updateField('mondaySchedule', value as number)}
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
              updateField('tuesdaySchedule', value as number)
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
              updateField('wednesdaySchedule', value as number)
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
              updateField('thursdaySchedule', value as number)
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
            onChange={(value) => updateField('fridaySchedule', value as number)}
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
              updateField('saturdaySchedule', value as number)
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
            onChange={(value) => updateField('sundaySchedule', value as number)}
            onDropdownVisibleChange={setScheduleDropdownOpen}
            width={250}
            height={48}
          />
        </div>

        <div className={styles.shiftRatesSection}>
          <RadioGroup
            value={formData.shiftRatesOption}
            onChange={(e) => updateField('shiftRatesOption', e.target.value)}
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
                  onChange={(e) => updateField('overtime', e.target.value)}
                  height={48}
                  width={120}
                />
                <Input
                  label="Night"
                  type="number"
                  value={formData.night}
                  onChange={(e) => updateField('night', e.target.value)}
                  height={48}
                  width={120}
                />
                <Input
                  label="Weekend"
                  type="number"
                  value={formData.weekend}
                  onChange={(e) => updateField('weekend', e.target.value)}
                  height={48}
                  width={120}
                />
                <Input
                  label="Holiday"
                  type="number"
                  value={formData.holiday}
                  onChange={(e) => updateField('holiday', e.target.value)}
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
