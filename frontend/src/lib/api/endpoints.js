// src/lib/api/endpoints.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// ✅ 1. ต้องประกาศตัวแปร client ตรงนี้ (ส่วนที่ขาดหายไป)
export const client = axios.create({
  baseURL: BASE_URL,
});

export const AuthAPI = {
  // ✅ เปลี่ยนมาใช้ client แทน axios.post แบบเดิม (เพื่อให้จัดการ Base URL ที่เดียว)
  login: async (username, password) => {
    return await client.post('/login', { username, password });
  },

  register: async (payload) => {
    return await client.post('/register', payload);
  }
};

export const MasterAPI = {
  // ตรงนี้จะทำงานได้แล้ว เพราะ client ถูกประกาศไว้ข้างบนแล้ว
  getSchools: () => client.get('/master/schools'),
  createSchool: (data) => client.post('/master/schools', data),
  updateSchool: (id, data) => client.put(`/master/schools/${id}`, data),
  deleteSchool: (id) => client.delete(`/master/schools/${id}`),

  // Branches ✅ เพิ่ม
  getBranches: () => client.get('/master/branches'),
  createBranch: (data) => client.post('/master/branches', data),
  updateBranch: (id, data) => client.put(`/master/branches/${id}`, data),
  deleteBranch: (id) => client.delete(`/master/branches/${id}`),

  // Villages ✅ เพิ่ม
  getVillages: () => client.get('/master/villages'),
  createVillage: (data) => client.post('/master/villages', data),
  updateVillage: (id, data) => client.put(`/master/villages/${id}`, data),
  deleteVillage: (id) => client.delete(`/master/villages/${id}`),
};