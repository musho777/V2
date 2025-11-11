import HttpService from './http.service';

export const ERP_API_BASE_URL = 'https://erp-dev-api.simplego.am';

// Create HTTP service instance with RxJS Observables
export const httpService = new HttpService({
  baseURL: ERP_API_BASE_URL,
});

// Legacy client for backward compatibility (will be deprecated)
const getAuthHeaders = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const erpApiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${ERP_API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  post: async (endpoint: string, data: unknown) => {
    const response = await fetch(`${ERP_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  put: async (endpoint: string, data: unknown) => {
    const response = await fetch(`${ERP_API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${ERP_API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: any = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.error = errorData.error;
      error.timestamp = errorData.timestamp;
      throw error;
    }
    return response.json();
  },
};
