import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5196/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, fullName) => api.post('/auth/register', { email, password, fullName }),
  getProfile: () => api.get('/auth/me'),
};

export const categoryService = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
};

export const placeService = {
  getPlaces: (params) => api.get('/places', { params }),
  getTopPlaces: (limit = 10) => api.get('/places/top', { params: { limit } }),
  getPlaceById: (id) => api.get(`/places/${id}`),
  getNearbyPlaces: (lng, lat, maxDistance = 5000) => 
    api.get('/places/nearby', { params: { longitude: lng, latitude: lat, maxDistanceMeters: maxDistance } }),
  createPlace: (data) => api.post('/places', data),
  createReview: (placeId, data) => api.post(`/places/${placeId}/reviews`, data),
  updateReview: (placeId, reviewId, data) => api.put(`/places/${placeId}/reviews/${reviewId}`, data),
  deleteReview: (placeId, reviewId) => api.delete(`/places/${placeId}/reviews/${reviewId}`),
  addComment: (placeId, reviewId, content) => 
    api.post(`/places/${placeId}/reviews/${reviewId}/comments`, { content }),
  addReply: (placeId, reviewId, commentId, content) => 
    api.post(`/places/${placeId}/reviews/${reviewId}/comments/${commentId}/replies`, { content }),
  toggleLike: (placeId, reviewId) => api.post(`/places/${placeId}/reviews/${reviewId}/like`),
};

export const interactionService = {
  // Favorites
  getFavorites: () => api.get('/users/me/favorites'),
  toggleFavorite: (placeId) => api.post(`/users/me/favorites/${placeId}`),
  checkFavorite: (placeId) => api.get(`/users/me/favorites/${placeId}/check`),

  // View History
  getViewHistory: () => api.get('/users/me/view-history'),
  recordView: (placeId) => api.post(`/users/me/view-history/${placeId}`),
  clearViewHistory: () => api.delete('/users/me/view-history'),

  // Proposals
  createProposal: (data) => api.post('/place-proposals', data),
  getProposals: (status) => api.get('/place-proposals', { params: { status } }),
  processProposal: (id, approve, rejectionReason) => 
    api.patch(`/place-proposals/${id}/decision`, { approve, rejectionReason }),

  // Reports
  createReport: (data) => api.post('/reports', data),
  getReports: (status) => api.get('/reports', { params: { status } }),
  resolveReport: (id, deleteContent) => api.patch(`/reports/${id}/resolve`, { deleteContent }),

  // Admin Dashboard
  getAdminStats: () => api.get('/admin/dashboard'),
};

export const recommendationService = {
  getRecommendations: (limit = 6) => api.get('/recommendations', { params: { limit } }),
  getTouristFlow: (originSlug) => api.get('/recommendations/tourist-flow', { params: { originSlug } }),
};

export default api;
