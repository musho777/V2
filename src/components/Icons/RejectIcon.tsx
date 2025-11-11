import React from 'react';

export interface RejectIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const RejectIcon: React.FC<RejectIconProps> = ({
  width = 71,
  height = 70,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 71 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse
        cx="35.5"
        cy="34.8426"
        rx="35.5"
        ry="34.8426"
        fill="url(#paint0_linear_11805_66890)"
        fillOpacity="0.8"
      />
      <path
        d="M47.0694 48.9992C46.3214 48.9992 45.5702 48.7125 44.9998 48.1421L22.8579 26.0002C21.714 24.8563 21.714 23.0018 22.8579 21.8579C24.0018 20.714 25.8563 20.714 27.0002 21.8579L49.1421 43.9998C50.286 45.1437 50.286 46.9982 49.1421 48.1421C48.5717 48.7125 47.8206 48.9992 47.0725 48.9992H47.0694Z"
        fill="white"
      />
      <path
        d="M24.9275 48.9992C24.1794 48.9992 23.4283 48.7125 22.8579 48.1421C21.714 46.9982 21.714 45.1437 22.8579 43.9998L44.9998 21.8579C46.1437 20.714 47.9982 20.714 49.1421 21.8579C50.286 23.0018 50.286 24.8563 49.1421 26.0002L38.0711 37.0711L27.0002 48.1421C26.4298 48.7125 25.6786 48.9992 24.9306 48.9992H24.9275Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_11805_66890"
          x1="-8.62815e-06"
          y1="34.8427"
          x2="71"
          y2="34.8427"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0AFFA6" />
          <stop offset="1" stopColor="#008E95" />
        </linearGradient>
      </defs>
    </svg>
  );
};
