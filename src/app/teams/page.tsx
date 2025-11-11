'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

const TeamsPage = dynamic(
  () => import('@/modules/team-controller/teams/pages/TeamsPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    ),
    ssr: false,
  },
);

export default withModuleAccess(TeamsPage, ModuleKey.TEAMS);
