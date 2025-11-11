import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  profile: 'Profile',
  departments: 'Departments',
  branches: 'Branches',
  teams: 'Teams',
  projects: 'Projects',
  'sub-projects': 'Sub Projects',
  settings: 'Settings',
  schedules: 'Schedules',
  archive: 'Archive',
  sales: 'Sales',
  reports: 'Reports',
  'project-management': 'Project Management',
};

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const pathname = usePathname();

  return useMemo(() => {
    if (!pathname || pathname === '/') {
      return [{ title: 'Home' }];
    }

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = '';

    segments.forEach((segment, index) => {
      // Skip dynamic route segments like [id]
      if (segment.startsWith('[') && segment.endsWith(']')) {
        return;
      }

      // Skip numeric IDs
      if (/^\d+$/.test(segment)) {
        return;
      }

      currentPath += `/${segment}`;

      // Get label from routeLabels or format the segment
      const label =
        routeLabels[segment] ||
        segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

      // Only add href if it's not the last item
      breadcrumbs.push({
        title: label,
        href: index < segments.length - 1 ? currentPath : undefined,
      });
    });

    return breadcrumbs.length > 0 ? breadcrumbs : [{ title: 'Home' }];
  }, [pathname]);
};
