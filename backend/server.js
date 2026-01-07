// backend/server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // ✅ เรียกใช้ Routes
const adminRoutes = require('./routes/adminRoutes'); // ✅ เพิ่ม
const masterRoutes = require('./routes/masterRoutes'); // ✅ เพิ่ม
const subjectRoutes = require('./routes/subjectRoutes'); // ✅ เพิ่ม route สำหรับ subjects
const reportRoutes = require('./routes/reportRoutes'); // ✅ เพิ่ม
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- Routes ---
// บอกว่าถ้า URL ขึ้นต้นด้วย /api ให้วิ่งไปดูใน authRoutes นะ
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes); // ✅ URL จะเป็น /api/admin/create-user
app.use('/api/master', masterRoutes); // ✅ URL จะเป็น /api/master/schools
app.use('/api/master/subjects', subjectRoutes); // ✅ เพิ่ม route สำหรับ subjects
app.use('/api/report', reportRoutes);

app.get('/', (req, res) => {
    res.send('Backend Server is Ready!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});