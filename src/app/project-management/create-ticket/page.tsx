'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

const CreateTicketPage = dynamic(
  () => import('@/modules/project-management/createTicket/pages/CreateTicket'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    ),
    ssr: false,
  },
);

export default withModuleAccess(CreateTicketPage, ModuleKey.PROJECT_MANAGEMENT);
