'use client';

import React from 'react';

import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Popover, Tooltip } from 'antd';

import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface Assignee {
  id?: string;
  name?: string;
  avatar?: string;
  email?: string;
}

export interface AvatarGroupProps {
  data: Assignee[];
  maxVisible?: number;
  size?: number | 'small' | 'default' | 'large';
  index?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  data = [],
  maxVisible = 4,
  size = 'default',
}) => {
  if (!data || data.length === 0) {
    return (
      <Typography variant="body2" as="div">
        -
      </Typography>
    );
  }

  const visibleAvatars = data.slice(0, maxVisible);
  const remainingCount = data.length - maxVisible;

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getBackgroundColor = (name: string) => {
    if (!name) return '#1890ff';
    const colors = [
      '#1890ff',
      '#52c41a',
      '#faad14',
      '#f5222d',
      '#722ed1',
      '#13c2c2',
      '#eb2f96',
      '#fa8c16',
    ];
    const charSum = name
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <Avatar.Group size={size} className={styles.avatarGroup}>
      {visibleAvatars?.map((assignee, index) => (
        <Tooltip
          key={assignee.id || index}
          title={assignee.name || assignee.email || 'Unknown'}
          placement="top"
        >
          {assignee.avatar ? (
            <Avatar src={assignee.avatar} alt={assignee.name} />
          ) : (
            <Avatar
              style={{
                backgroundColor: getBackgroundColor(
                  assignee.name || assignee.email || '',
                ),
              }}
              icon={
                !assignee.name && !assignee.email ? <UserOutlined /> : undefined
              }
            >
              {(assignee.name || assignee.email) &&
                getInitials(assignee.name || assignee.email || '')}
            </Avatar>
          )}
        </Tooltip>
      ))}
      {remainingCount > 0 && (
        <Popover
          content={
            <div className={styles.additionalList}>
              {data.slice(maxVisible).map((assignee, index) => (
                <div
                  key={assignee.id || index}
                  className={styles.additionalItem}
                >
                  {assignee.avatar ? (
                    <Avatar
                      size="small"
                      src={assignee.avatar}
                      alt={assignee.name}
                    />
                  ) : (
                    <Avatar
                      size="small"
                      style={{
                        backgroundColor: getBackgroundColor(
                          assignee.name || assignee.email || '',
                        ),
                      }}
                      icon={
                        !assignee.name && !assignee.email ? (
                          <UserOutlined />
                        ) : undefined
                      }
                    >
                      {(assignee.name || assignee.email) &&
                        getInitials(assignee.name || assignee.email || '')}
                    </Avatar>
                  )}
                  <Typography
                    variant="body2"
                    as="span"
                    className={styles.additionalName}
                  >
                    {assignee.name || assignee.email || 'Unknown'}
                  </Typography>
                </div>
              ))}
            </div>
          }
          title={
            <Typography variant="body2">
              {`${remainingCount} more assignee${remainingCount > 1 ? 's' : ''}`}
            </Typography>
          }
          trigger={['hover', 'click']}
          placement="bottom"
        >
          <Avatar
            style={{
              backgroundColor: '#fff',
              color: '#1890ff',
              border: '1px solid #d9d9d9',
            }}
            icon={<UserAddOutlined />}
            className={styles.moreAvatar}
          >
            <Typography variant="body2" as="span">
              +{remainingCount}
            </Typography>
          </Avatar>
        </Popover>
      )}
    </Avatar.Group>
  );
};
