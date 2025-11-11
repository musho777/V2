# ERP Customer Management Module

This module provides a comprehensive solution for managing customer information in the ERP system with best practices implementation.

## Architecture

### 🏗️ Structure

```
src/modules/erp/
├── services/
│   ├── customer.service.ts      # API service layer with all CRUD operations
│   └── api.config.ts             # API client configuration
├── hooks/
│   └── useCustomer.ts            # Custom React hook for customer operations
├── types/
│   └── customer.types.ts         # TypeScript type definitions
└── create-client/
    └── pages/
        └── LegalEntityDetailsPage.tsx  # Customer creation/edit page
```

## Key Components

### 1. **Customer Service** (`customer.service.ts`)

Provides all API operations for customer management:

#### Create Operation

```typescript
customerService.create(data: CustomerCreateDto): Promise<Customer>
```

#### Search Operations

```typescript
customerService.search(params: CustomerSearchParams): Promise<CustomerSearchResponse>
customerService.searchById(id: number): Promise<Customer>
```

#### Update Operations

All update operations follow the same pattern with specific endpoints:

- `updateTaxpayerRegistrationNumber(id, value)` - PUT `/customer/taxpayer-registration-number`
- `updateSocialCardNumber(id, value)` - PUT `/customer/social-card-number`
- `updateServiceAddresses(id, addresses)` - PUT `/customer/service-addresses`
- `updatePhoneNumbers(id, phones)` - PUT `/customer/phone-numbers`
- `updatePassport(id, passportInfo)` - PUT `/customer/passport`
- `updateNotificationAddress(id, value)` - PUT `/customer/notification-address`
- `updateName(id, name)` - PUT `/customer/name`
- `updateLocation(id, value)` - PUT `/customer/location`
- `updateExternalId(id, value)` - PUT `/customer/external-id`
- `updateEmail(id, value)` - PUT `/customer/email`
- `updateCustomerType(id, type)` - PUT `/customer/customer-type`
- `updateCompanyName(id, value)` - PUT `/customer/company-name`
- `updateBirthDate(id, value)` - PUT `/customer/birth-date`

### 2. **Custom Hook** (`useCustomer.ts`)

A comprehensive React hook that encapsulates all customer management logic:

#### Features

- ✅ State management for forms, addresses, and phone numbers
- ✅ CRUD operations with proper error handling
- ✅ Loading states
- ✅ Field-level editing control
- ✅ Memoized callbacks for performance optimization
- ✅ TypeScript type safety

#### Usage Example

```typescript
const {
  // State
  formData,
  addresses,
  phones,
  submitted,
  isSubmitting,
  error,

  // Actions
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
} = useCustomer({
  clientType: '2',
  documentType: 'armenian_passport',
  firstName: 'John',
  lastName: 'Doe',
  middleName: 'Smith',
});
```

### 3. **Type Definitions** (`customer.types.ts`)

Centralized type definitions for:

- `AddressForm` - Service address structure
- `PhoneForm` - Phone number structure
- `CustomerFormData` - Form data structure
- `PassportType` - Passport type enumeration
- `DocumentType` - Document type enumeration
- `ClientType` - Client type enumeration
- `EditState` - Field editing state tracker
- `CustomerTypeInfo` - Customer type information

### 4. **API Configuration** (`api.config.ts`)

Centralized API client with:

- ✅ Authentication header injection
- ✅ Base URL configuration
- ✅ HTTP methods: GET, POST, PUT, DELETE
- ✅ Error handling
- ✅ Response parsing

## Best Practices Implemented

### 1. **Separation of Concerns**

- Business logic separated into custom hooks
- API calls isolated in service layer
- Type definitions in dedicated files
- UI components focused on presentation

### 2. **Type Safety**

- Full TypeScript coverage
- Strict type checking
- Interface-based contracts
- Type inference optimization

### 3. **Performance Optimization**

- `useCallback` for function memoization
- Efficient state updates
- Minimal re-renders
- Optimized data structures

### 4. **Error Handling**

- Try-catch blocks in all async operations
- User-friendly error messages
- Error state management
- Error display in UI

### 5. **Code Reusability**

