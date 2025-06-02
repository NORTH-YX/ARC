const getBackendUrl = (): string => {
  try {
    const currentHost = window.location.hostname;

    // Si se ejecuta localmente, usar localhost con el puerto 8080
    if (currentHost === "localhost" || currentHost === "127.0.0.1") {
      return `http://localhost:8080/api`;
    }

    // En producción/nube, usar el hostname actual sin el puerto 8080
    return `http://${currentHost}/api`;
  } catch (error) {
    console.error("Error getting backend URL:", error);
    // Fallback a una URL predeterminada si algo falla
    return "http://localhost:8080/api";
  }
};

const API_BASE_URL = getBackendUrl();

class ApiClient {
  private static instance: ApiClient;
  private headers = {
    Accept: "*/*",
  };
  private onUnauthorized: (() => void) | null = null;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setToken(token: string | null) {
    this.headers = {
      Accept: "*/*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  setOnUnauthorized(callback: () => void) {
    this.onUnauthorized = callback;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log("Making request to:", fullUrl);

    const requestHeaders = new Headers(this.headers);

    if (options.body) {
      requestHeaders.set("Content-Type", "application/json");
    }

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: requestHeaders,
      });

      if (response.status === 403) {
        // Clear token and redirect to login
        this.setToken(null);
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
        window.location.href = "/login";
        throw new Error("Unauthorized access");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          headers: Object.fromEntries(response.headers.entries()),
        });
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      // Check if the response is JSON or text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        return response.text();
      }
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const apiClient = ApiClient.getInstance();
