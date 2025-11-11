# CRM System - Modular Microfrontend Application

A high-performance, enterprise-grade CRM system built with Next.js 15, featuring a modular microfrontend architecture with subscription-based and role-based access control.

## 🚀 Features

### Core Features

- **Modular Microfrontend Architecture** - Independent, scalable modules
- **Subscription-Based Access Control** - Different plans (FREE, BASIC, PROFESSIONAL, ENTERPRISE, CUSTOM)
- **Role-Based Permissions** - Fine-grained access control (SUPER_ADMIN, ADMIN, MANAGER, USER, VIEWER)
- **Dynamic Navigation** - Sidebar adapts to user permissions
- **Route Protection** - Multi-layer security (no URL bypass)
- **Lazy Loading** - Optimized performance with code splitting
- **Docker Ready** - Containerized deployment support
- **Responsive Design** - Mobile-first with Ant Design
- **TypeScript** - Full type safety

### Available Modules

| Module             | Min Plan     | Min Role | Status |
| ------------------ | ------------ | -------- | ------ |
| Dashboard          | FREE         | VIEWER   | ✅     |
| User Management    | PROFESSIONAL | ADMIN    | ✅     |
| Departments        | BASIC        | MANAGER  | ✅     |
| Branches           | PROFESSIONAL | MANAGER  | ✅     |
| Teams              | BASIC        | USER     | ✅     |
| Projects           | BASIC        | USER     | ✅     |
| Project Management | PROFESSIONAL | MANAGER  | ✅     |
| Sales              | PROFESSIONAL | USER     | ✅     |
| Reports            | PROFESSIONAL | MANAGER  | ✅     |
| Archive            | ENTERPRISE   | ADMIN    | ✅     |
| Settings           | BASIC        | ADMIN    | ✅     |

## 📋 Prerequisites

- Node.js 18+ and Yarn
- Docker and Docker Compose (for containerized deployment)
- Git

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4 (App Router, Turbopack)
- **Language:** TypeScript 5
- **UI Library:** Ant Design 5.27.4
- **Styling:** Tailwind CSS 4, SCSS
- **State Management:** React Query (TanStack Query)
- **Form Management:** Formik + Zod
- **Authentication:** JWT (axios interceptors)
- **HTTP Client:** Axios
- **Reactive Programming:** RxJS

## 📦 Installation

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd simple_go_v2

# Install dependencies
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker Development (with hot reload)

```bash
# Run in development mode
docker-compose -f docker-compose.dev.yml up

# Or using Make
make dev
```

### Docker Production

```bash
# Build and run production container
docker-compose up --build

# Run in background
docker-compose up -d

# Or using Make
make prod
make prod-d  # background
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://46.182.174.39:7070

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=CRM System

# Features
NEXT_TELEMETRY_DISABLED=1
```

### API Proxy Configuration

Edit `next.config.ts` to configure API rewrites:

```typescript
async rewrites() {
  return [
    {
      source: '/api/auth/:path*',
      destination: 'http://your-api-server:port/auth/:path*',
    },
    {
      source: '/api/:path*',
      destination: 'http://your-api-server:port/:path*',
    },
  ];
}
```

### Module Configuration

Modules are configured in `src/config/modules.config.tsx`:

```typescript
[ModuleKey.YOUR_MODULE]: {
  key: ModuleKey.YOUR_MODULE,
  name: 'Your Module',
  description: 'Module description',
  path: '/your-module',
  icon: <YourIcon />,
  requiredRoles: [UserRole.USER],
  requiredPlans: [SubscriptionPlan.BASIC],
  showInSidebar: true,
  sidebarOrder: 10,
  isEnabled: true,
}
```

## 🏗️ Project Structure

