import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { differenceInDays, format, formatDistanceToNow } from 'date-fns';

import { Typography } from '@/components/Typography/Typography';
import { formatDateTime, stripHtmlTags } from '@/utils/utils';

import styles from './History.module.scss';

interface Change {
  field: string;
  id: number;
  newValue: string | null;
  oldValue: string | null;
}

interface HistoryEntry {
  changes: Change[];
  createdAt: number;
  id: number;
  user: {
    id: number;
    name: string;
    profilePhoto: string;
  };
  comment?: string;
}

type FilterType = 'All' | 'Attachments' | 'Appointments';

const statusColors: Record<string, string> = {
  High: '#15C7A7',
  Urgent: '#E63946',
  Low: '#F2D124',
  Closed: '#212529',
  Resolved: '#15C7A7',
  'To Do': '#6C757D',
  Task: '#2D6CDF',
  Bug: '#E63946',
  Suggestion: '#F63DB7',
  Feature: '#15C7A7',
  Support: '#FF6A00',
  Waiting: '#FF6A00',
  Reopen: '#7367F0',
  Rejected: '#E63946',
};

const formatDate = (dateInput: string | number): string => {
  const date = new Date(typeof dateInput === 'string' ? dateInput : Number(dateInput));
  const daysDiff = differenceInDays(new Date(), date);

  if (daysDiff < 1) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else {
    return format(date, 'dd.MM.yyyy');
  }
};

