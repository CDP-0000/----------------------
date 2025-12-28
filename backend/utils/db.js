// backend/utils/db.js
const fs = require('fs');
const path = require('path');

// ชี้ไปที่โฟลเดอร์ data
const DATA_FILE = path.join(__dirname, '../data/users.json');

// ตรวจสอบว่ามีโฟลเดอร์ data หรือยัง ถ้าไม่มีให้สร้าง
const dirPath = path.dirname(DATA_FILE);
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

exports.readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            // ถ้าไม่มีไฟล์ ให้สร้างไฟล์เปล่า []
            fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB:", err);
        return [];
    }
};

exports.writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing DB:", err);
    }
};