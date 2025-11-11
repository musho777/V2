'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

const SingleTicketPage = dynamic(
  () => import('@/modules/project-management/singleTicket/pages/SingleTicket'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Ticket..." />
      </div>
    ),
    ssr: false,
  },
);

export default withModuleAccess(SingleTicketPage, ModuleKey.PROJECT_MANAGEMENT);
