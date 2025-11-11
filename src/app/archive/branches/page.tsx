'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

const ArchivedBranchesPage = dynamic(
  () => import('@/modules/archive/archive-branches/pages/ArchivedBranchesPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Archived Branches..." />
      </div>
    ),
    ssr: false,
  },
);

export default ArchivedBranchesPage;
