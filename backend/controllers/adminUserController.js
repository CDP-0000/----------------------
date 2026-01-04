// backend/controllers/adminUserController.js
const { readData, writeData } = require('../utils/db');

// Helper: สุ่มรหัสผ่าน 8 หลัก
const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};

// 1. สร้าง User ใหม่ (Create)
exports.createUser = (req, res) => {
    // รับค่าทั้งหมดจาก Frontend
    const { 
        targetRole, firstname, lastname, username, password, 
        age, gender, 
        educationLevel, studentType, // เฉพาะนักเรียน
        branchId, villageId, schoolId // นักเรียน, พนักงาน, ผจก.
    } = req.body;

    const users = readData();

    // Validate Duplicate Username
    if (users.find(u => u.loginId === username)) {
        return res.status(400).json({ success: false, message: "ชื่อผู้ใช้งาน (Username) นี้มีอยู่แล้ว" });
    }

    // สร้าง ID และ Password (ถ้าไม่กรอก)
    const newId = Date.now().toString();
    const finalPassword = password ? password : generatePassword();

    // สร้าง Object ตาม Role
    let newUser = {
        id: newId,
        loginId: username,
        password: finalPassword,
        role: targetRole,
        firstname,
        lastname,
        age: age || "-",
        gender: gender || "-",
        createdAt: new Date().toISOString()
    };

    // เพิ่มฟิลด์ตามเงื่อนไข
    if (['student', 'staff', 'branch_manager'].includes(targetRole)) {
        newUser.branchId = branchId || null;
        newUser.villageId = villageId || null;
        newUser.schoolId = schoolId || null;
    }

    if (targetRole === 'student') {
        newUser.educationLevel = educationLevel || "-";
        newUser.studentType = studentType || "NoCDP"; // Default NoCDP
    }

    users.push(newUser);
    writeData(users);

    res.json({ success: true, message: "สร้างข้อมูลสำเร็จ", user: newUser });
};

// 2. ดึงข้อมูลทั้งหมด (Read) - แสดง Password ตามที่ขอ
exports.getAllUsers = (req, res) => {
    const users = readData();
    // ส่งข้อมูลกลับไปทั้งหมดรวมถึง Password (ตาม requirement ของคุณ)
    // *หมายเหตุ: ใน Production จริง ไม่ควรส่ง password กลับไป
    res.json(users);
};

// 3. แก้ไขข้อมูล (Update)
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    let users = readData();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้งาน" });
    }

    // อัปเดตข้อมูล (Merge ข้อมูลเก่ากับใหม่)
    users[index] = { ...users[index], ...updateData };

    writeData(users);
    res.json({ success: true, message: "แก้ไขข้อมูลสำเร็จ", user: users[index] });
};

// 4. ลบข้อมูล (Delete)
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    let users = readData();
    
    const newUsers = users.filter(u => u.id !== id);
    
    if (users.length === newUsers.length) {
        return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้งาน" });
    }

    writeData(newUsers);
    res.json({ success: true, message: "ลบผู้ใช้งานเรียบร้อยแล้ว" });
};