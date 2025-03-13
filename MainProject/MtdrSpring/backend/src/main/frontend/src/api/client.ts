import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const createApiClient = () => {
  const { token } = useAuth();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const request = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  };

  return {
    get: (endpoint: string) => request(endpoint),
    post: (endpoint: string, data: any) => 
      request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    put: (endpoint: string, data: any) =>
      request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (endpoint: string) =>
      request(endpoint, {
        method: 'DELETE',
      }),
  };
}; 