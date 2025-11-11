import React from 'react';

export interface CheckboxIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const CheckboxIcon: React.FC<CheckboxIconProps> = ({
  width = 7,
  height = 7,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 7 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.3125 1.15625L2.375 5.84375L0.6875 3.96875"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
