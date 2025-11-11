# Module Hierarchy - Navigation Structure

## ✅ Fixed Hierarchy

The module hierarchy is now properly configured with 3 levels of nesting.

## 📊 Sidebar Structure

```
Dashboard
│
User Management
│
Departments ▼
  └── Branches ▼
       └── Teams (Branch-specific)
│
Teams (Global - Standalone)
│
Projects
│
Project Management
│
Sales
│
Reports (Beta)
│
Archive
│
Settings
```

## 🗂️ Module Tree

### Level 1: Top-Level Modules

These appear directly in the sidebar:

- **Dashboard** (`/dashboard`)
- **User Management** (`/users`)
- **Departments** ▼ (`/departments`)
- **Teams** (`/teams`) - Global/Standalone
- **Projects** (`/projects`)
- **Project Management** (`/project-management`)
- **Sales** (`/sales`)
- **Reports** (`/reports`)
- **Archive** (`/archive`)
- **Settings** (`/settings`)

### Level 2: Departments → Branches

When you expand **Departments**:

```
Departments ▼
  └── Branches ▼ (/departments/branches)
```

### Level 3: Branches → Teams

When you expand **Branches**:

```
Departments ▼
  └── Branches ▼
       └── Teams (/departments/branches/teams)
```

## 🔑 Module Keys

```typescript
export enum ModuleKey {
  DASHBOARD = 'DASHBOARD',
  USER_MANAGEMENT = 'USER_MANAGEMENT',

  // Nested hierarchy
  DEPARTMENTS = 'DEPARTMENTS', // Level 1
  BRANCHES = 'BRANCHES', // Level 2 (parent: DEPARTMENTS)
  BRANCH_TEAMS = 'BRANCH_TEAMS', // Level 3 (parent: BRANCHES)

  TEAMS = 'TEAMS', // Level 1 (standalone)

  PROJECTS = 'PROJECTS',
  PROJECT_MANAGEMENT = 'PROJECT_MANAGEMENT',
  SALES = 'SALES',
  REPORTS = 'REPORTS',
  ARCHIVE = 'ARCHIVE',
  SETTINGS = 'SETTINGS',
}
```

## 🛣️ URL Paths

### Nested Structure

```
/departments                          → Departments module
/departments/branches                 → Branches module
/departments/branches/teams           → Branch Teams module
```

### Standalone

```
/teams                                → Global Teams module (separate from branch teams)
```

## 📝 Configuration Breakdown

### Departments (Level 1)

```typescript
[ModuleKey.DEPARTMENTS]: {
  key: ModuleKey.DEPARTMENTS,
  path: '/departments',
  childModules: [ModuleKey.BRANCHES],     // Has Branches as child
  showInSidebar: true,                     // Shows in sidebar
  isNested: false,                         // Top-level
}
```

### Branches (Level 2)

```typescript
[ModuleKey.BRANCHES]: {
  key: ModuleKey.BRANCHES,
  path: '/departments/branches',
  parentModule: ModuleKey.DEPARTMENTS,    // Parent: Departments
  childModules: [ModuleKey.BRANCH_TEAMS], // Has Branch Teams as child
  showInSidebar: false,                    // Nested under parent
  isNested: true,                          // Is nested
}
```

### Branch Teams (Level 3)

```typescript
[ModuleKey.BRANCH_TEAMS]: {
  key: ModuleKey.BRANCH_TEAMS,
  path: '/departments/branches/teams',
  parentModule: ModuleKey.BRANCHES,       // Parent: Branches
  showInSidebar: false,                    // Nested under parent
  isNested: true,                          // Is nested
}
```

### Global Teams (Level 1 - Separate)

```typescript
[ModuleKey.TEAMS]: {
  key: ModuleKey.TEAMS,
  path: '/teams',
  showInSidebar: true,                     // Shows in sidebar
  isNested: false,                         // Top-level
  // No parent, no children - standalone
}
```

## 🎯 How Navigation Works

### 1. Click "Departments"

- Expands to show "Branches"
- URL: `/departments`

### 2. Click "Branches" (under Departments)

- Expands to show "Teams"
- URL: `/departments/branches`

### 3. Click "Teams" (under Branches)

- Opens Branch Teams module
- URL: `/departments/branches/teams`

### 4. Click "Teams" (standalone in sidebar)

- Opens Global Teams module
- URL: `/teams`

## 🔐 Permissions

### Branch Teams (Nested)

```typescript
requiredRoles: [MANAGER, ADMIN, SUPER_ADMIN];
requiredPlans: [PROFESSIONAL, ENTERPRISE, CUSTOM];
```

More restrictive - only for managers of specific branches

### Global Teams (Standalone)

```typescript
requiredRoles: [USER, MANAGER, ADMIN, SUPER_ADMIN];
requiredPlans: [BASIC, PROFESSIONAL, ENTERPRISE, CUSTOM];
```

Less restrictive - accessible to regular users

## 📂 File Structure

```
src/
├── modules/
│   ├── departments/
│   │   └── pages/
│   │       └── DepartmentsPage.tsx
│   │
│   ├── branches/
│   │   └── pages/
│   │       ├── BranchesPage.tsx
│   │       └── BranchTeamsPage.tsx        ← Branch-specific teams
│   │
│   └── teams/
│       └── pages/
│           └── TeamsPage.tsx               ← Global teams
│
└── app/
    ├── departments/
    │   ├── page.tsx                        ← /departments
    │   ├── layout.tsx
    │   └── branches/
    │       ├── page.tsx                    ← /departments/branches
    │       ├── layout.tsx
    │       └── teams/
    │           ├── page.tsx                ← /departments/branches/teams
    │           └── layout.tsx
    │
    └── teams/
        ├── page.tsx                        ← /teams (global)
        └── layout.tsx
```

## 🧪 Testing the Hierarchy

### 1. Login as SUPER_ADMIN

- See all modules including nested ones

### 2. Navigate to Departments

- Click on "Departments" in sidebar
- Should expand to show "Branches"

### 3. Navigate to Branches

- Click on "Branches" (under Departments)
- Should expand to show "Teams"

### 4. Navigate to Branch Teams

- Click on "Teams" (under Branches)
- Should open Branch Teams page
- URL should be `/departments/branches/teams`

### 5. Navigate to Global Teams

- Click on "Teams" (standalone in sidebar)
- Should open Global Teams page
- URL should be `/teams`

## 🎨 Visual Representation

### Sidebar Menu (Collapsed)

```
📊 Dashboard
👤 User Management
🏢 Departments >
👥 Teams
📁 Projects
...
```

### Sidebar Menu (Departments Expanded)

```
📊 Dashboard
👤 User Management
🏢 Departments ∨
  🏛️ Branches >
👥 Teams
📁 Projects
...
```

### Sidebar Menu (Fully Expanded)

```
📊 Dashboard
👤 User Management
🏢 Departments ∨
  🏛️ Branches ∨
    👥 Teams
👥 Teams
📁 Projects
...
```

## ✅ Implementation Complete

- ✅ Module keys defined
- ✅ Hierarchy configured
- ✅ Routes created
- ✅ Pages implemented
- ✅ Permissions set
- ✅ Build successful
- ✅ Ready to use

## 🚀 Next Steps

1. **Run the app:**

   ```bash
   yarn dev
   ```

2. **Login with appropriate role:**
   - MANAGER or higher to see Branch Teams
   - Any role to see Global Teams

3. **Test navigation:**
   - Expand Departments → Branches → Teams
   - Click standalone Teams

4. **Verify permissions:**
   - Test with different roles
   - Verify access control works

---

**The hierarchy is now working with 3 levels of nesting!** 🎉
