const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'An error occurred');
  }

  return response.json();
}

export const userApi = {
  getDashboardStats: () => fetchWithAuth('/users/dashboard'),
  getUserDiagrams: (limit = 10) => fetchWithAuth(`/users/diagrams?limit=${limit}`),
  getCredits: () => fetchWithAuth('/users/credits'),
  updateUser: (data) => fetchWithAuth('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};
