import React from 'react';

interface ResetIconProps {
  width?: number;
  height?: number;
  stroke?: string;
}

export const ResetIcon: React.FC<ResetIconProps> = ({
  width = 13,
  height = 13,
  stroke = '#1D3557',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.55516 3.63366C2.24996 2.43453 3.35687 1.52876 4.66979 1.08502C5.98271 0.641273 7.41215 0.689793 8.69196 1.22154C9.97177 1.75329 11.0147 2.73203 11.6266 3.97552C12.2385 5.21901 12.3776 6.64249 12.0181 7.98092C11.6585 9.31935 10.8248 10.4815 9.67221 11.251C8.51958 12.0205 7.12659 12.3449 5.75259 12.1637C4.3786 11.9826 3.11725 11.3083 2.20342 10.2664C1.28959 9.22448 0.78555 7.88597 0.785156 6.50009"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.35714 3.64328H1.5V0.786133"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
