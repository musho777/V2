import { useModules } from '@/contexts/ModuleContext';
import type { ModuleKey, PermissionCheck } from '@/types/module.types';

/**
 * Hook for permission checking
 */
export const usePermissions = () => {
  const {
    canAccessModule,
    canAccessPath,
    isModuleEnabled,
    hasFeature,
    getUpgradeMessage,
    subscription,
  } = useModules();

  /**
   * Check if user can access a module
   */
  const checkModuleAccess = (moduleKey: ModuleKey): PermissionCheck => {
    return canAccessModule(moduleKey);
  };

  /**
   * Check if user can access a path
   */
  const checkPathAccess = (path: string): PermissionCheck => {
    return canAccessPath(path);
  };

  /**
   * Check if module is enabled
   */
  const isEnabled = (moduleKey: ModuleKey): boolean => {
    return isModuleEnabled(moduleKey);
  };

  /**
   * Check if feature is available
   */
  const canUseFeature = (feature: string): boolean => {
    return hasFeature(feature);
  };

  /**
   * Get upgrade message for a module
   */
  const getUpgradeInfo = (moduleKey: ModuleKey): string => {
    return getUpgradeMessage(moduleKey);
  };

  /**
   * Check multiple modules at once
   */
  const canAccessAnyModule = (moduleKeys: ModuleKey[]): boolean => {
    return moduleKeys.some((key) => {
      const check = canAccessModule(key);
      return check.hasAccess;
    });
  };

  /**
   * Check if user can access all modules
   */
  const canAccessAllModules = (moduleKeys: ModuleKey[]): boolean => {
    return moduleKeys.every((key) => {
      const check = canAccessModule(key);
      return check.hasAccess;
    });
  };

  return {
    checkModuleAccess,
    checkPathAccess,
    isEnabled,
    canUseFeature,
    getUpgradeInfo,
    canAccessAnyModule,
    canAccessAllModules,
    subscription,
  };
};
