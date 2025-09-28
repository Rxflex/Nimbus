const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    return await response.json();
  }

  // Agent endpoints
  async getAgents() {
    return this.request('/admin/agents');
  }

  async createAgent(agentData) {
    return this.request('/admin/agents', {
      method: 'POST',
      body: JSON.stringify(agentData)
    });
  }

  async updateAgent(id, agentData) {
    return this.request(`/admin/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData)
    });
  }

  async deleteAgent(id) {
    return this.request(`/admin/agents/${id}`, {
      method: 'DELETE'
    });
  }

  // Rule endpoints
  async getRules() {
    return this.request('/admin/rules');
  }

  async createRule(ruleData) {
    return this.request('/admin/rules', {
      method: 'POST',
      body: JSON.stringify(ruleData)
    });
  }

  async updateRule(id, ruleData) {
    return this.request(`/admin/rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ruleData)
    });
  }

  async deleteRule(id) {
    return this.request(`/admin/rules/${id}`, {
      method: 'DELETE'
    });
  }

  // Route endpoints
  async getRoutes() {
    return this.request('/admin/routes');
  }

  async createRoute(routeData) {
    return this.request('/admin/routes', {
      method: 'POST',
      body: JSON.stringify(routeData)
    });
  }

  async updateRoute(id, routeData) {
    return this.request(`/admin/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(routeData)
    });
  }

  async deleteRoute(id) {
    return this.request(`/admin/routes/${id}`, {
      method: 'DELETE'
    });
  }

  // GeoDNS endpoints
  async getGeoDns() {
    return this.request('/admin/geodns');
  }

  async createGeoDns(geodnsData) {
    return this.request('/admin/geodns', {
      method: 'POST',
      body: JSON.stringify(geodnsData)
    });
  }

  async updateGeoDns(id, geodnsData) {
    return this.request(`/admin/geodns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(geodnsData)
    });
  }

  async deleteGeoDns(id) {
    return this.request(`/admin/geodns/${id}`, {
      method: 'DELETE'
    });
  }

  // User endpoints
  async getUsers() {
    return this.request('/auth/users');
  }

  async createUser(userData) {
    return this.request('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return this.request(`/auth/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.request(`/auth/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
