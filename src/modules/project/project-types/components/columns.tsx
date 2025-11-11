import { EditOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { Switch } from '@/components/Switch';
import { Typography } from '@/components/Typography';

import type { ProjectTypeTableRow } from '../types/project-type.types';

interface ColumnsProps {
  handleStatusChange: (id: number, status: boolean) => void;
  handleEdit: (id: number) => void;
  isGeneralManager: boolean;
}

export const createColumns = ({
  handleStatusChange,
  handleEdit,
  isGeneralManager,
}: ColumnsProps): ColumnsType<ProjectTypeTableRow> => [
  {
    title: 'TYPE NAME',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (_: string, record: ProjectTypeTableRow) =>
      isGeneralManager ? (
        <Switch
          checked={record.status === 'Active'}
          onChange={(checked) =>
            handleStatusChange(Number(record.key), checked)
          }
        />
      ) : (
        <Tag color={record.status === 'Active' ? 'green' : 'red'}>
          <Typography variant="body3" as="span">
            {record.status}
          </Typography>
        </Tag>
      ),
  },
  ...(isGeneralManager
    ? [
        {
          title: 'ACTIONS',
          key: 'actions',
          render: (_: string, record: ProjectTypeTableRow) => (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
            />
          ),
        },
      ]
    : []),
];
