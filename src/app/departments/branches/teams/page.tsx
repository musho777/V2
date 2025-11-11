'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

const BranchTeamsPage = dynamic(
  () => import('@/modules/branches/pages/BranchTeamsPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Branch Teams..." />
      </div>
    ),
    ssr: false,
  },
);

export default withModuleAccess(BranchTeamsPage, ModuleKey.BRANCH_TEAMS);
