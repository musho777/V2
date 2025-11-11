import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { Form, Formik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Switch } from '@/components/Switch';
import { TextArea } from '@/components/TextArea';
import { useAuth } from '@/hooks/useAuth';

import { projectTypeService } from '../services/project-type.service';
import type { CreateEditProjectTypeProps } from '../types/project-type.types';

const projectTypeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Project type name is required'),
  description: z.string().optional(),
  status: z.boolean(),
});

type ProjectTypeFormValues = z.infer<typeof projectTypeSchema>;

export default function CreateEditProjectType({
  onSuccess,
  editProjectType,
  editModalOpen = false,
  onEditClose,
}: CreateEditProjectTypeProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { hasRole } = useAuth();
  const isEditMode = !!editProjectType;

  const initialValues: ProjectTypeFormValues = {
    id: editProjectType?.id,
    name: editProjectType?.name || '',
    description: editProjectType?.description || '',
    status: editProjectType?.status ?? true,
  };

  const handleOpenModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = (resetForm?: () => void) => {
    if (isEditMode) {
      onEditClose?.();
    } else {
      setIsCreateModalOpen(false);
    }
    resetForm?.();
  };

  const handleFormSubmit = (
    values: ProjectTypeFormValues,
    {
      setFieldError,
      resetForm,
    }: {
      setFieldError: (field: string, message: string) => void;
      resetForm: () => void;
    },
  ) => {
    if (isEditMode && values.id !== undefined) {
      updateMutation.mutate(
        {
          id: values.id,
          name: values.name,
          description: values.description,
        },
        {
          onSuccess: () => {
            message.success('Project type updated successfully');
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
              'Failed to update project type';
            setFieldError('name', errorMessage);
            message.error(errorMessage);
          },
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          message.success('Project type created successfully');
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
            'Failed to create project type';
          setFieldError('name', errorMessage);
          message.error(errorMessage);
        },
      });
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: ProjectTypeFormValues) =>
      projectTypeService.createProjectType(data),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; name: string; description?: string }) =>
      projectTypeService.updateProjectType(data),
  });

  if (!hasRole('GENERAL_MANAGER')) {
    return null;
  }

  const isModalOpen = isEditMode ? editModalOpen : isCreateModalOpen;

  return (
    <>
      <Button buttonType="action" onClick={handleOpenModal}>
        + Create project type
      </Button>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(projectTypeSchema)}
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
            open={isModalOpen}
            title={isEditMode ? 'Edit Project Type' : 'Create Project Type'}
            onCancel={() => handleCloseModal(resetForm)}
            onSubmit={handleSubmit}
            submitButtonText={isEditMode ? 'Update' : 'Create'}
            closeButtonText="Cancel"
            loading={createMutation.isPending || updateMutation.isPending}
          >
            <Form>
              <div className="flex flex-col gap-6">
                <Input
                  label="Project type name"
                  name="name"
                  placeholder="Enter project type name"
                  value={values.name}
                  onChange={handleChange}
                  required
                  onBlur={handleBlur}
                  status={errors.name && touched.name ? 'error' : undefined}
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
                {!isEditMode && (
                  <div className="flex justify-end">
                    <Switch
                      label="Status"
                      checked={values.status}
                      onChange={(checked) =>
                        void setFieldValue('status', checked)
                      }
                    />
                  </div>
                )}
              </div>
            </Form>
          </Modal>
        )}
      </Formik>
    </>
  );
}
