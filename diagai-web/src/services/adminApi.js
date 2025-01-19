import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create a separate instance for admin API
const adminAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
adminAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear admin auth on unauthorized
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/admin/login';
    }
    throw error;
  }
);

export const adminApi = {
  login: async (email, password) => {
    try {
      const response = await adminAxios.post('/admin/login', { email, password });
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  getStats: async () => {
    try {
      const response = await adminAxios.get('/admin/stats');
      return response;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  },

  getUsers: async ({ page = 1, limit = 10, search = '', sort_by = 'created_at', sort_order = 'desc' } = {}) => {
    try {
      const response = await adminAxios.get('/admin/users', {
        params: {
          page,
          limit,
          search,
          sort_by,
          sort_order
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  getDiagrams: async ({ page = 1, limit = 10, search = '', status = '', type = '', sort_by = 'created_at', sort_order = 'desc' } = {}) => {
    try {
      const response = await adminAxios.get('/admin/diagrams', {
        params: {
          page,
          limit,
          search,
          status,
          type,
          sort_by,
          sort_order
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching diagrams:', error);
      throw new Error('Failed to fetch diagrams');
    }
  },

  getProjects: async ({ page = 1, limit = 10, search = '', sort_by = 'created_at', sort_order = 'desc' } = {}) => {
    try {
      const response = await adminAxios.get('/admin/projects', {
        params: {
          page,
          limit,
          search,
          sort_by,
          sort_order
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  },

  getProject: async (projectId) => {
    try {
      const response = await adminAxios.get(`/admin/projects/${projectId}`);
      return response;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project details');
    }
  },

  deleteProject: async (projectId) => {
    try {
      const response = await adminAxios.delete(`/admin/projects/${projectId}`);
      return response;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  },

  updateUserCredits: async (userId, credits) => {
    try {
      const response = await adminAxios.post(`/admin/users/${userId}/credits`, { credits });
      return response;
    } catch (error) {
      console.error('Error updating credits:', error);
      throw new Error('Failed to update user credits');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await adminAxios.delete(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  },

  deleteDiagram: async (diagramId) => {
    try {
      const response = await adminAxios.delete(`/admin/diagrams/${diagramId}`);
      return response;
    } catch (error) {
      console.error('Error deleting diagram:', error);
      throw new Error('Failed to delete diagram');
    }
  }
};
