'use client';

import React from 'react';

import { Typography } from '@/components/Typography';

export default function ArchivePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Typography variant="heading1" className="mb-4">
          Archive
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Select a category from the navigation to view archived items.
        </Typography>
      </div>
    </div>
  );
}
