import { useMemo } from 'react';

import { CircularProgress } from '@/components/CircularProgress';
import {
  BugIcon,
  EditIcon,
  FeatureIcon,
  HighPriorityIcon,
  ImmediatePriorityIcon,
  LowPriorityIcon,
  NormalPriorityIcon,
  SuggestionIcon,
  SupportIcon,
  TaskIcon,
  UrgentIcon,
} from '@/components/Icons';
import { Tag } from '@/components/Tag';
import { Typography } from '@/components/Typography';
import {
  PRIORITY_CONFIG,
  STATUS_COLORS,
  TRACKER_CONFIG,
} from '@/constants/constants';
import { formatDateTime } from '@/utils/utils';

import type { Ticket } from '../types/ticket.types';

import styles from '../pages/styles.module.scss';

const TRACKER_ICON_MAP: Record<string, React.ReactNode> = {
  TaskIcon: <TaskIcon />,
  SuggestionIcon: <SuggestionIcon />,
  SupportIcon: <SupportIcon />,
  BugIcon: <BugIcon />,
  FeatureIcon: <FeatureIcon />,
};

const PRIORITY_ICON_MAP: Record<string, React.ReactNode> = {
  LowPriorityIcon: <LowPriorityIcon />,
  NormalPriorityIcon: <NormalPriorityIcon />,
  HighPriorityIcon: <HighPriorityIcon />,
  UrgentIcon: <UrgentIcon style={{ marginBottom: '2px' }} />,
  ImmediatePriorityIcon: <ImmediatePriorityIcon />,
};

interface UseTicketColumnsProps {
  onNavigateSingleTicket: (uuid: string) => void;
  onNavigateEdit: (uuid: string) => void;
}

export const useTicketColumns = ({
  onNavigateSingleTicket,
  onNavigateEdit,
}: UseTicketColumnsProps) => {
  return useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (id: number, record: Ticket) => (
          <div className={styles.idCell}>
            {record.subtasks > 0 && (
              <Typography
                variant="body3"
                as="span"
                className={styles.parentIcon}
              >
                📁
              </Typography>
            )}
            <Typography
              variant="body2"
              as="span"
              className={styles.clickableTitle}
              onClick={() => onNavigateSingleTicket(record.uuid)}
            >
              {id}
            </Typography>
          </div>
        ),
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (title: string, record: Ticket) => (
          <Typography
            variant="body2"
            as="span"
            className={styles.clickableTitle}
            onClick={() => onNavigateSingleTicket(record.uuid)}
            title={title.length > 25 ? title : ''}
          >
            {title.length > 25 ? `${title.substring(0, 25)}...` : title}
          </Typography>
        ),
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        render: (priority: string) => {
          const config = PRIORITY_CONFIG[priority];
          return (
            <Tag tagType={config?.color} icon={PRIORITY_ICON_MAP[config?.icon]}>
              <Typography variant="body3" as="span">
                {priority}
              </Typography>
            </Tag>
          );
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Tag color={STATUS_COLORS[status]}>
            <Typography variant="body3" as="span">
              {status}
            </Typography>
          </Tag>
        ),
      },
      {
        title: 'Progress',
        dataIndex: 'progress',
        key: 'progress',
        render: (progress: number) => (
          <CircularProgress percent={progress} size={16} showRightLabel />
        ),
      },
      {
        title: 'Start date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (startDate: string) => (
          <Typography variant="body2">
            {startDate ? formatDateTime(startDate, true) : '-'}
          </Typography>
        ),
      },
      {
        title: 'End date',
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (dueDate: string, record: Ticket) => {
          const { startDate, status } = record;
          if (!dueDate) {
            return <Typography variant="body2">-</Typography>;
          }
          const dueDateOnly = new Date(dueDate).setHours(0, 0, 0, 0);
          const startDateOnly = new Date(startDate).setHours(0, 0, 0, 0);
          const todayOnly = new Date().setHours(0, 0, 0, 0);

          const isDueBeforeStart = dueDateOnly < startDateOnly;
          const isOverdue = dueDateOnly < todayOnly;

          const isResolvedOrClosed =
            status === 'Resolved' || status === 'Closed';

          const shouldHighlight =
            (isDueBeforeStart || isOverdue) && !isResolvedOrClosed;

          return (
            <Typography
              variant="body2"
              style={{ color: shouldHighlight ? '#E63946' : 'inherit' }}
            >
              {formatDateTime(dueDate, true)}
            </Typography>
          );
        },
      },
      {
        title: 'Tracker',
        dataIndex: 'tracker',
        key: 'tracker',
        render: (tracker: string) => {
          const config = TRACKER_CONFIG[tracker];
          return (
            <Tag tagType={config?.color} icon={TRACKER_ICON_MAP[config?.icon]}>
              <Typography variant="body3" as="span">
                {tracker}
              </Typography>
            </Tag>
          );
        },
      },
      {
        title: 'Created by',
        dataIndex: 'createdBy',
        key: 'createdBy',
      },
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        render: (uuid: string) => (
          <span onClick={() => onNavigateEdit(uuid)}>
            <EditIcon />
          </span>
        ),
      },
    ],
    [onNavigateSingleTicket, onNavigateEdit],
  );
};
