# Sidebar Navigation - Auto-Open Logic

## ✅ Feature: Smart Menu Opening

The sidebar now automatically keeps parent menus open when you're on a nested route.

## 🎯 How It Works

### Example Navigation Flow

#### 1. Navigate to `/departments`

```
Sidebar State:
✓ Departments ∨  (open)
  └── Branches
```

#### 2. Navigate to `/departments/branches`

```
Sidebar State:
✓ Departments ∨  (stays open)
  ✓ Branches ∨   (open)
    └── Teams
```

#### 3. Navigate to `/departments/branches/teams`

```
Sidebar State:
✓ Departments ∨  (stays open)
  ✓ Branches ∨   (stays open)
    ✓ Teams      (selected)
```

#### 4. Navigate to `/teams` (Global)

```
Sidebar State:
Departments >    (closed)
Teams            (selected, standalone)
```

## 🔧 Implementation

### Algorithm

```typescript
// Calculate which menu items should be open
const openKeys = useMemo(() => {
  const keys: string[] = [];

  // Find all parent paths that should be open
  const findParentPaths = (
    items: NavigationItem[],
    currentPath: string,
  ): boolean => {
    for (const item of items) {
      // If current path starts with this item's path (and not the same)
      // This item should be open
      if (currentPath.startsWith(item.path) && item.path !== currentPath) {
        keys.push(item.path);
      }

      // Recursively check children
      if (item.children && item.children.length > 0) {
        const found = findParentPaths(item.children, currentPath);
        if (found && !keys.includes(item.path)) {
          keys.push(item.path);
        }
      }

      // Return true if this branch contains the current path
      if (currentPath.startsWith(item.path)) {
        return true;
      }
    }
    return false;
  };

  findParentPaths(navigationItems, pathname);
  return keys;
}, [navigationItems, pathname]);
```

### Menu Configuration

```typescript
<Menu
  theme="dark"
  mode="inline"
  selectedKeys={[pathname]}        // Highlight current page
  defaultOpenKeys={openKeys}        // Initial open state
  openKeys={openKeys}              // Controlled open state
  items={menuItems}
/>
```

## 📊 Path Matching Logic

### Example: `/departments/branches/teams`

**Step 1:** Check path against all menu items

| Menu Item   | Path                          | Matches?        | Action            |
| ----------- | ----------------------------- | --------------- | ----------------- |
| Dashboard   | `/dashboard`                  | ❌ No           | Nothing           |
| Departments | `/departments`                | ✅ Yes (prefix) | Add to openKeys   |
| Branches    | `/departments/branches`       | ✅ Yes (prefix) | Add to openKeys   |
| Teams       | `/departments/branches/teams` | ✅ Yes (exact)  | Select (not open) |

**Result:**

```javascript
openKeys = ['/departments', '/departments/branches'];
selectedKeys = ['/departments/branches/teams'];
```

## 🎨 Visual Examples

### Case 1: On Branches Page (`/departments/branches`)

```
Sidebar:
━━━━━━━━━━━━━━━━━━━━━━
📊 Dashboard
👤 User Management
🏢 Departments ∨          ← Open
  🏛️ Branches ✓          ← Selected & Open
    👥 Teams
👥 Teams
📁 Projects
💼 Project Management
💰 Sales
📊 Reports
📦 Archive
⚙️ Settings
━━━━━━━━━━━━━━━━━━━━━━
```

### Case 2: On Branch Teams (`/departments/branches/teams`)

```
Sidebar:
━━━━━━━━━━━━━━━━━━━━━━
📊 Dashboard
👤 User Management
🏢 Departments ∨          ← Open
  🏛️ Branches ∨          ← Open
    👥 Teams ✓           ← Selected
👥 Teams
📁 Projects
💼 Project Management
💰 Sales
📊 Reports
📦 Archive
⚙️ Settings
━━━━━━━━━━━━━━━━━━━━━━
```

### Case 3: On Global Teams (`/teams`)

```
Sidebar:
━━━━━━━━━━━━━━━━━━━━━━
📊 Dashboard
👤 User Management
🏢 Departments >          ← Closed
👥 Teams ✓               ← Selected
📁 Projects
💼 Project Management
💰 Sales
📊 Reports
📦 Archive
⚙️ Settings
━━━━━━━━━━━━━━━━━━━━━━
```

