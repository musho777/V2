import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { PhoneInputProps } from 'react-phone-input-2';
import PhoneInput from 'react-phone-input-2';

import { Typography } from '@/components/Typography';

import 'react-phone-input-2/lib/style.css';
import styles from './styles.module.scss';

interface MyPhoneInputProps extends Partial<PhoneInputProps> {
  value?: string;
  label?: string;
  required?: boolean;
  tooltip?: string;
  onChange?: (
    value: string,
    data?: any,
    event?: React.ChangeEvent<HTMLInputElement>,
    formattedValue?: string,
  ) => void;
  readOnly?: boolean;
  error?: string;
  country?: string;
  placeholder?: string;
  width?: number;
}

export interface MyPhoneInputRef {
  focus: () => void;
}

export const MyPhoneInput = forwardRef<MyPhoneInputRef, MyPhoneInputProps>(
  (
    {
      value,
      label,
      required,
      // tooltip,
      onChange,
      readOnly,
      error = '',
      country = 'am',
      width,
      placeholder = 'Enter phone number',
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    return (
      <div className={`${styles.container} ${readOnly ? styles.readOnly : ''}`}>
        {label && (
          <Typography variant="label" as="label" className={styles.label}>
            {label}{' '}
            {required && (
              <Typography as="span" variant="label">
                *
              </Typography>
            )}
          </Typography>
        )}
        <PhoneInput
          inputStyle={{
            height: 44,
            borderRadius: 8,
            width: width,
          }}
          value={value}
          onChange={onChange}
          country={country}
          countryCodeEditable={false}
          placeholder={placeholder}
          inputProps={{
            height: '44px',
            'data-error': !!error,
            ...rest.inputProps,
          }}
          {...rest}
        />
        {error && (
          <Typography variant="body4" as="p" className={styles.errorText}>
            {error}
          </Typography>
        )}
      </div>
    );
  },
);

MyPhoneInput.displayName = 'MyPhoneInput';
