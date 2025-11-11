'use client';

import { Card, Empty } from 'antd';

import { Typography } from '@/components/Typography';

export default function BranchTeamsPage() {
  return (
    <div>
      <Typography variant="heading1" className="mb-6">
        Branch Teams
      </Typography>
      <Card>
        <Empty description="Branch Teams management coming soon" />
        <Typography variant="body1" className="mt-4 text-gray-600">
          This module manages teams that belong to specific branches.
        </Typography>
      </Card>
    </div>
  );
}
