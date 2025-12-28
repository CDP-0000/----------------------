const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');

// สร้าง User ใหม่ (สำหรับหน้า Admin User Manage)
router.post('/create-user', adminUserController.createUser);

// ดึง User ทั้งหมด
router.get('/users', adminUserController.getAllUsers);

module.exports = router;