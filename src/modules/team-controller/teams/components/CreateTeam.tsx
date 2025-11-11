import { useState } from 'react';

import { Form, Formik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { notificationService } from '@/components/Notification';
import { Select } from '@/components/Select';
import { TextArea } from '@/components/TextArea';
import { useAuth } from '@/hooks/useAuth';
import {
  useCreateTeamMutation,
  useDepartments,
  useTeamDetails,
  useTeamLeads,
  useTimezones,
} from '@/hooks/useSubTeams';
import type { Department } from '@/types/department.types';
import { toSelectOptions } from '@/utils/utils';

import type { CreateTeamProps, TeamLead } from '../types/team.types';

const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().min(1, 'Description is required'),
  teamLeadId: z.number().min(1, 'Team lead is required'),
  timezoneId: z.number().min(1, 'Time zone is required'),
  timezoneName: z.string().min(1, 'Time zone name is required'),
  departmentId: z.number().min(1, 'Department is required'),
});

type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

export default function CreateTeam({
  onSuccess,
  teamId,
  mode = 'create',
  open: externalOpen,
  onClose: externalOnClose,
}: CreateTeamProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeamLeadOpen, setIsTeamLeadOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { hasRole } = useAuth();

  const isOpen = externalOpen !== undefined ? externalOpen : isModalOpen;
  const isEditMode = mode === 'edit';

  const { data: teamDetails } = useTeamDetails(teamId, isEditMode);
  const { data: teamLeads } = useTeamLeads(
    isTeamLeadOpen || (isEditMode && isOpen),
  );
  const { data: departmentsData } = useDepartments(
    isDepartmentOpen || (isEditMode && isOpen),
  );
  const { data: timezones } = useTimezones(
    isTimezoneOpen || (isEditMode && isOpen),
  );

  const initialValues: CreateTeamFormValues = {
    name: teamDetails?.name || '',
    description: teamDetails?.description || '',
    teamLeadId: teamDetails?.teamLeadId || 0,
    timezoneId: teamDetails?.timezone?.id || 0,
    timezoneName: teamDetails?.timezone?.name || '',
    departmentId: teamDetails?.departmentId || 0,
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (resetForm?: () => void) => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setIsModalOpen(false);
      resetForm?.();
    }
  };

  const createMutation = useCreateTeamMutation(isEditMode, teamId);

  const handleFormSubmit = async (
    values: CreateTeamFormValues,
    {
      setFieldError,
      resetForm,
    }: {
      setFieldError: (field: string, message: string) => void;
      resetForm: () => void;
    },
  ) => {
    const selectedTeamLead = teamLeads?.find(
      (lead: TeamLead) => lead.id === values.teamLeadId,
    );
    const selectedDepartment = departmentsData?.find(
      (dept: Department) => dept.id === values.departmentId,
    );

    if (!selectedTeamLead || !selectedTeamLead.role) {
      setFieldError('teamLeadId', 'Team lead not found');
      return;
    }
    if (!selectedDepartment) {
      setFieldError('departmentId', 'Department not found');
      return;
    }

    const requestBody = {
      ...(isEditMode && teamId ? { id: Number(teamId) } : {}),
      name: values.name,
      description: values.description,
      status: true,
      teamLead: {
        id: values.teamLeadId,
        role: {
          id: selectedTeamLead.role.id,
          role: selectedTeamLead.role.role,
          default: selectedTeamLead.role.default,
        },
      },
      timezone: {
        id: values.timezoneId,
        name: values.timezoneName,
      },
      department: {
        id: values.departmentId,
      },
    };

    createMutation.mutate(requestBody, {
      onSuccess: () => {
        resetForm();
        handleCloseModal();
        onSuccess?.();
      },
      onError: (error: unknown) => {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'An error occurred';
        notificationService.error({
          message: isEditMode ? 'Update Failed' : 'Creation Failed',
          description: errorMessage,
        });
        setFieldError('name', errorMessage);
      },
    });
  };

  if (!hasRole('GENERAL_MANAGER')) {
    return null;
  }

  return (
    <>
      {!isEditMode && (
        <Button buttonType="action" onClick={handleOpenModal}>
          + Create team
        </Button>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(createTeamSchema)}
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
        }) => {
          const handleCreateClick = () => {
            const selectedUser = teamLeads?.find(
              (lead: TeamLead) => lead.id === values.teamLeadId,
            );

            if (selectedUser?.role?.role === 'TEAM_MEMBER') {
              setIsConfirmModalOpen(true);
            } else {
              handleSubmit();
            }
          };

          const handleConfirmRoleChange = () => {
            setIsConfirmModalOpen(false);
            handleSubmit();
          };

          const handleCancelRoleChange = () => {
            void setFieldValue('teamLeadId', 0);
            setIsConfirmModalOpen(false);
          };

          return (
            <>
              <Modal
                open={isOpen}
                title={isEditMode ? 'Edit Team' : 'Create Team'}
                onCancel={() => handleCloseModal(resetForm)}
                onSubmit={handleCreateClick}
                submitButtonText={isEditMode ? 'Save' : 'Create'}
                closeButtonText="Cancel"
                loading={createMutation.isPending}
              >
                <Form>
                  <div className="flex flex-col gap-6">
                    <Input
                      label="Team name"
                      name="name"
                      placeholder="Enter team name"
                      value={values.name}
                      onChange={handleChange}
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
                      status={
                        errors.description && touched.description
                          ? 'error'
                          : undefined
                      }
                    />
                    <Select
                      label="Team lead"
                      placeholder="Select team lead"
                      width={'100%'}
                      height={48}
                      value={values.teamLeadId || undefined}
                      onChange={(value) => {
                        void setFieldValue('teamLeadId', value);
                      }}
                      onOpenChange={setIsTeamLeadOpen}
                      options={toSelectOptions(teamLeads || [])}
                      allowClear
                      status={
                        errors.teamLeadId && touched.teamLeadId
                          ? 'error'
                          : undefined
                      }
                    />
                    <Select
                      label="Time zone"
                      placeholder="Select time zone"
                      width={'100%'}
                      height={48}
                      value={values.timezoneId || undefined}
                      onChange={(value) => {
                        const selectedTimezone = timezones?.find(
                          (tz: { id?: number; name?: string }) =>
                            tz.id === value,
                        );
                        if (selectedTimezone) {
                          void setFieldValue('timezoneId', value);
                          void setFieldValue(
                            'timezoneName',
                            selectedTimezone.name,
                          );
                        }
                      }}
                      onOpenChange={setIsTimezoneOpen}
                      options={toSelectOptions(timezones || [])}
                      allowClear
                      status={
                        errors.timezoneId && touched.timezoneId
                          ? 'error'
                          : undefined
                      }
                    />
                    <Select
                      label="Department"
                      placeholder="Select department"
                      width={'100%'}
                      height={48}
                      value={values.departmentId || undefined}
                      onChange={(value) =>
                        void setFieldValue('departmentId', value)
                      }
                      onOpenChange={setIsDepartmentOpen}
                      options={toSelectOptions(departmentsData || [])}
                      allowClear
                      status={
                        errors.departmentId && touched.departmentId
                          ? 'error'
                          : undefined
                      }
                    />
                  </div>
                </Form>
              </Modal>
              <Modal
                open={isConfirmModalOpen}
                title="Confirm Role Change"
                onCancel={handleCancelRoleChange}
                onSubmit={handleConfirmRoleChange}
                submitButtonText="Agree"
                closeButtonText="Cancel"
              >
                <p>
                  This user currently has the role of Team Member. By selecting
                  this user as Team Lead, their role will be changed. Do you
                  want to proceed?
                </p>
              </Modal>
            </>
          );
        }}
      </Formik>
    </>
  );
}
