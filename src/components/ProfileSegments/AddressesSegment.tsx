'use client';

import React, { useState } from 'react';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Switch } from 'antd';

import { Button } from '@/components/Button';
import {
  useAddressTypes,
  useCreateUserAddresses,
  useDeleteAddress,
  useToggleAddressStatus,
  useUserAddresses,
} from '@/modules/profile/hooks/useAddresses';
import type {
  AddressFormValues,
  UserAddress,
  UserAddressDTO,
} from '@/modules/profile/types/address.types';

import EmptyState from '../EmptyState';
import { Typography } from '../Typography';

import { AddressFormModal } from './AddressFormModal';

import styles from './styles.module.scss';

export interface AddressesSegmentProps {
  userId: number;
  canEdit?: boolean;
}

export const AddressesSegment: React.FC<AddressesSegmentProps> = ({
  userId,
  canEdit = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );
  const [selectedAddressTypeId, setSelectedAddressTypeId] = useState<
    number | null
  >(null);

  const { data: addressTypes = [] } = useAddressTypes();
  const { data: addressResponse, isLoading: isLoadingAddresses } =
    useUserAddresses(userId);
  const createMutation = useCreateUserAddresses();
  const deleteMutation = useDeleteAddress();
  const toggleStatusMutation = useToggleAddressStatus();

  // Transform UserAddressDTO[] to UserAddress[] for display
  const addressDTOs = Array.isArray(addressResponse) ? addressResponse : [];

  const addresses: UserAddress[] = addressDTOs.map((dto: UserAddressDTO) => ({
    id: dto.addressId,
    addressType: {
      id: dto.addressTypeId,
      name: dto.addressTypeName,
    },
    address1: dto.address1,
    address2: dto.address2,
    city: dto.city,
    state: dto.state,
    zip: dto.zip,
    country: dto.country,
    status: dto.status,
  }));

  // Group addresses by type
  const addressesByType = addressTypes.reduce(
    (acc, type) => {
      acc[type.id] = addresses.filter(
        (addr) => addr.addressType?.id === type.id,
      );
      return acc;
    },
    {} as Record<number, UserAddress[]>,
  );

  const handleAddAddress = (addressTypeId: number) => {
    setSelectedAddressTypeId(addressTypeId);
    setEditingAddress(null);
    setIsModalVisible(true);
  };

  const handleEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setSelectedAddressTypeId(address.addressType.id);
    setIsModalVisible(true);
  };

  const handleDeleteAddress = (addressId: number) => {
    deleteMutation.mutate({ userId, addressId });
  };

  const handleToggleStatus = (addressId: number, status: boolean) => {
    toggleStatusMutation.mutate({ userId, addressId, status });
  };

  const handleSubmit = (values: AddressFormValues) => {
    const addressTypeId = values.addressTypeId || selectedAddressTypeId;
    const addressType = addressTypes.find((t) => t.id === addressTypeId);

    if (!addressType) {
      return;
    }

    const requestData = {
      userId,
      addressType,
      addresses: [
        {
          userAddressId: editingAddress?.id,
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country,
          status: values.status,
        },
      ],
    };

    createMutation.mutate(requestData, {
      onSuccess: () => {
        setIsModalVisible(false);
        setEditingAddress(null);
        setSelectedAddressTypeId(null);
      },
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingAddress(null);
    setSelectedAddressTypeId(null);
  };

  const formatFullAddress = (address: UserAddress) => {
    const parts = [
      address.address1,
      address.address2,
      address.city,
      address.state,
      address.zip,
      address.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const renderAddress = (address: UserAddress) => (
    <div
      key={address.id}
      className={`${styles.addressItem} ${!address.status ? styles.inactive : ''}`}
    >
      <div className={styles.addressContent}>
        <Typography variant="body2" as="span" className={styles.addressValue}>
          {address.fullAddress || formatFullAddress(address)}
        </Typography>
      </div>

      <div className={styles.addressActions}>
        {canEdit && (
          <>
            <Switch
              checked={address.status}
              size="small"
              className={styles.switch}
              onChange={(checked) => handleToggleStatus(address.id, checked)}
            />
            <Button
              variant="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditAddress(address)}
            />
            <Popconfirm
              title="Delete address"
              description="Are you sure you want to delete this address?"
              onConfirm={() => handleDeleteAddress(address.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                variant="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </>
        )}
      </div>
    </div>
  );

  if (isLoadingAddresses) {
    return <Typography variant="body1">Loading addresses...</Typography>;
  }

  return (
    <>
      <div className={styles.segmentContainer}>
        {addressTypes.map((addressType) => {
          const typeAddresses = addressesByType[addressType.id] || [];

          return (
            <Card key={addressType.id} className={styles.segment}>
              <div className={styles.segmentHeader}>
                <h3 className={styles.segmentTitle}>
                  <Typography variant="heading5">{addressType.name}</Typography>
                </h3>
                {canEdit && (
                  <Button
                    variant="outlined"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddAddress(addressType.id)}
                  >
                    <Typography variant="buttonText">Add</Typography>
                  </Button>
                )}
              </div>

              <div className={styles.divider} />

              <div className={styles.addressList}>
                {typeAddresses.length > 0 ? (
                  typeAddresses.map(renderAddress)
                ) : (
                  <EmptyState
                    title={`No ${addressType.name.toLowerCase()} address added`}
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <AddressFormModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleSubmit}
        addressTypes={addressTypes}
        initialValues={editingAddress}
        isLoading={createMutation.isPending}
      />
    </>
  );
};
