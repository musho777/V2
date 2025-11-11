import React from 'react';

import styles from './IconCircle.module.scss';

interface IconCircleProps {
  icon: React.ReactNode;
  active?: boolean;
  borderColor?: string;
  textColor?: string;
  bgColor?: string;
  badge?: number;
  onClick?: () => void;
}

export const IconCircle: React.FC<IconCircleProps> = ({
  icon,
  active = false,
  borderColor = 'rgb(45, 108, 223,1)',
  bgColor,
  badge,
  onClick,
}) => {
  const getBgColor = () => {
    if (!active) return 'transparent';
    if (bgColor) return bgColor;
    const rgbMatch = borderColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0.1)`;
    }
    return 'rgba(0, 123, 255, 0.1)';
  };

  const isActiveState = active;

  const clonedIcon =
    React.isValidElement(icon) && isActiveState
      ? React.cloneElement(icon as React.ReactElement<{ active?: boolean }>, {
          active: true,
        })
      : icon;

  return (
    <div className={styles.container}>
      <div
        className={styles.iconCircle}
        style={{
          borderColor: isActiveState ? borderColor : 'rgb(212, 216, 221)',
          backgroundColor: getBgColor(),
          color: isActiveState ? borderColor : 'rgb(33, 37, 41)',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        {clonedIcon}
      </div>
      {badge !== undefined && badge > 0 && (
        <div
          className={`${styles.badge} ${styles.floatAnimation}`}
          style={{ backgroundColor: borderColor }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};
