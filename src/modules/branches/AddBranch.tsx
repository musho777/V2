'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { TextArea } from '@/components/TextArea';
import { Typography } from '@/components/Typography';
import { useBranchHeads } from '@/hooks/useBranchHeads';
import { useDepartments } from '@/hooks/useDepartments';
import { useRegions } from '@/hooks/useRegions';
import type { BranchHead } from '@/types/user.types';

import styles from './AddBranch.module.scss';

export interface AddBranchProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: AddBranchFormData) => void;
  initialData?: AddBranchFormData;
  isEditMode?: boolean;
}

export interface AddBranchFormData {
  name: string;
  description: string;
  branchHeadId: string;
  branchHeadRoleId: string;
  departmentId: string;
  regionId: string;
}

export const AddBranch: React.FC<AddBranchProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const [shouldFetchBranchHeads, setShouldFetchBranchHeads] = useState(false);
  const [shouldFetchRegions, setShouldFetchRegions] = useState(false);
  const [shouldFetchDepartments, setShouldFetchDepartments] = useState(false);

  const [formData, setFormData] = useState<AddBranchFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    branchHeadId: initialData?.branchHeadId || '',
    branchHeadRoleId: initialData?.branchHeadRoleId || '5',
    departmentId: initialData?.departmentId || '',
    regionId: initialData?.regionId || '',
  });

  const { data: branchHeadsData } = useBranchHeads(shouldFetchBranchHeads);
  const { data: regionsData } = useRegions(shouldFetchRegions);
  const { data: departmentsData } = useDepartments(
    shouldFetchDepartments ? { page: 0, size: 100 } : undefined,
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        branchHeadId: initialData.branchHeadId,
        branchHeadRoleId: initialData.branchHeadRoleId || '5',
        departmentId: initialData.departmentId,
        regionId: initialData.regionId,
      });
      setShouldFetchBranchHeads(true);
      setShouldFetchRegions(true);
      setShouldFetchDepartments(true);
    }
  }, [initialData]);

  const branchHeadOptions =
    branchHeadsData?.map((head: BranchHead) => ({
      value: String(head.id),
      label: head.name,
    })) || [];

  const regionOptions = Array.isArray(regionsData)
    ? regionsData.map((region) => ({
        value: String(region.id),
        label: region.name,
      }))
    : [];

  const departmentOptions =
    departmentsData?.content?.map((dept) => ({
      value: String(dept.id),
      label: dept.name,
    })) || [];

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      branchHeadId: '',
      branchHeadRoleId: '5',
      departmentId: '',
      regionId: '',
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
    formData.branchHeadId !== '' &&
    formData.departmentId !== '' &&
    formData.regionId !== '';

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      title={isEditMode ? 'Edit Branch' : 'Add New Branch'}
      submitButtonText={isEditMode ? 'Update' : 'Create'}
      closeButtonText="Cancel"
      closable={true}
      width={474}
      submitButtonDisabled={!isFormValid}
      content={
        <div className={styles.formContainer}>
          <Typography variant="body1" className={styles.subtitle}>
            Please fill in the branch information
          </Typography>
          <div className={styles.formFields}>
            <Input
              label="Branch Name"
              placeholder="Enter branch name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              width="100%"
              required
            />
            <TextArea
              label="Description"
              placeholder="Enter branch description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              width="100%"
              height={100}
              required
            />
            <Select
              label="Department"
              placeholder="Select department"
              value={formData.departmentId}
              onChange={(value) =>
                setFormData({ ...formData, departmentId: value })
              }
              onOpenChange={(open) => {
                if (open) setShouldFetchDepartments(true);
              }}
              options={departmentOptions}
              width="100%"
              height={48}
              showSearch
            />
            <Select
              label="Branch Head"
              placeholder="Select branch head"
              value={formData.branchHeadId}
              onChange={(value) =>
                setFormData({ ...formData, branchHeadId: value })
              }
              onOpenChange={(open) => {
                if (open) setShouldFetchBranchHeads(true);
              }}
              options={branchHeadOptions}
              width="100%"
              height={48}
              showSearch
            />
            <Select
              label="Region"
              placeholder="Select region"
              value={formData.regionId}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  regionId: value,
                })
              }
              onOpenChange={(open) => {
                if (open) setShouldFetchRegions(true);
              }}
              options={regionOptions}
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
