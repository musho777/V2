import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { Form, Formik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { ColorPickerWithPresets } from '@/components/ColorPickerWithPresets';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { notificationService } from '@/components/Notification/Notification';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { TextArea } from '@/components/TextArea';
import { useAuth } from '@/hooks/useAuth';
import { useEnabledUsers } from '@/hooks/useUsers';
import { toSelectOptions } from '@/utils/utils';

import { useProjectTypesAll } from '../hooks/useProjectTypesAll';
import { projectService } from '../services/project.service';
import type { CreateProjectProps } from '../types/project.types';

const createProjectSchema = z.object({
  name: z.preprocess(
    (val) => (val === undefined || val === null ? '' : val),
    z.string().min(1, 'Project name is required'),
  ),
  description: z.string().optional(),
  projectTypeId: z.number().min(1, 'Project type is required'),
  ownerId: z
    .object({
      label: z.string().optional(),
      value: z.number().optional(),
    })
    .refine((val) => val.value && val.value > 0, 'Project owner is required'),
  status: z.boolean(),
  color: z.string().optional(),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema> & {
  ownerId: { label?: string; value?: number };
};

export default function CreateProject({
  onSuccess,
  editProject,
  editModalOpen,
  onEditClose,
  onUpdateSuccess,
}: CreateProjectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasRole } = useAuth();

  const isEditMode = Boolean(editProject);
  const { data: projectTypesData } = useProjectTypesAll(
    isModalOpen || isEditMode,
  );
  const { data: usersData } = useEnabledUsers(isModalOpen || isEditMode);
  const initialValues: CreateProjectFormValues = {
    name: editProject?.name || '',
    description: editProject?.description || '',
    projectTypeId: editProject?.projectTypeId || 0,
    ownerId: {
      label: editProject?.projectOwnerName,
      value: editProject?.projectOwnerId,
    },
    status: editProject?.status ?? true,
    color: editProject?.color || '#2D6CDF',
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
    mutationFn: projectService.createProject,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        name: string;
        description?: string;
        status: boolean;
        projectType: { id: number };
        projectOwner: { id: number };
        color?: string;
      };
    }) => projectService.updateProject(id, data),
  });

  const handleFormSubmit = (
    values: CreateProjectFormValues,
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
      projectType: {
        id: values.projectTypeId,
      },
      projectOwner: {
        id: values.ownerId.value ?? 0,
      },
      color: values.color,
    };

    if (isEditMode && editProject?.id) {
      updateMutation.mutate(
        { id: editProject.id, data: requestBody },
        {
          onSuccess: () => {
            message.success('Project updated successfully');
            resetForm();
            handleCloseModal();
            onUpdateSuccess?.();
          },
          onError: (error: unknown) => {
            const errorMessage =
              (
                error as {
                  response?: { data?: { message?: string } };
                  message?: string;
                }
              )?.response?.data?.message ||
              (error as { message?: string })?.message ||
              'Failed to update project';
            setFieldError('name', errorMessage);
            notificationService.error({
              message: 'Error',
              description: errorMessage,
            });
          },
        },
      );
    } else {
      createMutation.mutate(requestBody, {
        onSuccess: () => {
          message.success('Project created successfully');
          handleCloseModal(resetForm);
          onSuccess?.();
        },
        onError: (error: unknown) => {
          const errorMessage =
            (
              error as {
                response?: { data?: { message?: string } };
                message?: string;
              }
            )?.response?.data?.message ||
            (error as { message?: string })?.message ||
            'Failed to create project';
          setFieldError('name', errorMessage);
          notificationService.error({
            message: 'Error',
            description: errorMessage,
          });
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
        + Create project
      </Button>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(createProjectSchema)}
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
            title={isEditMode ? 'Edit Project' : 'Create Project'}
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
                  label="Project name"
                  name="name"
                  placeholder="Enter project name"
                  value={values.name || ''}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name && touched.name ? errors.name : undefined}
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
                />
                <Select
                  label="Project type"
                  width={'100%'}
                  height={48}
                  required
                  placeholder="Select project type"
                  value={
                    values.projectTypeId > 0 ? values.projectTypeId : undefined
                  }
                  onChange={(value) =>
                    void setFieldValue('projectTypeId', value)
                  }
                  options={toSelectOptions(projectTypesData?.content || [])}
                  allowClear
                  error={
                    errors.projectTypeId && touched.projectTypeId
                      ? errors.projectTypeId
                      : undefined
                  }
                />
                <Select
                  label="Project owner"
                  placeholder="Select project owner"
                  allowClear
                  width={'100%'}
                  required
                  height={48}
                  labelInValue
                  value={values.ownerId.value || undefined}
                  onChange={(value) => void setFieldValue('ownerId', value)}
                  options={toSelectOptions(usersData || [])}
                  error={
                    errors.ownerId && touched.ownerId
                      ? String(errors.ownerId)
                      : undefined
                  }
                />
                <ColorPickerWithPresets
                  label="Select project color"
                  value={values.color}
                  onChange={(hex: string) => void setFieldValue('color', hex)}
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
