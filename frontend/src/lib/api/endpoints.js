// src/lib/api/endpoints.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api'; // ชี้ไปที่ Backend ของเรา

export const AuthAPI = {
  // ฟังก์ชัน Login
  login: async (username, password) => {
    // ยิง POST ไปที่ http://localhost:3000/api/login
    return await axios.post(`${BASE_URL}/login`, { username, password });
  },
  
  // ฟังก์ชัน Register (เผื่อไว้)
  register: async (payload) => {
    return await axios.post(`${BASE_URL}/register`, payload);
  }
};