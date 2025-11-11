import React, { useEffect, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Image, Upload } from 'antd';

import { Typography } from '@/components/Typography';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface DragDropUploadFileProps {
  onChange?: (files: File[]) => void;
  defaultFileList?: UploadFile[];
}

export const DragDropUploadFile: React.FC<DragDropUploadFileProps> = ({
  onChange,
  defaultFileList = [],
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);

  useEffect(() => {
    setFileList(defaultFileList);
  }, [defaultFileList]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (onChange) {
      const files = newFileList
        .map((file) => file.originFileObj)
        .filter((file) => file !== undefined) as File[];
      onChange(files);
    }
  };

  const uploadButton = (
    <button type="button">
      <PlusOutlined />
      <Typography variant="body2" as="div" style={{ marginTop: 8 }}>
        Upload
      </Typography>
    </button>
  );
  return (
    <div style={{ width: '100%' }}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={(file) => {
          void handlePreview(file);
        }}
        onChange={handleChange}
        customRequest={({ onSuccess }) => {
          void (async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
            if (onSuccess) {
              onSuccess('ok');
            }
          })();
        }}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
          alt="Preview"
        />
      )}
    </div>
  );
};
