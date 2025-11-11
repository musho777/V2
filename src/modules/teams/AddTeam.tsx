'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { TextArea } from '@/components/TextArea';
import { Typography } from '@/components/Typography';
import { useBranchHeads } from '@/hooks/useBranchHeads';
import type { BranchHead } from '@/types/user.types';

import styles from './AddTeam.module.scss';

export interface AddTeamProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: AddTeamFormData) => void;
  initialData?: AddTeamFormData;
  isEditMode?: boolean;
}

export interface AddTeamFormData {
  name: string;
  description: string;
  teamHeadId: string;
}

export const AddTeam: React.FC<AddTeamProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const [shouldFetchTeamHeads, setShouldFetchTeamHeads] = useState(false);
  const [formData, setFormData] = useState<AddTeamFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    teamHeadId: initialData?.teamHeadId || '',
  });

  const { data: teamHeadsData } = useBranchHeads(shouldFetchTeamHeads);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        teamHeadId: initialData.teamHeadId,
      });
      setShouldFetchTeamHeads(true);
    }
  }, [initialData]);

  const teamHeadOptions =
    teamHeadsData?.map((head: BranchHead) => ({
      value: String(head.id),
      label: head.name,
    })) || [];

  const handleTeamHeadDropdownOpen = () => {
    if (!shouldFetchTeamHeads) {
      setShouldFetchTeamHeads(true);
    }
  };

  const handleTeamHeadChange = (value: string) => {
    setFormData({
      ...formData,
      teamHeadId: value,
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      teamHeadId: '',
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
    formData.teamHeadId !== '';

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      title={isEditMode ? 'Edit Team' : 'Add New Team'}
      submitButtonText={isEditMode ? 'Update' : 'Create'}
      closeButtonText="Cancel"
      closable={true}
      width={474}
      submitButtonDisabled={!isFormValid}
      content={
        <div className={styles.formContainer}>
          <Typography variant="body1" className={styles.subtitle}>
            Please fill in the team information
          </Typography>
          <div className={styles.formFields}>
            <Input
              label="Team Name"
              placeholder="Enter team name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              width="100%"
              required
            />
            <TextArea
              label="Description"
              placeholder="Enter team description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              width="100%"
              height={100}
              required
            />
            <Select
              label="Team Head"
              placeholder="Select team head"
              value={formData.teamHeadId}
              onChange={handleTeamHeadChange}
              onOpenChange={(open) => {
                if (open) {
                  handleTeamHeadDropdownOpen();
                }
              }}
              options={teamHeadOptions}
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
