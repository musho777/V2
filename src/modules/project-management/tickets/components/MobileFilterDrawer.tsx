import { Drawer, Row } from 'antd';
import dayjs from 'dayjs';

import { DatePicker } from '@/components/DatePicker';
import { Select } from '@/components/Select';
import { toSelectOptions } from '@/utils/utils';

import {
  useEnabledAssignees,
  useEnabledProjects,
  useEnabledSubprojects,
  useEnabledWatchers,
  usePriorities,
  useStatuses,
  useTrackers,
} from '../../createTicket/hook/useCreateTicket';
import { useTicketSearchParams } from '../hooks/useTicketSearch';

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  shouldGetTrackers: boolean;
  setShouldGetTrackers: (value: boolean) => void;
  shouldGetPriorities: boolean;
  setShouldGetPriorities: (value: boolean) => void;
  shouldGetStatuses: boolean;
  setShouldGetStatuses: (value: boolean) => void;
  shouldGetProjects: boolean;
  setShouldGetProjects: (value: boolean) => void;
  shouldGetSubprojects: boolean;
  setShouldGetSubprojects: (value: boolean) => void;
  shouldGetAssignees: boolean;
  setShouldGetAssignees: (value: boolean) => void;
  shouldGetCreatedBy: boolean;
  setShouldGetCreatedBy: (value: boolean) => void;
  projectSearchQuery: string;
  setProjectSearchQuery: (value: string) => void;
  subprojectSearchQuery: string;
  setSubprojectSearchQuery: (value: string) => void;
  assigneeSearchQuery: string;
  setAssigneeSearchQuery: (value: string) => void;
  createdBySearchQuery: string;
  setCreatedBySearchQuery: (value: string) => void;
  setFirst: (value: boolean) => void;
}

