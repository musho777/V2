'use client';

import { useEffect, useState } from 'react';

import { AttendancePolicyCard } from '@/components/AttendancePolicyCard';
import { Button } from '@/components/Button';
import { CreateAttendancePolicyModal } from '@/components/CreateAttendancePolicyModal';
import { CreateScheduleModal } from '@/components/CreateScheduleModal';
import { Input } from '@/components/Input';
import { MessageModal } from '@/components/MessageModal';
import { PageTabs } from '@/components/PageTabs';
import { ScheduleCard } from '@/components/ScheduleCard';
import {
  useAttendancePolicies,
  useCreateAttendancePolicy,
  useDeleteAttendancePolicy,
  useUpdateAttendancePolicy,
} from '@/hooks/useAttendancePolicies';
import useDebounce from '@/hooks/useDebounce';
import {
  useCreateSchedule,
  useDeleteSchedule,
  useSchedules,
  useUpdateSchedule,
} from '@/hooks/useSchedules';
import type {
  AttendancePolicy,
  CreateAttendancePolicyRequest,
} from '@/types/attendance-policy.types';
import type { CreateScheduleRequest, Schedule } from '@/types/schedule.types';

import styles from './styles.module.scss';

export default function SchedulesPage() {
  const [searchValue, setSearchValue] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const [editMode, setEditMode] = useState(false);

  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState(false);
  const [isDeletePolicyModalOpen, setIsDeletePolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<AttendancePolicy | null>(
    null,
  );
  const [selectedPolicyName, setSelectedPolicyName] = useState<string>('');
  const [policyEditMode, setPolicyEditMode] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('schedules-active-tab') || 'schedules';
    }
    return 'schedules';
  });

  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    localStorage.setItem('schedules-active-tab', activeTab);
  }, [activeTab]);

  const { data: schedulesData, isLoading } = useSchedules({
    name: debouncedSearchValue || undefined,
    page: 0,
    size: 100,
  });
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const { data: policiesData, isLoading: isPoliciesLoading } =
    useAttendancePolicies();
  const createPolicy = useCreateAttendancePolicy();
  const updatePolicy = useUpdateAttendancePolicy();
  const deletePolicy = useDeleteAttendancePolicy();

  const schedules = schedulesData?.content || [];
  const policies = policiesData || [];

  const handleAddSchedule = () => {
    setEditMode(false);
    setSelectedSchedule(null);
    setIsCreateModalOpen(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditMode(true);
    setSelectedSchedule(schedule);
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSchedule) {
      try {
        await deleteSchedule.mutateAsync(selectedSchedule.id);
        setIsDeleteModalOpen(false);
        setSelectedSchedule(null);
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const handleSubmitSchedule = async (data: CreateScheduleRequest) => {
    try {
      if (editMode && selectedSchedule) {
        await updateSchedule.mutateAsync({
          ...data,
          id: selectedSchedule.id,
        });
      } else {
        await createSchedule.mutateAsync(data);
      }
      setIsCreateModalOpen(false);
      setSelectedSchedule(null);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleAddPolicy = () => {
    setPolicyEditMode(false);
    setSelectedPolicy(null);
    setSelectedPolicyName('');
    setIsCreatePolicyModalOpen(true);
  };

  const handleEditPolicy = (policy: AttendancePolicy) => {
    setPolicyEditMode(true);
    setSelectedPolicy(policy);
    setSelectedPolicyName('');
    setIsCreatePolicyModalOpen(true);
  };

  const handleDeletePolicyClick = (policy: AttendancePolicy) => {
    setSelectedPolicy(policy);
    setIsDeletePolicyModalOpen(true);
  };

  const handleConfirmDeletePolicy = async () => {
    if (selectedPolicy) {
      try {
        await deletePolicy.mutateAsync(selectedPolicy.id);
        setIsDeletePolicyModalOpen(false);
        setSelectedPolicy(null);
      } catch (error) {
        console.error('Error deleting policy:', error);
      }
    }
  };

  const handleSubmitPolicy = async (data: CreateAttendancePolicyRequest) => {
    try {
      if (policyEditMode && selectedPolicy) {
        await updatePolicy.mutateAsync({
          ...data,
          id: selectedPolicy.id,
        });
      } else {
        await createPolicy.mutateAsync(data);
      }
      setIsCreatePolicyModalOpen(false);
      setSelectedPolicy(null);
      setSelectedPolicyName('');
      setPolicyEditMode(false);
    } catch (error) {
      console.error('Error saving policy:', error);
    }
  };

  const tabs = [
    {
      key: 'schedules',
      label: 'Schedules',
      children: (
        <>
          <div className={styles.filterSection}>
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              width={273}
              type="search"
              className={styles.searchInput}
            />
            <Button
              buttonType="action"
              onClick={handleAddSchedule}
              className={styles.addButton}
            >
              + Add schedule
            </Button>
          </div>

          <div className={styles.cardsContainer}>
            {isLoading ? (
              <div className={styles.loadingMessage}>Loading schedules...</div>
            ) : schedules.length === 0 ? (
              <div className={styles.emptyMessage}>
                <p>No schedules found.</p>
                <p>
                  Create your first schedule by clicking the &ldquo;Add
                  schedule&rdquo; button.
                </p>
              </div>
            ) : (
              schedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onEdit={handleEditSchedule}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </div>
        </>
      ),
    },
    {
      key: 'attendance',
      label: 'Attendance Policy',
      children: (
        <>
          <div className={styles.filterSection}>
            <div style={{ width: 273 }} />
            <Button
              buttonType="action"
              onClick={handleAddPolicy}
              className={styles.addButton}
            >
              + Add policy
            </Button>
          </div>

          <div className={styles.cardsContainer}>
            {isPoliciesLoading ? (
              <div className={styles.loadingMessage}>Loading policies...</div>
            ) : policies.length === 0 ? (
              <div className={styles.emptyMessage}>
                <p>No policies found.</p>
                <p>
                  Create your first policy by clicking the &ldquo;Add
                  policy&rdquo; button.
                </p>
              </div>
            ) : (
              policies.map((policy) => (
                <AttendancePolicyCard
                  key={policy.id}
                  policy={policy}
                  onEdit={handleEditPolicy}
                  onDelete={handleDeletePolicyClick}
                />
              ))
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageTabs
        tabs={tabs}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      />

      <CreateScheduleModal
        open={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedSchedule(null);
          setEditMode(false);
        }}
        onSubmit={(data) => {
          void handleSubmitSchedule(data);
        }}
        mode={editMode ? 'edit' : 'create'}
        initialData={
          editMode && selectedSchedule
            ? {
                name: selectedSchedule.name,
                description: selectedSchedule.description,
                workingStatus: selectedSchedule.workingStatus,
                shiftStartTime: selectedSchedule.shiftStartTime,
                shiftEndTime: selectedSchedule.shiftEndTime,
                breakStartTime: selectedSchedule.breakStartTime,
                breakEndTime: selectedSchedule.breakEndTime,
                nightStartTime: selectedSchedule.nightStartTime,
                nightEndTime: selectedSchedule.nightEndTime,
                overtimeRate: selectedSchedule.overtimeRate,
                nightRate: selectedSchedule.nightRate,
                weekendRate: selectedSchedule.weekendRate,
                holidayRate: selectedSchedule.holidayRate,
              }
            : undefined
        }
      />

      <MessageModal
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedSchedule(null);
        }}
        onSubmit={() => {
          void handleConfirmDelete();
        }}
        title="Delete Schedule"
        message={`Are you sure you want to delete "${selectedSchedule?.name}" schedule?`}
        submitButtonText="Delete"
        closeButtonText="Cancel"
        type="error"
      />

      <CreateAttendancePolicyModal
        open={isCreatePolicyModalOpen}
        onClose={() => {
          setIsCreatePolicyModalOpen(false);
          setSelectedPolicy(null);
          setSelectedPolicyName('');
          setPolicyEditMode(false);
        }}
        onSubmit={(data) => {
          void handleSubmitPolicy(data);
        }}
        mode={policyEditMode ? 'edit' : 'create'}
        initialData={
          policyEditMode && selectedPolicy
            ? {
                name: selectedPolicyName,
                dailyAcceptableMinutes: selectedPolicy.dailyAcceptableMinutes,
                dailyUnacceptableMinutes:
                  selectedPolicy.dailyUnacceptableMinutes,
                monthlyAcceptableMinutes:
                  selectedPolicy.monthlyAcceptableMinutes,
                monthlyUnacceptableMinutes:
                  selectedPolicy.monthlyUnacceptableMinutes,
              }
            : undefined
        }
      />

      <MessageModal
        open={isDeletePolicyModalOpen}
        onCancel={() => {
          setIsDeletePolicyModalOpen(false);
          setSelectedPolicy(null);
        }}
        onSubmit={() => {
          void handleConfirmDeletePolicy();
        }}
        title="Delete Policy"
        message={`Are you sure you want to delete policy #${selectedPolicy?.id}?`}
        submitButtonText="Delete"
        closeButtonText="Cancel"
        type="error"
      />
    </div>
  );
}
