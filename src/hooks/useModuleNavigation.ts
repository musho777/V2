import { useRouter } from 'next/navigation';

import { message } from 'antd';

import { useModules } from '@/contexts/ModuleContext';
import type { ModuleKey } from '@/types/module.types';

/**
 * Hook for module navigation with permission checking
 */
export const useModuleNavigation = () => {
  const router = useRouter();
  const { canAccessModule, getUpgradeMessage } = useModules();

  /**
   * Navigate to a module with permission check
   */
  const navigateToModule = (moduleKey: ModuleKey, fallbackPath?: string) => {
    const check = canAccessModule(moduleKey);

    if (check.hasAccess) {
      // Navigate to module path
      router.push(`/${moduleKey.toLowerCase()}`);
    } else {
      message.error(check.reason || 'Access denied');
      if (fallbackPath) {
        router.push(fallbackPath);
      }
    }
  };

  /**
   * Navigate to path with permission check
   */
  const navigateToPath = (path: string, fallbackPath?: string) => {
    const check = canAccessModule(path as unknown as ModuleKey);

    if (check.hasAccess) {
      router.push(path);
    } else {
      message.error(check.reason || 'Access denied');
      if (fallbackPath) {
        router.push(fallbackPath);
      }
    }
  };

  /**
   * Show upgrade modal for a module
   */
  const showUpgradeModal = (moduleKey: ModuleKey) => {
    const upgradeMessage = getUpgradeMessage(moduleKey);
    message.info(upgradeMessage);
    // In production, show a proper modal with upgrade options
  };

  return {
    navigateToModule,
    navigateToPath,
    showUpgradeModal,
  };
};
