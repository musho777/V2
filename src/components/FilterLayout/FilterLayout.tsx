'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SearchIcon } from '@/components/Icons';

import { Button } from '../Button';
import { GridIcon } from '../Icons/GridIcon';
import { ListIcon } from '../Icons/ListIcon';
import { ResetIcon } from '../Icons/ResetIcon';
import { RolesIcon } from '../Icons/RolesIcon';
import { StatusIcon } from '../Icons/StatusIcon';
import { Select } from '../Select';

import styles from './styles.module.scss';

export interface FilterLayoutProps {
  width?: string | number;
  height?: string | number;
  margin?: string | number;
  searchSectionMargin?: string | number;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonLoading?: boolean;
  buttonIcon?: React.ReactNode;
  showSearch?: boolean;
  showFilters?: boolean;
  showTabs?: boolean;
  statusOptions?: Array<{ value: string; label: string }>;
  rolesOptions?: Array<{ value: string; label: string }>;
  occupationOptions?: Array<{ value: string; label: string }>;
  onReset?: () => void;
  activeTab?: 'grid' | 'list';
  onTabChange?: (tab: 'grid' | 'list') => void;
  searchFields?: React.ReactNode;
  onStatusDropdownOpen?: () => void;
  onRolesDropdownOpen?: () => void;
  onOccupationDropdownOpen?: () => void;
}

export const FilterLayout: React.FC<FilterLayoutProps> = ({
  width = '96%',
  height = 82,
  margin = '30px',
  leftContent,
  rightContent,
  showButton = true,
  buttonText = 'Action',
  onButtonClick,
  buttonLoading = false,
  buttonIcon,
  showSearch = false,
  showFilters = false,
  showTabs = false,
  statusOptions = [],
  rolesOptions = [],
  occupationOptions = [],
  onReset,
  activeTab = 'grid',
  onTabChange,
  searchFields,
  onStatusDropdownOpen,
  onRolesDropdownOpen,
  onOccupationDropdownOpen,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || undefined,
    role: searchParams.get('role') || undefined,
    occupation: searchParams.get('occupation') || undefined,
  });

  /** Update URL when filters change */
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.role) params.set('role', filters.role);
    if (filters.occupation) params.set('occupation', filters.occupation);
    router.replace('?' + params.toString());
  }, [filters, router]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const handleReset = () => {
    setFilters({ status: undefined, role: undefined, occupation: undefined });
    router.replace('?');
    onReset?.();
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    margin: typeof margin === 'number' ? `${margin}px` : margin,
  };

  const searchSectionStyle: React.CSSProperties = { width: '100%' };

  const containerStyleWithSearch: React.CSSProperties = {
    ...containerStyle,
    marginBottom: isSearchExpanded ? 0 : containerStyle.margin,
  };

  return (
    <>
      <div className={styles.filterLayout} style={containerStyleWithSearch}>
        <div className={styles.leftSection}>
          {leftContent ? (
            leftContent
          ) : (
            <>
              {showSearch && (
                <Button
                  buttonType="defaultWhite"
                  onClick={handleSearchClick}
                  icon={<SearchIcon />}
                  style={{
                    width: '86px',
                    height: '38px',
                    borderRadius: '10px',
                  }}
                >
                  Search
                </Button>
              )}

              {showFilters && (
                <>
                  <Select
                    placeholder="Status"
                    width={150}
                    options={statusOptions}
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    onOpenChange={(open) => open && onStatusDropdownOpen?.()}
                    icon={<StatusIcon />}
                    allowClear
                  />
                  {rolesOptions.length > 0 && (
                    <Select
                      placeholder="Roles"
                      width={150}
                      options={rolesOptions}
                      value={filters.role}
                      onChange={(value) => handleFilterChange('role', value)}
                      onOpenChange={(open) => open && onRolesDropdownOpen?.()}
                      icon={<RolesIcon />}
                      allowClear
                    />
                  )}
                  {occupationOptions.length > 0 && (
                    <Select
                      placeholder="Occupation"
                      width={150}
                      options={occupationOptions}
                      value={filters.occupation}
                      onChange={(value) =>
                        handleFilterChange('occupation', value)
                      }
                      onOpenChange={(open) =>
                        open && onOccupationDropdownOpen?.()
                      }
                      icon={<RolesIcon />}
                      allowClear
                    />
                  )}
                  <Button
                    buttonType="primary"
                    variant="link"
                    onClick={handleReset}
                    icon={<ResetIcon />}
                  >
                    Reset
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        <div className={styles.rightSection}>
          {showTabs && (
            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tab} ${
                  activeTab === 'grid' ? styles.active : ''
                }`}
                onClick={() => onTabChange?.('grid')}
              >
                <GridIcon />
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === 'list' ? styles.active : ''
                }`}
                onClick={() => onTabChange?.('list')}
              >
                <ListIcon />
              </button>
            </div>
          )}
          {rightContent}
          {showButton && (
            <Button
              buttonType="action"
              onClick={onButtonClick}
              loading={buttonLoading}
              icon={buttonIcon}
              style={{
                width: '144px',
                height: '38px',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
              }}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>

      {isSearchExpanded && (
        <div className={styles.searchSection} style={searchSectionStyle}>
          {searchFields}
        </div>
      )}
    </>
  );
};
