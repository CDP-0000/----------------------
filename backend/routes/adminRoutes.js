// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');

// Create
router.post('/create-user', adminUserController.createUser);

// Read
router.get('/users', adminUserController.getAllUsers);

// Update ✅
router.put('/update-user/:id', adminUserController.updateUser);

// Delete ✅
router.delete('/delete-user/:id', adminUserController.deleteUser);

module.exports = router;