import React from 'react';

interface ClockIconProps {
  className?: string;
}

export const ClockIcon: React.FC<ClockIconProps> = ({ className }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 3C8.55228 3 9 3.44772 9 4V7.58579L11.2071 9.79289C11.5976 10.1834 11.5976 10.8166 11.2071 11.2071C10.8166 11.5976 10.1834 11.5976 9.79289 11.2071L7.29289 8.70711C7.10536 8.51957 7 8.26522 7 8V4C7 3.44772 7.44772 3 8 3Z"
        fill="currentColor"
      />
    </svg>
  );
};
