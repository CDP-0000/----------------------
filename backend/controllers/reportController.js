// backend/controllers/reportController.js
const { readData, writeData } = require('../utils/db');

// --- 1. บันทึกหน้าที่ประจำวัน (Daily Duty) ---
exports.createDailyDuty = (req, res) => {
    const { taskDescription, userId } = req.body;
    
    // ดึงข้อมูล User มาเพื่อแปะชื่อ/สาขา อัตโนมัติ (Snapshot ข้อมูล ณ ตอนบันทึก)
    const users = readData('users.json');
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ success: false, message: "ไม่พบข้อมูลผู้ใช้งาน" });
    }

    const newLog = {
        id: Date.now().toString(),
        recordDate: new Date().toISOString(), // วันที่เก็บอัตโนมัติ
        userId: user.id,
        userFullName: `${user.firstname} ${user.lastname}`, // เก็บชื่อไปด้วยเลย เผื่อ User เปลี่ยนชื่อทีหลัง
        branchId: user.branchId || 'N/A', // เก็บสาขาอัตโนมัติ
        taskDescription,
        createdAt: new Date().toISOString()
    };

    const logs = readData('daily_duties.json'); // ไฟล์จะถูกสร้างเองโดย db.js
    logs.push(newLog);
    writeData('daily_duties.json', logs);

    res.json({ success: true, message: "บันทึกงานประจำวันสำเร็จ" });
};

// --- 2. บันทึกสรุปการสอน (Teaching Summary) ---
exports.createTeachingSummary = (req, res) => {
    // ข้อมูลที่ส่งมาจากหน้าบ้าน
    const { branchId, teacherId, subjectId, studentCount, description } = req.body;

    const newSummary = {
        id: Date.now().toString(),
        recordDate: new Date().toISOString(), // วันที่เก็บอัตโนมัติ
        branchId,
        teacherId,
        subjectId,
        studentCount: parseInt(studentCount),
        description,
        createdAt: new Date().toISOString()
    };

    const summaries = readData('teaching_summaries.json');
    summaries.push(newSummary);
    writeData('teaching_summaries.json', summaries);

    res.json({ success: true, message: "บันทึกสรุปการสอนสำเร็จ" });
};