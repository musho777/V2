'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import { MODULE_REGISTRY } from '@/config/modules.config';
import { useAuth } from '@/hooks/useAuth';
import { permissionService } from '@/services/permission.service';
import type {
  ModuleConfig,
  ModuleKey,
  NavigationItem,
  PermissionCheck,
  UserSubscription,
} from '@/types/module.types';
import { SubscriptionPlan } from '@/types/module.types';

interface ModuleContextType {
  // Module access
  accessibleModules: ModuleConfig[];
  canAccessModule: (moduleKey: ModuleKey) => PermissionCheck;
  canAccessPath: (path: string) => PermissionCheck;

  // Navigation
  navigationItems: NavigationItem[];

  // Subscription
  subscription: UserSubscription;
  hasFeature: (feature: string) => boolean;

  // Utilities
  getUpgradeMessage: (moduleKey: ModuleKey) => string;
  isModuleEnabled: (moduleKey: ModuleKey) => boolean;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

interface ModuleProviderProps {
  children: ReactNode;
  // In production, this would come from API
  initialSubscription?: UserSubscription;
}

export const ModuleProvider: React.FC<ModuleProviderProps> = ({
  children,
  initialSubscription,
}) => {
  const { user } = useAuth();

  // Mock subscription - In production, fetch from API
  const subscription: UserSubscription = useMemo(() => {
    if (initialSubscription) return initialSubscription;

    // Default subscription based on user role
    const plan = user?.role?.some((r) =>
      ['SUPER_ADMIN', 'GENERAL_MANAGER'].includes(r),
    )
      ? SubscriptionPlan.ENTERPRISE
      : user?.role?.includes('ADMIN')
        ? SubscriptionPlan.PROFESSIONAL
        : SubscriptionPlan.BASIC;

    return {
      plan,
      features: [],
      enabledModules: Object.keys(MODULE_REGISTRY) as ModuleKey[],
      disabledModules: [],
    };
  }, [user, initialSubscription]);

  const userRoles = useMemo(() => user?.role || [], [user]);

  // Get accessible modules
  const accessibleModules = useMemo(() => {
    if (!user) return [];
    return permissionService.getAccessibleModules(userRoles, subscription);
  }, [user, userRoles, subscription]);

  // Check module access
  const canAccessModule = (moduleKey: ModuleKey): PermissionCheck => {
    if (!user) {
      return {
        hasAccess: false,
        reason: 'User not authenticated',
      };
    }
    return permissionService.checkModuleAccess(
      moduleKey,
      userRoles,
      subscription,
    );
  };

  // Check path access
  const canAccessPath = (path: string): PermissionCheck => {
    if (!user) {
      return {
        hasAccess: false,
        reason: 'User not authenticated',
      };
    }
    return permissionService.canAccessPath(path, userRoles, subscription);
  };

  // Build navigation items for sidebar
  const navigationItems = useMemo(() => {
    const sidebarModules = permissionService.getAccessibleSidebarModules(
      userRoles,
      subscription,
    );
    const hierarchy = permissionService.getModuleHierarchy(
      userRoles,
      subscription,
    );

    const buildNavigationItem = (module: ModuleConfig): NavigationItem => {
      const hierarchyChildren = hierarchy.get(module.key as ModuleKey);
      const directChildren = module.children;

      return {
        key: module.key,
        label: module.name,
        path: module.path,
        icon: module.icon,
        isVisible: true,
        isDisabled: false,
        badge: module.isBeta ? 'Beta' : undefined,
        children: directChildren
          ? directChildren.map((child) => ({
              key: child.key,
              label: child.label,
              path: child.path,
              icon: child.icon,
              isVisible: child.isVisible,
              isDisabled: child.isDisabled,
            }))
          : hierarchyChildren?.map(buildNavigationItem),
      };
    };

    return sidebarModules
      .filter((module) => !module.parentModule) // Only top-level modules
      .map(buildNavigationItem);
  }, [userRoles, subscription]);

  // Check feature availability
  const hasFeature = (feature: string): boolean => {
    return permissionService.hasFeature(feature, subscription);
  };

  // Get upgrade message
  const getUpgradeMessage = (moduleKey: ModuleKey): string => {
    return permissionService.getUpgradeMessage(moduleKey);
  };

  // Check if module is enabled
  const isModuleEnabled = (moduleKey: ModuleKey): boolean => {
    const check = canAccessModule(moduleKey);
    return check.hasAccess;
  };

  const value: ModuleContextType = {
    accessibleModules,
    canAccessModule,
    canAccessPath,
    navigationItems,
    subscription,
    hasFeature,
    getUpgradeMessage,
    isModuleEnabled,
  };

  return (
    <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
  );
};

/**
 * Hook to use module context
 */
export const useModules = () => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};
