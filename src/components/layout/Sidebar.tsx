import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Badge, Drawer, Layout, Menu, theme } from 'antd';

import { Logo } from '@/components/Icons/Logo';
import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { useModules } from '@/contexts/ModuleContext';
import { useAuth } from '@/hooks/useAuth';
import type { NavigationItem } from '@/types/module.types';

import { CollapseLogo } from '../Icons/CollapseLogo';

import styles from './styles.module.scss';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1440;
    }
    return false;
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { navigationItems } = useModules();
  // const breadcrumbs = useBreadcrumbs();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1440);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const findParentKey = (items: NavigationItem[]): string | null => {
    for (const item of items) {
      if (item.children) {
        const childPaths = item.children.map((child) => child.path);
        if (childPaths.includes(pathname)) {
          return item.key;
        }
      }
    }
    return null;
  };

  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const parentKey = findParentKey(navigationItems);
    return parentKey ? [parentKey] : [];
  });
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const convertToMenuItem = (
    item: NavigationItem,
    isChild: boolean = false,
  ): MenuItem => {
    const label = item.badge ? (
      <div>
        {item.label}
        {!collapsed && <Badge count={item.badge} offset={[10, 0]} />}
      </div>
    ) : (
      item.label
    );
    const icon = isChild ? (
      collapsed ? null : (
        <img
          src="/submenu-indicator.svg"
          alt=""
          className={styles.submenuIndicator}
        />
      )
    ) : (
      item.icon
    );

    return {
      key: item.key,
      icon: icon,
      label,
      disabled: item.isDisabled,
      children: item.children?.map((child) => convertToMenuItem(child, true)),
    } as MenuItem;
  };

  const menuItems = useMemo(() => {
    return navigationItems.map((item) => convertToMenuItem(item));
  }, [navigationItems, collapsed]);

  const selectedKeys = useMemo(() => {
    // Find the navigation item by path
    const findItemByPath = (
      items: NavigationItem[],
      path: string,
    ): NavigationItem | null => {
      for (const item of items) {
        if (item.path === path) return item;
        if (item.children) {
          const found = findItemByPath(item.children, path);
          if (found) return found;
        }
      }
      return null;
    };

    // Special case for team-assign
    const searchPath = pathname === '/teams/team-assign' ? '/teams' : pathname;
    const item = findItemByPath(navigationItems, searchPath);

    return item ? [item.key] : [];
  }, [pathname, navigationItems]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    // Find the navigation item by key to get the correct path
    const findItemByKey = (
      items: NavigationItem[],
      key: string,
    ): NavigationItem | null => {
      for (const item of items) {
        if (item.key === key) return item;
        if (item.children) {
          const found = findItemByKey(item.children, key);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItemByKey(navigationItems, e.key);
    if (item) {
      router.push(item.path);
    }

    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleLogout = () => {
    void logout()
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  const sidebarContent = (isDrawer: boolean = false) => (
    <>
      <div className={styles.logoContainer}>
        <div className={styles.drawerHeader}>
          {!collapsed || isDrawer ? (
            <div className={styles.logoWrapper}>
              <Logo />
            </div>
          ) : (
            <div className={styles.collapseLogoWrapper}>
              <CollapseLogo />
            </div>
          )}
          {isDrawer && (
            <CloseOutlined
              className={styles.closeIcon}
              onClick={() => setDrawerOpen(false)}
            />
          )}
        </div>
      </div>
      <Menu
        theme="dark"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        mode="inline"
        inlineCollapsed={isDrawer ? false : collapsed}
        items={menuItems}
        onClick={handleMenuClick}
        className={`${styles.menu} custom-menu`}
      />
    </>
  );

  return (
    <Layout className={styles.layout}>
      {!isMobile ? (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={250}
          className={styles.sider}
        >
          {sidebarContent(false)}
        </Sider>
      ) : (
        <Drawer
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={250}
          className={styles.drawer}
          styles={{
            body: { padding: 0, background: 'rgb(29, 53, 87)' },
            header: { display: 'none' },
          }}
          closable={false}
        >
          {sidebarContent(true)}
        </Drawer>
      )}
      <Layout className={styles.contentLayout}>
        <Header
          className={styles.header}
          style={{ background: colorBgContainer }}
        >
          {isMobile && (
            <MenuOutlined
              className={styles.burgerMenu}
              onClick={() => setDrawerOpen(true)}
            />
          )}
          <div className={styles.headerRight}>
            <UserAvatar
              firstName={user?.firstName}
              lastName={user?.lastName}
              avatarUrl={user?.avatar}
              userId={user?.id}
              onLogout={handleLogout}
            />
          </div>
        </Header>
        <Content className={styles.content}>
          <div className={styles.contentInner}>
            <div
              className={styles.contentBox}
              style={{
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
