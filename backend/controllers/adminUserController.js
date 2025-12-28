// backend/controllers/adminUserController.js
const { readData, writeData } = require('../utils/db');

// API สร้าง User ภายใน (Staff, Manager, Director)
exports.createUser = (req, res) => {
    const { 
        targetRole, // role ที่ต้องการสร้าง (staff, branch_manager, director)
        firstname, 
        lastname, 
        username, 
        password,
        branchId // ถ้าเป็น staff/manager ต้องระบุสาขา
    } = req.body;

    // 1. อ่านข้อมูล
    const users = readData();

    // 2. Validate: ห้ามสร้าง role admin เพิ่ม (หรือแล้วแต่ Policy)
    const allowedRoles = ['staff', 'branch_manager', 'director'];
    if (!allowedRoles.includes(targetRole)) {
        return res.status(400).json({ success: false, message: "Role นี้ไม่สามารถสร้างได้" });
    }

    // 3. เช็คซ้ำ
    if (users.find(u => u.loginId === username)) {
        return res.status(400).json({ success: false, message: "Username นี้มีอยู่แล้ว" });
    }

    // 4. สร้าง User ใหม่
    const newUser = {
        id: Date.now().toString(),
        loginId: username,
        password: password,
        role: targetRole, // ใช้ role ตามที่ Admin สั่ง
        firstname,
        lastname,
        branchId: branchId || null, // ถ้าเป็น Director อาจจะเป็น null
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData(users);

    res.json({ success: true, message: `สร้างผู้ใช้ตำแหน่ง ${targetRole} สำเร็จ` });
};

// API ดึงรายชื่อ User ทั้งหมด (เพื่อแสดงในตารางหน้า Admin)
exports.getAllUsers = (req, res) => {
    const users = readData();
    // กรอง password ออกก่อนส่งกลับเพื่อความปลอดภัย
    const safeUsers = users.map(u => {
        const { password, ...rest } = u;
        return rest;
    });
    res.json(safeUsers);
};