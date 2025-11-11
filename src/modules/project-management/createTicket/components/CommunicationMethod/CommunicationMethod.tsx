import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { Input } from '@/components/Input';
import { MyPhoneInput } from '@/components/PhoneInput/PhoneInput';

import styles from './CommunicationMethod.module.scss';

interface CommunicationMethodProps {
  method: string;
  checked?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  phoneValue?: string;
  onPhoneChange?: (value: string) => void;
  phone?: boolean;
}

export const CommunicationMethod: React.FC<CommunicationMethodProps> = ({
  method,
  checked,
  onChange,
  phoneValue,
  onPhoneChange,
  phone,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.checkboxWrapper}>
        <Checkbox checked={checked} onChange={onChange} />
        <div className={styles.method}>
          <p>{method}</p>
        </div>
      </div>
      <div className={styles.phoneInput}>
        {phone}
        {phone ? (
          <MyPhoneInput value={phoneValue} onChange={onPhoneChange} />
        ) : (
          <div className={styles.inputWrapper}>
            <Input
              height={44}
              value={phoneValue}
              onChange={(e) => onPhoneChange?.(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
