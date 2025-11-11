'use client';

import React from 'react';
import Image from 'next/image';

import styles from './AuthLayout.module.scss';

interface AuthLayoutProps {
  children: React.ReactNode;
  leftContent?: React.ReactNode;
  authBottomText?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  authBottomText,
}) => {
  const renderBottomText = () => {
    if (!authBottomText) return null;

    const termsText = 'Terms of use & Privacy Policy.';
    const parts = authBottomText.split(termsText);

    if (parts.length === 2) {
      return (
        <p className={styles.authBottomText}>
          {parts[0]}
          <span className={styles.termsHighlight}>{termsText}</span>
          {parts[1]}
        </p>
      );
    }

    return <p className={styles.authBottomText}>{authBottomText}</p>;
  };

  return (
    <div className={styles.authLayout}>
      {/* Left Section - 40% width */}
      <div className={styles.leftSection}>
        <div className={styles.imageContainer}>
          <Image
            src="/crmauth.svg"
            alt="CRM Authentication"
            fill
            priority
            className={styles.authImage}
          />
        </div>
      </div>

      {/* Right Section - 60% width */}
      <div className={styles.rightSection}>
        <div className={styles.formContainer}>{children}</div>
        {renderBottomText()}
      </div>
    </div>
  );
};
