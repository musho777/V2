import React from 'react';

interface PhysicalPersonIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const PhysicalPersonIcon: React.FC<PhysicalPersonIconProps> = ({
  width = 25,
  height = 25,
  color = '#9141DB',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_13474_30429)">
        <path
          d="M8.92857 10.7143C11.1476 10.7143 12.9464 8.91545 12.9464 6.69645C12.9464 4.47745 11.1476 2.67859 8.92857 2.67859C6.70957 2.67859 4.91071 4.47745 4.91071 6.69645C4.91071 8.91545 6.70957 10.7143 8.92857 10.7143Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9643 24.1071H0.89286V22.3214C0.89286 20.1902 1.73948 18.1462 3.24647 16.6393C4.75345 15.1323 6.79738 14.2857 8.92857 14.2857C11.0598 14.2857 13.1037 15.1323 14.6107 16.6393C16.1177 18.1462 16.9643 20.1902 16.9643 22.3214V24.1071Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.0714 2.67859C17.137 2.67859 18.1589 3.10189 18.9125 3.85539C19.6659 4.60889 20.0893 5.63084 20.0893 6.69645C20.0893 7.76205 19.6659 8.784 18.9125 9.5375C18.1589 10.291 17.137 10.7143 16.0714 10.7143"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.9287 14.6249C20.4498 15.2035 21.7595 16.2304 22.6841 17.5697C23.6089 18.9089 24.1052 20.4975 24.1073 22.1248V24.1069H21.4287"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_13474_30429">
          <rect width="25" height="25" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
