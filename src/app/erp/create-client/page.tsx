'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

const CreateClientPage = dynamic(
  () => import('@/modules/erp/create-client/pages/CreateClientPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Create Client..." />
      </div>
    ),
    ssr: false,
  },
);

export default CreateClientPage;
