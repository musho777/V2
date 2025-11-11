'use client';

import React, { useState } from 'react';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Spin, Switch } from 'antd';

import { Button } from '@/components/Button';
import type { TagType } from '@/components/Tag';
import { Tag } from '@/components/Tag';
import {
  useDeleteLanguage,
  useUserLanguages,
} from '@/modules/profile/hooks/useLanguages';

import EmptyState from '../EmptyState';
import { EmptyIllustration } from '../Icons';
import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface LanguagesSegmentProps {
  userId: number;
  canEdit?: boolean;
}

interface UserLanguage {
  id: number;
  language: { id: number; name: string };
  languageLevel: { id: number; name: string };
  priority: { id: number; name: string };
  status: boolean;
}

const priorityColorMap: Record<string, TagType> = {
  Highest: 'blue',
  High: 'green',
  Medium: 'orange',
  Low: 'yellow',
};

export const LanguagesSegment: React.FC<LanguagesSegmentProps> = ({
  userId,
  canEdit = false,
}) => {
  const { data: languageResponse, isLoading: isLoadingLanguages } =
    useUserLanguages(userId);
  const deleteLanguage = useDeleteLanguage();

  const [_isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Transform API response to display format
  const languages: UserLanguage[] = [];
  if (languageResponse) {
    const response = languageResponse as any;

    // Handle array response or object with languages array
    if (Array.isArray(response)) {
      languages.push(...response);
    } else if (response.languages && Array.isArray(response.languages)) {
      languages.push(...response.languages);
    }
  }

  const handleDelete = async (languageId: number) => {
    try {
      await deleteLanguage.mutateAsync({ userId, languageId });
    } catch (error) {
      console.error('Failed to delete language:', error);
    }
  };

  if (isLoadingLanguages) {
    return (
      <div className={styles.segmentContainer}>
        <Card className={styles.segment}>
          <div className={styles.loadingContainer}>
            <Spin />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.segmentContainer}>
      <Card className={styles.segment}>
        <div className={styles.segmentHeader}>
          <h3 className={styles.segmentTitle}>
            <Typography variant="heading5">Languages</Typography>
          </h3>
          {canEdit && (
            <Button
              variant="outlined"
              // icon={<PlusOutlined />}
              onClick={() => setIsAddModalVisible(true)}
            >
              <Typography variant="buttonText">+ Add Language</Typography>
            </Button>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.languageList}>
          {languages.length === 0 ? (
            <EmptyState title="No languages added yet" />
          ) : (
            languages.map((language) => (
              <div
                key={language.id}
                className={`${styles.languageItem} ${!language.status ? styles.inactive : ''}`}
              >
                <Typography
                  variant="body2"
                  as="span"
                  className={styles.languageName}
                >
                  {language.language.name}
                </Typography>

                <div className={styles.languageActions}>
                  <Tag tagType="grey-light" className={styles.proficiencyTag}>
                    <Typography variant="body3" as="span">
                      {language.languageLevel.name}
                    </Typography>
                  </Tag>

                  <Tag
                    tagType={
                      priorityColorMap[language.priority.name] || 'grey-light'
                    }
                    className={styles.priorityTag}
                  >
                    <Typography variant="body3" as="span">
                      {language.priority.name}
                    </Typography>
                  </Tag>

                  {canEdit && (
                    <>
                      <Switch
                        checked={language.status}
                        size="small"
                        className={styles.switch}
                        disabled
                      />
                      <Popconfirm
                        title="Delete language"
                        description="Are you sure you want to delete this language?"
                        onConfirm={() => handleDelete(language.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          variant="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          className={styles.deleteButton}
                        />
                      </Popconfirm>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
