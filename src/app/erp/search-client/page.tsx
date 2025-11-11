'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

const SearchClientPage = dynamic(
  () => import('@/modules/erp/search-client/pages/SearchClientPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Search Client..." />
      </div>
    ),
    ssr: false,
  },
);

export default SearchClientPage;
