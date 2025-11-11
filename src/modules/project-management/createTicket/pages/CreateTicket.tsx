import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import type { UploadFile } from 'antd';
import { Col, Collapse, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Button } from '@/components/Button';
import { CustomCard } from '@/components/Card/Card';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { DragDropUploadFile } from '@/components/DragDropUploadFile/DragDropUploadFile';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { TextEditor } from '@/components/TextEditor';
import {
  HOURS_OPTIONS,
  MINUTES_OPTIONS,
  PROGRESS_OPTIONS,
} from '@/constants/constants';
import { toSelectOptions } from '@/utils/utils';

import { AppointmentForm } from '../components/AppointmentForm/AppointmentForm';
import { getSchema } from '../components/schema';
import {
  useCreateTicketMutation,
  useEnabledAssignees,
  useEnabledProjects,
  useEnabledSubprojects,
  useEnabledWatchers,
  useParentTasks,
  usePriorities,
  useStatuses,
  useTicketById,
  useTrackers,
  useUpdateTicketMutation,
} from '../hook/useCreateTicket';

import styles from './styles.module.scss';

const { Panel } = Collapse;
export default function CreateTicket() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string | undefined;
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [shouldGetProjects, setShouldGetProjects] = useState(false);
  const [shouldGetSubProjects, setShouldSubGetProjects] = useState(false);
  const [shouldGetAssignees, setShouldGetAssignees] = useState(false);
  const [shouldGetTrackers, setShouldGetTrackers] = useState(false);
  const [shouldGetPriorities, setShouldGetPriorities] = useState(false);
  const [shouldGetStatuses, setShouldGetStatuses] = useState(false);
  const [shouldGetWatchers, setShouldGetWatchers] = useState(false);
  const [shouldGetParentTasks, setShouldGetParentTasks] = useState(false);
  const [addAppointment, setAddAppointment] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState<UploadFile[]>(
    [],
  );
  const [selectedSubproject, setSelectedSubproject] = useState<{
    value: number;
    label: string;
    subprojectType?: string;
  } | null>(null);
  const [subprojectSearchQuery, setSubprojectSearchQuery] =
    useState<string>('');
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState<string>('');
  const [watcherSearchQuery, setWatcherSearchQuery] = useState<string>('');
  const [parentTaskIdOrTitle, setParentTaskIdOrTitle] = useState<string>('');

  const isEditMode = !!ticketId;
  const { data: ticketData, isLoading: isLoadingTicket } =
    useTicketById(ticketId);
  const { mutate: createTicket, isPending } = useCreateTicketMutation(() => {
    router.back();
  });
  const { mutate: updateTicket, isPending: isUpdating } =
    useUpdateTicketMutation(() => {
      router.back();
    });
  const { data: project, isLoading: isProjectLoading } = useEnabledProjects(
    shouldGetProjects,
    projectSearchQuery,
  );
  const { data: subproject, isLoading: isSubprojectLoading } =
    useEnabledSubprojects(
      selectedProjectId,
      subprojectSearchQuery,
      shouldGetSubProjects,
    );
  const { data: assignees, isLoading: isAssigneesLoading } =
    useEnabledAssignees(
      selectedSubproject?.value ? String(selectedSubproject.value) : '',
      assigneeSearchQuery,
      shouldGetAssignees,
    );

  const mergedAssignees =
    isEditMode && ticketData?.assignees
      ? [
          ...ticketData.assignees.map(
            (a: { user: { id: number; name: string } }) => ({
              id: a.user?.id,
              name: a.user?.name,
            }),
          ),
          ...(Array.isArray(assignees) ? assignees : []).filter(
            (assignee: { id: number }) =>
              !ticketData.assignees?.some(
                (a: { user: { id: number } }) => a.user?.id === assignee.id,
              ),
          ),
        ]
      : assignees;
  const { data: trackers } = useTrackers(shouldGetTrackers);
  const { data: priorities } = usePriorities(shouldGetPriorities);
  const { data: statuses } = useStatuses(shouldGetStatuses);
  const { data: watchers, isLoading: isWatchersLoading } = useEnabledWatchers(
    selectedSubproject?.value ? String(selectedSubproject.value) : '',
    watcherSearchQuery,
    shouldGetWatchers,
  );

  const mergedWatchers =
    isEditMode && ticketData?.watchers
      ? [
          ...ticketData.watchers.map((w: { id: number; name: string }) => ({
            id: w.id,
            name: w.name,
          })),
          ...(Array.isArray(watchers) ? watchers : []).filter(
            (watcher: { id: number }) =>
              !ticketData.watchers?.some(
                (w: { id: number }) => w.id === watcher.id,
              ),
          ),
        ]
      : watchers;

  const { data: parentTasks, isLoading: isParentTasksLoading } = useParentTasks(
    selectedSubproject?.value ? String(selectedSubproject.value) : '',
    shouldGetParentTasks,
    parentTaskIdOrTitle,
  );

  const handleRemove = (files) => {
    const item = [...removeFiles];
    item.push(files.uid);
    setRemoveFiles(item);
  };

  useEffect(() => {
    if (isEditMode && ticketData) {
      setSelectedProjectId(String(ticketData.project?.id || ''));
      if (ticketData.subproject) {
        setSelectedSubproject({
          value: ticketData.subproject.id,
          label: ticketData.subproject.name,
          subprojectType: ticketData.subproject.subprojectType,
        });
      }
      if (ticketData.attachments && Array.isArray(ticketData.attachments)) {
        const formattedAttachments: UploadFile[] = ticketData.attachments.map(
          (att: { id: number; name: string; url?: string }) => ({
            uid: String(att.id),
            name: att.name,
            status: 'done' as const,
            url:
              att.url ??
              `${process.env.NEXT_PUBLIC_BASE_URL}/test/${att.originalFileName}`,
          }),
        );
        setExistingAttachments(formattedAttachments);
      }
    }
  }, [isEditMode, ticketData]);

  if (isEditMode && isLoadingTicket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      <CustomCard
        style={{ maxWidth: 1250 }}
        title={isEditMode ? 'Edit Ticket' : 'Create Ticket'}
        renderBody={() => (
          <Formik
            enableReinitialize
            initialValues={{
              title: isEditMode && ticketData ? ticketData.title : '',
              description:
                isEditMode && ticketData ? ticketData.description : '',
              project:
                isEditMode && ticketData
                  ? {
                      id: ticketData.project.id,
                      label: ticketData.project.name,
                    }
                  : null,
              subprojectId:
                isEditMode && ticketData
                  ? {
                      id: ticketData.subproject?.id,
                      label: ticketData.subproject.name,
                    }
                  : undefined,
              tracker:
                isEditMode && ticketData
                  ? {
                      id: ticketData.tracker?.id,
                      label: ticketData.tracker?.name,
                    }
                  : {
                      id: 1,
                      label: 'Task',
                    },
              priority:
                isEditMode && ticketData
                  ? {
                      id: ticketData.priority?.id,
                      label: ticketData.priority?.name,
                    }
                  : {
                      id: 1,
                      label: 'Medium',
                    },
              status:
                isEditMode && ticketData
                  ? {
                      id: ticketData.status?.id,
                      label: ticketData.status?.name,
                    }
                  : {
                      id: 1,
                      label: 'To do',
                    },
              progress: isEditMode && ticketData ? ticketData.progress : 0,
              assignee:
                isEditMode && ticketData
                  ? ticketData.assignees?.map(
                      (a: { user: { id: number; name: string } }) => a.user?.id,
                    ) || []
                  : [],
              watchers:
                isEditMode && ticketData
                  ? ticketData.watchers?.map((w: any) => w.id) || []
                  : [],
              parentTaskId:
                isEditMode && ticketData
                  ? {
                      id: ticketData.parentTaskId,
                      label: ticketData.parentTask?.name,
                    }
                  : null,
              startDate:
                isEditMode && ticketData && ticketData.startDate
                  ? dayjs(ticketData.startDate)
                  : null,
              dueDate:
                isEditMode && ticketData && ticketData.dueDate
                  ? dayjs(ticketData.dueDate)
                  : null,
              estimatedTimeHours:
                isEditMode && ticketData ? ticketData.estimatedHours : null,
              estimatedTimeMinutes:
                isEditMode && ticketData ? ticketData.estimatedMinutes : null,
              appointment: {
                location: '',
                description: '',
                timezone: { value: '', label: '' },
                service: { value: '', label: '' },
                frequency: 'One-time',
                date: null,
                time: undefined,
                weekday: null,
                duration: { value: '', label: '' },
                reminder: { value: '', label: '' },
                communicationMethods: {
                  phoneCall: { checked: false, value: '' },
                  textMessage: { checked: false, value: '' },
                  email: { checked: false, value: '' },
                },
              },
            }}
            validationSchema={toFormikValidationSchema(
              getSchema(addAppointment),
            )}
            onSubmit={(values) => {
              const getIdFromValue = (val: unknown) => {
                if (typeof val === 'number') return val;
                if (val && typeof val === 'object' && 'id' in val)
                  return val.id as number;
                return null;
              };
              const ticketPayload = {
                title: values.title,
                description: values.description,
                projectId: getIdFromValue(values.project) ?? 0,
                subprojectId: getIdFromValue(values.subprojectId) ?? 0,
                statusId: getIdFromValue(values.status) ?? 0,
                trackerId: getIdFromValue(values.tracker) ?? 0,
                priorityId: getIdFromValue(values.priority) ?? 0,
                progress: values.progress,
                parentTaskId:
                  values.parentTaskId && values.parentTaskId > 0
                    ? values.parentTaskId
                    : undefined,
                startDate: values.startDate
                  ? (values.startDate as dayjs.Dayjs).format('YYYY-MM-DD')
                  : undefined,
                dueDate: values.dueDate
                  ? (values.dueDate as dayjs.Dayjs).format('YYYY-MM-DD')
                  : undefined,
                estimatedHours:
                  values.estimatedTimeHours !== null
                    ? Number(values.estimatedTimeHours)
                    : undefined,
                estimatedMinutes:
                  values.estimatedTimeMinutes !== null
                    ? Number(values.estimatedTimeMinutes)
                    : undefined,
                assigneeUserIds: values.assignee,
                removedAttachmentIds: removeFiles,
                watcherIds: values.watchers,
                attachments,
              };
              if (isEditMode && ticketId) {
                updateTicket({ ticketId, data: ticketPayload });
              } else {
                createTicket(ticketPayload);
              }
            }}
          >
            {({
              values,
              handleSubmit,
              handleChange,
              setFieldValue,
              setFieldTouched,
              errors,
              submitCount,
            }) => {
              const handleFieldChange = (field: string, value: unknown) => {
                void setFieldValue(field, value);
              };

              return (
                <Form onSubmit={handleSubmit}>
                  <Row gutter={[48, 48]}>
                    <Col
                      className={styles.columnContainer}
                      xs={24}
                      sm={24}
                      md={12}
                    >
                      <Input
                        onChange={handleChange}
                        name="title"
                        value={values.title}
                        label="Title"
                        required
                        height={44}
                        placeholder="Enter ticket name"
                        error={submitCount > 0 ? errors.title : undefined}
                      />
                      <TextEditor
                        label="Description"
                        height={311}
                        placeholder="Describe ticket"
                        value={values.description}
                        onChange={(content) => {
                          void setFieldValue('description', content);
                        }}
                        error={submitCount > 0 ? errors.description : undefined}
                      />
                      <Select
                        name="project"
                        height={44}
                        placeholder="Select project"
                        options={toSelectOptions(
                          Array.isArray(project) ? project : [],
                        )}
                        required
                        value={values.project}
                        label="Project"
                        showSearch
                        filterOption={false}
                        loading={isProjectLoading}
                        onSearch={(value) => {
                          setProjectSearchQuery(value);
                        }}
                        onOpenChange={(open) => {
                          if (open) {
                            setShouldGetProjects(true);
                            setProjectSearchQuery('');
                          }
                        }}
                        onChange={(option) => {
                          void setFieldValue('subprojectId', '');
                          void setFieldValue('project', Number(option));
                          setSelectedProjectId(String(option));
                          setSubprojectSearchQuery('');
                          setProjectSearchQuery('');
                        }}
                        width={'100%'}
                        error={submitCount > 0 ? errors.project : undefined}
                      />
                      <Select
                        height={44}
                        value={values.subprojectId}
                        label="Subproject / Activity"
                        placeholder="Assign activity"
                        required
                        labelInValue
                        showSearch
                        filterOption={false}
                        loading={isSubprojectLoading}
                        disabled={!selectedProjectId}
                        onSearch={(value) => {
                          setSubprojectSearchQuery(value);
                        }}
                        onOpenChange={(open) => {
                          if (open) {
                            setShouldSubGetProjects(true);
                            setSubprojectSearchQuery('');
                          }
                        }}
                        onChange={(option) => {
                          void setFieldValue('assignee', []);
                          void setFieldTouched('subprojectId', true);
                          void setFieldValue(
                            'subprojectId',
                            Number(option.value),
                          );
                          setSelectedSubproject(option);
                          setSubprojectSearchQuery('');
                        }}
                        options={toSelectOptions(
                          Array.isArray(subproject) ? subproject : [],
                        )}
                        width={'100%'}
                        error={
                          submitCount > 0 ? errors.subprojectId : undefined
                        }
                      />
                      <Select
                        height={44}
                        label="Assignee"
                        required
                        mode="multiple"
                        placeholder="Assign members"
                        value={values.assignee}
                        disabled={!selectedSubproject?.value}
                        showTags={true}
                        showSearch
                        filterOption={false}
                        loading={isAssigneesLoading}
                        onSearch={(value) => {
                          setAssigneeSearchQuery(value);
                        }}
                        onOpenChange={(open) => {
                          if (open) {
                            setShouldGetAssignees(true);
                            setAssigneeSearchQuery('');
                          }
                        }}
                        onChange={(option) => {
                          void setFieldValue('assignee', option);
                        }}
                        options={toSelectOptions(
                          Array.isArray(mergedAssignees) ? mergedAssignees : [],
                        )}
                        width={'100%'}
                        error={
                          submitCount > 0 && typeof errors.assignee === 'string'
                            ? errors.assignee
                            : undefined
                        }
                      />
                      <Select
                        height={44}
                        label="Parent task"
                        placement="topLeft"
                        width={'100%'}
                        placeholder="Search by ID or title"
                        showSearch
                        filterOption={false}
                        loading={isParentTasksLoading}
                        disabled={!selectedSubproject?.value}
                        options={toSelectOptions(
                          Array.isArray(parentTasks) ? parentTasks : [],
                        )}
                        onSearch={(value) => {
                          setParentTaskIdOrTitle(value);
                        }}
                        onOpenChange={(open) => {
                          if (open) {
                            setShouldGetParentTasks(true);
                            setParentTaskIdOrTitle('');
                          }
                        }}
                        onChange={(option) => {
                          void setFieldValue('parentTaskId', Number(option));
                          setParentTaskIdOrTitle('');
                        }}
                      />
                    </Col>
                    <Col
                      className={styles.columnContainer}
                      xs={24}
                      sm={24}
                      md={12}
                    >
                      <Row gutter={[24, 24]}>
                        <Col span={12}>
                          <Select
                            height={44}
                            label="Tracker"
                            required
                            width={'100%'}
                            showSearch
                            options={toSelectOptions(
                              Array.isArray(trackers) ? trackers : [],
                            )}
                            value={values.tracker}
                            name="tracker"
                            onOpenChange={(open) => {
                              if (open) {
                                setShouldGetTrackers(true);
                              }
                            }}
                            onChange={(option) => {
                              void setFieldValue('tracker', Number(option));
                            }}
                            error={
                              submitCount > 0 &&
                              typeof errors.tracker === 'string'
                                ? errors.tracker
                                : undefined
                            }
                          />
                        </Col>
                        <Col span={12}>
                          <Select
                            height={44}
                            label="Priority"
                            required
                            width={'100%'}
                            showSearch
                            options={toSelectOptions(
                              Array.isArray(priorities) ? priorities : [],
                            )}
                            value={values.priority}
                            name="priority"
                            onOpenChange={(open) => {
                              if (open) {
                                setShouldGetPriorities(true);
                              }
                            }}
                            onChange={(option) => {
                              void setFieldValue('priority', Number(option));
                            }}
                            error={
                              submitCount > 0 &&
                              typeof errors.priority === 'string'
                                ? errors.priority
                                : undefined
                            }
                          />
                        </Col>
                      </Row>
                      <Row gutter={[24, 24]}>
                        <Col span={12}>
                          <Select
                            height={44}
                            label="Status"
                            required
                            width={'100%'}
                            showSearch
                            options={toSelectOptions(
                              Array.isArray(statuses) ? statuses : [],
                            )}
                            value={values.status}
                            name="status"
                            onOpenChange={(open) => {
                              if (open) {
                                setShouldGetStatuses(true);
                              }
                            }}
                            onChange={(option) => {
                              void setFieldValue('status', Number(option));
                            }}
                            error={
                              submitCount > 0 &&
                              typeof errors.status === 'string'
                                ? errors.status
                                : undefined
                            }
                          />
                        </Col>
                        <Col span={12}>
                          <Select
                            height={44}
                            label="Progress"
                            required
                            width={'100%'}
                            showSearch
                            options={PROGRESS_OPTIONS}
                            value={values.progress}
                            name="progress"
                            onChange={(option) => {
                              void setFieldValue('progress', Number(option));
                            }}
                            error={
                              submitCount > 0 ? errors.progress : undefined
                            }
                          />
                        </Col>
                      </Row>
                      <Row gutter={[24, 24]}>
                        <Col span={12}>
                          <DatePicker
                            height={44}
                            label="Start date"
                            width={'100%'}
                            format="DD/MM/YYYY"
                            value={values.startDate}
                            maxDate={values.dueDate ?? undefined}
                            onChange={(date) => {
                              void setFieldValue('startDate', date);
                            }}
                          />
                        </Col>
                        <Col span={12}>
                          <DatePicker
                            height={44}
                            label="Due date"
                            width={'100%'}
                            format="DD/MM/YYYY"
                            value={values.dueDate}
                            minDate={values.startDate ?? undefined}
                            onChange={(date) => {
                              void setFieldValue('dueDate', date);
                            }}
                          />
                        </Col>
                      </Row>
                      <div className="flex flex-col gap-2">
                        <p className={styles.fieldLabel}>Estimated time</p>
                        <Row gutter={[8, 8]}>
                          <Col>
                            <div className="flex items-center gap-1">
                              <Select
                                height={44}
                                width={130}
                                placeholder="Hours"
                                options={HOURS_OPTIONS}
                                value={values.estimatedTimeHours}
                                onChange={(option) => {
                                  void setFieldValue(
                                    'estimatedTimeHours',
                                    option,
                                  );
                                }}
                              />
                              <p className={styles.timeUnit}>h</p>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="flex items-center gap-1">
                              <Select
                                height={44}
                                width={130}
                                placeholder="Minutes"
                                options={MINUTES_OPTIONS}
                                value={values.estimatedTimeMinutes}
                                onChange={(option) => {
                                  void setFieldValue(
                                    'estimatedTimeMinutes',
                                    option,
                                  );
                                }}
                              />
                              <p className={styles.timeUnit}>m</p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <Row>
                        <Col span={24}>
                          <Select
                            height={44}
                            label="Watchers"
                            mode="multiple"
                            width={'100%'}
                            placeholder="Assign watchers"
                            disabled={!selectedSubproject?.value}
                            showTags={true}
                            showSearch
                            filterOption={false}
                            loading={isWatchersLoading}
                            onSearch={(value) => {
                              setWatcherSearchQuery(value);
                            }}
                            onOpenChange={(open) => {
                              if (open) {
                                setShouldGetWatchers(true);
                                setWatcherSearchQuery('');
                              }
                            }}
                            onChange={(option) => {
                              void setFieldValue('watchers', option);
                            }}
                            options={toSelectOptions(
                              Array.isArray(mergedWatchers)
                                ? mergedWatchers
                                : [],
                            )}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <DragDropUploadFile
                          onChange={(files) => setAttachments(files)}
                          onRemove={(files) => handleRemove(files)}
                          defaultFileList={existingAttachments}
                        />
                      </Row>
                    </Col>
                  </Row>
                  {selectedSubproject?.subprojectType === 'Activity' && (
                    <Row>
                      <p
                        className={`${styles.myElement} ${addAppointment ? styles.open : styles.closed}`}
                        onClick={() => setAddAppointment(!addAppointment)}
                      >
                        {addAppointment
                          ? '- Clear and close appointment'
                          : '+ Add appointment'}
                      </p>
                    </Row>
                  )}
                  <Collapse activeKey={addAppointment ? '1' : ''} ghost>
                    <Panel showArrow={false} key="1" header={null}>
                      <AppointmentForm
                        values={values}
                        handleChange={handleChange}
                        setFieldValue={handleFieldChange}
                        subproject={subproject}
                        setShouldSubGetProjects={setShouldSubGetProjects}
                        errors={errors}
                        submitCount={submitCount}
                      />
                    </Panel>
                  </Collapse>

                  <div className={styles.buttonContainer}>
                    <Button
                      buttonType="defaultWhite"
                      className={styles.button200}
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button
                      buttonType="action"
                      className={styles.button200}
                      onClick={() => {
                        void handleSubmit();
                      }}
                      disabled={isPending || isUpdating}
                    >
                      {isEditMode
                        ? isUpdating
                          ? 'Updating...'
                          : 'Update ticket'
                        : isPending
                          ? 'Creating...'
                          : 'Create ticket'}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      />
    </div>
  );
}