```
simple_go_v2/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── dashboard/            # Dashboard module route
│   │   ├── users/                # Users module route
│   │   ├── departments/          # Departments module route
│   │   └── [other-modules]/      # Other module routes
│   │
│   ├── modules/                  # Module implementations
│   │   ├── departments/
│   │   │   ├── pages/            # Module pages
│   │   │   ├── components/       # Module components
│   │   │   ├── hooks/            # Module hooks
│   │   │   ├── services/         # Module services
│   │   │   └── types/            # Module types
│   │   └── [other-modules]/
│   │
│   ├── components/               # Shared components
│   │   ├── guards/               # Route & module guards
│   │   ├── layout/               # Layout components
│   │   └── Table.tsx             # Responsive table
│   │
│   ├── contexts/                 # React contexts
│   │   ├── ModuleContext.tsx     # Module & permission state
│   │   └── SidebarContext.tsx    # Sidebar state
│   │
│   ├── hooks/                    # Shared hooks
│   │   ├── useAuth.ts            # Authentication
│   │   ├── usePermissions.ts     # Permission checks
│   │   └── useModuleNavigation.ts # Safe navigation
│   │
│   ├── services/                 # Business logic
│   │   ├── auth.service.ts       # Auth service
│   │   └── permission.service.ts # Permission logic
│   │
│   ├── types/                    # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── module.types.ts
│   │   └── permission.types.ts
│   │
│   ├── config/                   # Configuration
│   │   └── modules.config.tsx    # Module registry
│   │
│   └── utils/                    # Utilities
│       ├── httpClient.ts         # Axios instance
│       └── tokenService.ts       # Token management
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # Architecture details
│   ├── docker-compose.example.yml # Microservices example
│   └── Dockerfile.sales          # Module container example
│
├── docker-compose.yml            # Production Docker setup
├── docker-compose.dev.yml        # Development Docker setup
├── Dockerfile                    # Production Dockerfile
├── Makefile                      # Make commands
└── README.md                     # This file
```

## 🔧 Available Commands

### Development

```bash
# Local development
yarn dev              # Start dev server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint

# Docker development
make dev              # Start Docker dev server
make dev-d            # Start in background
make logs             # View logs

# Docker production
make prod             # Build and start
make prod-d           # Build and start in background
make build            # Build Docker image
make up               # Start containers
make down             # Stop containers
make restart          # Restart containers

# Utilities
make clean            # Clean Docker resources
make rebuild          # Rebuild from scratch
make shell            # Open shell in container
make status           # Show container status
make help             # Show all commands
```

## 🔐 Authentication & Authorization

### How It Works

1. **User logs in** → JWT tokens stored in localStorage
2. **Token decoded** → Extract user roles and info
3. **Module access calculated** → Based on roles + subscription
4. **Navigation generated** → Sidebar shows accessible modules only
5. **Routes protected** → RouteGuard checks every page access
6. **Components guarded** → ModuleGuard protects sensitive UI

### Example: Checking Permissions

```typescript
import { usePermissions } from '@/hooks/usePermissions';
import { ModuleKey } from '@/types/module.types';

function MyComponent() {
  const { isEnabled, checkModuleAccess } = usePermissions();

  // Simple check
  if (isEnabled(ModuleKey.SALES)) {
    return <SalesWidget />;
  }

  // Detailed check
  const access = checkModuleAccess(ModuleKey.USER_MANAGEMENT);
  if (!access.hasAccess) {
    console.log(access.reason); // Why access denied
  }

  return <div>Access Denied</div>;
}
```

### Example: Protected Route

```typescript
// src/app/my-module/page.tsx
import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { ModuleKey } from '@/types/module.types';

function MyModulePage() {
  return <div>Protected Content</div>;
}

export default withModuleAccess(MyModulePage, ModuleKey.MY_MODULE);
```

## 🎯 Adding a New Module

### 1. Define Module Key

Edit `src/types/module.types.ts`:

```typescript
export enum ModuleKey {
  // ... existing keys
  MY_NEW_MODULE = 'MY_NEW_MODULE',
}
```

### 2. Register Module

Edit `src/config/modules.config.tsx`:

