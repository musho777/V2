import {
  ApartmentOutlined,
  BarChartOutlined,
  BranchesOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FolderOutlined,
  InboxOutlined,
  ProjectOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import type { ModuleConfig } from '@/types/module.types';
import { ModuleKey, SubscriptionPlan, UserRole } from '@/types/module.types';

/**
 * Module Registry - Central configuration for all modules
 *
 * This configuration defines:
 * - Module metadata
 * - Access control (roles and subscription plans)
 * - Module relationships (parent-child)
 * - Micro-frontend deployment settings
 * - UI visibility and ordering
 */
export const MODULE_REGISTRY: Record<ModuleKey, ModuleConfig> = {
  [ModuleKey.DASHBOARD]: {
    key: ModuleKey.DASHBOARD,
    name: 'Dashboard',
    description: 'Main dashboard and analytics overview',
    path: '/dashboard',
    icon: <DashboardOutlined />,
    requiredRoles: [
      UserRole.VIEWER,
      UserRole.USER,
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
      UserRole.BRANCH_HEAD,
      UserRole.DEPARTMENT_HEAD,
      UserRole.TEAM_LEAD,
    ],
    requiredPlans: [
      SubscriptionPlan.FREE,
      SubscriptionPlan.BASIC,
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 1,
    isEnabled: true,
    // For micro-frontend deployment:
    // remoteEntry: 'http://dashboard.myapp.com/remoteEntry.js',
    // scope: 'dashboard',
    // module: './Module',
  },

  [ModuleKey.USER_MANAGEMENT]: {
    key: ModuleKey.USER_MANAGEMENT,
    name: 'User Management',
    description: 'Manage users, roles, and permissions',
    path: '/users',
    icon: <UserOutlined />,
    requiredRoles: [
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
      UserRole.BRANCH_HEAD,
      UserRole.DEPARTMENT_HEAD,
      UserRole.TEAM_LEAD,
    ],
    requiredPlans: [
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 2,
    isEnabled: true,
  },

  [ModuleKey.DEPARTMENTS]: {
    key: ModuleKey.DEPARTMENTS,
    name: 'Departments',
    description: 'Department management and organization',
    path: '/departments',
    icon: <ApartmentOutlined />,
    requiredRoles: [
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
      UserRole.DEPARTMENT_HEAD,
    ],
    requiredPlans: [
      SubscriptionPlan.BASIC,
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 3,
    isEnabled: true,
  },

  [ModuleKey.BRANCHES]: {
    key: ModuleKey.BRANCHES,
    name: 'Branches',
    description: 'Branch management and organization',
    path: '/branches',
    icon: <BranchesOutlined />,
    requiredRoles: [
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
      UserRole.BRANCH_HEAD,
      UserRole.DEPARTMENT_HEAD,
      UserRole.TEAM_LEAD,
    ],
    requiredPlans: [
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 4,
    isEnabled: true,
  },

  [ModuleKey.BRANCH_TEAMS]: {
    key: ModuleKey.BRANCH_TEAMS,
    name: 'Teams',
    description: 'Team management within branches',
    path: '/departments/branches/teams',
    icon: <TeamOutlined />,
    requiredRoles: [
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
      UserRole.BRANCH_HEAD,
      UserRole.DEPARTMENT_HEAD,
      UserRole.TEAM_LEAD,
    ],
    requiredPlans: [
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    parentModule: ModuleKey.BRANCHES,
    showInSidebar: false,
    isNested: true,
    sidebarOrder: 4.5,
    isEnabled: false,
  },

  [ModuleKey.TEAMS]: {
    key: ModuleKey.TEAMS,
    name: 'Teams',
    description: 'Global team management',
    path: '/teams',
    icon: <TeamOutlined />,
    requiredRoles: [
      UserRole.USER,
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
      UserRole.BRANCH_HEAD,
      UserRole.DEPARTMENT_HEAD,
      UserRole.TEAM_LEAD,
    ],
    requiredPlans: [
      SubscriptionPlan.BASIC,
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 5,
    isEnabled: true,
  },

  [ModuleKey.PROJECTS]: {
    key: ModuleKey.PROJECTS,
    name: 'Projects',
    description: 'Project listing and overview',
    path: '/projects',
    icon: <ProjectOutlined />,
    requiredRoles: [
      UserRole.USER,
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
    ],
    requiredPlans: [
      SubscriptionPlan.BASIC,
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 6,
    isEnabled: true,
    childModules: [ModuleKey.PROJECT_LIST, ModuleKey.PROJECT_TYPES],
  },

  [ModuleKey.PROJECT_LIST]: {
    key: ModuleKey.PROJECT_LIST,
    name: 'All Projects',
    description: 'View all projects',
    path: '/projects',
    icon: <ProjectOutlined />,
    requiredRoles: [
      UserRole.USER,
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
    ],
    requiredPlans: [
      SubscriptionPlan.BASIC,
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    parentModule: ModuleKey.PROJECTS,
    showInSidebar: true,
    isNested: true,
    sidebarOrder: 6.1,
    isEnabled: true,
  },

  [ModuleKey.PROJECT_TYPES]: {
    key: ModuleKey.PROJECT_TYPES,
    name: 'Types',
    description: 'Manage project types',
    path: '/projects/types',
    icon: <FolderOutlined />,
    requiredRoles: [
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
    ],
    requiredPlans: [
      SubscriptionPlan.BASIC,
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    parentModule: ModuleKey.PROJECTS,
    showInSidebar: true,
    isNested: true,
    sidebarOrder: 6.2,
    isEnabled: true,
  },

  [ModuleKey.PROJECT_MANAGEMENT]: {
    key: ModuleKey.PROJECT_MANAGEMENT,
    name: 'Project Management',
    description: 'Advanced project management tools',
    path: '/project-management',
    icon: <FolderOutlined />,
    requiredRoles: [
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
    ],
    requiredPlans: [
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 7,
    isEnabled: true,
  },

  [ModuleKey.SALES]: {
    key: ModuleKey.SALES,
    name: 'Sales',
    description: 'Sales tracking and CRM',
    path: '/sales',
    icon: <ShoppingOutlined />,
    requiredRoles: [
      UserRole.USER,
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ],
    requiredPlans: [
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 8,
    isEnabled: true,
  },

  [ModuleKey.REPORTS]: {
    key: ModuleKey.REPORTS,
    name: 'Reports',
    description: 'Analytics and reporting with nested modules',
    path: '/reports',
    icon: <BarChartOutlined />,
    requiredRoles: [UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
    requiredPlans: [
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 9,
    isEnabled: true,
    isBeta: true,
  },

  [ModuleKey.ARCHIVE]: {
    key: ModuleKey.ARCHIVE,
    name: 'Archive',
    description: 'Archived data and records',
    path: '/archive',
    icon: <InboxOutlined />,
    requiredRoles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    requiredPlans: [SubscriptionPlan.ENTERPRISE, SubscriptionPlan.CUSTOM],
    showInSidebar: true,
    sidebarOrder: 10,
    isEnabled: true,
    isBeta: true,
    children: [
      {
        key: 'archive-departments',
        label: 'Departments',
        path: '/archive/departments',
        icon: <ApartmentOutlined />,
        isVisible: true,
        isDisabled: false,
      },
      {
        key: 'archive-branches',
        label: 'Branches',
        path: '/archive/branches',
        icon: <BranchesOutlined />,
        isVisible: true,
        isDisabled: false,
      },
      {
        key: 'archive-teams',
        label: 'Teams',
        path: '/archive/teams',
        icon: <TeamOutlined />,
        isVisible: true,
        isDisabled: false,
      },
      {
        key: 'archive-users',
        label: 'Users',
        path: '/archive/users',
        icon: <UserOutlined />,
        isVisible: true,
        isDisabled: false,
      },
    ],
  },

  [ModuleKey.SETTINGS]: {
    key: ModuleKey.SETTINGS,
    name: 'Settings',
    description: 'Application settings and configuration',
    path: '/settings',
    icon: <SettingOutlined />,
    requiredRoles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    requiredPlans: [
      SubscriptionPlan.BASIC,
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 99,
    isEnabled: true,
    children: [
      {
        key: 'settings-schedules',
        label: 'Schedules',
        path: '/settings/schedules',
        icon: <SettingOutlined />,
        isVisible: true,
        isDisabled: false,
      },
      {
        key: 'settings-sales-settings',
        label: 'Sales Settings',
        path: '/settings/sales-settings',
        icon: <ShoppingOutlined />,
        isVisible: true,
        isDisabled: false,
      },
    ],
  },

  [ModuleKey.ERP]: {
    key: ModuleKey.ERP,
    name: 'ERP',
    description: 'Enterprise Resource Planning',
    path: '/erp',
    icon: <DatabaseOutlined />,
    requiredRoles: [
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.GENERAL_MANAGER,
    ],
    requiredPlans: [
      SubscriptionPlan.PROFESSIONAL,
      SubscriptionPlan.ENTERPRISE,
      SubscriptionPlan.CUSTOM,
    ],
    showInSidebar: true,
    sidebarOrder: 100,
    isEnabled: true,
    children: [
      {
        key: 'erp-create-client',
        label: 'Create Client',
        path: '/erp/create-client',
        icon: <UserOutlined />,
        isVisible: true,
        isDisabled: false,
      },
      {
        key: 'erp-address-add',
        label: 'Address Add',
        path: '/erp/address-add',
        icon: <ApartmentOutlined />,
        isVisible: true,
        isDisabled: false,
      },
      {
        key: 'erp-search-client',
        label: 'Search Client',
        path: '/erp/search-client',
        icon: <UserOutlined />,
        isVisible: true,
        isDisabled: false,
      },
    ],
  },
};

/**
 * Helper to get module configuration
 */
export const getModuleConfig = (key: ModuleKey): ModuleConfig | undefined => {
  return MODULE_REGISTRY[key];
};

/**
 * Get all enabled modules
 */
export const getEnabledModules = (): ModuleConfig[] => {
  return Object.values(MODULE_REGISTRY).filter((module) => module.isEnabled);
};

/**
 * Get modules for sidebar (sorted by order)
 */
export const getSidebarModules = (): ModuleConfig[] => {
  return Object.values(MODULE_REGISTRY).sort(
    (a, b) => (a.sidebarOrder ?? 0) - (b.sidebarOrder ?? 0),
  );
};
