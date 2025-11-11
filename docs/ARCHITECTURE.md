# Microfrontend Architecture Documentation

## Overview

This application implements a comprehensive modular microfrontend architecture with:

- **Subscription-based module access control**
- **Role-based access control (RBAC)**
- **Dynamic routing and navigation**
- **Lazy loading for optimal performance**
- **Docker-ready for containerization**

## Architecture Components

### 1. Module System

#### Module Registry (`src/config/modules.config.tsx`)

Central configuration for all modules with:

- Module metadata (name, description, icon)
- Access control (roles and subscription plans)
- Parent-child relationships for nested modules
- Micro-frontend deployment configuration
- UI visibility and ordering

#### Available Modules

1. **Dashboard** - Main dashboard (FREE+, all roles)
2. **User Management** - User and role management (PROFESSIONAL+, ADMIN+)
3. **Departments** - Department organization (BASIC+, MANAGER+)
4. **Branches** - Branch management under departments (PROFESSIONAL+, MANAGER+)
5. **Teams** - Team management (BASIC+, USER+)
6. **Projects** - Project listing (BASIC+, USER+)
7. **Project Management** - Advanced project tools (PROFESSIONAL+, MANAGER+)
8. **Sales** - Sales tracking and CRM (PROFESSIONAL+, USER+)
9. **Reports** - Analytics and reporting (PROFESSIONAL+, MANAGER+)
10. **Archive** - Archived data (ENTERPRISE+, ADMIN+)
11. **Settings** - Application configuration (BASIC+, ADMIN+)

### 2. Permission System

#### Types (`src/types/`)

- `module.types.ts` - Module configuration and subscription types
- `permission.types.ts` - Permission definitions and resource types

#### Permission Service (`src/services/permission.service.ts`)

Handles all permission logic:

- Module access checking
- Subscription plan validation
- Role validation
- Path-based access control
- Module hierarchy management

#### Context Provider (`src/contexts/ModuleContext.tsx`)

Provides module and permission data throughout the app:

```tsx
const {
  accessibleModules,
  canAccessModule,
  canAccessPath,
  navigationItems,
  subscription,
} = useModules();
```

### 3. Route Protection

#### RouteGuard (`src/components/guards/RouteGuard.tsx`)

Top-level route protection:

- Checks authentication
- Validates module access for current path
- Redirects unauthorized users
- Shows access denied messages

#### ModuleGuard (`src/components/guards/ModuleGuard.tsx`)

Component-level protection:

```tsx
<ModuleGuard moduleKey={ModuleKey.USER_MANAGEMENT}>
  <YourComponent />
</ModuleGuard>
```

#### HOC (`src/components/guards/withModuleAccess.tsx`)

Higher-order component for wrapping pages:

```tsx
export default withModuleAccess(MyPage, ModuleKey.SALES);
```

### 4. Hooks

#### usePermissions (`src/hooks/usePermissions.ts`)

Permission checking utilities:

```tsx
const { checkModuleAccess, isEnabled, canUseFeature } = usePermissions();
```

#### useModuleNavigation (`src/hooks/useModuleNavigation.ts`)

Safe navigation with permission checks:

```tsx
const { navigateToModule, showUpgradeModal } = useModuleNavigation();
```

### 5. Dynamic Navigation

#### Sidebar (`src/components/layout/Sidebar.tsx`)

Automatically generates navigation based on:

- User roles
- Subscription plan
- Module configuration
- Enabled/disabled modules

Features:

- Nested menu items (parent-child modules)
- Beta badges
- Icon display
- Collapsible design

## Folder Structure

```
src/
├── app/                          # Next.js app router
│   ├── dashboard/
│   ├── users/
│   ├── departments/
│   ├── projects/
│   ├── sales/
│   └── [other-modules]/
│       ├── layout.tsx           # Module layout with AppLayout
│       └── page.tsx             # Lazy-loaded module page
│
├── modules/                      # Module implementations
│   ├── departments/
│   ├── projects/
│   ├── sales/
│   └── [module-name]/
│       ├── components/          # Module-specific components
│       ├── hooks/               # Module-specific hooks
│       ├── services/            # Module API services
│       ├── types/               # Module type definitions
│       └── pages/               # Module page components
│
├── components/
│   ├── guards/                  # Route and module guards
│   ├── layout/                  # Layout components
│   └── Table.tsx                # Responsive table component
│
├── contexts/
│   ├── ModuleContext.tsx        # Module and permission context
│   └── SidebarContext.tsx       # Sidebar state
│
├── hooks/
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   └── useModuleNavigation.ts
│
├── services/
│   ├── auth.service.ts
│   └── permission.service.ts
│
├── types/
│   ├── auth.types.ts
│   ├── module.types.ts
│   └── permission.types.ts
│
└── config/
    └── modules.config.tsx       # Module registry
```

