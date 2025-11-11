'use client';

import React from 'react';

import type { TagProps as AntTagProps } from 'antd';
import { Tag as AntTag } from 'antd';
import clsx from 'clsx';

import styles from './styles.module.scss';

export type TagType =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'active'
  | 'inactive'
  | 'pending'
  | 'blue'
  | 'blue-light'
  | 'green'
  | 'green-light'
  | 'red'
  | 'red-light'
  | 'orange'
  | 'orange-light'
  | 'yellow'
  | 'yellow-light'
  | 'purple'
  | 'purple-light'
  | 'pink'
  | 'pink-light'
  | 'grey'
  | 'grey-light'
  | 'blue-span'
  | 'red-span'
  | 'pink-span'
  | 'green-span'
  | 'orange-span';

export interface TagProps extends Omit<AntTagProps, 'color'> {
  className?: string;
  tagType?: TagType;
  color?: string;

  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({
  className,
  tagType = 'default',
  children,
  icon,
  ...props
}) => {
  const tagClass = tagType ? styles[tagType] : '';

  return (
    <AntTag
      icon={icon}
      className={clsx(styles.tag, tagClass, className)}
      {...props}
    >
      {children}
    </AntTag>
  );
};
