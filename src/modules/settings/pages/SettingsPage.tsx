'use client';

import { Card, Empty } from 'antd';

import { Typography } from '@/components/Typography';

export default function SettingsPage() {
  return (
    <div>
      <Typography variant="heading1" className="mb-6">
        Settings
      </Typography>
      <Card>
        <Empty description="Settings module coming soon" />
      </Card>
    </div>
  );
}
