'use client';

import React, { useState } from 'react';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Switch } from 'antd';

import { Button } from '@/components/Button';
import {
  useCreateUserContacts,
  useDeleteContact,
  useToggleContactStatus,
  useUserContacts,
} from '@/modules/profile/hooks/useContacts';
import type {
  ContactFormValues,
  UserContact,
} from '@/modules/profile/types/contact.types';

import EmptyState from '../EmptyState';
import { Typography } from '../Typography';

import { ContactFormModal } from './ContactFormModal';

import styles from './styles.module.scss';

export interface ContactsSegmentProps {
  userId: number;
  canEdit?: boolean;
}

export const ContactsSegment: React.FC<ContactsSegmentProps> = ({
  userId,
  canEdit = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<UserContact | null>(
    null,
  );
  const [selectedContactTypeId, setSelectedContactTypeId] = useState<
    number | null
  >(null);

  const { data: contactResponse, isLoading: isLoadingContacts } =
    useUserContacts(userId);
  const createMutation = useCreateUserContacts();
  const deleteMutation = useDeleteContact();
  const toggleStatusMutation = useToggleContactStatus();

  // Transform API response to UserContact[] for display
  const contacts: UserContact[] = [];

  if (contactResponse) {
    const response = contactResponse as any;

    // Process emails array
    if (response.emails && Array.isArray(response.emails)) {
      response.emails.forEach((email: any) => {
        contacts.push({
          id: email.id || email.contactId || Math.random(),
          contactType: { id: 1, name: 'Email' },
          contact: email.email || email.contact || email,
          priority: {
            id: email.priorityId || 1,
            name: email.priorityName || 'Medium',
          },
          status: email.status ?? true,
        });
      });
    }

    // Process phones array
    if (response.phones && Array.isArray(response.phones)) {
      response.phones.forEach((phone: any) => {
        contacts.push({
          id: phone.id || phone.contactId || Math.random(),
          contactType: { id: 2, name: 'Phone' },
          contact: phone.phone || phone.contact || phone,
          priority: {
            id: phone.priorityId || 1,
            name: phone.priorityName || 'Medium',
          },
          status: phone.status ?? true,
        });
      });
    }

    // Process mobilePhones array
    if (response.mobilePhones && Array.isArray(response.mobilePhones)) {
      response.mobilePhones.forEach((mobile: any) => {
        contacts.push({
          id: mobile.id || mobile.contactId || Math.random(),
          contactType: { id: 3, name: 'Mobile Phone' },
          contact: mobile.phone || mobile.contact || mobile,
          priority: {
            id: mobile.priorityId || 1,
            name: mobile.priorityName || 'Medium',
          },
          status: mobile.status ?? true,
        });
      });
    }

    // Process workEmail (single value)
    if (response.workEmail) {
      contacts.push({
        id: -1, // Temporary ID for work email
        contactType: { id: 4, name: 'Work Email' },
        contact: response.workEmail,
        priority: { id: 1, name: 'High' },
        status: true,
      });
    }

    // Process workPhone (single value)
    if (response.workPhone) {
      contacts.push({
        id: -2, // Temporary ID for work phone
        contactType: { id: 5, name: 'Work Phone' },
        contact: response.workPhone,
        priority: { id: 1, name: 'High' },
        status: true,
      });
    }
  }

  // Group contacts by type
  const contactsByType = contacts.reduce(
    (acc, contact) => {
      const typeId = contact.contactType.id;
      if (!acc[typeId]) {
        acc[typeId] = [];
      }
      acc[typeId].push(contact);
      return acc;
    },
    {} as Record<number, UserContact[]>,
  );

  // Get unique contact types from the data
  const contactTypes = Object.keys(contactsByType).map((typeId) => {
    const firstContact = contactsByType[Number(typeId)][0];
    return {
      id: firstContact.contactType.id,
      name: firstContact.contactType.name,
    };
  });

  const handleAddContact = (contactTypeId: number) => {
    setSelectedContactTypeId(contactTypeId);
    setEditingContact(null);
    setIsModalVisible(true);
  };

  const handleEditContact = (contact: UserContact) => {
    setEditingContact(contact);
    setSelectedContactTypeId(contact.contactType.id);
    setIsModalVisible(true);
  };

  const handleDeleteContact = (contactId: number) => {
    deleteMutation.mutate({ userId, contactId });
  };

  const handleToggleStatus = (contactId: number, status: boolean) => {
    toggleStatusMutation.mutate({ userId, contactId, status });
  };

  const handleSubmit = (values: ContactFormValues) => {
    const contactTypeId = values.contactTypeId || selectedContactTypeId;
    const contactType = contactTypes.find((t) => t.id === contactTypeId);

    if (!contactType) {
      return;
    }

    const requestData = {
      userId,
      contactType: {
        id: contactType.id,
      },
      contacts: [
        {
          userContactId: editingContact?.id,
          contact: values.contact,
          priority: {
            id: values.priorityId,
            priority: '', // Priority name will be determined by the API
          },
          status: values.status,
        },
      ],
    };

    createMutation.mutate(requestData, {
      onSuccess: () => {
        setIsModalVisible(false);
        setEditingContact(null);
        setSelectedContactTypeId(null);
      },
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingContact(null);
    setSelectedContactTypeId(null);
  };

  const renderContact = (contact: UserContact) => (
    <div
      key={contact.id}
      className={`${styles.contactItem} ${!contact.status ? styles.inactive : ''}`}
    >
      <div className={styles.contactContent}>
        <span className={styles.contactValue}>
          <Typography variant="caption">{contact.contact}</Typography>
        </span>
        <Typography
          variant="body3"
          as="span"
          className={styles.contactPriority}
        >
          {contact.priority.name}
        </Typography>
      </div>

      <div className={styles.contactActions}>
        {canEdit && (
          <>
            <Switch
              checked={contact.status}
              size="small"
              className={styles.switch}
              onChange={(checked) => handleToggleStatus(contact.id, checked)}
            />
            <Button
              variant="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditContact(contact)}
              className={styles.actionButton}
            />
            <Popconfirm
              title="Delete contact"
              description="Are you sure you want to delete this contact?"
              onConfirm={() => handleDeleteContact(contact.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                variant="text"
                size="small"
                icon={<DeleteOutlined />}
                className={styles.actionButton}
                danger
              />
            </Popconfirm>
          </>
        )}
      </div>
    </div>
  );

  if (isLoadingContacts) {
    return <Typography variant="body1">Loading contacts...</Typography>;
  }

  return (
    <>
      <div className={styles.segmentContainer}>
        {contactTypes.map((contactType) => {
          const typeContacts = contactsByType[contactType.id] || [];

          return (
            <Card key={contactType.id} className={styles.segment}>
              <div className={styles.segmentHeader}>
                <h3 className={styles.segmentTitle}>
                  <Typography variant="heading5">{contactType.name}</Typography>
                </h3>
                {canEdit && (
                  <Button
                    variant="outlined"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddContact(contactType.id)}
                  >
                    <Typography variant="buttonText">Add</Typography>
                  </Button>
                )}
              </div>

              <div className={styles.divider} />

              <div className={styles.contactList}>
                {typeContacts.length > 0 ? (
                  typeContacts.map(renderContact)
                ) : (
                  <div className={styles.emptyState}>
                    <EmptyState
                      title={`No ${contactType.name.toLowerCase()} added`}
                    />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <ContactFormModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleSubmit}
        contactTypes={contactTypes}
        initialValues={editingContact}
        isLoading={createMutation.isPending}
      />
    </>
  );
};
