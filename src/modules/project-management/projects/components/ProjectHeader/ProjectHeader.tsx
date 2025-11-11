import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';

import styles from './styles.module.scss';

interface ProjectHeaderProps {
  allTicketsCount: number;
  onAllTicketsClick: () => void;
  onSearchChange: (value: string) => void;
}

export function ProjectHeader({
  allTicketsCount,
  onAllTicketsClick,
  onSearchChange,
}: ProjectHeaderProps) {
  return (
    <div className={styles.header}>
      <button className={styles.allTicketCount} onClick={onAllTicketsClick}>
        <Typography variant="body1">All tickets</Typography>
        <Typography variant="body1">{allTicketsCount}</Typography>
      </button>
      <Input
        height={44}
        placeholder="Search..."
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
