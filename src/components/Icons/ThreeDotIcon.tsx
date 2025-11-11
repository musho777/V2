import React from 'react';

interface ThreeDotIconProps {
  width?: number;
  height?: number;
  fill?: string;
}

export const ThreeDotIcon: React.FC<ThreeDotIconProps> = ({
  width = 17,
  height = 3,
  fill = '#6C757D',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="1.70003" cy="1.5" rx="1.70003" ry="1.5" fill={fill} />
      <ellipse cx="8.50081" cy="1.5" rx="1.70003" ry="1.5" fill={fill} />
      <ellipse cx="15.2996" cy="1.5" rx="1.70003" ry="1.5" fill={fill} />
    </svg>
  );
};
