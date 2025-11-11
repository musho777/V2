'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

const ReportsPage = dynamic(
  () => import('@/modules/reports/pages/ReportsPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Reports..." />
      </div>
    ),
    ssr: false,
  },
);

export default withModuleAccess(ReportsPage, ModuleKey.REPORTS);
