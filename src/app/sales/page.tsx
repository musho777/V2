'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

const SalesPage = dynamic(() => import('@/modules/sales/pages/SalesPage'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Spin size="large" tip="Loading Sales..." />
    </div>
  ),
  ssr: false,
});

export default withModuleAccess(SalesPage, ModuleKey.SALES);
