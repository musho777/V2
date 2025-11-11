import { Editor } from '@tinymce/tinymce-react';

import styles from './styles.module.scss';

interface TextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  label?: string;
  height?: number;
  placeholder?: string;
  error?: string;
}

export const TextEditor = ({
  value = '',
  onChange,
  label,
  height = 300,
  placeholder = 'Enter text...',
  error,
}: TextEditorProps) => {
  return (
    <div className={styles.textEditorContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar: false,
          statusbar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
          content_style:
            'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
          placeholder,
        }}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
