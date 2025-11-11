import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

import { ResetIcon } from '@/components/Icons/ResetIcon';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { PROJECT_STATUS } from '@/constants/constants';
import useDebounce from '@/hooks/useDebounce';
import { toSelectOptions } from '@/utils/utils';

import { useProjectSearchParams } from '../hooks/useSearch';

export default function Filter() {
  const { searchData, setProjectSearchData, resetSearchData } =
    useProjectSearchParams();
  const [first, setFirst] = useState(false);
  const [name, setName] = useState(searchData.name || '');
  const debouncedName = useDebounce(name, 500);

  const [status, setStatus] = useState(
    searchData.status === 'true'
      ? 'active'
      : searchData.status === 'false'
        ? 'disabled'
        : 'all',
  );
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirst(true);
    setName(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setFirst(true);
    setStatus(value);
    setProjectSearchData({
      status:
        value === 'active' ? true : value === 'disabled' ? false : undefined,
    });
  };

  const handleReset = () => {
    setFirst(true);
    setName('');
    setStatus('all');
    resetSearchData();
  };

  useEffect(() => {
    if (first) setProjectSearchData({ name: debouncedName });
  }, [debouncedName]);

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
