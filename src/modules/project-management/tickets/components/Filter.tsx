import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Col, Row } from 'antd';
import dayjs from 'dayjs';

import { Button } from '@/components/Button';
import { DatePicker } from '@/components/DatePicker';
import { UserIcon, UsersIcon, WatchIcon } from '@/components/Icons';
import { Input } from '@/components/Input';
import { ResetButton } from '@/components/ResetButton';
import { Select } from '@/components/Select';
import useDebounce from '@/hooks/useDebounce';
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
import { useTicketCounts } from '../hooks/useTickets';
import { useTicketSearchParams } from '../hooks/useTicketSearch';

import { IconCircle } from './IconCircle';
import MobileFilterDrawer from './MobileFilterDrawer';
import MobileSearchDrawer from './MobileSearchDrawer';

import styles from './IconCircle.module.scss';

export default function Filter() {
  const router = useRouter();
  const { data: counts } = useTicketCounts();
  const { searchData, setTicketSearchData, resetSearchData } =
    useTicketSearchParams();
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ticketId, setTicketId] = useState(searchData.id || '');
  const [searchText, setSearchText] = useState(searchData.search || '');
  const debouncedTicketId = useDebounce(ticketId, 500);
  const debouncedSearchText = useDebounce(searchText, 500);
  const [first, setFirst] = useState(false);
  const [shouldGetTrackers, setShouldGetTrackers] = useState(false);
  const [shouldGetPriorities, setShouldGetPriorities] = useState(false);
  const [shouldGetStatuses, setShouldGetStatuses] = useState(false);
  const [shouldGetProjects, setShouldGetProjects] = useState(false);
  const [shouldGetSubprojects, setShouldGetSubprojects] = useState(false);
  const [shouldGetAssignees, setShouldGetAssignees] = useState(false);
  const [shouldGetCreatedBy, setShouldGetCreatedBy] = useState(false);

  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');
  const [subprojectSearchQuery, setSubprojectSearchQuery] =
    useState<string>('');
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState<string>('');
  const [createdBySearchQuery, setCreatedBySearchQuery] = useState<string>('');

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

  const handleClearSearch = () => {
    setFirst(true);
    setTicketId('');
    setSearchText('');
    setTicketSearchData({
      id: '',
      search: '',
    });
  };

  const handelResetAll = () => {
    handleClearAllFilters();
    handleClearSearch();
    resetSearchData();
  };

  const handleSelectChange = (field: string) => (values: unknown) => {
    const ids = Array.isArray(values) ? values.map((v) => Number(v)) : [];
    setTicketSearchData({ [field]: ids });
  };

  const handleDateChange = (field: string) => (date: dayjs.Dayjs | null) => {
    setTicketSearchData({
      [field]: date ? date.format('YYYY-MM-DD') : '',
    });
  };

  const handleInputChange =
    (setter: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFirst(true);
      setter(e.target.value);
    };

  const handleOpenChange =
    (
      shouldGetSetter: (value: boolean) => void,
      searchQuerySetter?: (value: string) => void,
    ) =>
    (open: boolean) => {
      if (open) {
        setFirst(true);
        shouldGetSetter(true);
        if (searchQuerySetter) {
          searchQuerySetter('');
        }
      }
    };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (first) setTicketSearchData({ id: debouncedTicketId });
  }, [debouncedTicketId]);

  useEffect(() => {
    if (first) setTicketSearchData({ search: debouncedSearchText });
  }, [debouncedSearchText]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between w-full">
        {!isMobile && (
          <Row gutter={[12, 12]}>
            <Col>
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
                onChange={handleDateChange('createdDateFrom')}
              />
            </Col>
            <Col>
              <DatePicker
                placeholder="Created date to"
                width={'100%'}
                format="DD/MM/YYYY"
                value={
                  searchData.createdDateTo
                    ? dayjs(searchData.createdDateTo)
                    : null
                }
                minDate={
                  searchData.createdDateFrom
                    ? dayjs(searchData.createdDateFrom)
                    : undefined
                }
                onChange={handleDateChange('createdDateTo')}
              />
            </Col>
          </Row>
        )}
        {isMobile ? (
          <div className="flex justify-between w-full gap-2">
            <Button
              className="flex-1"
              height={38}
              onClick={() => {
                setFirst(true);
                setShowFilter(!showFilter);
                setShowSearch(false);
              }}
            >
              Filter
            </Button>
            <Button
              className="flex-1"
              height={38}
              onClick={() => {
                setFirst(true);
                setShowSearch(!showSearch);
                setShowFilter(false);
              }}
            >
              Search
            </Button>
          </div>
        ) : (
          <Row gutter={[12, 12]}>
            <Col>
              <Button
                className="w-[150px]"
                height={38}
                onClick={() => {
                  setFirst(true);
                  setShowFilter(!showFilter);
                  setShowSearch(false);
                }}
              >
                Filter
              </Button>
            </Col>
            <Col>
              <Button
                className="w-[150px]"
                height={38}
                onClick={() => {
                  setFirst(true);
                  setShowSearch(!showSearch);
                  setShowFilter(false);
                }}
              >
                Search
              </Button>
            </Col>
            <Col>
              <Button
                height={38}
                type="primary"
                className="w-[150px]"
                onClick={() => {
                  router.push('/project-management/create-ticket');
                }}
              >
                + Create Ticket
              </Button>
            </Col>
          </Row>
        )}
      </div>
      <div className="flex  items-center justify-between">
        <div
          className={`flex gap-4 items-center flex-wrap ${isMobile ? 'justify-center' : ''}`}
        >
          <div className={styles.filterItem}>
            <IconCircle
              active={false}
              icon={<UserIcon />}
              badge={counts?.assignedToMe}
            />
            <div className={styles.line} />
            <IconCircle
              borderColor="rgb(255, 106, 0)"
              icon={<p className="text-[11px] font-semibold">New</p>}
              badge={counts?.assignedToMeNew}
            />
          </div>
          <div className={styles.filterItem}>
            <IconCircle icon={<UsersIcon />} badge={counts?.assignedToMyTeam} />
            <div className={styles.line} />
            <IconCircle
              borderColor="rgb(255, 106, 0)"
              icon={<p className="text-[11px] font-semibold">New</p>}
              badge={counts?.assignedToMyTeamNew}
            />
          </div>
          <div className={styles.filterItem}>
            <IconCircle icon={<WatchIcon />} badge={counts?.watcher} />
            <div className={styles.line} />
            <IconCircle
              borderColor="rgb(255, 106, 0)"
              badge={counts?.watcherNew}
              icon={<p className="text-[11px] font-semibold">New</p>}
            />
          </div>
        </div>
        {!isMobile && <ResetButton onReset={handelResetAll} height={38} />}
      </div>

      {!isMobile && showFilter && (
        <div className="border-t border-[rgb(223,223,223)] !pt-[30px] relative">
          <button
            onClick={() => {
              setFirst(true);
              setShowFilter(false);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <Row gutter={[12, 12]}>
            <Col>
              <Select
                placeholder="Select Project"
                label="Project"
                mode="multiple"
                showSearch
                filterOption={false}
                loading={isProjectLoading}
                value={searchData.projectIds}
                options={toSelectOptions(
                  Array.isArray(projects) ? projects : [],
                )}
                onSearch={(value) => {
                  setProjectSearchQuery(value);
                }}
                onOpenChange={handleOpenChange(
                  setShouldGetProjects,
                  setProjectSearchQuery,
                )}
                onChange={handleSelectChange('projectIds')}
              />
            </Col>
            <Col>
              <Select
                placeholder="Select Subproject"
                label="Subproject"
                mode="multiple"
                loading={isSubprojectLoading}
                value={searchData.subprojectIds}
                options={toSelectOptions(
                  Array.isArray(subprojects) ? subprojects : [],
                )}
                onSearch={(value) => {
                  setSubprojectSearchQuery(value);
                }}
                onOpenChange={handleOpenChange(
                  setShouldGetSubprojects,
                  setSubprojectSearchQuery,
                )}
                onChange={handleSelectChange('subprojectIds')}
              />
            </Col>
            <Col>
              <Select
                placeholder="Select Assignee"
                label="Assignee"
                mode="multiple"
                showSearch
                filterOption={false}
                loading={isAssigneeLoading}
                value={searchData.assigneeUserIds}
                options={toSelectOptions(
                  Array.isArray(assignees) ? assignees : [],
                )}
                onSearch={(value) => {
                  setAssigneeSearchQuery(value);
                }}
                onOpenChange={handleOpenChange(
                  setShouldGetAssignees,
                  setAssigneeSearchQuery,
                )}
                onChange={handleSelectChange('assigneeUserIds')}
              />
            </Col>
            <Col>
              <Select
                placeholder="Select Created By"
                label="Created By"
                mode="multiple"
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
                onOpenChange={handleOpenChange(
                  setShouldGetCreatedBy,
                  setCreatedBySearchQuery,
                )}
                onChange={handleSelectChange('createdByIds')}
              />
            </Col>
            <Col>
              <Select
                placeholder="Select Priority"
                label="Priority"
                mode="multiple"
                showSearch
                value={searchData.priorityIds}
                options={toSelectOptions(
                  Array.isArray(priorities) ? priorities : [],
                )}
                onOpenChange={handleOpenChange(setShouldGetPriorities)}
                onChange={handleSelectChange('priorityIds')}
              />
            </Col>
            <Col>
              <Select
                placeholder="Select Status"
                label="Status"
                mode="multiple"
                showSearch
                value={searchData.statusIds}
                options={toSelectOptions(
                  Array.isArray(statuses) ? statuses : [],
                )}
                onOpenChange={handleOpenChange(setShouldGetStatuses)}
                onChange={handleSelectChange('statusIds')}
              />
            </Col>
            <Col>
              <Select
                label="Tracker"
                mode="multiple"
                placeholder="Select Tracker"
                showSearch
                options={toSelectOptions(
                  Array.isArray(trackers) ? trackers : [],
                )}
                value={searchData.trackerIds}
                name="tracker"
                onOpenChange={handleOpenChange(setShouldGetTrackers)}
                onChange={handleSelectChange('trackerIds')}
              />
            </Col>
          </Row>
          <div className="flex justify-end mt-4">
            <p
              onClick={handleClearAllFilters}
              className="cursor-pointer text-[rgb(29,53,87)] text-[14px] font-semibold w-[57px] underline"
            >
              Clear all
            </p>
          </div>
        </div>
      )}

      {isMobile && (
        <MobileFilterDrawer
          open={showFilter}
          onClose={() => setShowFilter(false)}
          shouldGetTrackers={shouldGetTrackers}
          setShouldGetTrackers={setShouldGetTrackers}
          shouldGetPriorities={shouldGetPriorities}
          setShouldGetPriorities={setShouldGetPriorities}
          shouldGetStatuses={shouldGetStatuses}
          setShouldGetStatuses={setShouldGetStatuses}
          shouldGetProjects={shouldGetProjects}
          setShouldGetProjects={setShouldGetProjects}
          shouldGetSubprojects={shouldGetSubprojects}
          setShouldGetSubprojects={setShouldGetSubprojects}
          shouldGetAssignees={shouldGetAssignees}
          setShouldGetAssignees={setShouldGetAssignees}
          shouldGetCreatedBy={shouldGetCreatedBy}
          setShouldGetCreatedBy={setShouldGetCreatedBy}
          projectSearchQuery={projectSearchQuery}
          setProjectSearchQuery={setProjectSearchQuery}
          subprojectSearchQuery={subprojectSearchQuery}
          setSubprojectSearchQuery={setSubprojectSearchQuery}
          assigneeSearchQuery={assigneeSearchQuery}
          setAssigneeSearchQuery={setAssigneeSearchQuery}
          createdBySearchQuery={createdBySearchQuery}
          setCreatedBySearchQuery={setCreatedBySearchQuery}
          setFirst={setFirst}
        />
      )}

      {!isMobile && showSearch && (
        <div className="border-t border-[rgb(223,223,223)] !pt-[30px] relative">
          <button
            onClick={() => {
              setFirst(true);
              setShowSearch(false);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <Row gutter={[12, 12]}>
            <Col>
              <Input
                height={38}
                placeholder="Enter ticket ID"
                label="Ticket ID"
                value={ticketId}
                type="number"
                onChange={handleInputChange(setTicketId)}
              />
            </Col>
            <Col>
              <Input
                height={38}
                placeholder="Enter ticket title or description"
                label="Ticket title or description"
                value={searchText}
                onChange={handleInputChange(setSearchText)}
              />
            </Col>
          </Row>
          <div className="flex justify-end mt-4">
            <p
              onClick={handleClearSearch}
              className="cursor-pointer text-[rgb(29,53,87)] text-[14px] font-semibold w-[57px] underline"
            >
              Clear all
            </p>
          </div>
        </div>
      )}

      {isMobile && (
        <MobileSearchDrawer
          open={showSearch}
          onClose={() => setShowSearch(false)}
          ticketId={ticketId}
          setTicketId={setTicketId}
          searchText={searchText}
          setSearchText={setSearchText}
          setTicketSearchData={setTicketSearchData}
          setFirst={setFirst}
        />
      )}
      {isMobile && (
        <Button
          type="primary"
          className="!fixed !bottom-6 !right-6 !w-11 !h-7 !rounded-full shadow-lg !z-50 !p-0 flex items-center justify-center text-2xl"
          onClick={() => {
            setFirst(true);
            router.push('/project-management/create-ticket');
          }}
        >
          +
        </Button>
      )}
    </div>
  );
}
