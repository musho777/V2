// ERP Services exports

// HTTP infrastructure
export { erpApiClient, httpService } from './api.config';
export { default as HttpService } from './http.service';

// Entity services - regular (fetch-based)
export * from './administrative-district.service';
export * from './building.service';
export * from './city.service';
export * from './country.service';
export * from './customer.service';
export * from './region.service';
export * from './street.service';

// Entity services - Observable-based (RxJS)
export * from './building.service.observable';
export * from './city.service.observable';
export * from './country.service.observable';
export * from './customer.service.observable';
export * from './region.service.observable';
export * from './street.service.observable';
