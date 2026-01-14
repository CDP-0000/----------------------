// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/create', reviewController.createReview);
router.get('/subject/:subjectId', reviewController.getReviewsBySubject);

module.exports = router;