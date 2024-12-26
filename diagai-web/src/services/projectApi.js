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

export const projectApi = {
  // Get all projects
  getProjects: () => fetchWithAuth('/projects'),

  // Get single project with diagrams
  getProject: (projectId) => fetchWithAuth(`/projects/${projectId}`),

  // Create new project
  createProject: (data) => fetchWithAuth('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update project
  updateProject: (projectId, data) => fetchWithAuth(`/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Delete project
  deleteProject: (projectId) => fetchWithAuth(`/projects/${projectId}`, {
    method: 'DELETE',
  }),
};
