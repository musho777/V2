'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';

import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  userId?: number;
  onLogout?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName = 'U',
  lastName = 'N',
  avatarUrl,
  userId,
  onLogout,
}) => {
  const router = useRouter();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile') {
      if (userId) {
        router.push(`/users/${userId}/profile`);
      } else {
        router.push('/profile');
      }
    } else if (key === 'logout') {
      onLogout?.();
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Typography variant="body2">Profile</Typography>,
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: <Typography variant="body2">Logout</Typography>,
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      trigger={['click']}
      placement="bottomRight"
    >
      <div className={styles.avatarWrapper}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${firstName} ${lastName}`}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <Typography variant="body2" as="span">
              {getInitials()}
            </Typography>
          </div>
        )}
      </div>
    </Dropdown>
  );
};
