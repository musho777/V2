'use client';

import React, { useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Card, Spin } from 'antd';

import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { useEmployeeSchedule } from '@/hooks/useEmployeeSchedule';
import type { AssignEmployeeScheduleRequest } from '@/types/employee-schedule.types';

import EmptyState from '../EmptyState';
import { Typography } from '../Typography';

import { AssignScheduleModal } from './AssignScheduleModal';
import { EditScheduleModal } from './EditScheduleModal';

import styles from './styles.module.scss';

export interface SchedulesSegmentProps {
  canEdit?: boolean;
  employeeId: number;
}

export const SchedulesSegment: React.FC<SchedulesSegmentProps> = ({
  canEdit = false,
  employeeId,
}) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    schedule,
    isLoading,
    isAssigning,
    isUpdating,
    assignSchedule,
    updateSchedule,
  } = useEmployeeSchedule(employeeId);

  const handleOpenAssignModal = () => {
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleAssignSchedule = async (
    scheduleData: AssignEmployeeScheduleRequest,
  ) => {
    const success = await assignSchedule(scheduleData);
    if (success) {
      setIsAssignModalOpen(false);
    }
  };

  const handleUpdateSchedule = async (
    scheduleData: AssignEmployeeScheduleRequest,
  ) => {
    const success = await updateSchedule(scheduleData);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  const weekdays = [
    { key: 'Monday', schedule: schedule?.workScheduleForMonday },
    { key: 'Tuesday', schedule: schedule?.workScheduleForTuesday },
    { key: 'Wednesday', schedule: schedule?.workScheduleForWednesday },
    { key: 'Thursday', schedule: schedule?.workScheduleForThursday },
    { key: 'Friday', schedule: schedule?.workScheduleForFriday },
    { key: 'Saturday', schedule: schedule?.workScheduleForSaturday },
    { key: 'Sunday', schedule: schedule?.workScheduleForSunday },
  ];

  return (
    <>
      <div className={styles.segmentContainer}>
        <Card className={styles.segment}>
          <div className={styles.segmentHeader}>
            <h3 className={styles.segmentTitle}>
              <Typography variant="heading5">Schedules</Typography>
            </h3>
            {canEdit && schedule && (
              <Typography
                variant="body2"
                as="span"
                onClick={handleOpenEditModal}
                className={styles.editText}
              >
                Edit
              </Typography>
            )}
          </div>

          <div className={styles.divider} />

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spin />
            </div>
          ) : schedule ? (
            <>
              <div className={styles.scheduleInfo}>
                <div className={styles.infoRow}>
                  <Typography
                    variant="label"
                    as="span"
                    className={styles.label}
                  >
                    Timezone:
                  </Typography>
                  <Typography
                    variant="body2"
                    as="span"
                    className={styles.value}
                  >
                    {schedule.timezone?.name || 'N/A'}
                  </Typography>
                </div>

                <div className={styles.infoRow}>
                  <Typography
                    variant="label"
                    as="span"
                    className={styles.label}
                  >
                    Salary Type:
                  </Typography>
                  <Typography
                    variant="body2"
                    as="span"
                    className={styles.value}
                  >
                    {schedule.salaryType === 'FIXED'
                      ? 'Fixed Salary'
                      : 'Hourly Rate'}
                  </Typography>
                </div>

                <div className={styles.infoRow}>
                  <Typography
                    variant="label"
                    as="span"
                    className={styles.label}
                  >
                    Salary Amount:
                  </Typography>
                  <Typography
                    variant="body2"
                    as="span"
                    className={styles.value}
                  >
                    {schedule.salaryAmount} {schedule.moneyUnitName || ''} (
                    {schedule.moneyUnitSymbol || ''})
                  </Typography>
                </div>

                <div className={styles.infoRow}>
                  <Typography
                    variant="label"
                    as="span"
                    className={styles.label}
                  >
                    Effective Date:
                  </Typography>
                  <Typography
                    variant="body2"
                    as="span"
                    className={styles.value}
                  >
                    {schedule.effectiveDate || 'N/A'}
                  </Typography>
                </div>
              </div>

              <div className={styles.divider} />

              <h4 className={styles.subTitle}>
                <Typography variant="heading5">Weekly Schedule</Typography>
              </h4>
              <div className={styles.weeklySchedule}>
                {weekdays.map((day) => (
                  <div key={day.key} className={styles.scheduleItem}>
                    <Typography
                      variant="body2"
                      as="span"
                      className={styles.dayName}
                    >
                      {day.key}
                    </Typography>
                    <Tag tagType="grey-light" className={styles.scheduleTag}>
                      <Typography variant="body3" as="span">
                        {day.schedule?.name}
                      </Typography>
                    </Tag>
                  </div>
                ))}
              </div>

              {schedule.isOwnRates && (
                <>
                  <div className={styles.divider} />
                  <h4 className={styles.subTitle}>Custom Shift Rates</h4>
                  <div className={styles.scheduleInfo}>
                    <div className={styles.infoRow}>
                      <Typography
                        variant="label"
                        as="span"
                        className={styles.label}
                      >
                        Overtime:
                      </Typography>
                      <Typography
                        variant="body2"
                        as="span"
                        className={styles.value}
                      >
                        {schedule.overtimeRate}%
                      </Typography>
                    </div>
                    <div className={styles.infoRow}>
                      <Typography
                        variant="label"
                        as="span"
                        className={styles.label}
                      >
                        Night:
                      </Typography>
                      <Typography
                        variant="body2"
                        as="span"
                        className={styles.value}
                      >
                        {schedule.nightRate}%
                      </Typography>
                    </div>
                    <div className={styles.infoRow}>
                      <Typography
                        variant="label"
                        as="span"
                        className={styles.label}
                      >
                        Weekend:
                      </Typography>
                      <Typography
                        variant="body2"
                        as="span"
                        className={styles.value}
                      >
                        {schedule.weekendRate}%
                      </Typography>
                    </div>
                    <div className={styles.infoRow}>
                      <Typography
                        variant="label"
                        as="span"
                        className={styles.label}
                      >
                        Holiday:
                      </Typography>
                      <Typography
                        variant="body2"
                        as="span"
                        className={styles.value}
                      >
                        {schedule.holidayRate}%
                      </Typography>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <EmptyState
                title="No schedule assigned yet"
                actionBtnText="Assign Schedule"
                actionBtnIcon={<PlusOutlined />}
                onAction={handleOpenAssignModal}
                accessToAction={canEdit}
              />
            </div>
          )}
        </Card>
      </div>

      <AssignScheduleModal
        open={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        onAssign={(data) => {
          void handleAssignSchedule(data);
        }}
        loading={isAssigning}
        employeeId={employeeId}
      />

      <EditScheduleModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={(data) => {
          void handleUpdateSchedule(data);
        }}
        loading={isUpdating}
        employeeId={employeeId}
        initialData={schedule}
      />
    </>
  );
};
