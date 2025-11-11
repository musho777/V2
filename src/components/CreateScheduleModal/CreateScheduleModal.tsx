'use client';

import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { TimePicker } from '@/components/TimePicker';
import type {
  CreateScheduleRequest,
  WorkingStatus,
} from '@/types/schedule.types';

import type { CreateScheduleFormValues } from './schema';
import { createScheduleSchema } from './schema';

import styles from './styles.module.scss';

export interface CreateScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateScheduleRequest) => void | Promise<void>;
  initialData?: Partial<CreateScheduleRequest>;
  mode?: 'create' | 'edit';
}

const workingStatusOptions = [
  { value: 'WORKING', label: 'Working' },
  { value: 'DAY_OFF', label: 'Day Off' },
];

export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const initialValues: CreateScheduleFormValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    workingStatus: initialData?.workingStatus || 'DAY_OFF',
    shiftStartTime: initialData?.shiftStartTime || '09:00',
    shiftEndTime: initialData?.shiftEndTime || '18:00',
    breakStartTime: initialData?.breakStartTime || '13:00',
    breakEndTime: initialData?.breakEndTime || '14:00',
    nightStartTime: initialData?.nightStartTime || '22:00',
    nightEndTime: initialData?.nightEndTime || '06:00',
    overtimeRate: initialData?.overtimeRate ?? 10,
    nightRate: initialData?.nightRate ?? 10,
    weekendRate: initialData?.weekendRate ?? 10,
    holidayRate: initialData?.holidayRate ?? 10,
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
    }
  }, [open]);

  return (
    <Modal open={open} onCancel={handleClose} showFooter={false} width={474}>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(createScheduleSchema)}
        onSubmit={async (values) => {
          await onSubmit?.(values);
          handleClose();
        }}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, submitForm, isValid }) => {
          const isStep1Valid =
            values.name && values.description && values.workingStatus;

          return (
            <>
              {currentStep === 1 ? (
                <div>
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                      {mode === 'edit' ? 'Edit' : 'Create'} schedule
                    </h2>
                  </div>

                  <div className={styles.modalForm}>
                    <div>
                      <Input
                        label="Schedule name *"
                        value={values.name}
                        onChange={(e) => {
                          void setFieldValue('name', e.target.value);
                        }}
                        placeholder="Enter schedule name"
                        width="100%"
                        maxLength={50}
                      />
                      {touched.name && errors.name && (
                        <p className={styles.error}>{errors.name}</p>
                      )}
                      <p className={styles.characterCount}>0-50 characters</p>
                    </div>

                    <div>
                      <Input
                        label="Description *"
                        value={values.description}
                        onChange={(e) => {
                          void setFieldValue('description', e.target.value);
                        }}
                        placeholder="Enter description"
                        width="100%"
                        maxLength={250}
                      />
                      {touched.description && errors.description && (
                        <p className={styles.error}>{errors.description}</p>
                      )}
                      <p className={styles.characterCount}>0-250 characters</p>
                    </div>

                    <div>
                      <Select
                        label="Working status *"
                        placeholder="Select working status"
                        options={workingStatusOptions}
                        value={values.workingStatus}
                        onChange={(value) => {
                          void setFieldValue(
                            'workingStatus',
                            value as WorkingStatus,
                          );
                        }}
                        width="100%"
                      />
                      {touched.workingStatus && errors.workingStatus && (
                        <p className={styles.error}>{errors.workingStatus}</p>
                      )}
                    </div>
                  </div>

                  <div className={styles.modalFooter}>
                    <Button
                      buttonType="primary"
                      onClick={handleClose}
                      className={styles.modalButton}
                    >
                      Cancel
                    </Button>
                    <Button
                      buttonType="action"
                      onClick={() => setCurrentStep(2)}
                      className={styles.modalButton}
                      disabled={!isStep1Valid}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                      {mode === 'edit' ? 'Edit' : 'Create'} schedule
                    </h2>
                  </div>

                  <div className={styles.modalForm}>
                    <div className={styles.timeSection}>
                      <p className={styles.sectionLabel}>Shift time</p>
                      <div className={styles.timeRow}>
                        <div style={{ width: '48%' }}>
                          <TimePicker
                            value={
                              values.shiftStartTime
                                ? dayjs(values.shiftStartTime, 'HH:mm')
                                : undefined
                            }
                            onChange={(time) => {
                              void setFieldValue(
                                'shiftStartTime',
                                time ? time.format('HH:mm') : '',
                              );
                            }}
                            placeholder="09:00"
                            width="100%"
                          />
                          {touched.shiftStartTime && errors.shiftStartTime && (
                            <p className={styles.error}>
                              {errors.shiftStartTime}
                            </p>
                          )}
                        </div>
                        <div style={{ width: '48%' }}>
                          <TimePicker
                            value={
                              values.shiftEndTime
                                ? dayjs(values.shiftEndTime, 'HH:mm')
                                : undefined
                            }
                            onChange={(time) => {
                              void setFieldValue(
                                'shiftEndTime',
                                time ? time.format('HH:mm') : '',
                              );
                            }}
                            placeholder="18:00"
                            width="100%"
                          />
                          {touched.shiftEndTime && errors.shiftEndTime && (
                            <p className={styles.error}>
                              {errors.shiftEndTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.timeSection}>
                      <p className={styles.sectionLabel}>Break time</p>
                      <div className={styles.timeRow}>
                        <div style={{ width: '48%' }}>
                          <TimePicker
                            value={
                              values.breakStartTime
                                ? dayjs(values.breakStartTime, 'HH:mm')
                                : undefined
                            }
                            onChange={(time) => {
                              void setFieldValue(
                                'breakStartTime',
                                time ? time.format('HH:mm') : '',
                              );
                            }}
                            placeholder="13:00"
                            width="100%"
                          />
                          {touched.breakStartTime && errors.breakStartTime && (
                            <p className={styles.error}>
                              {errors.breakStartTime}
                            </p>
                          )}
                        </div>
                        <div style={{ width: '48%' }}>
                          <TimePicker
                            value={
                              values.breakEndTime
                                ? dayjs(values.breakEndTime, 'HH:mm')
                                : undefined
                            }
                            onChange={(time) => {
                              void setFieldValue(
                                'breakEndTime',
                                time ? time.format('HH:mm') : '',
                              );
                            }}
                            placeholder="14:00"
                            width="100%"
                          />
                          {touched.breakEndTime && errors.breakEndTime && (
                            <p className={styles.error}>
                              {errors.breakEndTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.timeSection}>
                      <p className={styles.sectionLabel}>Night hours</p>
                      <div className={styles.timeRow}>
                        <div style={{ width: '48%' }}>
                          <TimePicker
                            value={
                              values.nightStartTime
                                ? dayjs(values.nightStartTime, 'HH:mm')
                                : undefined
                            }
                            onChange={(time) => {
                              void setFieldValue(
                                'nightStartTime',
                                time ? time.format('HH:mm') : '',
                              );
                            }}
                            placeholder="22:00"
                            width="100%"
                          />
                          {touched.nightStartTime && errors.nightStartTime && (
                            <p className={styles.error}>
                              {errors.nightStartTime}
                            </p>
                          )}
                        </div>
                        <div style={{ width: '48%' }}>
                          <TimePicker
                            value={
                              values.nightEndTime
                                ? dayjs(values.nightEndTime, 'HH:mm')
                                : undefined
                            }
                            onChange={(time) => {
                              void setFieldValue(
                                'nightEndTime',
                                time ? time.format('HH:mm') : '',
                              );
                            }}
                            placeholder="06:00"
                            width="100%"
                          />
                          {touched.nightEndTime && errors.nightEndTime && (
                            <p className={styles.error}>
                              {errors.nightEndTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.rateSection}>
                      <p className={styles.sectionLabel}>
                        Out of shift hours Rate (%)
                      </p>
                      <div className={styles.rateGrid}>
                        <div>
                          <Input
                            label="Overtime"
                            value={String(values.overtimeRate)}
                            onChange={(e) => {
                              void setFieldValue(
                                'overtimeRate',
                                Number(e.target.value) || 0,
                              );
                            }}
                            placeholder="10"
                            width="100%"
                            type="number"
                          />
                          {touched.overtimeRate && errors.overtimeRate && (
                            <p className={styles.error}>
                              {errors.overtimeRate}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            label="Night"
                            value={String(values.nightRate)}
                            onChange={(e) => {
                              void setFieldValue(
                                'nightRate',
                                Number(e.target.value) || 0,
                              );
                            }}
                            placeholder="10"
                            width="100%"
                            type="number"
                          />
                          {touched.nightRate && errors.nightRate && (
                            <p className={styles.error}>{errors.nightRate}</p>
                          )}
                        </div>
                        <div>
                          <Input
                            label="Weekend"
                            value={String(values.weekendRate)}
                            onChange={(e) => {
                              void setFieldValue(
                                'weekendRate',
                                Number(e.target.value) || 0,
                              );
                            }}
                            placeholder="10"
                            width="100%"
                            type="number"
                          />
                          {touched.weekendRate && errors.weekendRate && (
                            <p className={styles.error}>{errors.weekendRate}</p>
                          )}
                        </div>
                        <div>
                          <Input
                            label="Holiday"
                            value={String(values.holidayRate)}
                            onChange={(e) => {
                              void setFieldValue(
                                'holidayRate',
                                Number(e.target.value) || 0,
                              );
                            }}
                            placeholder="10"
                            width="100%"
                            type="number"
                          />
                          {touched.holidayRate && errors.holidayRate && (
                            <p className={styles.error}>{errors.holidayRate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.modalFooter}>
                    <Button
                      buttonType="primary"
                      onClick={() => setCurrentStep(1)}
                      className={styles.modalButton}
                    >
                      Back
                    </Button>
                    <Button
                      buttonType="action"
                      onClick={() => {
                        void submitForm();
                      }}
                      className={styles.modalButton}
                      disabled={!isValid}
                    >
                      {mode === 'edit' ? 'Update' : 'Save'} Schedule
                    </Button>
                  </div>
                </div>
              )}
            </>
          );
        }}
      </Formik>
    </Modal>
  );
};
