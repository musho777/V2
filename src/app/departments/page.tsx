'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

// Lazy load the departments page for better performance
const DepartmentsPage = dynamic(
  () => import('@/modules/departments/pages/DepartmentsPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Departments..." spinning>
          <div />
        </Spin>
      </div>
    ),
    ssr: false,
  },
);

// Wrap with module access control
export default withModuleAccess(DepartmentsPage, ModuleKey.DEPARTMENTS);
