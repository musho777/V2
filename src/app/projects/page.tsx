'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { Spin } from 'antd';

import { Button } from '@/components/Button';
import { withModuleAccess } from '@/components/guards/withModuleAccess';
import { PageTabs } from '@/components/PageTabs';
import { useAuth } from '@/hooks/useAuth';
import { useProjectSearchParams } from '@/modules/project/projects/hooks/useSearch';
import { useSubProjectSearchParams } from '@/modules/project/sub-projects/hooks/useSearch';
import { ModuleKey } from '@/types/module.types';

const ProjectsContent = dynamic(
  () => import('@/modules/project/projects/pages/ProjectsPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spin size="large" />
      </div>
    ),
    ssr: false,
  },
);

const SubProjectsContent = dynamic(
  () => import('@/modules/project/sub-projects/pages/SubProjectsPage'),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spin size="large" />
      </div>
    ),
    ssr: false,
  },
);

function ProjectsPage() {
  const router = useRouter();
  const { hasRole } = useAuth();
  const { resetSearchData: resetProjectSearch } = useProjectSearchParams();
  const { resetSearchData: resetSubProjectSearch } =
    useSubProjectSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('projects-active-tab') || 'projects';
    }
    return 'projects';
  });

  useEffect(() => {
    localStorage.setItem('projects-active-tab', activeTab);
  }, [activeTab]);

  const handleAssignClick = () => {
    if (activeTab === 'projects') {
      router.push('/projects/projects-assign');
    } else {
      router.push('/projects/subprojects-assign');
    }
  };

  const tabs = [
    {
      key: 'projects',
      label: 'Projects',
      children: <ProjectsContent />,
    },
    {
      key: 'subprojects',
      label: 'Subprojects',
      children: <SubProjectsContent />,
    },
  ];

  const handleTabChange = (key: string) => {
    if (key === 'projects' && activeTab === 'subprojects') {
      resetProjectSearch();
    } else if (key === 'subprojects' && activeTab === 'projects') {
      resetSubProjectSearch();
    }
    setActiveTab(key);
  };

  return (
    <PageTabs
      tabs={tabs}
      activeKey={activeTab}
      onChange={handleTabChange}
      tabBarExtraContent={
        hasRole('GENERAL_MANAGER') ? (
          <Button onClick={handleAssignClick}>
            {activeTab === 'projects'
              ? 'Assign subproject to project'
              : 'Assign team to subproject'}
          </Button>
        ) : undefined
      }
    />
  );
}

export default withModuleAccess(ProjectsPage, ModuleKey.PROJECTS);
