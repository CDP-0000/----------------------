const { readData, writeData } = require('../utils/db');

const DB_FILE = 'subjects.json';

// Helper: สร้างรหัสวิชาอัตโนมัติ (Format: SK-YYYY-XXXX)
const generateSubjectCode = (subjects) => {
    const year = new Date().getFullYear();
    // นับจำนวนวิชาในปีนี้เพื่อรันเลข
    const count = subjects.filter(s => s.code.startsWith(`SK-${year}`)).length + 1;
    return `SK-${year}-${String(count).padStart(4, '0')}`;
};

// 1. ดึงวิชาทั้งหมด
exports.getAllSubjects = (req, res) => {
    const subjects = readData(DB_FILE);
    res.json(subjects);
};

// 2. สร้างวิชาใหม่ (พร้อม Generate Code)
exports.createSubject = (req, res) => {
    const { name, branchId, instructorId, category, description, status } = req.body;
    const subjects = readData(DB_FILE);

    // ✅ สร้างรหัสอัตโนมัติ
    const code = generateSubjectCode(subjects);

    const newSubject = {
        id: Date.now().toString(),
        code, // ใช้รหัสที่สร้างเอง
        name,
        branchId,      // สาขาที่เปิดสอน
        instructorId,  // ผู้รับผิดชอบ (Staff/Manager)
        category: category || "การเรียน",
        description: description || "",
        status: status || "Active",
        updatedAt: new Date().toISOString()
    };

    subjects.push(newSubject);
    writeData(subjects, DB_FILE);
    res.json({ success: true, message: "เพิ่มวิชาสำเร็จ", subject: newSubject });
};

// 3. แก้ไขวิชา
exports.updateSubject = (req, res) => {
    const { id } = req.params;
    const { name, branchId, instructorId, category, description, status } = req.body;
    let subjects = readData(DB_FILE);

    const index = subjects.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: "ไม่พบข้อมูล" });

    // Update (รหัสวิชา code จะไม่ถูกแก้ไข)
    subjects[index] = {
        ...subjects[index],
        name, branchId, instructorId, category, description, status,
        updatedAt: new Date().toISOString()
    };

    writeData(subjects, DB_FILE);
    res.json({ success: true, message: "แก้ไขสำเร็จ", subject: subjects[index] });
};

// 4. ลบวิชา
exports.deleteSubject = (req, res) => {
    const { id } = req.params;
    let subjects = readData(DB_FILE);
    const newSubjects = subjects.filter(s => s.id !== id);
    
    if (subjects.length === newSubjects.length) return res.status(404).json({ success: false, message: "ไม่พบข้อมูล" });

    writeData(newSubjects, DB_FILE);
    res.json({ success: true, message: "ลบสำเร็จ" });
};