// API Schema Types (matching Swagger)
export interface AddressType {
  id: number;
  name: string;
  default?: boolean;
}

export interface AddressRequest {
  userAddressId?: number;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  status?: boolean;
}

export interface UserAddressRequest {
  userId: number;
  addressType: AddressType;
  addresses: AddressRequest[];
}

export interface OwnAddressRequest {
  userAddressId?: number;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  status?: boolean;
  delete?: boolean;
}

export interface OwnAddressesRequest {
  addressType: AddressType;
  addresses: OwnAddressRequest[];
}

export interface UserAddressDTO {
  userId: number;
  addressId: number;
  addressTypeId: number;
  addressTypeName: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  status: boolean;
}

// Frontend Display Types
export interface UserAddress {
  id: number;
  addressType: {
    id: number;
    name: string;
  };
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  fullAddress?: string;
  status: boolean;
}

// Form Types
export interface AddressFormValues {
  addressTypeId: number;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  status: boolean;
}
