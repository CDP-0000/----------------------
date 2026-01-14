// backend/controllers/reviewController.js
const { readData, writeData } = require('../utils/db');

// บันทึกรีวิว (Create Review)
exports.createReview = (req, res) => {
    const { studentId, studentName, subjectId, subjectName, rating, comment } = req.body;

    if (!studentId || !subjectId || !rating) {
        return res.status(400).json({ success: false, message: "ข้อมูลไม่ครบถ้วน (ต้องระบุผู้เรียน, วิชา, และคะแนน)" });
    }

    // อ่านไฟล์ reviews.json (ถ้าไม่มี db.js จะสร้างให้)
    const reviews = readData('reviews.json');

    // ตรวจสอบว่าเคยรีวิววิชานี้ไปแล้วหรือยัง? (ป้องกันการปั๊มคะแนน)
    const existing = reviews.find(r => r.studentId === studentId && r.subjectId === subjectId);
    if (existing) {
        return res.status(400).json({ success: false, message: "คุณเคยรีวิววิชานี้ไปแล้ว" });
    }

    const newReview = {
        id: Date.now().toString(),
        studentId,
        studentName,   // เก็บชื่อไว้ด้วยเพื่อแสดงผลง่ายๆ
        subjectId,
        subjectName,
        rating: parseInt(rating),
        comment: comment || "",
        createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    writeData('reviews.json', reviews);

    res.json({ success: true, message: "บันทึกรีวิวเรียบร้อยขอบคุณครับ!", review: newReview });
};

// ดึงรีวิวของวิชา (เผื่ออยากเอาไปโชว์)
exports.getReviewsBySubject = (req, res) => {
    const { subjectId } = req.params;
    const reviews = readData('reviews.json');
    const subjectReviews = reviews.filter(r => r.subjectId === subjectId);
    res.json(subjectReviews);
};