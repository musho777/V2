'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Typography variant="h2" className="text-2xl font-bold">
          Dashboard
        </Typography>
        <Button
          type="primary"
          danger
          onClick={() => {
            void handleLogout();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
