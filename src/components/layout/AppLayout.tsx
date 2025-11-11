'use client';

import { Layout } from 'antd';

import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';

import Sidebar from './Sidebar';

const { Content: _Content } = Layout;

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { collapsed: _collapsed } = useSidebar();
  return <Sidebar>{children}</Sidebar>;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