## Usage Examples

### 1. Adding a New Module

```typescript
// 1. Add to ModuleKey enum (types/module.types.ts)
export enum ModuleKey {
  // ...
  MY_NEW_MODULE = 'MY_NEW_MODULE',
}

// 2. Register in MODULE_REGISTRY (config/modules.config.tsx)
[ModuleKey.MY_NEW_MODULE]: {
  key: ModuleKey.MY_NEW_MODULE,
  name: 'My New Module',
  path: '/my-new-module',
  icon: <Icon />,
  requiredRoles: [UserRole.USER],
  requiredPlans: [SubscriptionPlan.BASIC],
  showInSidebar: true,
  sidebarOrder: 11,
  isEnabled: true,
}

// 3. Create module structure
mkdir -p src/modules/my-new-module/{components,pages,hooks,services,types}

// 4. Create page component (modules/my-new-module/pages/MyNewModulePage.tsx)
export default function MyNewModulePage() {
  return <div>My Module Content</div>;
}

// 5. Create app route (app/my-new-module/page.tsx)
const MyNewModulePage = dynamic(
  () => import('@/modules/my-new-module/pages/MyNewModulePage'),
  { loading: () => <Spin />, ssr: false }
);
export default withModuleAccess(MyNewModulePage, ModuleKey.MY_NEW_MODULE);

// 6. Create layout (app/my-new-module/layout.tsx)
export default function MyNewModuleLayout({ children }) {
  return <AppLayout>{children}</AppLayout>;
}
```

### 2. Creating Nested Modules

```typescript
// Parent module
[ModuleKey.DEPARTMENTS]: {
  // ...
  childModules: [ModuleKey.BRANCHES],
}

// Child module
[ModuleKey.BRANCHES]: {
  // ...
  parentModule: ModuleKey.DEPARTMENTS,
  isNested: true,
}
```

### 3. Checking Permissions in Components

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { checkModuleAccess, isEnabled } = usePermissions();

  const canAccessSales = isEnabled(ModuleKey.SALES);

  return <div>{canAccessSales && <SalesWidget />}</div>;
}
```

### 4. Safe Navigation

```tsx
import { useModuleNavigation } from '@/hooks/useModuleNavigation';

function MyComponent() {
  const { navigateToModule } = useModuleNavigation();

  const handleClick = () => {
    navigateToModule(ModuleKey.SALES, '/dashboard');
  };

  return <Button onClick={handleClick}>Go to Sales</Button>;
}
```

## Subscription Plans

### Plan Hierarchy

1. **FREE** - Basic access (Dashboard only)
2. **BASIC** - Small teams (Dashboard, Teams, Projects, Departments)
3. **PROFESSIONAL** - Growing businesses (+ User Management, Project Management, Sales, Reports)
4. **ENTERPRISE** - Large organizations (+ Archive, advanced features)
5. **CUSTOM** - Tailored access

### Configuring User Subscription

In production, fetch subscription from API:

```tsx
<ModuleProvider initialSubscription={{
  plan: SubscriptionPlan.PROFESSIONAL,
  features: ['advanced_reports', 'api_access'],
  enabledModules: [/* specific modules */],
  disabledModules: [/* disabled modules */],
}}>
```

## Performance Optimizations

### 1. Lazy Loading

All modules use dynamic imports:

```tsx
const ModulePage = dynamic(() => import('./ModulePage'), {
  loading: () => <Spin />,
  ssr: false,
});
```

### 2. Code Splitting

- Each module is a separate bundle
- Only loaded when accessed
- Reduces initial bundle size

### 3. Memoization

- Module lists are memoized in context
- Permission checks are cached
- Navigation items computed once

## Docker Containerization

### Module as Separate Container

```dockerfile
# Example Dockerfile for Sales module
FROM node:18-alpine

WORKDIR /app

# Copy only sales module files
COPY src/modules/sales ./src/modules/sales
COPY package.json ./

RUN npm install
RUN npm run build:sales

EXPOSE 3001