- Shared types across components
- Reusable hook for customer operations
- Generic API client
- DRY principle adherence

### 6. **Maintainability**

- Clear naming conventions
- Modular architecture
- Comprehensive documentation
- Consistent code style

## API Endpoints Reference

Base URL: `https://erp-dev-api.simplego.am`

### Customer Endpoints

| Method | Endpoint                                 | Description                   |
| ------ | ---------------------------------------- | ----------------------------- |
| POST   | `/customer/add`                          | Create new customer           |
| GET    | `/customer/search`                       | Search customers with filters |
| GET    | `/customer/search-by-id/{id}`            | Get customer by ID            |
| PUT    | `/customer/taxpayer-registration-number` | Update tax ID                 |
| PUT    | `/customer/social-card-number`           | Update social card number     |
| PUT    | `/customer/service-addresses`            | Update service addresses      |
| PUT    | `/customer/phone-numbers`                | Update phone numbers          |
| PUT    | `/customer/passport`                     | Update passport information   |
| PUT    | `/customer/notification-address`         | Update notification address   |
| PUT    | `/customer/name`                         | Update customer name          |
| PUT    | `/customer/location`                     | Update location address       |
| PUT    | `/customer/external-id`                  | Update external ID            |
| PUT    | `/customer/email`                        | Update email                  |
| PUT    | `/customer/customer-type`                | Update customer type          |
| PUT    | `/customer/company-name`                 | Update company name           |
| PUT    | `/customer/birth-date`                   | Update birth date             |

## Data Flow

```
User Interaction
    ↓
Component (LegalEntityDetailsPage)
    ↓
Custom Hook (useCustomer)
    ↓
Service Layer (customerService)
    ↓
API Client (erpApiClient)
    ↓
Backend API
```

## Customer Types

1. **Legal Entity (Իրավաբանական անձ)** - `clientType: '2'`
   - Requires: Company name, Tax ID, Location address

2. **Individual Entrepreneur (Անհատ ձեռներեց)** - `clientType: '1'`
   - Requires: Birth date, Tax ID, Location address

3. **Physical Person (Ֆիզիկական անձ)** - `clientType: '3'`
   - Requires: Birth date
   - Does not require: Company name, Tax ID, Location address

## Document Types

1. **Armenian Passport** - `documentType: 'armenian_passport'`
2. **Armenian ID Card** - `documentType: 'armenian_id'`
3. **Foreign Passport** - `documentType: 'foreign_passport'`

## Example: Creating a Customer

```typescript
import { useCustomer } from '@/modules/erp/hooks/useCustomer';

function MyComponent() {
  const {
    formData,
    handleFormDataChange,
    createCustomer,
    isSubmitting,
    error,
  } = useCustomer({
    clientType: '2',
    documentType: 'armenian_passport',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Smith',
  });

  const handleSubmit = async () => {
    try {
      const customer = await createCustomer();
      console.log('Customer created:', customer);
    } catch (err) {
      console.error('Failed to create customer:', err);
    }
  };

  return (
    <div>
      <input
        value={formData.email}
        onChange={(e) => handleFormDataChange('email', e.target.value)}
      />
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Customer'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

## Example: Updating Customer Fields

```typescript
const { updateCustomerField } = useCustomer();

// Update email
await updateCustomerField(customerId, 'email', 'newemail@example.com');

// Update tax ID
await updateCustomerField(customerId, 'taxId', '1234567890');

// Update external ID
await updateCustomerField(customerId, 'erpExternalId', 12345);
```

## Future Enhancements

- [ ] Add customer deletion functionality
- [ ] Implement optimistic updates
- [ ] Add data validation schemas (Zod/Yup)
- [ ] Implement caching strategy (React Query/SWR)
- [ ] Add unit and integration tests
- [ ] Implement audit logging
- [ ] Add bulk operations support
- [ ] Implement real-time updates (WebSocket)

## Contributing

When adding new features:

1. Add type definitions to `customer.types.ts`
2. Implement API calls in `customer.service.ts`
3. Add hook methods in `useCustomer.ts`
4. Update components to use the hook
5. Update this documentation

## License

Internal use only - SimpleGo ERP System
