// ERP Hooks exports

// Observable infrastructure hooks
export * from './useObservable';

// Entity hooks - regular
export * from './useAddressAdd';
export * from './useAdministrativeDistricts';
export * from './useBuildings';
export * from './useCities';
export * from './useCountries';
export * from './useCustomer';
export * from './useRegions';
export * from './useSearchClient';
export * from './useStreets';

// Entity hooks - Observable-based (RxJS)
export * from './useCustomerObservable';
export * from './useSearchClientObservable';
