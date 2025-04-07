const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  private static instance: ApiClient;
  private headers = {
    'Accept': '*/*',
  };

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setToken(token: string | null) {
    this.headers = {
      'Accept': '*/*',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('Making request to:', fullUrl);
    
    // Prepare headers
    const requestHeaders = new Headers(this.headers);
    
    // Only add Content-Type for POST/PUT requests with a body
    if (options.body) {
      requestHeaders.set('Content-Type', 'application/json');
    }
    
    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: requestHeaders,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  get(endpoint: string) {
    return this.request(endpoint, { 
      method: 'GET',
    });
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, { 
      method: 'DELETE',
    });
  }
}

export const apiClient = ApiClient.getInstance(); 