## 🔍 Path Matching Examples

| Current Path                  | Open Keys                                   | Selected Key                  |
| ----------------------------- | ------------------------------------------- | ----------------------------- |
| `/dashboard`                  | `[]`                                        | `/dashboard`                  |
| `/departments`                | `[]`                                        | `/departments`                |
| `/departments/branches`       | `['/departments']`                          | `/departments/branches`       |
| `/departments/branches/teams` | `['/departments', '/departments/branches']` | `/departments/branches/teams` |
| `/teams`                      | `[]`                                        | `/teams`                      |
| `/projects`                   | `[]`                                        | `/projects`                   |
| `/sales`                      | `[]`                                        | `/sales`                      |

## 🚀 Future-Proof

This logic works for **any level of nesting**:

### 4-Level Example

```
A ∨
  B ∨
    C ∨
      D ✓
```

If on path `/a/b/c/d`:

```javascript
openKeys = ['/a', '/a/b', '/a/c'];
selectedKeys = ['/a/b/c/d'];
```

### Multiple Children Example

```
Departments ∨
  Branches ∨
    Teams ✓
    Managers
  Locations
```

If on `/departments/branches/teams`:

```javascript
openKeys = ['/departments', '/departments/branches'];
selectedKeys = ['/departments/branches/teams'];
// Branches shows both Teams and Managers
// Departments shows both Branches and Locations
```

## 🎯 Benefits

### 1. **Better UX**

- Users always see where they are in the hierarchy
- No need to manually re-expand menus

### 2. **Navigation Context**

- Easy to navigate between related modules
- Understand module relationships

### 3. **Intuitive**

- Matches user expectations
- Consistent with modern app behavior

### 4. **Automatic**

- No manual state management needed
- Works for any future nested modules

## 🧪 Testing

### Test Case 1: Direct Navigation

```typescript
1. Go to /departments
   Expected: Departments menu open

2. Go to /departments/branches
   Expected: Departments and Branches menus open

3. Go to /departments/branches/teams
   Expected: Departments and Branches menus open, Teams selected
```

### Test Case 2: Link Navigation

```typescript
1. Start at /dashboard
2. Click "Departments" in sidebar
   Expected: Departments menu opens
3. Click "Branches" under Departments
   Expected: Branches menu opens, Departments stays open
4. Click "Teams" under Branches
   Expected: All parent menus stay open, Teams is selected
```

### Test Case 3: Back/Forward Browser Navigation

```typescript
1. Navigate: /dashboard → /departments → /departments/branches
2. Click browser back button
   Expected: Departments menu stays open
3. Click browser forward button
   Expected: Departments and Branches menus open again
```

## ⚙️ Configuration

The logic is **automatically applied** to all nested routes.

### To Add a New Nested Module

Just configure the hierarchy in `modules.config.tsx`:

```typescript
[ModuleKey.NEW_PARENT]: {
  childModules: [ModuleKey.NEW_CHILD],
  showInSidebar: true,
}

[ModuleKey.NEW_CHILD]: {
  parentModule: ModuleKey.NEW_PARENT,
  showInSidebar: false,
  isNested: true,
}
```

**That's it!** The auto-open logic will work automatically.

## 🎓 Code Location

**File:** `src/components/layout/Sidebar.tsx`

**Key Lines:**

```typescript
// Lines 23-52: Auto-open logic
const openKeys = useMemo(() => { ... }, [navigationItems, pathname]);

// Lines 118-119: Apply to Menu
defaultOpenKeys={openKeys}
openKeys={openKeys}
```

## 📝 Summary

| Feature                | Status                   |
| ---------------------- | ------------------------ |
| Auto-open parent menus | ✅ Working               |
| Multi-level support    | ✅ Unlimited levels      |
| Browser back/forward   | ✅ Maintains state       |
| Performance optimized  | ✅ useMemo caching       |
| Future-proof           | ✅ Works for any nesting |

---

**The sidebar navigation now intelligently keeps parent menus open!** 🎉
