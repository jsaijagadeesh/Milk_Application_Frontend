import axiosInstance from './axiosInstance';

export const userApi = {
  getAll:       ()              => axiosInstance.get('/api/v1/users'),
  getById:      (id)            => axiosInstance.get(`/api/v1/users/${id}`),
  getWallet:    (id)            => axiosInstance.get(`/api/v1/users/${id}/wallet`),
  deductWallet: (id, amount)    => axiosInstance.post(`/api/v1/users/${id}/wallet/deduct`, { amount }),
  addWallet:    (id, amount)    => axiosInstance.post(`/api/v1/users/${id}/wallet/add`, { amount }),
  updateRole:   (id, role)      => axiosInstance.put(`/api/v1/users/${id}/role?new_role=${role}`),
  createUser:   (data)          => axiosInstance.post('/api/v1/users', data),
  delete:       (id)            => axiosInstance.delete(`/api/v1/users/${id}`),
};
