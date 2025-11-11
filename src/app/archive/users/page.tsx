'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

const ArchivedUsersPage = dynamic(
  () => import('@/modules/archive/archive-users/pages/ArchivedUsersPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Archived Users..." />
      </div>
    ),
    ssr: false,
  },
);

export default ArchivedUsersPage;
