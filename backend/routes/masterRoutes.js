const express = require('express');
const router = express.Router();

const schoolController = require('../controllers/schoolController');
const branchController = require('../controllers/branchController');   // ✅ เพิ่ม
const villageController = require('../controllers/villageController'); // ✅ เพิ่ม

// --- Schools ---
router.get('/schools', schoolController.getSchools);
router.post('/schools', schoolController.createSchool);
router.put('/schools/:id', schoolController.updateSchool);
router.delete('/schools/:id', schoolController.deleteSchool);

// --- Branches (สาขา) --- 
router.get('/branches', branchController.getBranches);
router.post('/branches', branchController.createBranch);
router.put('/branches/:id', branchController.updateBranch);
router.delete('/branches/:id', branchController.deleteBranch);

// --- Villages (หมู่บ้าน) --- 
router.get('/villages', villageController.getVillages);
router.post('/villages', villageController.createVillage);
router.put('/villages/:id', villageController.updateVillage);
router.delete('/villages/:id', villageController.deleteVillage);

module.exports = router;