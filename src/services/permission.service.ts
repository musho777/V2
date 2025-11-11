import { MODULE_REGISTRY } from '@/config/modules.config';
import type {
  ModuleConfig,
  ModuleKey,
  PermissionCheck,
  SubscriptionPlan,
  UserRole,
  UserSubscription,
} from '@/types/module.types';

/**
 * Permission Service
 * Handles all permission and access control logic
 */
class PermissionService {
  /**
   * Check if user has access to a module
   */
  checkModuleAccess(
    moduleKey: ModuleKey,
    userRoles: string[],
    subscription: UserSubscription,
  ): PermissionCheck {
    const moduleConfig = MODULE_REGISTRY[moduleKey];

    if (!moduleConfig) {
      return {
        hasAccess: false,
        reason: 'Module not found',
      };
    }

    if (!moduleConfig.isEnabled) {
      return {
        hasAccess: false,
        reason: 'Module is disabled',
      };
    }

    // Check if module is explicitly disabled for this user
    if (subscription.disabledModules?.includes(moduleKey)) {
      return {
        hasAccess: false,
        reason: 'Module is disabled for your account',
      };
    }

    // Check subscription plan
    const hasValidPlan = this.checkSubscriptionPlan(
      subscription.plan,
      moduleConfig.requiredPlans ?? [],
    );

    if (!hasValidPlan) {
      return {
        hasAccess: false,
        reason: 'Your subscription plan does not include this module',
        missingPlan: moduleConfig.requiredPlans?.[0],
      };
    }

    // Check roles
    const hasValidRole = this.checkRoles(userRoles, moduleConfig.requiredRoles);

    if (!hasValidRole) {
      return {
        hasAccess: false,
        reason: 'You do not have the required role to access this module',
        missingRoles: moduleConfig.requiredRoles as UserRole[],
      };
    }

    // Check if explicitly enabled in subscription
    if (
      subscription.enabledModules.length > 0 &&
      !subscription.enabledModules.includes(moduleKey)
    ) {
      return {
        hasAccess: false,
        reason: 'Module not enabled for your subscription',
      };
    }

    return {
      hasAccess: true,
    };
  }

  /**
   * Check if user's subscription plan meets requirements
   */
  private checkSubscriptionPlan(
    userPlan: SubscriptionPlan,
    requiredPlans: SubscriptionPlan[],
  ): boolean {
    if (requiredPlans.length === 0) return true;
    return requiredPlans.includes(userPlan);
  }

  /**
   * Check if user has at least one of the required roles
   */
  private checkRoles(userRoles: string[], requiredRoles: UserRole[]): boolean {
    if (requiredRoles.length === 0) return true;

    return userRoles.some((role) => requiredRoles.includes(role as UserRole));
  }

  /**
   * Get all accessible modules for a user
   */
  getAccessibleModules(
    userRoles: string[],
    subscription: UserSubscription,
  ): ModuleConfig[] {
    return Object.values(MODULE_REGISTRY).filter((moduleConfig) => {
      const check = this.checkModuleAccess(
        moduleConfig.key as ModuleKey,
        userRoles,
        subscription,
      );
      return check.hasAccess;
    });
  }

  /**
   * Get accessible modules for sidebar
   */
  getAccessibleSidebarModules(
    userRoles: string[],
    subscription: UserSubscription,
  ): ModuleConfig[] {
    return this.getAccessibleModules(userRoles, subscription)
      .filter((moduleConfig) => moduleConfig.showInSidebar)
      .sort((a, b) => (a.sidebarOrder ?? 0) - (b.sidebarOrder ?? 0));
  }

  /**
   * Check if user can access a specific path
   */
  canAccessPath(
    path: string,
    userRoles: string[],
    subscription: UserSubscription,
  ): PermissionCheck {
    // Find module by path
    const foundModule = Object.values(MODULE_REGISTRY).find((m) =>
      path.startsWith(m.path),
    );

    if (!foundModule) {
      return {
        hasAccess: true, // Allow access to non-module paths
      };
    }

    return this.checkModuleAccess(
      foundModule.key as ModuleKey,
      userRoles,
      subscription,
    );
  }

  /**
   * Get module hierarchy (parent-child relationships)
   */
  getModuleHierarchy(
    userRoles: string[],
    subscription: UserSubscription,
  ): Map<ModuleKey, ModuleConfig[]> {
    const hierarchy = new Map<ModuleKey, ModuleConfig[]>();
    const accessibleModules = this.getAccessibleModules(
      userRoles,
      subscription,
    );

    accessibleModules.forEach((moduleConfig) => {
      if (moduleConfig.parentModule) {
        const children = hierarchy.get(moduleConfig.parentModule) || [];
        children.push(moduleConfig);
        hierarchy.set(moduleConfig.parentModule, children);
      }
    });

    return hierarchy;
  }

  /**
   * Check if a feature is available in the subscription
   */
  hasFeature(feature: string, subscription: UserSubscription): boolean {
    return subscription.features.includes(feature);
  }

  /**
   * Get upgrade message for a module
   */
  getUpgradeMessage(moduleKey: ModuleKey): string {
    const moduleConfig = MODULE_REGISTRY[moduleKey];
    if (!moduleConfig) return 'Module not found';

    const requiredPlan = moduleConfig.requiredPlans?.[0];
    return `This feature requires ${requiredPlan ?? 'a premium'} plan or higher. Please upgrade your subscription to access ${moduleConfig.name}.`;
  }
}

export const permissionService = new PermissionService();
