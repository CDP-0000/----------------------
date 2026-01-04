// frontend/src/lib/api/endpoints.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const client = axios.create({
  baseURL: BASE_URL,
});

export const AuthAPI = {
  login: async (username, password) => {
    return await client.post('/login', { username, password });
  },
  register: async (payload) => {
    return await client.post('/register', payload);
  }
};

export const MasterAPI = {
  getSchools: () => client.get('/master/schools'),
  createSchool: (data) => client.post('/master/schools', data),
  updateSchool: (id, data) => client.put(`/master/schools/${id}`, data),
  deleteSchool: (id) => client.delete(`/master/schools/${id}`),

  getBranches: () => client.get('/master/branches'),
  createBranch: (data) => client.post('/master/branches', data),
  updateBranch: (id, data) => client.put(`/master/branches/${id}`, data),
  deleteBranch: (id) => client.delete(`/master/branches/${id}`),

  getVillages: () => client.get('/master/villages'),
  createVillage: (data) => client.post('/master/villages', data),
  updateVillage: (id, data) => client.put(`/master/villages/${id}`, data),
  deleteVillage: (id) => client.delete(`/master/villages/${id}`),
};

export const AdminAPI = {
  getAllUsers: () => client.get('/admin/users'),
  createUser: (data) => client.post('/admin/create-user', data),
  // ✅ เพิ่ม 2 ฟังก์ชันนี้
  updateUser: (id, data) => client.put(`/admin/update-user/${id}`, data),
  deleteUser: (id) => client.delete(`/admin/delete-user/${id}`),
};