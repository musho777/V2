'use client';

import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import type { CreateAttendancePolicyRequest } from '@/types/attendance-policy.types';

import type { CreateAttendancePolicyFormValues } from './schema';
import { createAttendancePolicySchema } from './schema';

import styles from './styles.module.scss';

export interface CreateAttendancePolicyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateAttendancePolicyRequest) => void | Promise<void>;
  initialData?: Partial<CreateAttendancePolicyRequest>;
  mode?: 'create' | 'edit';
}

export const CreateAttendancePolicyModal: React.FC<
  CreateAttendancePolicyModalProps
> = ({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
  const initialValues: CreateAttendancePolicyFormValues = {
    name: initialData?.name || '',
    dailyAcceptableMinutes: initialData?.dailyAcceptableMinutes ?? 0,
    dailyUnacceptableMinutes: initialData?.dailyUnacceptableMinutes ?? 0,
    monthlyAcceptableMinutes: initialData?.monthlyAcceptableMinutes ?? 0,
    monthlyUnacceptableMinutes: initialData?.monthlyUnacceptableMinutes ?? 0,
  };

  return (
    <Modal open={open} onCancel={onClose} showFooter={false} width={474}>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(
          createAttendancePolicySchema,
        )}
        onSubmit={async (values) => {
          await onSubmit?.(values);
          onClose();
        }}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, submitForm, isValid }) => {
          return (
            <div>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {mode === 'edit' ? 'Edit' : 'Create'} attendance policy
                </h2>
              </div>

              <div className={styles.modalForm}>
                <div>
                  <Input
                    label="Policy name *"
                    value={values.name}
                    onChange={(e) => {
                      void setFieldValue('name', e.target.value);
                    }}
                    placeholder="Enter policy name"
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
                    label="Daily acceptable minutes *"
                    value={String(values.dailyAcceptableMinutes)}
                    onChange={(e) => {
                      void setFieldValue(
                        'dailyAcceptableMinutes',
                        Number(e.target.value) || 0,
                      );
                    }}
                    placeholder="0"
                    width="100%"
                    type="number"
                  />
                  {touched.dailyAcceptableMinutes &&
                    errors.dailyAcceptableMinutes && (
                      <p className={styles.error}>
                        {errors.dailyAcceptableMinutes}
                      </p>
                    )}
                </div>

                <div>
                  <Input
                    label="Daily unacceptable minutes *"
                    value={String(values.dailyUnacceptableMinutes)}
                    onChange={(e) => {
                      void setFieldValue(
                        'dailyUnacceptableMinutes',
                        Number(e.target.value) || 0,
                      );
                    }}
                    placeholder="0"
                    width="100%"
                    type="number"
                  />
                  {touched.dailyUnacceptableMinutes &&
                    errors.dailyUnacceptableMinutes && (
                      <p className={styles.error}>
                        {errors.dailyUnacceptableMinutes}
                      </p>
                    )}
                </div>

                <div>
                  <Input
                    label="Monthly acceptable minutes *"
                    value={String(values.monthlyAcceptableMinutes)}
                    onChange={(e) => {
                      void setFieldValue(
                        'monthlyAcceptableMinutes',
                        Number(e.target.value) || 0,
                      );
                    }}
                    placeholder="0"
                    width="100%"
                    type="number"
                  />
                  {touched.monthlyAcceptableMinutes &&
                    errors.monthlyAcceptableMinutes && (
                      <p className={styles.error}>
                        {errors.monthlyAcceptableMinutes}
                      </p>
                    )}
                </div>

                <div>
                  <Input
                    label="Monthly unacceptable minutes *"
                    value={String(values.monthlyUnacceptableMinutes)}
                    onChange={(e) => {
                      void setFieldValue(
                        'monthlyUnacceptableMinutes',
                        Number(e.target.value) || 0,
                      );
                    }}
                    placeholder="0"
                    width="100%"
                    type="number"
                  />
                  {touched.monthlyUnacceptableMinutes &&
                    errors.monthlyUnacceptableMinutes && (
                      <p className={styles.error}>
                        {errors.monthlyUnacceptableMinutes}
                      </p>
                    )}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <Button
                  buttonType="primary"
                  onClick={onClose}
                  className={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  buttonType="action"
                  onClick={() => {
                    void submitForm();
                  }}
                  className={styles.modalButton}
                  disabled={!isValid}
                >
                  {mode === 'edit' ? 'Update' : 'Save'} Policy
                </Button>
              </div>
            </div>
          );
        }}
      </Formik>
    </Modal>
  );
};
