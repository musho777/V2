'use client';

import type { ReactNode } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';

import { LockOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';

import { useModules } from '@/contexts/ModuleContext';
import type { ModuleKey } from '@/types/module.types';

interface ModuleGuardProps {
  moduleKey: ModuleKey;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ModuleGuard component
 * Protects content based on module access
 * Use this to wrap module-specific components
 */
export const ModuleGuard: React.FC<ModuleGuardProps> = ({
  moduleKey,
  children,
  fallback,
}) => {
  const router = useRouter();
  const { canAccessModule } = useModules();

  const accessCheck = canAccessModule(moduleKey);

  if (!accessCheck.hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Result
        status="403"
        title="Module Access Denied"
        subTitle={
          accessCheck.reason || `You do not have access to this module.`
        }
        icon={<LockOutlined />}
        extra={[
          <Button
            type="primary"
            key="dashboard"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>,
          accessCheck.missingPlan && (
            <Button
              key="upgrade"
              onClick={() => router.push('/settings/subscription')}
            >
              Upgrade to {accessCheck.missingPlan}
            </Button>
          ),
        ]}
      />
    );
  }

  return <>{children}</>;
};
