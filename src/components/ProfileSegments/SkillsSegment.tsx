'use client';

import React, { useState } from 'react';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Spin, Switch } from 'antd';

import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import {
  useDeleteSkill,
  useUserSkills,
} from '@/modules/profile/hooks/useSkills';

import EmptyState from '../EmptyState';
import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface SkillsSegmentProps {
  userId: number;
  canEdit?: boolean;
}

interface UserSkill {
  id: number;
  skill: { id: number; name: string };
  skillLevel: { id: number; name: string };
  status: boolean;
}

export const SkillsSegment: React.FC<SkillsSegmentProps> = ({
  userId,
  canEdit = false,
}) => {
  const { data: skillResponse, isLoading: isLoadingSkills } =
    useUserSkills(userId);
  const deleteSkill = useDeleteSkill();

  const [_isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Transform API response to display format
  const skills: UserSkill[] = [];
  if (skillResponse) {
    const response = skillResponse as any;

    // Handle array response or object with skills array
    if (Array.isArray(response)) {
      skills.push(...response);
    } else if (response.skills && Array.isArray(response.skills)) {
      skills.push(...response.skills);
    }
  }

  const handleDelete = async (skillId: number) => {
    try {
      await deleteSkill.mutateAsync({ userId, skillId });
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  if (isLoadingSkills) {
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
            <Typography variant="heading5">Skills</Typography>
          </h3>
          {canEdit && (
            <Button
              variant="outlined"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalVisible(true)}
            >
              <Typography variant="buttonText"> Add Skill</Typography>
            </Button>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.skillList}>
          {skills.length === 0 ? (
            <EmptyState title="No skills added yet" />
          ) : (
            skills.map((skill) => (
              <div
                key={skill.id}
                className={`${styles.skillItem} ${!skill.status ? styles.inactive : ''}`}
              >
                <Typography
                  variant="body2"
                  as="span"
                  className={styles.skillName}
                >
                  {skill.skill.name}
                </Typography>

                <div className={styles.skillActions}>
                  <Tag tagType="grey-light" className={styles.levelTag}>
                    <Typography variant="body3" as="span">
                      {skill.skillLevel.name}
                    </Typography>
                  </Tag>

                  {canEdit && (
                    <>
                      <Switch
                        checked={skill.status}
                        size="small"
                        className={styles.switch}
                        disabled
                      />
                      <Popconfirm
                        title="Delete skill"
                        description="Are you sure you want to delete this skill?"
                        onConfirm={() => handleDelete(skill.id)}
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
