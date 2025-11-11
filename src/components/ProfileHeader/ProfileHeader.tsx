'use client';

import React, { useEffect, useState } from 'react';

import { Card } from 'antd';

import { Button } from '@/components/Button';
import { EditIconNew, ProfileStatus } from '@/components/Icons';
import ImageUpload from '@/components/ImageUpload';
import { useUploadProfilePhoto } from '@/modules/profile/hooks/usePersonal';

import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  status: 'online' | 'offline';
  isVerified?: boolean;
  onEdit?: () => void;
  canEdit?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  firstName,
  lastName,
  username,
  avatarUrl,
  status,
  isVerified = false,
  onEdit,
  canEdit = true,
}) => {
  const { mutate: uploadPhoto } = useUploadProfilePhoto();
  const [avatar, setAvatar] = useState<string | undefined>(avatarUrl);

  useEffect(() => {
    setAvatar(avatarUrl);
  }, [avatarUrl]);

  const handleProfilePhotoChange = (file: File, base64: string) => {
    setAvatar(base64);

    if (file) {
      uploadPhoto({ photo: file });
    }
  };

  return (
    <Card className={styles.profileHeader}>
      <div className={styles.background} />

      <div className={styles.content}>
        <div className={styles.avatarContainer}>
          <ImageUpload
            value={avatar}
            onChange={handleProfilePhotoChange}
            size={120}
            disabled={!canEdit}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <div className={styles.name}>
              <Typography variant="h5">
                {firstName} {lastName}
              </Typography>
            </div>
            {isVerified && <ProfileStatus className={styles.verifiedIcons} />}
          </div>

          <div className={styles.username}>
            <Typography variant="textPlaceholder">@{username}</Typography>
          </div>

          <div className={styles.statusTag}>
            <Typography variant="body3" as="span">
              {status === 'online' ? 'Online' : 'Offline'}
            </Typography>
          </div>
        </div>

        {canEdit && (
          <Button
            variant="outlined"
            onClick={onEdit}
            className={styles.editButton}
          >
            <EditIconNew />
            <Typography variant="buttonText">Edit</Typography>
          </Button>
        )}
      </div>
    </Card>
  );
};
