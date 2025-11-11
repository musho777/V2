'use client';

import { useState } from 'react';

import { Col, Row } from 'antd';

import { ProjectCard } from '../components/ProjectCard/ProjectCard';
import { ProjectHeader } from '../components/ProjectHeader/ProjectHeader';
import type { Project } from '../types/project.types';

import styles from './styles.module.scss';

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    owner: 'Sarah Johnson',
    color: '#3b82f6',
    ticketsCount: 24,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    owner: 'Michael Chen',
    color: '#8b5cf6',
    ticketsCount: 18,
  },
  {
    id: '3',
    name: 'Database Migration',
    owner: 'Emily Davis',
    color: '#10b981',
    ticketsCount: 12,
  },
  {
    id: '4',
    name: 'API Integration',
    owner: 'James Wilson',
    color: '#f59e0b',
    ticketsCount: 31,
  },
  {
    id: '5',
    name: 'Security Audit',
    owner: 'Lisa Anderson',
    color: '#ef4444',
    ticketsCount: 8,
  },
  {
    id: '6',
    name: 'Performance Optimization',
    owner: 'David Martinez',
    color: '#06b6d4',
    ticketsCount: 15,
  },
  {
    id: '7',
    name: 'User Analytics Dashboard',
    owner: 'Jennifer Taylor',
    color: '#ec4899',
    ticketsCount: 22,
  },
  {
    id: '8',
    name: 'CI/CD Pipeline',
    owner: 'Robert Brown',
    color: '#14b8a6',
    ticketsCount: 9,
  },
];

export default function ProjectManagementPage() {
  const [searchValue, setSearchValue] = useState('');

  const handleAllTicketsClick = () => {
    // eslint-disable-next-line no-console
    console.log('Navigate to all tickets');
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const allTicketsCount = mockProjects.reduce(
    (sum, project) => sum + project.ticketsCount,
    0,
  );

  const filteredProjects = mockProjects.filter((project) =>
    project.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      <ProjectHeader
        allTicketsCount={allTicketsCount}
        onAllTicketsClick={handleAllTicketsClick}
        onSearchChange={handleSearchChange}
      />
      <Row gutter={[24, 24]}>
        {filteredProjects.map((project) => (
          <Col key={project.id} xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
            <ProjectCard
              name={project.name}
              owner={project.owner}
              color={project.color}
              ticketsCount={project.ticketsCount}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
