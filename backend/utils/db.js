const fs = require('fs');
const path = require('path');

// ฟังก์ชันช่วยหา Path (สังเกตตรง = 'users.json')
// ความหมาย: ถ้าเรียก getFilePath() เฉยๆ ให้ค่า fileName เป็น 'users.json' อัตโนมัติ
const getFilePath = (fileName = 'users.json') => path.join(__dirname, `../data/${fileName}`);

const ensureFileExists = (filePath) => {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    // ถ้าไฟล์ยังไม่มี ให้สร้าง []
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
};

// 1. อ่านข้อมูล
// ถ้าเรียก readData() เฉยๆ -> อ่าน users.json (โค้ดเก่ารอดตาย!)
// ถ้าเรียก readData('schools.json') -> อ่าน schools.json (โค้ดใหม่ใช้งานได้)
exports.readData = (fileName = 'users.json') => {
    const filePath = getFilePath(fileName);
    ensureFileExists(filePath); // สร้างไฟล์ให้อัตโนมัติถ้ายังไม่มี
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${fileName}:`, err);
        return [];
    }
};

// 2. เขียนข้อมูล
exports.writeData = (fileName, data) => {
    // กรณีเขียนข้อมูล ต้องระวังนิดนึงครับ
    // ถ้า data เป็น array และ fileName ไม่ถูกส่งมา (อาจจะสลับที่กัน)
    // เรามาดักจับให้ฉลาดขึ้น
    
    let targetFile = fileName;
    let content = data;

    // ถ้าส่งมาค่าเดียว (เช่น writeData(users)) ให้ถือว่าลง users.json
    if (typeof fileName !== 'string') {
        content = fileName;
        targetFile = 'users.json';
    }

    const filePath = getFilePath(targetFile);
    ensureFileExists(filePath);
    try {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    } catch (err) {
        console.error(`Error writing ${targetFile}:`, err);
    }
};