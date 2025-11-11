'use client';

import React from 'react';

import type { TabsProps as AntTabsProps } from 'antd';
import { Tabs as AntTabs } from 'antd';

import styles from './styles.module.scss';

export interface TabItem {
  key: string;
  label: string;
  children?: React.ReactNode;
}

export interface PageTabsProps extends Omit<AntTabsProps, 'items'> {
  className?: string;
  tabs: TabItem[];
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  tabBarExtraContent?: React.ReactNode;
}

export const PageTabs: React.FC<PageTabsProps> = ({
  className,
  tabs,
  activeKey,
  onChange,
  tabBarExtraContent,
  ...props
}) => {
  return (
    <AntTabs
      className={`${styles.pageTabs} ${className || ''}`}
      items={tabs}
      activeKey={activeKey}
      onChange={onChange}
      tabBarExtraContent={tabBarExtraContent}
      {...props}
    />
  );
};
