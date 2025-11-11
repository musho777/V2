'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

const ArchivedTeamsPage = dynamic(
  () => import('@/modules/archive/archive-teams/pages/ArchivedTeamsPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Archived Teams..." />
      </div>
    ),
    ssr: false,
  },
);

export default ArchivedTeamsPage;
