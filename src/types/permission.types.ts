import type { ModuleKey, SubscriptionPlan, UserRole } from './module.types';

/**
 * Permission types
 */
export enum PermissionType {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  ADMIN = 'ADMIN',
}

/**
 * Resource types that can have permissions
 */
export enum ResourceType {
  MODULE = 'MODULE',
  FEATURE = 'FEATURE',
  DATA = 'DATA',
  SETTING = 'SETTING',
}

/**
 * Permission definition
 */
export interface Permission {
  id: string;
  resource: ResourceType;
  resourceId: string; // Module key or feature name
  type: PermissionType;
  roles: UserRole[];
  plans: SubscriptionPlan[];
}

/**
 * User permissions
 */
export interface UserPermissions {
  userId: number;
  roles: UserRole[];
  subscriptionPlan: SubscriptionPlan;
  customPermissions?: Permission[];
  moduleAccess: Map<ModuleKey, PermissionType[]>;
}

/**
 * Permission evaluation context
 */
export interface PermissionContext {
  user: {
    id: number;
    roles: UserRole[];
    subscription: SubscriptionPlan;
  };
  module?: ModuleKey;
  requiredPermission?: PermissionType;
}
