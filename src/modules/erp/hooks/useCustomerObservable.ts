import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Customer, CustomerCreateDto } from '../services/customer.service';
import { customerServiceObservable } from '../services/customer.service.observable';
import type {
  AddressForm,
  ClientType,
  CustomerFormData,
  DocumentType,
  EditState,
  PassportType,
  PhoneForm,
} from '../types/customer.types';

import { useObservableLazy } from './useObservable';

interface UseCustomerObservableOptions {
  clientType?: ClientType;
  documentType?: DocumentType;
  firstName?: string;
  lastName?: string;
  middleName?: string;
}

export const useCustomerObservable = (
  options: UseCustomerObservableOptions = {},
) => {
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

  // Observable hooks for API calls
  const [executeCreate, createState] = useObservableLazy<
    Customer,
    CustomerCreateDto
  >((data) => customerServiceObservable.create(data));

  const [executeUpdateField, updateFieldState] = useObservableLazy<
    void,
    { id: number; field: string; value: any }
  >((params) => {
    const { id, field, value } = params;

    switch (field) {
      case 'taxId':
        return customerServiceObservable.updateTaxpayerRegistrationNumber(
          id,
          value,
        );
      case 'socialCardNumber':
        return customerServiceObservable.updateSocialCardNumber(id, value);
      case 'notificationAddress':
        return customerServiceObservable.updateNotificationAddress(id, value);
      case 'email':
        return customerServiceObservable.updateEmail(id, value);
      case 'locationAddress':
        return customerServiceObservable.updateLocation(id, value);
      case 'erpExternalId':
        return customerServiceObservable.updateExternalId(id, Number(value));
      case 'organizationName':
        return customerServiceObservable.updateCompanyName(id, value);
      case 'birthDate':
        return customerServiceObservable.updateBirthDate(id, value);
      default:
        throw new Error(`Unknown field: ${field}`);
    }
  });

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

  const createCustomer = useCallback(() => {
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

    executeCreate(customerData);
  }, [
    firstName,
    lastName,
    middleName,
    clientType,
    getCustomerTypeName,
    getPassportType,
    formData,
    addresses,
    phones,
    executeCreate,
  ]);

  const updateCustomerField = useCallback(
    (
      customerId: number,
      field: keyof CustomerFormData,
      value: string | number,
    ) => {
      setError(null);
      executeUpdateField({ id: customerId, field, value });
      handleFormDataChange(field, String(value));
    },
    [executeUpdateField, handleFormDataChange],
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
    isSubmitting: createState.loading || updateFieldState.loading,
    error:
      error || createState.error?.message || updateFieldState.error?.message,
    customer: createState.data,

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
    handleCancel,

    // Utilities
    getPassportType,
    getCustomerTypeName,
  };
};
