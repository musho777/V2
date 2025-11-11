import { EditOutlined } from '@ant-design/icons';
import { Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { Typography } from '@/components/Typography';
import { PROJECT_STATUS } from '@/constants/constants';

import type { ProjectTableRow } from '../types/project.types';

interface ColumnConfig {
  handleEdit: (id: number) => void;
  handleStatusChange: (id: number, status: boolean) => void;
  isGeneralManager: boolean;
}

export const createColumns = ({
  handleEdit,
  handleStatusChange,
  isGeneralManager,
}: ColumnConfig): ColumnsType<ProjectTableRow> => [
  {
    title: 'PROJECT NAME',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'PROJECT TYPE',
    dataIndex: 'projectTypeName',
    key: 'projectTypeName',
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (status: string, record: ProjectTableRow) => {
      const statusConfig = Object.values(PROJECT_STATUS).find(
        (s) => s.label === status,
      );
      return isGeneralManager ? (
        <Switch
          checked={status === 'Active'}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ) : (
        <Tag color={statusConfig?.color}>
          <Typography variant="body3" as="span">
            {status}
          </Typography>
        </Tag>
      );
    },
  },
  {
    title: 'ACTION',
    key: 'action',
    render: (_: unknown, record: ProjectTableRow) =>
      isGeneralManager ? (
        <EditOutlined
          onClick={() => handleEdit(record.id)}
          style={{ cursor: 'pointer', fontSize: '18px' }}
        />
      ) : null,
  },
];
