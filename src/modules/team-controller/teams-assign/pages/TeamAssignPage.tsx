import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { AssignItem } from '@/components/AssignItem/AssignItem';
import { Button } from '@/components/Button';
import { CustomCard } from '@/components/Card/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

import {
  useAssignedTeams,
  useEnabledTeams,
  useUnassignedTeams,
} from '../hooks/useTeamAssign';
import { projectAssignService } from '../services/teamAssign.service';
import type { TeamInterface } from '../types/team.types';

export default function TeamAssignPage() {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<number[]>([]);

  const {
    data: enabledTeams,
    refetch: refetchEnabledTeams,
    isFetching: isLoadingTeams,
  } = useEnabledTeams(false);

  const teams: TeamInterface[] =
    enabledTeams?.map((team) => ({
      value: String(team.id),
      label: team.name,
    })) || [];

  const {
    data: assignedData,
    isLoading: assignedDataLoading,
    refetch: refetchAssigned,
  } = useAssignedTeams(selectedTeamId);

  const { data: unAssignedData, refetch: refetchUnAssigned } =
    useUnassignedTeams(selectedTeamId);

  const removeMutation = useMutation({
    mutationFn: () =>
      projectAssignService.removeTeams({
        teamId: selectedTeamId as number,
        userIds: selectedTeams,
      }),
    onSuccess: () => {
      void refetchAssigned();
      void refetchUnAssigned();
      setSelectedUser([]);
    },
    onError: (error) => {
      console.error('Failed to remove subprojects:', error);
    },
  });
  const assignMutation = useMutation({
    mutationFn: () =>
      projectAssignService.assignTeams({
        teamId: selectedTeamId as number,
        userIds: selectedUser.map((id) => id),
      }),
    onSuccess: () => {
      void refetchAssigned();
      void refetchUnAssigned();
      setSelectedUser([]);
    },
    onError: (error) => {
      console.error('Failed to assign subprojects:', error);
    },
  });

  const toggleSelection = (
    id: number | string,
    setter: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    setter((prev) =>
      prev.includes(numericId)
        ? prev.filter((sid) => sid !== numericId)
        : [...prev, numericId],
    );
  };

  const toggleTeam = (id: number | string) =>
    toggleSelection(id, setSelectedTeams);
  const toggleUser = (id: number | string) =>
    toggleSelection(id, setSelectedUser);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:justify-between">
      <CustomCard
        title="Team"
        className="w-full lg:w-[48%] flex flex-col h-full"
        styles={{
          body: {
            flex: 1,
          },
        }}
        renderBody={() => (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col gap-5">
              <Select
                onChange={(value: string | number) =>
                  setSelectedTeamId(Number(value))
                }
                onOpenChange={(open) => {
                  if (open && !enabledTeams) {
                    void refetchEnabledTeams();
                  }
                }}
                options={teams}
                loading={isLoadingTeams}
                width={'100%'}
              />
              <AssignItem
                selectedData={selectedTeams}
                data={assignedData}
                toggleSelect={toggleTeam}
              />
            </div>
            <div className="flex justify-end items-end w-full">
              <Button
                buttonType={'action'}
                onClick={() => removeMutation.mutate()}
                disabled={!selectedTeams.length || assignMutation.isPending}
                key={1}
                loading={removeMutation.isPending}
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      />
      {selectedTeamId && (
        <CustomCard
          title="Members"
          loading={assignedDataLoading}
          className="w-full lg:w-[48%] flex flex-col h-full"
          styles={{
            body: {
              flex: 1,
            },
          }}
          renderBody={() => (
            <div className="gap-5 flex flex-col h-full">
              <div className="flex-1 flex flex-col gap-5">
                <Input height={38} />
                <AssignItem
                  selectedData={selectedUser}
                  data={unAssignedData}
                  toggleSelect={toggleUser}
                />
              </div>
              <div className="flex justify-end items-end w-full">
                <Button
                  onClick={() => assignMutation.mutate()}
                  disabled={!selectedUser.length || assignMutation.isPending}
                  key={1}
                  buttonType={'action'}
                  loading={assignMutation.isPending}
                >
                  Assign
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
