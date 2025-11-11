'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

const ArchivedDepartmentsPage = dynamic(
  () =>
    import(
      '@/modules/archive/archive-departments/pages/ArchivedDepartmentsPage'
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Archived Departments..." />
      </div>
    ),
    ssr: false,
  },
);

export default ArchivedDepartmentsPage;
