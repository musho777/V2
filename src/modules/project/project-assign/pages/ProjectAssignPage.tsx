import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { AssignItem } from '@/components/AssignItem/AssignItem';
import { Button } from '@/components/Button';
import { CustomCard } from '@/components/Card/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { toSelectOptions } from '@/utils/utils';

import { useProjects } from '../../../../hooks/useProjects';
import {
  useAssignedProjects,
  useUnassignedProjects,
} from '../hooks/useProjectAssign';
import { projectAssignService } from '../services/projectAssign.service';

export default function ProjectAssignPage() {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { data } = useProjects({ page: 0, size: 200 }, isSelectOpen);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const [selectedSubprojects, setSelectedSubprojects] = useState<number[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);

  const { data: assignedData, refetch: refetchAssigned } =
    useAssignedProjects(selectedProjectId);

  const {
    data: unAssignedData,
    isLoading: unAssignLoading,
    refetch: refetchUnAssigned,
  } = useUnassignedProjects(selectedProjectId);

  const removeMutation = useMutation({
    mutationFn: () =>
      projectAssignService.removeSubprojects({
        projectId: selectedProjectId as number,
        subprojectIds: selectedProjects,
      }),
    onSuccess: () => {
      void refetchAssigned();
      void refetchUnAssigned();
      setSelectedProjects([]);
    },
    onError: (error) => {
      console.error('Failed to remove subprojects:', error);
    },
  });

  const assignMutation = useMutation({
    mutationFn: () =>
      projectAssignService.assignSubprojects({
        projectId: selectedProjectId as number,
        subprojects: selectedSubprojects.map((id) => ({ id })),
      }),
    onSuccess: () => {
      void refetchAssigned();
      void refetchUnAssigned();
      setSelectedSubprojects([]);
    },
    onError: (error) => {
      console.error('Failed to assign subprojects:', error);
    },
  });

  const toggleSubproject = (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    setSelectedSubprojects((prev) =>
      prev.includes(numId)
        ? prev.filter((sid) => sid !== numId)
        : [...prev, numId],
    );
  };
  const toggleProject = (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    setSelectedProjects((prev) =>
      prev.includes(numId)
        ? prev.filter((sid) => sid !== numId)
        : [...prev, numId],
    );
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:justify-between">
      <CustomCard
        title="Project"
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
                  setSelectedProjectId(Number(value))
                }
                onOpenChange={(open) => setIsSelectOpen(open)}
                options={toSelectOptions(
                  Array.isArray(data?.content) ? data?.content : [],
                )}
                width={'100%'}
                height={44}
              />
              <AssignItem
                data={assignedData}
                toggleSelect={toggleProject}
                selectedData={selectedProjects}
              />
            </div>

            <div className="flex justify-end items-end w-full">
              <Button
                buttonType={'action'}
                onClick={() => removeMutation.mutate()}
                disabled={!selectedProjects.length || assignMutation.isPending}
                key={1}
                loading={removeMutation.isPending}
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      />
      {selectedProjectId && (
        <CustomCard
          title="Subproject"
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
                <Input height={44} />
                <AssignItem
                  data={unAssignedData}
                  toggleSelect={toggleSubproject}
                  selectedData={selectedSubprojects}
                />
              </div>
              <div className="flex justify-end items-end w-full">
                <Button
                  onClick={() => assignMutation.mutate()}
                  disabled={
                    !selectedSubprojects.length || assignMutation.isPending
                  }
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
