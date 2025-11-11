import AppLayout from '@/components/layout/AppLayout';

export default function ProjectManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
