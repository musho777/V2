'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface DropdownItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger?: React.ReactNode;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger,
  placement = 'bottomRight',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick?.();
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div
        className={styles.trigger}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div className={`${styles.menu} ${styles[placement]}`}>
          {items.map((item) => (
            <div
              key={item.key}
              className={`${styles.menuItem} ${
                item.danger ? styles.danger : ''
              } ${item.disabled ? styles.disabled : ''}`}
              onClick={() => handleItemClick(item)}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <Typography variant="body2" as="span" className={styles.label}>
                {item.label}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
