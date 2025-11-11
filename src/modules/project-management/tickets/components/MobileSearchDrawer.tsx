import { Drawer } from 'antd';

import { Input } from '@/components/Input';

import type { TicketSearchData } from '../hooks/useTicketSearch';

interface MobileSearchDrawerProps {
  open: boolean;
  onClose: () => void;
  ticketId: string;
  setTicketId: (value: string) => void;
  searchText: string;
  setSearchText: (value: string) => void;
  setTicketSearchData: (data: Partial<TicketSearchData>) => void;
  setFirst: (value: boolean) => void;
}

export default function MobileSearchDrawer({
  open,
  onClose,
  ticketId,
  setTicketId,
  searchText,
  setSearchText,
  setTicketSearchData,
  setFirst,
}: MobileSearchDrawerProps) {
  const handleClearSearch = () => {
    setFirst(true);
    setTicketId('');
    setSearchText('');
    setTicketSearchData({
      id: '',
      search: '',
    });
  };

  return (
    <Drawer
      title="Search"
      placement="bottom"
      onClose={onClose}
      open={open}
      height="50vh"
    >
      <div className="flex flex-col gap-4">
        <Input
          height={38}
          placeholder="Enter ticket ID"
          label="Ticket ID"
          type="number"
          value={ticketId}
          onChange={(e) => {
            setFirst(true);
            setTicketId(e.target.value);
          }}
        />
        <Input
          height={38}
          placeholder="Enter ticket title or description"
          label="Ticket title or description"
          value={searchText}
          onChange={(e) => {
            setFirst(true);
            setSearchText(e.target.value);
          }}
        />
      </div>
      <div className="flex justify-end mt-4">
        <p
          onClick={handleClearSearch}
          className="cursor-pointer text-[rgb(29,53,87)] text-[14px] font-semibold w-[57px] underline"
        >
          Clear all
        </p>
      </div>
    </Drawer>
  );
}
