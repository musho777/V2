'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { TextArea } from '@/components/TextArea';
import { Typography } from '@/components/Typography';
import { useDepartmentHeads } from '@/hooks/useDepartmentHeads';
import type { DepartmentHead } from '@/types/user.types';

import styles from './AddDepartment.module.scss';

export interface AddDepartmentProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: AddDepartmentFormData) => void;
  initialData?: AddDepartmentFormData;
  isEditMode?: boolean;
}

export interface AddDepartmentFormData {
  name: string;
  description: string;
  departmentHeadId: string;
}

export const AddDepartment: React.FC<AddDepartmentProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const [shouldFetchDepartmentHeads, setShouldFetchDepartmentHeads] =
    useState(false);
  const [formData, setFormData] = useState<AddDepartmentFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    departmentHeadId: initialData?.departmentHeadId || '',
  });

  const { data: departmentHeadsData } = useDepartmentHeads(
    shouldFetchDepartmentHeads,
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        departmentHeadId: initialData.departmentHeadId,
      });
      setShouldFetchDepartmentHeads(true);
    }
  }, [initialData]);

  const departmentHeadOptions =
    departmentHeadsData?.map((head: DepartmentHead) => ({
      value: String(head.id),
      label: head.name,
    })) || [];

  const handleDepartmentHeadDropdownOpen = () => {
    if (!shouldFetchDepartmentHeads) {
      setShouldFetchDepartmentHeads(true);
    }
  };

  const handleDepartmentHeadChange = (value: string) => {
    setFormData({
      ...formData,
      departmentHeadId: value,
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      departmentHeadId: '',
    });
    onClose();
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.description.trim() !== '' &&
    formData.departmentHeadId !== '';

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      title={isEditMode ? 'Edit Department' : 'Add New Department'}
      submitButtonText={isEditMode ? 'Update' : 'Create'}
      closeButtonText="Cancel"
      closable={true}
      width={474}
      submitButtonDisabled={!isFormValid}
      content={
        <div className={styles.formContainer}>
          <Typography variant="body1" className={styles.subtitle}>
            Please fill in the department information
          </Typography>
          <div className={styles.formFields}>
            <Input
              label="Department Name"
              placeholder="Enter department name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              width="100%"
              required
            />
            <TextArea
              label="Description"
              placeholder="Enter department description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              width="100%"
              height={100}
              required
            />
            <Select
              label="Department Head"
              placeholder="Select department head"
              value={formData.departmentHeadId}
              onChange={handleDepartmentHeadChange}
              onOpenChange={(open) => {
                if (open) {
                  handleDepartmentHeadDropdownOpen();
                }
              }}
              options={departmentHeadOptions}
              width="100%"
              height={48}
              showSearch
            />
          </div>
        </div>
      }
    />
  );
};
