import { EditOutlined } from '@ant-design/icons';
import { Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { Typography } from '@/components/Typography';
import { PROJECT_STATUS } from '@/constants/constants';

import type { TeamTableRow } from '../types/team.types';

interface ColumnsProps {
  onEdit: (teamId: string) => void;
  onStatusChange: (teamId: number, status: boolean) => void;
  isGeneralManager: boolean;
}

export const getColumns = ({
  onEdit,
  onStatusChange,
  isGeneralManager,
}: ColumnsProps): ColumnsType<TeamTableRow> => [
  {
    title: 'TEAM NAME',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'BRANCH HEAD',
    dataIndex: 'branchHeadName',
    key: 'branchHeadName',
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (_: string, record: TeamTableRow) =>
      isGeneralManager ? (
        <Switch
          checked={record.status === 'Active'}
          onChange={(checked) => onStatusChange(Number(record.key), checked)}
        />
      ) : (
        <Tag
          color={
            record.status === 'Active'
              ? PROJECT_STATUS.active.color
              : PROJECT_STATUS.disabled.color
          }
        >
          <Typography variant="body3" as="span">
            {record.status}
          </Typography>
        </Tag>
      ),
  },
  {
    title: 'ACTIONS',
    key: 'actions',
    render: (_: unknown, record: TeamTableRow) => (
      <EditOutlined
        onClick={() => onEdit(record.key)}
        style={{ cursor: 'pointer', fontSize: '18px' }}
      />
    ),
  },
];
