'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

const ProjectManagementPage = dynamic(
  () =>
    import('@/modules/project-management/projects/pages/ProjectManagementPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Project Management..." />
      </div>
    ),
    ssr: false,
  },
);

export default withModuleAccess(
  ProjectManagementPage,
  ModuleKey.PROJECT_MANAGEMENT,
);
