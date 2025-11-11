import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { ResetIcon } from '@/components/Icons/ResetIcon';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

interface SalesSettingsFilterProps {
  onNameChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  nameValue?: string;
  statusValue?: string;
  namePlaceholder?: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
];

export const SalesSettingsFilter: React.FC<SalesSettingsFilterProps> = ({
  onNameChange,
  onStatusChange,
  onReset,
  nameValue = '',
  statusValue = 'all',
  namePlaceholder = 'Search by name',
}) => {
  const [name, setName] = useState(nameValue);
  const [status, setStatus] = useState(statusValue);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    onNameChange(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusChange(value);
  };

  const handleReset = () => {
    setName('');
    setStatus('all');
    onReset();
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        height={38}
        placeholder={namePlaceholder}
        value={name}
        onChange={handleNameChange}
      />
      <Select
        placeholder="Select status"
        value={status}
        width={120}
        onChange={handleStatusChange}
        options={STATUS_OPTIONS}
      />
      <div onClick={handleReset} className="cursor-pointer">
        <ResetIcon />
      </div>
    </div>
  );
};
