import React from 'react';

import { Checkbox } from 'antd';

import { ChooseIcon } from '@/components/Icons';
import { Typography } from '@/components/Typography';

interface DataItem {
  id?: number;
  userId?: number;
  assignedId?: number | string;
  subprojectTeamName?: string;
  user?: string;
  name?: string;
  subprojectName?: string;
}

interface AssignedDataResponse {
  assigned?: DataItem[];
}

interface UnassignedDataResponse {
  unassigned?: DataItem[];
}

interface AssignItemProps {
  data?: DataItem[] | AssignedDataResponse | UnassignedDataResponse;
  selectedData: (number | string)[];
  toggleSelect: (id: number | string) => void;
  emptyText?: string;
}

export const AssignItem: React.FC<AssignItemProps> = ({
  data,
  selectedData,
  toggleSelect,
  emptyText = 'No items available',
}) => {
  // Normalize data to always be an array
  const items = Array.isArray(data)
    ? data
    : (data as AssignedDataResponse)?.assigned ||
      (data as UnassignedDataResponse)?.unassigned ||
      [];

  if (items.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        {items.map((elm) => {
          const itemId =
            elm.id ??
            elm.userId ??
            elm.assignedId ??
            elm.subprojectTeamName ??
            0;
          const displayName =
            elm.user ??
            elm.name ??
            elm.subprojectName ??
            elm.subprojectTeamName ??
            '';
          return (
            <div
              key={itemId}
              onClick={() => toggleSelect(itemId)}
              className="flex-row flex items-center gap-3 cursor-pointer"
            >
              <Checkbox checked={selectedData.includes(itemId)} />
              <Typography variant="body2" as="p">
                {displayName}
              </Typography>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center items-center flex-col gap-5">
      <ChooseIcon />
      <Typography variant="body2" as="p">
        {emptyText}
      </Typography>
    </div>
  );
};
