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

export const diagramApi = {
  // Generate new diagram
  generateDiagram: (data) => fetchWithAuth('/diagrams/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get single diagram
  getDiagram: (diagramId) => fetchWithAuth(`/diagrams/${diagramId}`),

  // Update diagram
  updateDiagram: (diagramId, data) => fetchWithAuth(`/diagrams/${diagramId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Delete diagram
  deleteDiagram: (diagramId) => fetchWithAuth(`/diagrams/${diagramId}`, {
    method: 'DELETE',
  }),
};
