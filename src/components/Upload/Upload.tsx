'use client';

import React from 'react';

import type { UploadProps as AntUploadProps } from 'antd';
import { Upload as AntUpload } from 'antd';

import { FileUploadIcon } from '@/components/Icons';
import { Typography } from '@/components/Typography';

import './upload-global.css';
import styles from './styles.module.scss';

const { Dragger: AntDragger } = AntUpload;

export interface UploadComponentProps extends AntUploadProps {
  className?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
  title?: string;
  contentText?: string;
}

const UploadComponent: React.FC<UploadComponentProps> = ({
  className,
  label,
  children,
  ...props
}) => {
  return (
    <div className={styles.uploadWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntUpload className={`${styles.upload} ${className || ''}`} {...props}>
        {children}
      </AntUpload>
    </div>
  );
};

const Dragger: React.FC<UploadComponentProps> = ({
  className,
  label,
  width = 391,
  height = 164,
  title = 'Click or drag file to this area to upload',
  contentText = 'Support for a single or bulk upload.',
  children,
  ...props
}) => {
  const draggerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={styles.uploadWrapper}>
      {label && (
        <Typography variant="label" as="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <AntDragger
        className={`${styles.upload} ${styles.dragger} ${className || ''}`}
        style={draggerStyle}
        {...props}
      >
        {children || (
          <>
            <Typography variant="body2" as="p" className={styles.uploadIcon}>
              <FileUploadIcon />
            </Typography>
            <Typography variant="body2" as="p" className={styles.uploadTitle}>
              {title}
            </Typography>
            <Typography variant="body4" as="p" className={styles.uploadContent}>
              {contentText}
            </Typography>
          </>
        )}
      </AntDragger>
    </div>
  );
};

export const Upload = Object.assign(UploadComponent, {
  Dragger,
});
