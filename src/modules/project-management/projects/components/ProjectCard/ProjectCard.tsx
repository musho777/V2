import { Row } from 'antd';

import { Typography } from '@/components/Typography';

import type { Project } from '../../types/project.types';

import styles from './styles.module.scss';

type ProjectCardProps = Omit<Project, 'id'>;

export function ProjectCard({
  name,
  owner,
  color,
  ticketsCount,
}: ProjectCardProps) {
  return (
    <div
      className={styles.styledCard}
      style={{ borderLeft: `3px solid ${color ?? '#ff6a00'}` }}
    >
      <Typography variant="heading3" className={styles.projectName}>
        {name}
      </Typography>
      <Row>
        <Typography variant="body2" className={styles.ownerLabel}>
          Owner:
        </Typography>
        <Typography variant="body2" className={styles.owner}>
          {owner}
        </Typography>
      </Row>
      <div className={styles.ticketCount}>
        <Typography variant="body2" as="span" className={styles.count}>
          {ticketsCount} {ticketsCount === 1 ? 'Ticket' : 'Tickets'}
        </Typography>
      </div>
    </div>
  );
}
