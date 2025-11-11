import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { notificationService } from '@/components/Notification';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { TextArea } from '@/components/TextArea';
import { TimeSelector } from '@/components/TimeSelector';
import { useAuth } from '@/hooks/useAuth';
import { useTimezones } from '@/hooks/useTimezones';
import { toSelectOptions } from '@/utils/utils';

import {
  useManagementTypes,
  useSubProjectTypes,
} from '../hooks/useSubProjects';
import { subProjectService } from '../services/sub-project.service';
import type { CreateSubProjectProps } from '../types/sub-project.types';

import {
  type CreateSubProjectFormValues,
  createSubProjectSchema,
} from './subProjectSchema';

export default function CreateSubProject({
  onSuccess,
  editSubProject,
  editModalOpen,
  onEditClose,
  onUpdateSuccess,
}: CreateSubProjectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managementTypesEnabled, setManagementTypesEnabled] = useState(false);
  const [subProjectTypesEnabled, setSubProjectTypesEnabled] = useState(false);
  const [timezonesEnabled, setTimezonesEnabled] = useState(false);
  const { hasRole } = useAuth();

  const isEditMode = Boolean(editSubProject);

  const { data: managementTypes } = useManagementTypes(
    managementTypesEnabled || isEditMode,
  );
  const { data: subProjectTypes } = useSubProjectTypes(
    subProjectTypesEnabled || isEditMode,
  );
  const { data: timezones } = useTimezones(timezonesEnabled || isEditMode);

  const initialValues: CreateSubProjectFormValues = {
    name: editSubProject?.name || '',
    description: editSubProject?.description || '',
    status: editSubProject?.status || true,
    subprojectTypeName:
      editSubProject?.subprojectTypeName ||
      editSubProject?.subprojectType ||
      '',
    managementTypeName:
      editSubProject?.managementTypeName ||
      editSubProject?.managementType ||
      '',
    timezoneId: editSubProject?.timezone?.id || 0,
    timezoneName: editSubProject?.timezone?.name || '',
    startTime: editSubProject?.startTime || '',
    endTime: editSubProject?.endTime || '',
    timeFormat: '24',
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (resetForm?: () => void) => {
    setIsModalOpen(false);
    resetForm?.();
    if (isEditMode && onEditClose) {
      onEditClose();
    }
  };

  const createMutation = useMutation({
    mutationFn: subProjectService.createSubProject,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: typeof subProjectService.createSubProject extends (
        arg: infer P,
      ) => unknown
        ? P
        : never;
    }) => subProjectService.updateSubProject(id, data),
  });

  const handleFormSubmit = (
    values: CreateSubProjectFormValues,
    {
      setFieldError,
      resetForm,
    }: {
      setFieldError: (field: string, message: string) => void;
      resetForm: () => void;
    },
  ) => {
    const requestBody = {
      name: values.name,
      description: values.description,
      status: values.status,
      subprojectTypeName: values.subprojectTypeName,
      managementTypeName: values.managementTypeName,
      timezone: {
        id: values.timezoneId,
        name: values.timezoneName,
      },
      startTime: values.startTime,
      endTime: values.endTime,
    };

    if (isEditMode && editSubProject) {
      updateMutation.mutate(
        { id: editSubProject.id, data: requestBody },
        {
          onSuccess: () => {
            resetForm();
            handleCloseModal();
            onUpdateSuccess?.();
            notificationService.success({
              message: 'Success',
              description: 'Subproject updated successfully',
            });
          },
          onError: (error: unknown) => {
            const errorMessage =
              (error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message || 'An error occurred';
            notificationService.error({
              message: 'Update Failed',
              description: errorMessage,
            });
            setFieldError('name', errorMessage);
          },
        },
      );
    } else {
      createMutation.mutate(requestBody, {
        onSuccess: () => {
          resetForm();
          handleCloseModal();
          onSuccess?.();
          notificationService.success({
            message: 'Success',
            description: 'Subproject created successfully',
          });
        },
        onError: (error: unknown) => {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'An error occurred';
          notificationService.error({
            message: 'Creation Failed',
            description: errorMessage,
          });
          setFieldError('name', errorMessage);
        },
      });
    }
  };

  if (!hasRole('GENERAL_MANAGER')) {
    return null;
  }

  return (
    <>
      <Button buttonType="action" onClick={handleOpenModal}>
        + Create subproject
      </Button>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(createSubProjectSchema)}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          resetForm,
        }) => (
          <Modal
            open={isEditMode ? (editModalOpen ?? false) : isModalOpen}
            title={isEditMode ? 'Edit Subproject' : 'Create Subproject'}
            onCancel={() => handleCloseModal(resetForm)}
            onSubmit={handleSubmit}
            submitButtonText={isEditMode ? 'Update' : 'Create'}
            closeButtonText="Cancel"
            loading={
              isEditMode ? updateMutation.isPending : createMutation.isPending
            }
          >
            <Form>
              <div className="flex flex-col gap-6">
                <Input
                  label="Subproject name"
                  name="name"
                  required
                  placeholder="Enter subproject name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name ? errors.name : undefined}
                />
                <TextArea
                  label="Description"
                  name="description"
                  placeholder="Enter description"
                  width={'100%'}
                  value={values.description}
                  style={{ resize: 'none' }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.description && errors.description
                      ? errors.description
                      : undefined
                  }
                />
                <Select
                  label="Subproject type"
                  placeholder="Select subproject type"
                  width={'100%'}
                  height={48}
                  required
                  value={values.subprojectTypeName || undefined}
                  onChange={(value) =>
                    void setFieldValue('subprojectTypeName', value)
                  }
                  onOpenChange={(open) => {
                    if (open) setSubProjectTypesEnabled(true);
                  }}
                  options={toSelectOptions(subProjectTypes || [])}
                  allowClear
                  error={
                    touched.subprojectTypeName && errors.subprojectTypeName
                      ? errors.subprojectTypeName
                      : undefined
                  }
                />
                <Select
                  label="Management type"
                  placeholder="Select management type"
                  width={'100%'}
                  height={48}
                  required
                  value={values.managementTypeName || undefined}
                  onChange={(value) =>
                    void setFieldValue('managementTypeName', value)
                  }
                  onOpenChange={(open) => {
                    if (open) setManagementTypesEnabled(true);
                  }}
                  options={toSelectOptions(managementTypes || [])}
                  allowClear
                  error={
                    touched.managementTypeName && errors.managementTypeName
                      ? errors.managementTypeName
                      : undefined
                  }
                />
                <Select
                  label="Time zone"
                  placeholder="Select time zone"
                  width={'100%'}
                  height={48}
                  required
                  placement="topLeft"
                  value={values.timezoneId || undefined}
                  onChange={(value) => {
                    const selectedTimezone = timezones?.find(
                      (tz: { id?: number; name?: string }) => tz.id === value,
                    );
                    if (selectedTimezone) {
                      void setFieldValue('timezoneName', selectedTimezone.name);
                      void setFieldValue('timezoneId', value);
                    }
                  }}
                  onOpenChange={(open) => {
                    if (open) setTimezonesEnabled(true);
                  }}
                  options={toSelectOptions(timezones || [])}
                  allowClear
                  error={
                    touched.timezoneId && errors.timezoneId
                      ? String(errors.timezoneId)
                      : undefined
                  }
                />
                <TimeSelector
                  label="Select Time"
                  placeholder="Select start and end time"
                  value={{
                    startTime: values.startTime || '',
                    endTime: values.endTime || '',
                  }}
                  height={48}
                  required
                  onChange={(timeValue) => {
                    void setFieldValue('startTime', timeValue.startTime);
                    void setFieldValue('endTime', timeValue.endTime || '');
                  }}
                  timeFormat={values.timeFormat}
                  onTimeFormatChange={(format) =>
                    void setFieldValue('timeFormat', format)
                  }
                  error={
                    (errors.startTime && touched.startTime
                      ? errors.startTime
                      : errors.endTime && touched.endTime
                        ? errors.endTime
                        : undefined) as string | undefined
                  }
                  allowDisabled
                  showFormatSelector
                />
                <div className="flex justify-end">
                  <Switch
                    label="Status"
                    checked={values.status}
                    onChange={(checked) =>
                      void setFieldValue('status', checked)
                    }
                  />
                </div>
              </div>
            </Form>
          </Modal>
        )}
      </Formik>
    </>
  );
}