const History: React.FC = ({ historyData }) => {
  const [isFilterDropDownOpen, setIsFilterDropDownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const filterRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const filteredHistory = historyData;
  // ?.map((group: HistoryEntry[]) =>
  //   group.filter((item) =>
  //     selectedFilter === 'All'
  //       ? true
  //       : selectedFilter === 'Attachments'
  //         ? item.type === 'File'
  //         : selectedFilter === 'Appointments'
  //           ? item.type.includes('Appointment') ||
  //             item.type.includes('Frequency')
  //           : false,
  //   ),
  // )
  // .filter((group: HistoryEntry[]) => group.length > 0);

  // useEffect(() => {
  //   if (
  //     location.state?.scrollToLastUpdate &&
  //     bottomRef.current &&
  //     !hasScrolledRef.current
  //   ) {
  //     bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  //     hasScrolledRef.current = true;
  //   }
  // }, [location, filteredHistory]);

  const renderChange = (change: Change, changeIndex: number) => {
    const isDateChange =
      change.field === 'Start date' ||
      change.field === 'End date' ||
      change.field === 'One-Time';

    const getColor = (type: string) => statusColors[type] || '#2d6cdf';

    return (
      <div key={change.id || changeIndex} className={styles.changeItem}>
        {/* <img src={ellipse} className="mr-1 mt-[10px]" alt="" /> */}
        <div className={styles.changeContent}>
          <Typography
            variant="caption"
            weight="semibold"
            className={styles.changeType}
          >
            {change.field}{' '}
          </Typography>
          {change.oldValue && change.newValue && (
            <Typography
              variant="caption"
              weight="semibold"
              className={styles.changeAction}
            >
              {' '}
              changed from{' '}
            </Typography>
          )}

          {change.oldValue && change.newValue ? (
            <>
              <Typography
                variant="caption"
                weight="semibold"
                className={styles.changeValue}
                style={{ color: getColor(change.oldValue) }}
              >
                {isDateChange
                  ? formatDateTime(change.oldValue, true)
                  : change.oldValue}
              </Typography>
              <Typography
                variant="caption"
                weight="semibold"
                className={styles.changeAction}
              >
                {' '}
                to{' '}
              </Typography>
              <Typography
                variant="caption"
                weight="semibold"
                className={styles.changeValue}
                style={{ color: getColor(change.newValue) }}
              >
                {isDateChange
                  ? formatDateTime(change.newValue, true)
                  : change.newValue}
              </Typography>
            </>
          ) : change.newValue ? (
            <>
              <Typography
                variant="caption"
                weight="semibold"
                className={styles.changeAction}
              >
                {' '}
                set to{' '}
              </Typography>
              <Typography
                variant="caption"
                weight="semibold"
                className={styles.changeValue}
                style={{ color: getColor(change.newValue) }}
              >
                {isDateChange
                  ? formatDateTime(change.newValue, true)
                  : change.newValue}
              </Typography>
            </>
          ) : change.oldValue ? (
            <>
              <Typography
                variant="caption"
                weight="semibold"
                className={styles.changeAction}
              >
                {' '}
                removed from{' '}
              </Typography>
              <Typography
                variant="caption"
                weight="semibold"
                className={styles.changeValue}
                style={{ color: getColor(change.oldValue) }}
              >
                {isDateChange
                  ? formatDateTime(change.oldValue, true)
                  : change.oldValue}
              </Typography>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  const renderGroup = (group: HistoryEntry[]) => {
    return (
      <Fragment key={group[0].createdAt}>
        <div className={styles.group}>
          <div className={styles.changesList}>
            {group.map((entry) =>
              entry.changes.map((change, index) =>
                renderChange(change, index),
              ),
            )}
          </div>
          {/* {stripHtmlTags(group[0].comment) !== 'null' &&
          stripHtmlTags(group[0].comment).length > 0 && (
            <div className={styles.comment}>
              <div dangerouslySetInnerHTML={{ __html: group[0].comment }} />
            </div>
          )} */}
          <div className={styles.metadata}>
            <Typography variant="body6" className={styles.metadataText}>
              {formatDate(group[0].createdAt)}
            </Typography>
            <Typography variant="body6" className={styles.metadataText}>
              by {group[0].user.name}
            </Typography>
          </div>
        </div>
      </Fragment>
    );
  };

  const renderDropdown = () => (
    <ul id="dropdown-filter" className={styles.dropdown}>
      <li
        onClick={() => setSelectedFilter('All')}
        className={styles.dropdownItem}
      >
        {/* <img src={all} alt="all" className="w-4" /> */}
        All
      </li>
      <li
        onClick={() => setSelectedFilter('Attachments')}
        className={styles.dropdownItem}
      >
        {/* <img src={attach} alt="attachments" className="w-4" /> */}
        Attachments
      </li>
      <li
        onClick={() => setSelectedFilter('Appointments')}
        className={styles.dropdownItem}
      >
        {/* <img src={appt} alt="appointments" className="w-4" /> */}
        Appointments
      </li>
    </ul>
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target as Node) &&
      !(event.target as Element).closest('#dropdown-filter')
    ) {
      setIsFilterDropDownOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFilterDropDownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isFilterDropDownOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterDropDownOpen, handleClickOutside, handleKeyDown]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Typography
            variant="body2"
            weight="semibold"
            className={styles.title}
          >
            History
          </Typography>
          <div
            ref={filterRef}
            onClick={() => setIsFilterDropDownOpen(true)}
            className={styles.filterButton}
          >
            {/* <img src={filter} alt="filter" /> */}
          </div>
          {isFilterDropDownOpen &&
            createPortal(renderDropdown(), document.body)}
        </div>
      </div>
      <div className={styles.scrollContent}>
        {filteredHistory?.map(
          (entry: HistoryEntry | HistoryEntry[], index: number) =>
            Array.isArray(entry) ? (
              renderGroup(entry)
            ) : (
              <Fragment key={entry.id || entry.createdAt || index}>
                <div className={styles.group}>
                  <div className={styles.changesList}>
                    {entry.changes?.map((change, changeIndex) =>
                      renderChange(change, changeIndex),
                    )}
                  </div>
                  {entry.comment && stripHtmlTags(entry.comment) && (
                    <div className={styles.comment}>
                      <div
                        dangerouslySetInnerHTML={{ __html: entry.comment }}
                      />
                    </div>
                  )}
                  <div className={styles.metadata}>
                    <Typography variant="body6" className={styles.metadataText}>
                      {formatDate(entry.createdAt)}
                    </Typography>
                    <Typography variant="body6" className={styles.metadataText}>
                      by {entry.user.name}
                    </Typography>
                  </div>
                </div>
              </Fragment>
            ),
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

export default History;
