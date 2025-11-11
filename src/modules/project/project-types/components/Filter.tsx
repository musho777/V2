import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { ResetIcon } from '@/components/Icons/ResetIcon';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { PROJECT_STATUS } from '@/constants/constants';
import { toSelectOptions } from '@/utils/utils';

import type { FilterProps } from '../types/project-type.types';

export default function Filter({ onFilterChange, onReset }: FilterProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('all');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    onFilterChange({ name: value });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({
      status:
        value === 'active' ? true : value === 'disabled' ? false : undefined,
    });
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
        placeholder="Search by name"
        value={name}
        onChange={handleNameChange}
      />
      <Select
        placeholder="Select status"
        value={status}
        width={100}
        onChange={handleStatusChange}
        options={toSelectOptions(PROJECT_STATUS)}
      />
      <div onClick={handleReset} className="cursor-pointer">
        <ResetIcon />
      </div>
    </div>
  );
}
