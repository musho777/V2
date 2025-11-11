'use client';

import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { LockOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';

import { useModules } from '@/contexts/ModuleContext';
import { useAuth } from '@/hooks/useAuth';

interface RouteGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

/**
 * RouteGuard component
 * Protects routes from unauthorized access
 * Checks authentication and module permissions
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  fallbackPath = '/login',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { canAccessPath } = useModules();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Skip auth check for public routes
    if (isPublicRoute) return;

    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push(fallbackPath);
    }
  }, [
    isAuthenticated,
    authLoading,
    pathname,
    router,
    fallbackPath,
    isPublicRoute,
  ]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading...">
          <div style={{ minHeight: '200px' }} />
        </Spin>
      </div>
    );
  }

  // Allow public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Check if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Check module access
  const accessCheck = canAccessPath(pathname);

  if (!accessCheck.hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Result
          status="403"
          title="Access Denied"
          subTitle={
            accessCheck.reason ||
            'You do not have permission to access this page.'
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
                Upgrade Plan
              </Button>
            ),
          ]}
        />
      </div>
    );
  }

  return <>{children}</>;
};
