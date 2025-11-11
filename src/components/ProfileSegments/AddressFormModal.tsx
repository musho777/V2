'use client';

import React, { useEffect } from 'react';

import { Form, Input, Modal, Select, Switch } from 'antd';

import type {
  AddressFormValues,
  AddressType,
  UserAddress,
} from '@/modules/profile/types/address.types';

interface AddressFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: AddressFormValues) => void;
  addressTypes: AddressType[];
  initialValues?: UserAddress | null;
  isLoading?: boolean;
}

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  addressTypes,
  initialValues,
  isLoading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        addressTypeId: initialValues.addressType.id,
        address1: initialValues.address1,
        address2: initialValues.address2,
        city: initialValues.city,
        state: initialValues.state,
        zip: initialValues.zip,
        country: initialValues.country,
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
      title={initialValues ? 'Edit Address' : 'Add New Address'}
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
          name="addressTypeId"
          label="Address Type"
          rules={[{ required: true, message: 'Please select address type' }]}
        >
          <Select
            placeholder="Select address type"
            options={addressTypes.map((type) => ({
              label: type.name,
              value: type.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="address1"
          label="Address Line 1"
          rules={[
            { required: true, message: 'Please enter address line 1' },
            { min: 3, message: 'Address must be at least 3 characters' },
          ]}
        >
          <Input placeholder="Enter address line 1" />
        </Form.Item>

        <Form.Item name="address2" label="Address Line 2">
          <Input placeholder="Enter address line 2 (optional)" />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          rules={[
            { required: true, message: 'Please enter city' },
            { min: 2, message: 'City must be at least 2 characters' },
          ]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item name="state" label="State/Province">
          <Input placeholder="Enter state or province (optional)" />
        </Form.Item>

        <Form.Item
          name="zip"
          label="ZIP/Postal Code"
          rules={[{ required: true, message: 'Please enter ZIP/postal code' }]}
        >
          <Input placeholder="Enter ZIP/postal code" />
        </Form.Item>

        <Form.Item
          name="country"
          label="Country"
          rules={[
            { required: true, message: 'Please enter country' },
            { min: 2, message: 'Country must be at least 2 characters' },
          ]}
        >
          <Input placeholder="Enter country" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Active"
          valuePropName="checked"
          extra="Enable this address for use"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
