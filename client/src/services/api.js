import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('pisUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const authAPI = {
  login:          (data) => API.post('/auth/login', data),
  register:       (data) => API.post('/auth/register', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

export const usersAPI = {
  getAll:  ()       => API.get('/users'),
  create:  (data)   => API.post('/users', data),
  update:  (id, d)  => API.put(`/users/${id}`, d),
  remove:  (id)     => API.delete(`/users/${id}`),
};

export const patientsAPI = {
  getAll:  (q)      => API.get('/patients', { params: { q } }),
  getOne:  (id)     => API.get(`/patients/${id}`),
  create:  (data)   => API.post('/patients', data),
  update:  (id, d)  => API.put(`/patients/${id}`, d),
  remove:  (id)     => API.delete(`/patients/${id}`),
};

export const parametersAPI = {
  add:     (data)   => API.post('/parameters', data),
  getAll:  (pid)    => API.get(`/parameters/${pid}`),
  update:  (id, d)  => API.put(`/parameters/${id}`, d),
};

export const consultationsAPI = {
  add:     (data)   => API.post('/consultations', data),
  getAll:  (pid)    => API.get(`/consultations/${pid}`),
  update:  (id, d)  => API.put(`/consultations/${id}`, d),
  remove:  (id)     => API.delete(`/consultations/${id}`),
};

export const appointmentsAPI = {
  getAll:  ()       => API.get('/appointments'),
  getOne:  (id)     => API.get(`/appointments/${id}`),
  add:     (data)   => API.post('/appointments', data),
  update:  (id, d)  => API.put(`/appointments/${id}`, d),
  remove:  (id)     => API.delete(`/appointments/${id}`),
};

export const reportsAPI = {
  patients:      () => API.get('/reports/patients'),
  consultations: () => API.get('/reports/consultations'),
  appointments:  () => API.get('/reports/appointments'),
  users:         () => API.get('/reports/users'),
};

export default API;
