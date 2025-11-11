import { Col, Row } from 'antd';
import type { Dayjs } from 'dayjs';
import type { FormikHandlers } from 'formik';

import { DatePicker } from '@/components/DatePicker';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import {
  TimeSelector,
  type TimeSelectorValue,
} from '@/components/TimeSelector';
import {
  TICKET_APPOINTMENT_FREQUENCY_OPTIONS,
  WEEKDAY_OPTIONS,
} from '@/constants/constants';
import { toSelectOptions } from '@/utils/utils';

import { CommunicationMethod } from '../CommunicationMethod/CommunicationMethod';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptionItem {
  id?: string | number;
  value?: string | number;
  label?: string;
  name?: string;
  typeName?: string;
  firstName?: string;
  lastName?: string;
}

interface AppointmentValues {
  location?: string;
  description?: string;
  timezone?: SelectOption;
  service?: SelectOption;
  frequency?: string;
  date?: Dayjs | null;
  time?: TimeSelectorValue;
  weekday?: SelectOption | null;
  duration?: SelectOption;
  reminder?: SelectOption;
  communicationMethods?: {
    phoneCall?: { checked: boolean; value?: string };
    textMessage?: { checked: boolean; value?: string };
    email?: { checked: boolean; value?: string };
  };
}

interface FormValues {
  appointment?: AppointmentValues;
}

interface SubprojectData {
  content?: SelectOptionItem[];
}

