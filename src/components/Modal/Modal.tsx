'use client';

import React from 'react';

import type { ModalProps as AntModalProps } from 'antd';
import { Modal as AntModal } from 'antd';

import { Button } from '../Button';

import styles from './styles.module.scss';

export interface ModalProps extends Omit<AntModalProps, 'footer' | 'width'> {
  className?: string;
  submitButtonText?: string;
  closeButtonText?: string;
  onSubmit?: () => void;
  showFooter?: boolean;
  showSubmitButton?: boolean;
  showCloseButton?: boolean;
  submitButtonDisabled?: boolean;
  content?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  loading?: boolean;
  submitButtonWidth?: number | string;
  closeButtonWidth?: number | string;
  submitButtonHeight?: number | string;
  closeButtonHeight?: number | string;
  closeButtonClassName?: string;
  submitButtonClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  className,
  submitButtonText = 'Submit',
  closeButtonText = 'Close',
  onSubmit,
  onCancel,
  showFooter = true,
  showSubmitButton = true,
  showCloseButton = true,
  submitButtonDisabled = false,
  content,
  children,
  width = 474,
  height,
  submitButtonWidth,
  closeButtonWidth,
  submitButtonHeight,
  closeButtonHeight,
  closeButtonClassName,
  submitButtonClassName,
  loading = false,
  ...props
}) => {
  const footerButtons = [];

  if (showCloseButton) {
    footerButtons.push(
      <Button
        key="close"
        variant="outlined"
        onClick={onCancel}
        className={`${styles.footerButton} ${closeButtonClassName || ''}`}
        width={closeButtonWidth}
        height={closeButtonHeight}
      >
        {closeButtonText}
      </Button>,
    );
  }

  if (showSubmitButton) {
    footerButtons.push(
      <Button
        key="submit"
        buttonType="action"
        onClick={onSubmit}
        className={`${styles.footerButton} ${submitButtonClassName || ''}`}
        disabled={submitButtonDisabled}
        loading={loading}
        width={submitButtonWidth}
        height={submitButtonHeight}
      >
        {submitButtonText}
      </Button>,
    );
  }

  const footer = showFooter ? footerButtons : null;

  const modalStyle = height ? { height } : undefined;

  return (
    <AntModal
      className={`${styles.modal} ${className || ''}`}
      footer={footer}
      onCancel={onCancel}
      width={width}
      style={modalStyle}
      centered={true}
      {...props}
    >
      <div className={styles.content}>{content || children}</div>
    </AntModal>
  );
};
