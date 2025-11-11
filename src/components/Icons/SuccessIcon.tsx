import React from 'react';

export interface SuccessIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const SuccessIcon: React.FC<SuccessIconProps> = ({
  width = 104,
  height = 102,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 104 102"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse
        cx="51.9623"
        cy="51"
        rx="51.9623"
        ry="51"
        fill="url(#paint0_linear_2_6274)"
        fillOpacity="0.8"
      />
      <path
        d="M44.1724 76.5852C44.2264 76.5475 47.3164 74.2411 47.3687 74.1993C47.686 73.9786 47.9744 73.6872 48.215 73.3247L78.377 27.8921C79.0929 26.4735 77.5435 25.6845 77.5646 25.7026C76.8004 25.3171 75.6542 25.7026 75.6542 25.7026C75.5993 25.7386 75.7058 25.6591 75.6542 25.7026C75.5993 25.7386 73.2022 27.8921 73.2022 27.8921L72.6536 28.4905L45.2113 57.3661L30.2436 48.8008C29.6564 48.4646 28.4446 48.9743 28.4446 48.9743C26.0263 49.9586 26.0263 51.5022 26.0263 51.5022C25.8902 51.5918 26.1389 52.5265 26.026 52.6599L44.1724 76.5852Z"
        fill="#BEBEBE"
      />
      <path
        d="M26.3603 53.2129L41.7853 75.6267C43.0525 77.4678 45.4888 77.4295 46.7116 75.549L77.2655 28.5605C77.816 27.7141 77.6805 26.5162 76.9601 25.8604C76.2978 25.2577 75.3512 25.3089 74.7409 25.9807L44.3526 59.4433L28.5066 50.185C27.8237 49.7861 26.9942 49.9495 26.4652 50.5875C25.8664 51.3098 25.8217 52.4303 26.3603 53.2129Z"
        fill="#FFFBFB"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2_6274"
          x1="-1.26292e-05"
          y1="51.0002"
          x2="103.925"
          y2="51.0002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0AFFA6" />
          <stop offset="1" stopColor="#008E95" />
        </linearGradient>
      </defs>
    </svg>
  );
};