interface AppointmentFormProps {
  values: FormValues;
  handleChange: FormikHandlers['handleChange'];
  setFieldValue: (field: string, value: unknown) => void;
  subproject?: SubprojectData;
  setShouldSubGetProjects: (value: boolean) => void;
  errors?: any;
  touched?: any;
  submitCount?: number;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  values,
  handleChange,
  setFieldValue,
  subproject,
  setShouldSubGetProjects,
  errors,
  touched,
}) => {
  return (
    <Row gutter={[48, 48]}>
      <Col
        style={{
          gap: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
        xs={24}
        sm={24}
        md={12}
      >
        <Input
          onChange={handleChange}
          name="appointment.location"
          value={values.appointment?.location}
          label="Set the location"
          height={44}
          error={
            touched?.appointment?.location
              ? errors?.appointment?.location
              : undefined
          }
        />
        <Input
          onChange={handleChange}
          name="appointment.description"
          value={values.appointment?.description}
          label="Description"
          height={44}
          error={
            touched?.appointment?.description
              ? errors?.appointment?.description
              : undefined
          }
        />
        <Select
          height={44}
          value={values.appointment?.timezone}
          label="Time zone"
          name="appointment.timezone"
          onOpenChange={(open) => {
            if (open) {
              setShouldSubGetProjects(true);
            }
          }}
          onChange={(option) => setFieldValue('appointment.timezone', option)}
          options={toSelectOptions(subproject?.content || [])}
          width={'100%'}
          error={
            touched?.appointment?.timezone
              ? errors?.appointment?.timezone?.value
              : undefined
          }
        />
        <Select
          height={44}
          label="Service"
          name="appointment.service"
          value={values.appointment?.service}
          onChange={(option) => setFieldValue('appointment.service', option)}
          width={'100%'}
          error={
            touched?.appointment?.service
              ? errors?.appointment?.service?.value
              : undefined
          }
        />
      </Col>
      <Col
        style={{
          gap: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
        xs={24}
        sm={24}
        md={12}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Select
              height={44}
              label="Frequency"
              width={'100%'}
              name="appointment.frequency"
              value={values.appointment?.frequency}
              options={TICKET_APPOINTMENT_FREQUENCY_OPTIONS}
              onChange={(option) =>
                setFieldValue('appointment.frequency', option)
              }
              error={
                touched?.appointment?.frequency
                  ? errors?.appointment?.frequency
                  : undefined
              }
            />
          </Col>
          <Col span={12}>
            {values.appointment?.frequency === 'One-time' && (
              <DatePicker
                width={'100%'}
                height={44}
                label="Choose date"
                name="appointment.date"
                value={values.appointment?.date}
                onChange={(date) => setFieldValue('appointment.date', date)}
                error={
                  touched?.appointment?.date
                    ? errors?.appointment?.date
                    : undefined
                }
              />
            )}
            {values.appointment?.frequency === 'Daily' && (
              <TimeSelector
                singleTime={true}
                height={44}
                label="Select time"
                width={'100%'}
                name="appointment.time"
                value={values.appointment?.time}
                onChange={(time) => setFieldValue('appointment.time', time)}
                error={
                  touched?.appointment?.time
                    ? errors?.appointment?.time
                    : undefined
                }
              />
            )}
            {values.appointment?.frequency === 'Weekly' && (
              <Select
                height={44}
                label="Choose days"
                width={'100%'}
                name="appointment.weekday"
                placeholder="Choose days"
                value={values.appointment?.weekday}
                options={WEEKDAY_OPTIONS}
                onChange={(option) =>
                  setFieldValue('appointment.weekday', option)
                }
                error={
                  touched?.appointment?.weekday
                    ? errors?.appointment?.weekday
                    : undefined
                }
              />
            )}
            {values.appointment?.frequency === 'Monthly' && (
              <DatePicker
                width={'100%'}
                height={44}
                label="Choose date"
                name="appointment.date"
                value={values.appointment?.date}
                onChange={(date) => setFieldValue('appointment.date', date)}
                error={
                  touched?.appointment?.date
                    ? errors?.appointment?.date
                    : undefined
                }
              />
            )}
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Select
              height={44}
              label="Duration"
              width={'100%'}
              name="appointment.duration"
              value={values.appointment?.duration}
              onChange={(option) =>
                setFieldValue('appointment.duration', option)
              }
              error={
                touched?.appointment?.duration
                  ? errors?.appointment?.duration?.value
                  : undefined
              }
            />
          </Col>
          <Col span={12}>
            <Select
              height={44}
              label="Reminder"
              width={'100%'}
              name="appointment.reminder"
              value={values.appointment?.reminder}
              onChange={(option) =>
                setFieldValue('appointment.reminder', option)
              }
              error={
                touched?.appointment?.reminder
                  ? errors?.appointment?.reminder
                  : undefined
              }
            />
          </Col>
        </Row>
        <Row>
          <Col
            span={24}
            style={{
              gap: 5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CommunicationMethod
              phone
              method={'Phone call'}
              checked={
                values.appointment?.communicationMethods?.phoneCall?.checked
              }
              phoneValue={
                values.appointment?.communicationMethods?.phoneCall?.value
              }
              onChange={(e) =>
                setFieldValue(
                  'appointment.communicationMethods.phoneCall.checked',
                  e.target.checked,
                )
              }
              onPhoneChange={(value) =>
                setFieldValue(
                  'appointment.communicationMethods.phoneCall.value',
                  value,
                )
              }
            />
            <CommunicationMethod
              phone
              method={'Text message'}
              checked={
                values.appointment?.communicationMethods?.textMessage?.checked
              }
              phoneValue={
                values.appointment?.communicationMethods?.textMessage?.value
              }
              onChange={(e) =>
                setFieldValue(
                  'appointment.communicationMethods.textMessage.checked',
                  e.target.checked,
                )
              }
              onPhoneChange={(value) =>
                setFieldValue(
                  'appointment.communicationMethods.textMessage.value',
                  value,
                )
              }
            />
            <CommunicationMethod
              method={'Email'}
              checked={values.appointment?.communicationMethods?.email?.checked}
              phoneValue={
                values.appointment?.communicationMethods?.email?.value
              }
              onChange={(e) =>
                setFieldValue(
                  'appointment.communicationMethods.email.checked',
                  e.target.checked,
                )
              }
              onPhoneChange={(value) =>
                setFieldValue(
                  'appointment.communicationMethods.email.value',
                  value,
                )
              }
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
