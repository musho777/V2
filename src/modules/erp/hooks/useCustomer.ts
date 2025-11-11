import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Customer, CustomerCreateDto } from '../services/customer.service';
import { customerService } from '../services/customer.service';
import type {
  AddressForm,
  ClientType,
  CustomerFormData,
  DocumentType,
  EditState,
  PassportType,
  PhoneForm,
} from '../types/customer.types';

interface UseCustomerOptions {
  clientType?: ClientType;
  documentType?: DocumentType;
  firstName?: string;
  lastName?: string;
  middleName?: string;
}

export const useCustomer = (options: UseCustomerOptions = {}) => {
  const router = useRouter();
  const {
    clientType = '2',
    documentType = 'armenian_passport',
    firstName = '',
    lastName = '',
    middleName = '',
  } = options;

  const [submitted, setSubmitted] = useState(false);
  const [editingFields, setEditingFields] = useState<EditState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CustomerFormData>({
    organizationName: '',
    passportNumber: '',
    issueDate: '',
    issuedBy: '',
    registrationAddress: '',
    socialCardNumber: '',
    notificationAddress: '',
    email: '',
    erpExternalId: '',
    taxId: '',
    locationAddress: '',
    birthDate: '',
  });

  const [addresses, setAddresses] = useState<AddressForm[]>([
    {
      id: '1',
      street: '',
      building: '',
      apartment: '',
      roomNumber: '',
      entrance: '',
      floor: '',
      comment: '',
    },
  ]);

  const [phones, setPhones] = useState<PhoneForm[]>([
    { id: '1', phoneNumber: '', comment: '' },
  ]);

  const getPassportType = useCallback((): PassportType => {
    switch (documentType) {
      case 'armenian_id':
        return 'ARMENIAN_ID';
      case 'foreign_passport':
        return 'FOREIGN_PASSPORT';
      case 'armenian_passport':
      default:
        return 'ARMENIAN_PASSPORT';
    }
  }, [documentType]);

  const getCustomerTypeName = useCallback(() => {
    switch (clientType) {
      case '1':
        return 'Անհատ ձեռներեց';
      case '3':
        return 'Ֆիզիկական անձ';
      case '2':
      default:
        return 'Իրավաբանական անձ';
    }
  }, [clientType]);

  const handleAddAddress = useCallback(() => {
    const newAddress: AddressForm = {
      id: Date.now().toString(),
      street: '',
      building: '',
      apartment: '',
      roomNumber: '',
      entrance: '',
      floor: '',
      comment: '',
    };
    setAddresses((prev) => [...prev, newAddress]);
  }, []);

  const handleAddPhone = useCallback(() => {
    const newPhone: PhoneForm = {
      id: Date.now().toString(),
      phoneNumber: '',
      comment: '',
    };
    setPhones((prev) => [...prev, newPhone]);
  }, []);

  const handleAddressChange = useCallback(
    (id: string, field: keyof AddressForm, value: string) => {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === id ? { ...addr, [field]: value } : addr,
        ),
      );
    },
    [],
  );

  const handlePhoneChange = useCallback(
    (id: string, field: keyof PhoneForm, value: string) => {
      setPhones((prev) =>
        prev.map((phone) =>
          phone.id === id ? { ...phone, [field]: value } : phone,
        ),
      );
    },
    [],
  );

  const handleFormDataChange = useCallback(
    (field: keyof CustomerFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const toggleEdit = useCallback((fieldName: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  }, []);

  const isFieldDisabled = useCallback(
    (fieldName: string) => {
      return submitted && !editingFields[fieldName];
    },
    [submitted, editingFields],
  );

  const createCustomer = useCallback(async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const customerData: CustomerCreateDto = {
        name: {
          firstName,
          lastName,
          patronymic: middleName,
        },
        customerType: {
          id: Number(clientType),
          name: getCustomerTypeName(),
        },
        passportInfo: {
          type: getPassportType(),
          number: formData.passportNumber,
          issueDate: formData.issueDate,
          issuerCode: formData.issuedBy,
          address: formData.registrationAddress,
        },
        socialCardNumber: formData.socialCardNumber || undefined,
        notificationAddress: formData.notificationAddress || undefined,
        location: formData.locationAddress || undefined,
        email: formData.email || undefined,
        externalId: formData.erpExternalId
          ? Number(formData.erpExternalId)
          : undefined,
        birthDate: formData.birthDate || undefined,
        taxpayerRegistrationNumber: formData.taxId || undefined,
        companyName: formData.organizationName || undefined,
        serviceAddresses: addresses.map((addr) => ({
          building: {
            id: Number(addr.building) || 0,
          },
          flat: addr.apartment ? Number(addr.apartment) : undefined,
          room: addr.roomNumber ? Number(addr.roomNumber) : undefined,
          entrance: addr.entrance ? Number(addr.entrance) : undefined,
          floor: addr.floor ? Number(addr.floor) : undefined,
          comment: addr.comment || undefined,
        })),
        phoneNumbers: phones.map((phone) => ({
          number: phone.phoneNumber,
          comment: phone.comment || undefined,
        })),
      };

      const result = await customerService.create(customerData);
      setSubmitted(true);
      setEditingFields({});

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create customer';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    firstName,
    lastName,
    middleName,
    clientType,
    getCustomerTypeName,
    getPassportType,
    formData,
    addresses,
    phones,
  ]);

  const updateCustomerField = useCallback(
    async (
      customerId: number,
      field: keyof CustomerFormData,
      value: string | number,
    ) => {
      try {
        setIsSubmitting(true);
        setError(null);

        switch (field) {
          case 'taxId':
            if (typeof value === 'string') {
              await customerService.updateTaxpayerRegistrationNumber(
                customerId,
                value,
              );
            }
            break;
          case 'socialCardNumber':
            if (typeof value === 'string') {
              await customerService.updateSocialCardNumber(customerId, value);
            }
            break;
          case 'notificationAddress':
            if (typeof value === 'string') {
              await customerService.updateNotificationAddress(
                customerId,
                value,
              );
            }
            break;
          case 'email':
            if (typeof value === 'string') {
              await customerService.updateEmail(customerId, value);
            }
            break;
          case 'locationAddress':
            if (typeof value === 'string') {
              await customerService.updateLocation(customerId, value);
            }
            break;
          case 'erpExternalId':
            if (typeof value === 'number' || typeof value === 'string') {
              await customerService.updateExternalId(customerId, Number(value));
            }
            break;
          case 'organizationName':
            if (typeof value === 'string') {
              await customerService.updateCompanyName(customerId, value);
            }
            break;
          case 'birthDate':
            if (typeof value === 'string') {
              await customerService.updateBirthDate(customerId, value);
            }
            break;
          default:
            break;
        }

        handleFormDataChange(field, String(value));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : `Failed to update ${field}`;
        setError(errorMessage);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleFormDataChange],
  );

  const updatePassport = useCallback(
    async (customerId: number) => {
      try {
        setIsSubmitting(true);
        setError(null);

        await customerService.updatePassport(customerId, {
          type: getPassportType(),
          number: formData.passportNumber,
          issueDate: formData.issueDate,
          issuerCode: formData.issuedBy,
          address: formData.registrationAddress,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update passport';
        setError(errorMessage);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [getPassportType, formData],
  );

  const updateServiceAddresses = useCallback(
    async (customerId: number) => {
      try {
        setIsSubmitting(true);
        setError(null);

        await customerService.updateServiceAddresses(
          customerId,
          addresses.map((addr) => ({
            building: {
              id: Number(addr.building) || 0,
            },
            flat: addr.apartment ? Number(addr.apartment) : undefined,
            room: addr.roomNumber ? Number(addr.roomNumber) : undefined,
            entrance: addr.entrance ? Number(addr.entrance) : undefined,
            floor: addr.floor ? Number(addr.floor) : undefined,
            comment: addr.comment || undefined,
          })),
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to update service addresses';
        setError(errorMessage);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [addresses],
  );

  const updatePhoneNumbers = useCallback(
    async (customerId: number) => {
      try {
        setIsSubmitting(true);
        setError(null);

        await customerService.updatePhoneNumbers(
          customerId,
          phones.map((phone) => ({
            number: phone.phoneNumber,
            comment: phone.comment || undefined,
          })),
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update phone numbers';
        setError(errorMessage);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [phones],
  );

  const handleCancel = useCallback(() => {
    router.push('/erp/create-client');
  }, [router]);

  return {
    // State
    formData,
    addresses,
    phones,
    submitted,
    editingFields,
    isSubmitting,
    error,

    // Actions
    setFormData,
    setAddresses,
    setPhones,
    handleFormDataChange,
    handleAddAddress,
    handleAddPhone,
    handleAddressChange,
    handlePhoneChange,
    toggleEdit,
    isFieldDisabled,
    createCustomer,
    updateCustomerField,
    updatePassport,
    updateServiceAddresses,
    updatePhoneNumbers,
    handleCancel,

    // Utilities
    getPassportType,
    getCustomerTypeName,
  };
};
