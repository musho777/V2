import React from 'react';

interface EyeOpenIconProps {
  className?: string;
}

export const EyeOpenIcon: React.FC<EyeOpenIconProps> = ({ className }) => {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.5 7C12.5 7.66304 12.2366 8.29893 11.7678 8.76777C11.2989 9.23661 10.663 9.5 10 9.5C9.33696 9.5 8.70107 9.23661 8.23223 8.76777C7.76339 8.29893 7.5 7.66304 7.5 7C7.5 6.33696 7.76339 5.70107 8.23223 5.23223C8.70107 4.76339 9.33696 4.5 10 4.5C10.663 4.5 11.2989 4.76339 11.7678 5.23223C12.2366 5.70107 12.5 6.33696 12.5 7Z"
        stroke="#6C757D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.66699 6.99984C3.00033 3.58567 6.11366 1.1665 10.0003 1.1665C13.887 1.1665 17.0003 3.58567 18.3337 6.99984C17.0003 10.414 13.887 12.8332 10.0003 12.8332C6.11366 12.8332 3.00033 10.414 1.66699 6.99984Z"
        stroke="#6C757D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
