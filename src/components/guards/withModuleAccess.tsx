'use client';

import type { ComponentType } from 'react';
import React from 'react';

import type { ModuleKey } from '@/types/module.types';

import { ModuleGuard } from './ModuleGuard';

/**
 * HOC to wrap components with module access control
 * Usage: export default withModuleAccess(MyComponent, ModuleKey.USER_MANAGEMENT);
 */
export function withModuleAccess<P extends object>(
  Component: ComponentType<P>,
  moduleKey: ModuleKey,
  fallback?: React.ReactNode,
) {
  const WrappedComponent = (props: P) => {
    return (
      <ModuleGuard moduleKey={moduleKey} fallback={fallback}>
        <Component {...props} />
      </ModuleGuard>
    );
  };

  WrappedComponent.displayName = `withModuleAccess(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
