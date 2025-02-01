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
  getProject: (id) => fetchWithAuth(`/projects/${id}`),

  // Get diagrams with status and type filters
  getDiagrams: (projectId, status = 'all', type = 'all') => {
    let url = `/projects/${projectId}/diagrams`;
    const params = [];
    
    if (status !== 'all') {
      params.push(`status=${status}`);
    }
    if (type !== 'all') {
      params.push(`type=${type}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return fetchWithAuth(url);
  },

  // Create new project
  createProject: (data) => fetchWithAuth('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Update project
  updateProject: (id, data) => fetchWithAuth(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Delete project
  deleteProject: (id) => fetchWithAuth(`/projects/${id}`, {
    method: 'DELETE',
  }),
};
