import AppLayout from '@/components/layout/AppLayout';

export default function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
