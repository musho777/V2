import React from 'react';

import { Typography } from '@/components/Typography';

import styles from './styles.module.scss';

interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className,
}) => {
  if (!message) return null;

  return (
    <Typography
      variant="body2"
      as="div"
      className={`${styles.errorMessage} ${className || ''}`}
    >
      {message}
    </Typography>
  );
};
