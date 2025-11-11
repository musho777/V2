'use client';

import React, { useEffect } from 'react';

import { Form, Input, Modal, Select, Switch } from 'antd';

import type {
  ContactFormValues,
  UserContact,
} from '@/modules/profile/types/contact.types';

interface ContactType {
  id: number;
  name: string;
}

interface ContactFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ContactFormValues) => void;
  contactTypes: ContactType[];
  initialValues?: UserContact | null;
  isLoading?: boolean;
}

// Hardcoded priorities - these should match the API
const PRIORITIES = [
  { id: 1, name: 'Highest' },
  { id: 2, name: 'High' },
  { id: 3, name: 'Medium' },
  { id: 4, name: 'Low' },
];

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  contactTypes,
  initialValues,
  isLoading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        contactTypeId: initialValues.contactType.id,
        contact: initialValues.contact,
        priorityId: initialValues.priority.id,
        status: initialValues.status,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({
        status: true,
      });
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch(() => {
        // Validation failed, errors are displayed in the form
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? 'Edit Contact' : 'Add New Contact'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      width={600}
      okText={initialValues ? 'Update' : 'Create'}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: true,
        }}
      >
        <Form.Item
          name="contactTypeId"
          label="Contact Type"
          rules={[{ required: true, message: 'Please select contact type' }]}
        >
          <Select
            placeholder="Select contact type"
            options={contactTypes.map((type) => ({
              label: type.name,
              value: type.id,
            }))}
            disabled={!!initialValues} // Don't allow changing type when editing
          />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Contact Value"
          rules={[
            { required: true, message: 'Please enter contact value' },
            { min: 3, message: 'Contact must be at least 3 characters' },
          ]}
        >
          <Input placeholder="Enter email or phone number" />
        </Form.Item>

        <Form.Item
          name="priorityId"
          label="Priority"
          rules={[{ required: true, message: 'Please select priority' }]}
        >
          <Select
            placeholder="Select priority"
            options={PRIORITIES.map((priority) => ({
              label: priority.name,
              value: priority.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Active"
          valuePropName="checked"
          extra="Enable this contact for use"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
