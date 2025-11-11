'use client';

import React from 'react';

import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import { RejectIcon } from '../Icons/RejectIcon';
import { SuccessIcon } from '../Icons/SuccessIcon';
import type { ModalProps } from '../Modal';
import { Modal } from '../Modal';
import { Typography } from '../Typography';

import styles from './styles.module.scss';

export type MessageModalType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'reject';

export interface MessageModalProps extends Omit<ModalProps, 'children'> {
  type?: MessageModalType;
  iconTop?: React.ReactNode;
  message?: string;
  headText?: string;
}

const defaultIcons: Record<MessageModalType, React.ReactNode> = {
  success: <SuccessIcon />,
  warning: <WarningOutlined className={styles.iconWarning} />,
  error: <CloseCircleOutlined className={styles.iconError} />,
  info: <InfoCircleOutlined className={styles.iconInfo} />,
  reject: <RejectIcon />,
};

const defaultTitles: Record<MessageModalType, string> = {
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  info: 'Information',
  reject: 'Rejected',
};

export const MessageModal: React.FC<MessageModalProps> = ({
  type = 'info',
  iconTop,
  message,
  content,
  title,
  headText,
  showCloseButton = false,
  showSubmitButton = true,
  ...props
}) => {
  const icon = iconTop !== undefined ? iconTop : defaultIcons[type];
  const modalTitle = title !== undefined ? title : defaultTitles[type];

  return (
    <Modal
      {...props}
      title={null}
      className={`${styles.messageModal} ${styles[type]}`}
      showCloseButton={showCloseButton}
      showSubmitButton={showSubmitButton}
    >
      <div className={styles.messageContent}>
        {icon && <div className={styles.iconContainer}>{icon}</div>}
        <Typography variant="heading3" as="div" className={styles.modalTitle}>
          {modalTitle}
        </Typography>
        {headText && (
          <Typography variant="body2" as="div" className={styles.headText}>
            {headText}
          </Typography>
        )}
        <Typography variant="body2" as="div" className={styles.message}>
          {message || content}
        </Typography>
      </div>
    </Modal>
  );
};