```typescript
[ModuleKey.MY_NEW_MODULE]: {
  key: ModuleKey.MY_NEW_MODULE,
  name: 'My New Module',
  description: 'Description of my module',
  path: '/my-new-module',
  icon: <MyIcon />,
  requiredRoles: [UserRole.USER],
  requiredPlans: [SubscriptionPlan.BASIC],
  showInSidebar: true,
  sidebarOrder: 12,
  isEnabled: true,
}
```

### 3. Create Module Structure

```bash
mkdir -p src/modules/my-new-module/{pages,components,hooks,services,types}
mkdir -p src/app/my-new-module
```

### 4. Create Module Page

`src/modules/my-new-module/pages/MyNewModulePage.tsx`:

```typescript
'use client';

import { Card } from 'antd';

export default function MyNewModulePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My New Module</h1>
      <Card>
        <p>Module content here</p>
      </Card>
    </div>
  );
}
```

### 5. Create App Route

`src/app/my-new-module/page.tsx`:

```typescript
'use client';

import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import { ModuleKey } from '@/types/module.types';
import { withModuleAccess } from '@/components/guards/withModuleAccess';

const MyNewModulePage = dynamic(
  () => import('@/modules/my-new-module/pages/MyNewModulePage'),
  {
    loading: () => <Spin size="large" />,
    ssr: false,
  }
);

export default withModuleAccess(MyNewModulePage, ModuleKey.MY_NEW_MODULE);
```

`src/app/my-new-module/layout.tsx`:

```typescript
import AppLayout from '@/components/layout/AppLayout';

export default function MyNewModuleLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
```

### 6. Done!

The module will now:

- ✅ Appear in sidebar (if user has access)
- ✅ Be protected by route guard
- ✅ Check permissions automatically
- ✅ Lazy load on navigation

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build image
docker-compose build

# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Docker Permissions Fix

If you get permission denied errors:

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply changes (logout/login or run)
newgrp docker

# Verify
docker ps
```

### Environment Variables in Docker

Create `.env` file:

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
API_URL=http://your-api-server:port
```

Update `docker-compose.yml`:

```yaml
services:
  app:
    env_file:
      - .env
```

## 🔍 Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules
yarn install

# Rebuild Docker without cache
docker-compose build --no-cache
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "8080:3000"
```

### Module Not Showing in Sidebar

1. Check `isEnabled: true` in module config
2. Verify `showInSidebar: true`
3. Check user has required role and subscription plan
4. Review browser console for errors

### Docker Permission Denied

```bash
# Run with sudo
sudo docker-compose up

# Or add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - Detailed architecture documentation
- [Microservices Setup](docs/docker-compose.example.yml) - Multi-container example
- [Module Container Example](docs/Dockerfile.sales) - Separate module deployment

## 🧪 Testing

```bash
# Run tests (setup required)
yarn test

# Run tests in watch mode
yarn test:watch

# Run E2E tests
yarn test:e2e
```

## 📈 Performance

- **Lazy Loading:** All modules loaded on-demand
- **Code Splitting:** Separate bundles per module
- **Optimized Build:** Standalone output for Docker
- **Image Optimization:** Multi-stage Docker builds
- **Caching:** Efficient layer caching

## 🔒 Security

- ✅ JWT authentication
- ✅ Multi-layer route protection
- ✅ Role-based access control
- ✅ Subscription-based features
- ✅ No URL bypass
- ✅ Token refresh mechanism
- ✅ Secure HTTP client with interceptors

## 🚢 Deployment Options

### 1. Docker (Recommended)

```bash
docker-compose up -d
```

### 2. Vercel

```bash
vercel deploy
```

### 3. Custom Server

```bash
yarn build
yarn start
```

### 4. Kubernetes

See `docs/` for Kubernetes manifests (coming soon)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests and linting
4. Submit pull request

## 📝 License

[Your License]

## 👥 Team

[Your Team Information]

## 📞 Support

- Documentation: Check `docs/` folder
- Issues: Report on GitHub
- Email: [your-email]

---

**Built with ❤️ using Next.js, TypeScript, and Ant Design**
