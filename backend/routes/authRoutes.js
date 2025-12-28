// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ถ้ามีคนยิงมาที่ /register ให้ไปทำงานที่ authController.register
router.post('/register', authController.register);

// ถ้ามีคนยิงมาที่ /login ให้ไปทำงานที่ authController.login
router.post('/login', authController.login);

module.exports = router;