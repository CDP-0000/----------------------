// backend/controllers/authController.js
const { readData, writeData } = require('../utils/db');

// Helper: สร้างรหัสผ่านจากวันเกิด (format: YYYY-MM-DD -> DDMMYYYY)
const generatePasswordFromBirthdate = (birthdate) => {
    if (!birthdate) return '1234'; // Default fallback
    const parts = birthdate.split('-'); // [YYYY, MM, DD]
    if (parts.length === 3) {
        return `${parts[2]}${parts[1]}${parts[0]}`;
    }
    return '1234';
};

// --- 1. Register (สำหรับนักเรียน) ---
exports.register = (req, res) => {
    try {
        const formData = req.body;
        const users = readData('users.json');

        // (Optional) เช็คว่าเคยมีชื่อ-นามสกุลนี้ในระบบหรือยัง? (ป้องกันการกดรัว)
        const existingUser = users.find(u => 
            u.firstname === formData.firstname && 
            u.lastname === formData.lastname
        );
        
        if (existingUser) {
            // ถ้าต้องการให้แจ้งเตือนว่ามีชื่อนี้แล้ว ให้เปิดบรรทัดนี้:
            // return res.status(400).json({ success: false, message: "ชื่อและนามสกุลนี้มีในระบบแล้ว" });
        }

        // 1. สร้าง Student ID (สุ่มเลข 6 หลัก)
        // ตรวจสอบไม่ให้ซ้ำกับ ID ที่มีอยู่
        let loginId;
        let isDuplicate = true;
        while (isDuplicate) {
            loginId = `STU${Math.floor(100000 + Math.random() * 900000)}`;
            if (!users.find(u => u.loginId === loginId)) {
                isDuplicate = false;
            }
        }

        // 2. สร้าง Password จากวันเกิด (DDMMYYYY)
        const password = generatePasswordFromBirthdate(formData.birthdate);

        // 3. เตรียม Object ข้อมูลที่จะบันทึก (Map ตาม Frontend เป๊ะๆ)
        const newUser = {
            id: Date.now().toString(),
            loginId: loginId,
            password: password, // ใน Production ควร Hash ด้วย bcrypt
            
            role: 'student', // บังคับเป็น student
            studentType: formData.studentType || 'general', // รับค่า NoCDP หรืออื่นๆ
            
            // ข้อมูลส่วนตัว
            firstname: formData.firstname,
            lastname: formData.lastname,
            nickname: formData.nickname,
            birthdate: formData.birthdate,
            gender: formData.gender,
            contact: formData.contact || '',
            
            // ข้อมูลการศึกษา/พื้นที่
            educationLevel: formData.educationLevel,
            branchId: formData.branchId,
            villageId: formData.villageId,
            schoolId: formData.schoolId,

            // ข้อมูล Profile เบื้องต้น (Interests, Goals, Health)
            initialProfile: formData.initialProfile || {},

            createdAt: new Date().toISOString(),
            isActive: true
        };

        // 4. บันทึกลงไฟล์
        users.push(newUser);
        writeData('users.json', users);

        // 5. ส่ง Response กลับไปให้ Frontend แสดงผล
        // Frontend คาดหวัง credentials: { loginId, password }
        res.status(201).json({ 
            success: true, 
            message: "ลงทะเบียนนักเรียนสำเร็จ", 
            credentials: { 
                loginId: loginId, 
                password: password 
            },
            user: {
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Server Error: ไม่สามารถลงทะเบียนได้" });
    }
};

// --- 2. Login (เหมือนเดิม) ---
exports.login = (req, res) => {
    const { username, password } = req.body;
    const users = readData('users.json');

    const user = users.find(u => u.loginId === username && u.password === password);

    if (user) {
        const { password, ...userData } = user; 
        res.json({ 
            success: true, 
            message: "Login Success", 
            role: user.role, 
            user: userData 
        });
    } else {
        res.status(401).json({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }
};