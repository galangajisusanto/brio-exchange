export default class ApiClient {
  constructor(
    baseUrl = 'https://fvvscniadzaapklejpim.supabase.co/rest/v1/',
    apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dnNjbmlhZHphYXBrbGVqcGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTU2MzgsImV4cCI6MjA2MjY3MTYzOH0.2NPR8_w1kCZxeY6i4BPa1YuidNfcP1uXDUrwjSPyaos'
  ) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.headers = {
      'Content-Type': 'application/json',
      'apikey': apiKey,
    };
  }

  // Generic request handler with improved error handling
  async makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      method,
      headers: this.headers,
    };

    // Add body for non-GET requests
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.body = JSON.stringify(body);
    }

    try {
      console.log(`Making ${method} request to: ${url}`);
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText} - ${errorText}`);
      }

      // Handle empty responses (like DELETE)
      if (response.status === 204 || method === 'DELETE') {
        return { success: true, message: 'Operation completed successfully' };
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`Response from ${method} ${endpoint}:`, data);
        return data;
      }

      return response;
    } catch (error) {
      console.error(`API Request failed for ${method} ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Convenience methods for HTTP verbs
  async get(endpoint) {
    return this.makeRequest(endpoint, 'GET');
  }

  async post(endpoint, data) {
    return this.makeRequest(endpoint, 'POST', data);
  }

  async put(endpoint, data) {
    return this.makeRequest(endpoint, 'PUT', data);
  }

  async patch(endpoint, data) {
    return this.makeRequest(endpoint, 'PATCH', data);
  }

  async delete(endpoint) {
    return this.makeRequest(endpoint, 'DELETE');
  }
}