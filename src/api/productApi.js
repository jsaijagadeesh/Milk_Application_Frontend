import axiosInstance from './axiosInstance';

export const productApi = {
  getAll:  ()           => axiosInstance.get('/api/v1/products'),
  getById: (id)         => axiosInstance.get(`/api/v1/products/${id}`),
  create:  (data)       => axiosInstance.post('/api/v1/products', data),
  update:  (id, data)   => axiosInstance.put(`/api/v1/products/${id}`, data),
  delete:  (id)         => axiosInstance.delete(`/api/v1/products/${id}`),
};
