'use client';

import AppLayout from '@/components/layout/AppLayout';

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="flex gap-4 flex-col h-full">{children}</div>
    </AppLayout>
  );
}
