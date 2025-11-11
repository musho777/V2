'use client';

import { useParams } from 'next/navigation';

import { Spin } from 'antd';

import { Button } from '@/components/Button';
import { CircularProgress } from '@/components/CircularProgress';
import { FileAttachment } from '@/components/FileAttachment';
import { Assignees } from '@/components/Icons/Assignees';
import { AttachmentsSvg } from '@/components/Icons/AttachmentsSvg';
// import {
//   HighPriorityIcon,
//   ImmediatePriorityIcon,
//   LowPriorityIcon,
//   NormalPriorityIcon,
//   UrgentIcon,
// } from '@/components/Icons';
import { PriorityIcon } from '@/components/Icons/PriorityIcon';
import { ProgressIcon } from '@/components/Icons/ProgressIcon';
import { ProjectSvg } from '@/components/Icons/ProjectSvg';
import { Status } from '@/components/Icons/Status';
import { SubprojectIcon } from '@/components/Icons/SubprojectIcon';
import { TrackerIcon } from '@/components/Icons/TrackerIcon';
import { WatchersIcon } from '@/components/Icons/WatchersIcon';
import { Tag } from '@/components/Tag';
import { Typography } from '@/components/Typography';
import {
  PRIORITY_CONFIG,
  STATUS_COLORS,
  TRACKER_CONFIG,
} from '@/constants/constants';
import { formatDateTime } from '@/utils/utils';

import { useTicketById } from '../../createTicket/hook/useCreateTicket';
import { CommentSection } from '../components/CommentSection';
import History from '../components/history/History';

import styles from './styles.module.scss';

// const PRIORITY_ICON_MAP: Record<string, React.ReactNode> = {
//   LowPriorityIcon: <LowPriorityIcon />,
//   NormalPriorityIcon: <NormalPriorityIcon />,
//   HighPriorityIcon: <HighPriorityIcon />,
//   UrgentIcon: <UrgentIcon style={{ marginBottom: '2px' }} />,
//   ImmediatePriorityIcon: <ImmediatePriorityIcon />,
// };

export default function SingleTicket() {
  const params = useParams();
  const ticketId = params.id as string | undefined;

  const { data: ticket, isLoading } = useTicketById(ticketId);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading ticket..." />
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.columnContainer}>
        <div className={styles.content}>
          <div className={styles.header}>
            <Typography variant="heading3">{ticket.title}</Typography>
            <Button height={32}>Edit</Button>
          </div>
          <div className={styles.detailsRow}>
            <Typography variant="textPlaceholder" color="muted">
              Ticket ID:
              <Typography variant="label"> {ticket?.id}</Typography>
            </Typography>
            <Typography variant="textPlaceholder" color="muted">
              Creator:
              <Typography variant="label"> {ticket?.createdBy.name}</Typography>
            </Typography>
            <Typography variant="textPlaceholder" color="muted">
              Created date:
              <Typography variant="label">
                {' '}
                {formatDateTime(ticket?.createdAt)}
              </Typography>
            </Typography>
          </div>
          <div className={styles.headerContent}>
            <div className={styles.columnInfo}>
              <div className={styles.fieldItemRow}>
                <div className={styles.fieldItemInfo}>
                  <TrackerIcon />
                  <Typography variant="textPlaceholder" color="muted">
                    Tracker
                  </Typography>
                </div>
                <Tag tagType={TRACKER_CONFIG[ticket?.tracker.name]?.color}>
                  {ticket?.status.name}
                </Tag>
              </div>
              <div className={styles.fieldItemRow}>
                <div className={styles.fieldItemInfo}>
                  <PriorityIcon />
                  <Typography variant="textPlaceholder" color="muted">
                    Priority
                  </Typography>
                </div>
                <Tag
                  tagType={PRIORITY_CONFIG[ticket?.priority.name].color}
                  // icon={PRIORITY_ICON_MAP[config?.icon]}
                >
                  {ticket?.priority.name}
                </Tag>
              </div>
              <div className={styles.fieldItemRow}>
                <div className={styles.fieldItemInfo}>
                  <Status />
                  <Typography variant="textPlaceholder" color="muted">
                    Status
                  </Typography>
                </div>
                <Tag color={STATUS_COLORS[ticket.status?.name]}>To Do</Tag>
              </div>
              <div className={styles.fieldItemRow}>
                <div className={styles.fieldItemInfo}>
                  <ProgressIcon />
                  <Typography variant="textPlaceholder" color="muted">
                    Progress
                  </Typography>
                </div>
                <CircularProgress
                  percent={ticket?.progress}
                  size={16}
                  showRightLabel
                />
              </div>
            </div>
            <div className={styles.columnInfo}>
              <div className={styles.fieldItemRow}>
                <div className={styles.fieldItemInfo}>
                  <ProjectSvg />
                  <Typography variant="textPlaceholder" color="muted">
                    Project
                  </Typography>
                </div>
                <Typography variant="body2">{ticket?.project.name}</Typography>
              </div>
              <div className={styles.fieldItemRow}>
                <div className={styles.fieldItemInfo}>
                  <SubprojectIcon />
                  <Typography variant="textPlaceholder" color="muted">
                    Subproject
                  </Typography>
                </div>
                <Typography variant="body2">
                  {ticket.subproject.name}
                </Typography>
              </div>
              <div className={styles.fieldItemRow}>
                <div className={styles.fieldItemInfo}>
                  <Assignees />
                  <Typography variant="textPlaceholder" color="muted">
                    Assignees
                  </Typography>
                </div>
                <Typography variant="body2">Task</Typography>
              </div>
              <div className={styles.fieldItemRow}>
                <div className={styles.fieldItemInfo}>
                  <WatchersIcon />
                  <Typography variant="textPlaceholder" color="muted">
                    Watchers
                  </Typography>
                </div>
                <Typography variant="body2">Task</Typography>
              </div>
            </div>
          </div>
          <div
            className={styles.commentArea}
            dangerouslySetInnerHTML={{ __html: ticket?.description }}
          />
          <div className={styles.attachments}>
            <div className={styles.attachmentsHeader}>
              <AttachmentsSvg />
              <Typography variant="textPlaceholder" color="muted">
                Attachments ({ticket?.attachments?.length})
              </Typography>
            </div>
            {ticket.attachments.map((elm, i) => {
              return (
                <FileAttachment
                  key={i}
                  fileName={elm.originalFileName}
                  fileSize={elm.size}
                  fileUrl={`${process.env.NEXT_PUBLIC_URL}/${elm.originalFileName}`}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.content}>
          {ticketId && (
            <CommentSection
              ticketId={ticketId}
              comments={ticket?.comments || []}
            />
          )}
        </div>
      </div>
      <div className={styles.history}>
        <History historyData={ticket?.updates} />
      </div>
    </div>
  );
}
