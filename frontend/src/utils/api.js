// Auth uses an httpOnly cookie set by the server; the token is never
// exposed to JavaScript, so there is nothing to store client-side.
async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'include'
  });
  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    error.code = data.code;
    throw error;
  }
  return data;
}

export const api = {
  login: (email, password) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),
  listBlogs: () => request('/api/blogs'),
  listAdminBlogs: () => request('/api/blogs/admin'),
  getBlog: (idOrSlug) => request(`/api/blogs/${encodeURIComponent(idOrSlug)}`),
  createBlog: (payload) => request('/api/blogs', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateBlog: (id, payload) => request(`/api/blogs/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deleteBlog: (id) => request(`/api/blogs/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  }),
  createApplication: (payload) => request('/api/applications', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  listApplications: () => request('/api/applications'),
  updateApplicationStatus: (id, status) => request(`/api/applications/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  subscribe: (email, source = 'footer') => request('/api/subscribers', {
    method: 'POST',
    body: JSON.stringify({ email, source })
  }),
  listSubscribers: () => request('/api/subscribers'),
  deleteSubscriber: (id) => request(`/api/subscribers/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  }),
  listAiModels: () => request('/api/ai/models'),
  recommendLearningPath: (payload) => request('/api/ai/learning-path', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  askSupportAi: (question) => request('/api/ai/support', {
    method: 'POST',
    body: JSON.stringify({ question })
  }),
  analyzeCareerFit: (payload) => request('/api/ai/career-fit', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  generateBlogDraft: (payload) => request('/api/ai/blog-draft', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  summarizeApplication: (payload) => request('/api/ai/application-summary', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
