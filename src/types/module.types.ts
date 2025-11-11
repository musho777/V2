import type { ReactNode } from 'react';

/**
 * Subscription plan levels - determines which modules are available
 */
export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM',
}

/**
 * User roles for role-based access control
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  GENERAL_MANAGER = 'GENERAL_MANAGER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  VIEWER = 'VIEWER',
  BRANCH_HEAD = 'BRANCH_HEAD',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  TEAM_LEAD = 'TEAM_LEAD',
}

/**
 * Module identifiers - each module has a unique key
 */
export enum ModuleKey {
  DASHBOARD = 'DASHBOARD',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  DEPARTMENTS = 'DEPARTMENTS',
  BRANCHES = 'BRANCHES',
  BRANCH_TEAMS = 'BRANCH_TEAMS',
  TEAMS = 'TEAMS',
  PROJECTS = 'PROJECTS',
  PROJECT_LIST = 'PROJECT_LIST',
  PROJECT_TYPES = 'PROJECT_TYPES',
  PROJECT_MANAGEMENT = 'PROJECT_MANAGEMENT',
  SETTINGS = 'SETTINGS',
  ARCHIVE = 'ARCHIVE',
  REPORTS = 'REPORTS',
  SALES = 'SALES',
  ERP = 'ERP',
}

/**
 * Module configuration for micro-frontend deployment
 */
export interface ModuleConfig {
  key: ModuleKey | string;
  name: string;
  description: string;
  path: string;
  icon?: ReactNode;

  // Access control
  requiredRoles: UserRole[];
  requiredPlans?: SubscriptionPlan[];

  // Module relationships
  parentModule?: ModuleKey;
  childModules?: ModuleKey[];
  children?: NavigationItem[];

  // Micro-frontend config
  remoteEntry?: string; // URL for remote module in production
  scope?: string; // Webpack scope name
  module?: string; // Module name to load

  // UI Configuration
  showInSidebar: boolean;
  sidebarOrder?: number;
  isNested?: boolean;

  // Feature flags
  isEnabled?: boolean;
  isBeta?: boolean;
}

/**
 * User subscription information
 */
export interface UserSubscription {
  plan: SubscriptionPlan;
  features: string[];
  expiresAt?: Date;
  enabledModules: ModuleKey[];
  disabledModules?: ModuleKey[];
}

/**
 * Permission check result
 */
export interface PermissionCheck {
  hasAccess: boolean;
  reason?: string;
  missingRoles?: UserRole[];
  missingPlan?: SubscriptionPlan;
}

/**
 * Navigation item for sidebar
 */
export interface NavigationItem {
  key: string;
  label: string;
  path: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  badge?: string | number;
  isVisible: boolean;
  isDisabled: boolean;
}

/**
 * Module metadata for dynamic loading
 */
export interface ModuleMetadata {
  version: string;
  lastUpdated: Date;
  dependencies?: ModuleKey[];
  healthStatus?: 'healthy' | 'degraded' | 'unavailable';
}

/**
 * Route configuration for a module
 */
export interface ModuleRoute {
  path: string;
  component: React.ComponentType<Record<string, unknown>>;
  exact?: boolean;
  children?: ModuleRoute[];
  requiredRoles?: UserRole[];
  requiredPlans?: SubscriptionPlan[];
}
