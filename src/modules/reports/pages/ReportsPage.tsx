'use client';

import { Card, Empty, Tag } from 'antd';

import { Typography } from '@/components/Typography';

export default function ReportsPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Typography variant="heading1">Reports</Typography>
        <Tag color="blue">
          <Typography variant="body3" as="span">
            Beta
          </Typography>
        </Tag>
      </div>
      <Card>
        <Empty description="Reports module coming soon" />
      </Card>
    </div>
  );
}
