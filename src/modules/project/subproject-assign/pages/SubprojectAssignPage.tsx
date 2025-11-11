import { useState } from 'react';

import { AssignItem } from '@/components/AssignItem/AssignItem';
import { Button } from '@/components/Button';
import { CustomCard } from '@/components/Card/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { toSelectOptions } from '@/utils/utils';

import { useSubProjects } from '../../sub-projects/hooks/useSubProjects';
import {
  useAssignedProjects,
  useAssignTeamsMutation,
  useRemoveTeamsMutation,
  useUnassignedProjects,
} from '../hooks/useSubprojectAssign';

export default function ProjectAssignPage() {
  const { data } = useSubProjects({ page: 0, size: 200 });

  const [selectedSubprojectId, setSelectedSubProjectId] = useState<
    number | null
  >(null);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  const { data: assignedData } = useAssignedProjects(selectedSubprojectId);
  const { data: unAssignedData, isLoading: unAssignLoading } =
    useUnassignedProjects(selectedSubprojectId);

  const assignMutation = useAssignTeamsMutation();
  const removeMutation = useRemoveTeamsMutation();

  const toggleSelection = (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    setSelectedTeams((prev) =>
      prev.includes(numId)
        ? prev.filter((sid) => sid !== numId)
        : [...prev, numId],
    );
  };

  const handleRemoveTeams = () => {
    if (selectedSubprojectId) {
      removeMutation.mutate(
        {
          projectId: selectedSubprojectId,
          subprojectIds: selectedTeams,
        },
        {
          onSuccess: () => {
            setSelectedTeams([]);
          },
        },
      );
    }
  };

  const handleAssignTeams = () => {
    if (selectedSubprojectId) {
      assignMutation.mutate(
        {
          projectId: selectedSubprojectId,
          subprojects: selectedTeams,
        },
        {
          onSuccess: () => {
            setSelectedTeams([]);
          },
        },
      );
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:justify-between">
      <CustomCard
        title="Subproject"
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
                  setSelectedSubProjectId(Number(value))
                }
                options={toSelectOptions(
                  Array.isArray(data?.content) ? data?.content : [],
                )}
                width={'100%'}
                height={44}
              />
              <AssignItem
                data={assignedData}
                toggleSelect={toggleSelection}
                selectedData={selectedTeams}
              />
            </div>
            <div className="flex justify-end items-end w-full">
              <Button
                buttonType={'action'}
                onClick={handleRemoveTeams}
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
      {selectedSubprojectId && (
        <CustomCard
          title="Team"
          loading={unAssignLoading}
          className="w-full lg:w-[48%] flex flex-col h-full"
          styles={{
            body: {
              flex: 1,
            },
          }}
          renderBody={() => (
            <div className="flex flex-col h-full">
              <div className="flex-1 flex flex-col gap-5">
                <Input />
                <AssignItem
                  data={unAssignedData}
                  toggleSelect={toggleSelection}
                  selectedData={selectedTeams}
                />
              </div>
              <div className="flex justify-end items-end w-full">
                <Button
                  onClick={handleAssignTeams}
                  disabled={!selectedTeams.length || assignMutation.isPending}
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
