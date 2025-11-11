import React from 'react';

interface IndividualEntrepreneurIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const IndividualEntrepreneurIcon: React.FC<
  IndividualEntrepreneurIconProps
> = ({ width = 28, height = 28, color = '#2D6CDF' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_13474_30450)">
        <path
          d="M14.0001 15.9999C16.7615 15.9999 19.0001 13.7614 19.0001 10.9999C19.0001 8.23852 16.7615 5.99994 14.0001 5.99994C11.2386 5.99994 9.00006 8.23852 9.00006 10.9999C9.00006 13.7614 11.2386 15.9999 14.0001 15.9999Z"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.45984 23.8C6.35232 22.335 7.60665 21.1242 9.10225 20.2841C10.5979 19.444 12.2844 19.0027 13.9998 19.0027C15.7153 19.0027 17.4018 19.444 18.8974 20.2841C20.393 21.1242 21.6474 22.335 22.5398 23.8"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.9999 27C21.1796 27 26.9999 21.1797 26.9999 14C26.9999 6.8203 21.1796 1 13.9999 1C6.82024 1 0.999939 6.8203 0.999939 14C0.999939 21.1797 6.82024 27 13.9999 27Z"
          stroke={color}
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_13474_30450">
          <rect width="28" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
