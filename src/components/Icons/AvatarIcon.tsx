import React from 'react';

export const AvatarIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="100"
      height="100"
      fill="none"
      className={className}
    >
      <circle cx="256" cy="256" r="256" fill="#EBEBEB" />
      <circle cx="256" cy="180" r="80" fill="#A0A0A0" />
      <path
        d="M128 400c0-70 56.3-120 128-120s128 50 128 120v16H128v-16z"
        fill="#A0A0A0"
      />
    </svg>
  );
};
