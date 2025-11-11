import React from 'react';

import styles from './IconCircle.module.scss';

interface IconCircleProps {
  icon: React.ReactNode;
  active?: boolean;
  borderColor?: string;
  textColor?: string;
  bgColor?: string;
  badge?: number;
}

export const IconCircle: React.FC<IconCircleProps> = ({
  icon,
  active = false,
  borderColor = 'rgb(45, 108, 223,1)',
  bgColor,
  badge,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getBgColor = () => {
    if (!active && !isHovered) return 'transparent';
    if (bgColor) return bgColor;
    const rgbMatch = borderColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0.1)`;
    }
    return 'rgba(0, 123, 255, 0.1)';
  };

  const isActiveState = active || isHovered;

  const clonedIcon =
    React.isValidElement(icon) && isHovered
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
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
