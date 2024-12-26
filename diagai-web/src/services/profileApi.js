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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'An error occurred');
  }

  return response.json();
}

export const profileApi = {
  // Get current user profile
  getProfile: () => fetchWithAuth('/users/me'),

  // Update user profile
  updateProfile: (data) => fetchWithAuth('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Get user credits and usage
  getCredits: () => fetchWithAuth('/users/credits'),
};
