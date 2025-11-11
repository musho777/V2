'use client';

import dynamic from 'next/dynamic';

import { Spin } from 'antd';

const AddressAddPage = dynamic(
  () => import('@/modules/erp/address-add/pages/AddressAddPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading Address Add..." />
      </div>
    ),
    ssr: false,
  },
);

export default AddressAddPage;