export default function MobileFilterDrawer({
  open,
  onClose,
  shouldGetTrackers,
  setShouldGetTrackers,
  shouldGetPriorities,
  setShouldGetPriorities,
  shouldGetStatuses,
  setShouldGetStatuses,
  shouldGetProjects,
  setShouldGetProjects,
  shouldGetSubprojects,
  setShouldGetSubprojects,
  shouldGetAssignees,
  setShouldGetAssignees,
  shouldGetCreatedBy,
  setShouldGetCreatedBy,
  projectSearchQuery,
  setProjectSearchQuery,
  subprojectSearchQuery,
  setSubprojectSearchQuery,
  assigneeSearchQuery,
  setAssigneeSearchQuery,
  createdBySearchQuery,
  setCreatedBySearchQuery,
  setFirst,
}: MobileFilterDrawerProps) {
  const { searchData, setTicketSearchData } = useTicketSearchParams();
  const { data: projects, isLoading: isProjectLoading } = useEnabledProjects(
    shouldGetProjects,
    projectSearchQuery,
  );

  const { data: subprojects, isLoading: isSubprojectLoading } =
    useEnabledSubprojects(
      undefined,
      subprojectSearchQuery,
      shouldGetSubprojects,
    );

  const { data: assignees, isLoading: isAssigneeLoading } = useEnabledAssignees(
    undefined,
    assigneeSearchQuery,
    shouldGetAssignees,
  );

  const { data: createdByUsers, isLoading: isCreatedByLoading } =
    useEnabledWatchers(undefined, createdBySearchQuery, shouldGetCreatedBy);

  const { data: trackers } = useTrackers(shouldGetTrackers);
  const { data: priorities } = usePriorities(shouldGetPriorities);
  const { data: statuses } = useStatuses(shouldGetStatuses);

  const handleClearAllFilters = () => {
    setFirst(true);
    setTicketSearchData({
      projectIds: [],
      subprojectIds: [],
      priorityIds: [],
      statusIds: [],
      trackerIds: [],
      assigneeUserIds: [],
      createdByIds: [],
      createdDateFrom: '',
      createdDateTo: '',
    });
  };

  return (
    <Drawer
      title="Filter"
      placement="bottom"
      onClose={onClose}
      open={open}
      height="80vh"
    >
      <div className="flex flex-col gap-4">
        <DatePicker
          placeholder="Created date from"
          width={'100%'}
          format="DD/MM/YYYY"
          value={
            searchData.createdDateFrom
              ? dayjs(searchData.createdDateFrom)
              : null
          }
          maxDate={
            searchData.createdDateTo
              ? dayjs(searchData.createdDateTo)
              : undefined
          }
          onChange={(date) => {
            setTicketSearchData({
              createdDateFrom: date ? date.format('YYYY-MM-DD') : '',
            });
          }}
        />
        <DatePicker
          placeholder="Created date to"
          width={'100%'}
          format="DD/MM/YYYY"
          value={
            searchData.createdDateTo ? dayjs(searchData.createdDateTo) : null
          }
          minDate={
            searchData.createdDateFrom
              ? dayjs(searchData.createdDateFrom)
              : undefined
          }
          onChange={(date) => {
            setTicketSearchData({
              createdDateTo: date ? date.format('YYYY-MM-DD') : '',
            });
          }}
        />
        <Select
          placeholder="Select Project"
          label="Project"
          mode="multiple"
          width={'100%'}
          showSearch
          filterOption={false}
          loading={isProjectLoading}
          value={searchData.projectIds}
          options={toSelectOptions(Array.isArray(projects) ? projects : [])}
          onSearch={(value) => {
            setProjectSearchQuery(value);
          }}
          onOpenChange={(open) => {
            if (open) {
              setFirst(true);
              setShouldGetProjects(true);
              setProjectSearchQuery('');
            }
          }}
          onChange={(values) => {
            const projectIds = Array.isArray(values)
              ? values.map((v) => Number(v))
              : [];
            setTicketSearchData({ projectIds: projectIds });
          }}
        />
        <Select
          placeholder="Select Subproject"
          label="Subproject"
          mode="multiple"
          width={'100%'}
          filterOption={false}
          loading={isSubprojectLoading}
          disabled={
            !searchData.projectIds || searchData.projectIds.length === 0
          }
          value={searchData.subprojectIds}
          options={toSelectOptions(
            Array.isArray(subprojects) ? subprojects : [],
          )}
          onSearch={(value) => {
            setSubprojectSearchQuery(value);
          }}
          onOpenChange={(open) => {
            if (open) {
              setFirst(true);
              setShouldGetSubprojects(true);
              setSubprojectSearchQuery('');
            }
          }}
          onChange={(values) => {
            const subprojectIds = Array.isArray(values)
              ? values.map((v) => Number(v))
              : [];
            setTicketSearchData({ subprojectIds });
          }}
        />
        <Select
          placeholder="Select Assignee"
          label="Assignee"
          mode="multiple"
          width={'100%'}
          showSearch
          filterOption={false}
          loading={isAssigneeLoading}
          value={searchData.assigneeUserIds}
          options={toSelectOptions(Array.isArray(assignees) ? assignees : [])}
          onSearch={(value) => {
            setAssigneeSearchQuery(value);
          }}
          onOpenChange={(open) => {
            if (open) {
              setFirst(true);
              setShouldGetAssignees(true);
              setAssigneeSearchQuery('');
            }
          }}
          onChange={(values) => {
            const assigneeUserIds = Array.isArray(values)
              ? values.map((v) => Number(v))
              : [];
            setTicketSearchData({ assigneeUserIds });
          }}
        />
        <Select
          placeholder="Select Created By"
          label="Created By"
          mode="multiple"
          width={'100%'}
          showSearch
          filterOption={false}
          loading={isCreatedByLoading}
          value={searchData.createdByIds}
          options={toSelectOptions(
            Array.isArray(createdByUsers) ? createdByUsers : [],
          )}
          onSearch={(value) => {
            setCreatedBySearchQuery(value);
          }}
          onOpenChange={(open) => {
            if (open) {
              setFirst(true);
              setShouldGetCreatedBy(true);
              setCreatedBySearchQuery('');
            }
          }}
          onChange={(values) => {
            const createdByIds = Array.isArray(values)
              ? values.map((v) => Number(v))
              : [];
            setTicketSearchData({ createdByIds });
          }}
        />
        <Row style={{ justifyContent: 'space-between' }}></Row>
        <Select
          placeholder="Select Priority"
          label="Priority"
          mode="multiple"
          width={'100%'}
          value={searchData.priorityIds}
          options={toSelectOptions(Array.isArray(priorities) ? priorities : [])}
          onOpenChange={(open) => {
            if (open) {
              setFirst(true);
              setShouldGetPriorities(true);
            }
          }}
          onChange={(values) => {
            const priorityIds = Array.isArray(values)
              ? values.map((v) => Number(v))
              : [];
            setTicketSearchData({ priorityIds });
          }}
        />
        <Select
          placeholder="Select Status"
          label="Status"
          mode="multiple"
          width={'100%'}
          value={searchData.statusIds}
          options={toSelectOptions(Array.isArray(statuses) ? statuses : [])}
          onOpenChange={(open) => {
            if (open) {
              setFirst(true);
              setShouldGetStatuses(true);
            }
          }}
          onChange={(values) => {
            const statusIds = Array.isArray(values)
              ? values.map((v) => Number(v))
              : [];
            setTicketSearchData({ statusIds: statusIds });
          }}
        />
        <Select
          label="Tracker"
          mode="multiple"
          placeholder="Select Tracker"
          width={'100%'}
          options={toSelectOptions(Array.isArray(trackers) ? trackers : [])}
          value={searchData.trackerIds}
          name="tracker"
          onOpenChange={(open) => {
            if (open) {
              setFirst(true);
              setShouldGetTrackers(true);
            }
          }}
          onChange={(values) => {
            const trackerIds = Array.isArray(values)
              ? values.map((v) => Number(v))
              : [];
            setTicketSearchData({ trackerIds: trackerIds });
          }}
        />
      </div>
      <div className="flex justify-end mt-4">
        <p
          onClick={handleClearAllFilters}
          className="cursor-pointer text-[rgb(29,53,87)] text-[14px] font-semibold w-[57px] underline"
        >
          Clear all
        </p>
      </div>
    </Drawer>
  );
}
