// backend/controllers/authController.js
const { readData, writeData } = require('../utils/db');

// --- 1. Register (สำหรับนักเรียนเท่านั้น!) ---
exports.register = (req, res) => {
    const formData = req.body;
    const users = readData();

    // เช็คว่า Username ซ้ำไหม
    if (users.find(u => u.loginId === formData.username)) {
        return res.status(400).json({ success: false, message: "Username นี้ถูกใช้ไปแล้ว" });
    }

    // Logic สร้าง ID นักเรียน (Student ID)
    const loginId = `STU${Math.floor(100000 + Math.random() * 900000)}`;
    const password = formData.password || '1234'; 

    // *** จุดสำคัญ: ตรวจสอบข้อมูลเด็กโครงการ ***
    // สมมติ: ถ้ากรอก "รหัสบัตรประชาชน" ตรงกับฐานข้อมูล "ประวัติเด็ก (StudentHistory)" ให้ถือว่าเป็นเด็กโครงการ
    // (ใน Mockup เราอาจจะรับค่า isProjectStudent มาจาก Frontend หรือเช็คแบบง่ายๆ ไปก่อน)
    
    const newUser = {
        id: Date.now().toString(),
        loginId: loginId, 
        password: password, 
        
        // 🚨 SECURITY: บังคับเป็น student เท่านั้น ห้ามรับค่า role จาก Frontend
        role: 'student', 
        
        firstname: formData.firstname,
        lastname: formData.lastname,
        studentType: formData.isProjectMember ? 'project' : 'general', // แยกประเภท
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData(users);

    res.json({ success: true, message: "ลงทะเบียนนักเรียนสำเร็จ", credentials: { loginId, password } });
};

// --- 2. Login (รองรับทุก Role) ---
exports.login = (req, res) => {
    const { username, password } = req.body;
    const users = readData();

    const user = users.find(u => u.loginId === username && u.password === password);

    if (user) {
        // ส่งข้อมูลกลับไป แต่ไม่ต้องส่ง password กลับ
        const { password, ...userData } = user; 
        res.json({ 
            success: true, 
            message: "Login Success", 
            role: user.role, // Frontend จะเอาค่านี้ไป Redirect หน้า
            user: userData 
        });
    } else {
        res.status(401).json({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }
};