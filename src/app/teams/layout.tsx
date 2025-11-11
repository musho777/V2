'use client';

import { usePathname, useRouter } from 'next/navigation';

import AppLayout from '@/components/layout/AppLayout';
import { CustomSegmented } from '@/components/Segmented/CustomSegmented';
import { useAuth } from '@/hooks/useAuth';

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentView = pathname === '/teams' ? 'teams' : 'team_membership';
  return (
    <AppLayout>
      <div className="flex  gap-4 flex-col h-full">
        {hasRole('GENERAL_MANAGER') && (
          <div>
            <CustomSegmented
              currentView={currentView}
              onChange={(value) => {
                if (value === 'teams') {
                  router.push('/teams');
                } else {
                  router.push('/teams/team-assign');
                }
              }}
              options={[
                { label: 'Teams', value: 'teams' },
                { label: 'Team membership', value: 'team_membership' },
              ]}
            />
          </div>
        )}
        {children}
      </div>
    </AppLayout>
  );
}