CMD ["npm", "run", "start:sales"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  main-app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production

  sales-module:
    build:
      context: .
      dockerfile: Dockerfile.sales
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
      - MODULE_NAME=sales

  reports-module:
    build:
      context: .
      dockerfile: Dockerfile.reports
    ports:
      - '3002:3002'
```

### Webpack Module Federation (for true microfrontends)

```javascript
// webpack.config.js for sales module
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'sales',
      filename: 'remoteEntry.js',
      exposes: {
        './Module': './src/modules/sales/pages/SalesPage',
      },
      shared: ['react', 'react-dom', 'antd'],
    }),
  ],
};
```

Then in modules.config.tsx:

```typescript
[ModuleKey.SALES]: {
  // ...
  remoteEntry: 'http://sales.myapp.com:3001/remoteEntry.js',
  scope: 'sales',
  module: './Module',
}
```

## API Integration

### Subscription API

```typescript
// services/subscription.service.ts
export const subscriptionService = {
  async getUserSubscription(userId: number): Promise<UserSubscription> {
    const response = await httpClient.get(`/api/subscriptions/${userId}`);
    return response.data;
  },

  async updateSubscription(userId: number, plan: SubscriptionPlan) {
    return httpClient.put(`/api/subscriptions/${userId}`, { plan });
  },
};
```

### Module Enablement API

```typescript
// services/module.service.ts
export const moduleService = {
  async getEnabledModules(userId: number): Promise<ModuleKey[]> {
    const response = await httpClient.get(`/api/users/${userId}/modules`);
    return response.data;
  },

  async toggleModule(userId: number, moduleKey: ModuleKey, enabled: boolean) {
    return httpClient.post(`/api/users/${userId}/modules/${moduleKey}`, {
      enabled,
    });
  },
};
```

## Security Considerations

1. **Server-side validation** - Always validate permissions on the backend
2. **Token-based auth** - JWT tokens contain user roles
3. **Route protection** - Multiple layers (route guard, module guard, HOC)
4. **No URL bypass** - All routes check permissions
5. **Audit logging** - Log module access attempts

## Testing

### Unit Tests

```typescript
// __tests__/services/permission.service.test.ts
import { permissionService } from '@/services/permission.service';

describe('PermissionService', () => {
  it('should deny access without proper role', () => {
    const result = permissionService.checkModuleAccess(
      ModuleKey.USER_MANAGEMENT,
      ['USER'],
      mockSubscription,
    );
    expect(result.hasAccess).toBe(false);
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/module-access.test.tsx
import { render } from '@testing-library/react';
import { ModuleProvider } from '@/contexts/ModuleContext';

test('shows access denied for unauthorized module', () => {
  const { getByText } = render(
    <ModuleProvider>
      <ModuleGuard moduleKey={ModuleKey.ADMIN}>
        <div>Admin Content</div>
      </ModuleGuard>
    </ModuleProvider>
  );
  expect(getByText(/access denied/i)).toBeInTheDocument();
});
```

## Monitoring & Analytics

Track module usage:

```typescript
// Track module access
analytics.track('module_accessed', {
  module: moduleKey,
  userId: user.id,
  subscriptionPlan: subscription.plan,
});

// Track upgrade prompts
analytics.track('upgrade_prompt_shown', {
  module: moduleKey,
  requiredPlan: missingPlan,
});
```

## Migration Guide

### From Monolith to Microfrontends

1. **Phase 1: Modular Structure** ✅ (Current)
   - Organize code into modules
   - Implement permission system
   - Add lazy loading

2. **Phase 2: Module Federation**
   - Set up Webpack Module Federation
   - Configure remote entries
   - Test remote loading

3. **Phase 3: Containerization**
   - Create Dockerfiles for each module
   - Set up Docker Compose
   - Configure networking

4. **Phase 4: Deployment**
   - Deploy to Kubernetes
   - Set up service mesh
   - Configure load balancing

## Best Practices

1. **Module Independence** - Keep modules loosely coupled
2. **Shared Components** - Use common component library
3. **Type Safety** - Strict TypeScript configuration
4. **Error Boundaries** - Wrap modules in error boundaries
5. **Performance Monitoring** - Track bundle sizes and load times
6. **Documentation** - Document module APIs and contracts
7. **Version Control** - Version module APIs for compatibility
8. **Testing** - Comprehensive test coverage for permissions

## Future Enhancements

- [ ] Module marketplace for add-ons
- [ ] A/B testing for modules
- [ ] Feature flags per module
- [ ] Real-time module updates
- [ ] Module analytics dashboard
- [ ] Custom module builder
- [ ] Multi-tenancy support
- [ ] Module versioning system

## Support

For questions or issues:

1. Check this documentation
2. Review module configuration
3. Check permission service logs
4. Contact development team

---

**Version:** 1.0.0
**Last Updated:** 2025-10-07
