'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

const SettingsPage = dynamic(
  () => import('@/modules/settings/pages/SettingsPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Settings..." />
      </div>
    ),
    ssr: false,
  },
);

export default withModuleAccess(SettingsPage, ModuleKey.SETTINGS);
