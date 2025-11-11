'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

const ArchivePage = dynamic(
  () => import('@/modules/archive/pages/ArchivePage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Archive..." />
      </div>
    ),
    ssr: false,
  },
);

export default withModuleAccess(ArchivePage, ModuleKey.ARCHIVE);
