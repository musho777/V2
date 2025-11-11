'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Area } from 'react-easy-crop';
import Cropper from 'react-easy-crop';

import { from, Observable } from 'rxjs';

import { AttachIcon, AvatarIcon } from '../Icons';
import { PhotoTake } from '../Icons/PhotoTake';
import { ZoomMinus } from '../Icons/ZoomMinus';
import { ZoomPLus } from '../Icons/ZoomPLus';
import { Modal } from '../Modal';
import { Slider } from '../Slider';
import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface ImageUploadProps {
  value?: string;
  onChange?: (file: File, base64: string) => void;
  maxSizeMB?: number;
  shape?: 'circle' | 'square';
  size?: number;
  disabled?: boolean;
}

const getBase64 = (file: File): Observable<string> => {
  return from(
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    }),
  );
};

const processCroppedImage = (
  imageSrc: string,
  cropArea: Area,
  outputType: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality: number = 0.92,
): Observable<File> => {
  return from(
    new Promise<File>(async (resolve, reject) => {
      try {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((res) => (image.onload = res));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.drawImage(
          image,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          cropArea.width,
          cropArea.height,
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Failed to create blob'));
            const file = new File(
              [blob],
              `cropped.${outputType.split('/')[1]}`,
              {
                type: outputType,
              },
            );
            resolve(file);
          },
          outputType,
          quality,
        );
      } catch (error) {
        reject(error);
      }
    }),
  );
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  maxSizeMB = 2,
  shape = 'circle',
  size = 120,
  disabled = false,
}) => {
  const [savedImageSrc, setSavedImageSrc] = useState<string>(value || '');
  const [tempImageSrc, setTempImageSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLUListElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const handleFileSelect = (file: File | undefined) => {
    if (!file?.type.startsWith('image/')) {
      console.error({ content: 'Please select an image file.' });
      return;
    }
    if (file?.size / 1024 / 1024 > maxSizeMB) {
      console.error({ content: `Max size is ${maxSizeMB}MB.` });
      return;
    }

    const subscription = getBase64(file).subscribe({
      next: (base64) => {
        setTempImageSrc(base64);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCropModalOpen(true);
        setDropdownOpen(false);
      },
      error: (error) => {
        console.error('Error converting file to base64:', error);
      },
    });

    return () => subscription.unsubscribe();
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = (): Observable<File | null> => {
    if (!tempImageSrc || !croppedAreaPixels) {
      return from(Promise.resolve(null));
    }

    return new Observable((observer) => {
      const subscription = processCroppedImage(
        tempImageSrc,
        croppedAreaPixels,
        'image/png',
        0.9,
      ).subscribe({
        next: (file) => {
          observer.next(file);
          observer.complete();
        },
        error: (error) => {
          console.error('Cropping failed:', error);
          observer.next(null);
          observer.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
  };

  const handleSave = () => {
    const subscription = getCroppedImage().subscribe({
      next: (file) => {
        if (!file) return;

        getBase64(file).subscribe({
          next: (base64) => {
            setSavedImageSrc(base64);
            setTempImageSrc('');
            onChange?.(file, base64);
            setCropModalOpen(false);
          },
          error: (error) => {
            console.error('Error converting cropped file to base64:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error getting cropped image:', error);
      },
    });

    return () => subscription.unsubscribe();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      setStream(mediaStream);
      setCameraModalOpen(true);
      setDropdownOpen(false);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        } else {
          console.warn('videoRef is still null after timeout');
        }
      }, 500);
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setCameraModalOpen(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    stopCamera();
    setTempImageSrc(dataURL);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCropModalOpen(true);
  };

  const handleCancelUpload = () => {
    setCropModalOpen(false);
    setTempImageSrc('');
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const handleAttachPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleCancelCamera = () => {
    stopCamera();
    setCameraModalOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div
          ref={avatarRef}
          className={styles.avatarWrapper}
          style={{
            width: size,
            height: size,
            borderRadius: shape === 'circle' ? '50%' : 8,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
        >
          {savedImageSrc ? (
            <img src={savedImageSrc} className={styles.avatarWrapper} />
          ) : (
            <AvatarIcon className="avatarIcon" />
          )}
        </div>

        {dropdownOpen && (
          <ul ref={dropdownRef} className={styles.dropdownMenu}>
            <li
              className={styles.dropdownItem}
              onClick={handleAttachPhotoClick}
            >
              <AttachIcon />
              <Typography variant="body2" as="span">
                {' '}
                Attach Photo
              </Typography>
            </li>
            <li className={styles.dropdownItem} onClick={startCamera}>
              <PhotoTake />
              <Typography variant="body2" as="span">
                {' '}
                Take a Photo
              </Typography>
            </li>
          </ul>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.fileInput}
        onChange={(e) => {
          const file = e.target.files?.[0];
          handleFileSelect(file);
        }}
      />

      {cropModalOpen && tempImageSrc && (
        <Modal
          open={cropModalOpen}
          onCancel={handleCancelUpload}
          showFooter
          showSubmitButton
          showCloseButton
          submitButtonText="Save"
          closeButtonText="Cancel"
          onSubmit={handleSave}
          width={693}
          submitButtonWidth={128}
          submitButtonHeight={44}
          closeButtonWidth={128}
          closeButtonHeight={44}
          closeButtonClassName={styles.cancelButton}
        >
          <div className={styles.cropModalContent}>
            <div className={styles.cropperContainer}>
              <Cropper
                image={tempImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape={shape === 'circle' ? 'round' : 'rect'}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className={styles.zoomControls}>
              <div onClick={() => setZoom((z) => Math.max(1, z - 0.1))}>
                <ZoomMinus />
              </div>
              <Slider value={zoom} onChange={(val) => setZoom(val)} />
              <div onClick={() => setZoom((z) => Math.min(3, z + 0.1))}>
                <ZoomPLus />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {cameraModalOpen && (
        <Modal
          open={cameraModalOpen}
          onCancel={handleCancelCamera}
          showFooter
          showSubmitButton
          showCloseButton
          closeButtonText="Cancel"
          submitButtonText="Capture"
          onSubmit={capturePhoto}
          width={693}
          submitButtonWidth={128}
          submitButtonHeight={44}
          closeButtonWidth={128}
          closeButtonHeight={44}
          closeButtonClassName={styles.cancelButton}
        >
          <div className={styles.cameraModalContent}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.videoElement}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ImageUpload;
