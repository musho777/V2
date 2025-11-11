'use client';

import React, { useState } from 'react';

import { FileIcon } from '../Icons/FileIcon';
import { Modal } from '../Modal';
import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface FileAttachmentProps {
  fileName: string;
  fileSize: number;
  fileUrl: string;
  className?: string;
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

const isImageFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName);
  return IMAGE_EXTENSIONS.includes(extension);
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) {
    // Less than 1MB, show in KB
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    // 1MB or more, show in MB
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};

export const FileAttachment: React.FC<FileAttachmentProps> = ({
  fileName,
  fileSize,
  fileUrl,
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (isImageFile(fileName)) {
      setIsModalOpen(true);
    } else {
      // Download the file
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.fileAttachment} ${className || ''}`}
        onClick={handleClick}
      >
        <div className={styles.fileIcon}>{<FileIcon />}</div>
        <div className={styles.fileInfo}>
          <Typography variant="body2" className={styles.fileName}>
            {fileName}
          </Typography>
          <Typography
            variant="textPlaceholder"
            color="muted"
            className={styles.fileSize}
          >
            {formatFileSize(fileSize)}
          </Typography>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        showFooter={false}
        width="auto"
        className={styles.imageModal}
      >
        <div className={styles.imageContainer}>
          <img src={fileUrl} alt={fileName} className={styles.modalImage} />
        </div>
      </Modal>
    </>
  );
};
