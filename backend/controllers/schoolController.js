const { readData, writeData } = require('../utils/db');
const FILE_NAME = 'schools.json';

// Get All
exports.getSchools = (req, res) => {
    const schools = readData(FILE_NAME);
    res.json(schools);
};

// Create
exports.createSchool = (req, res) => {
    const schools = readData(FILE_NAME);
    
    const newSchool = {
        id: Date.now().toString(),
        ...req.body, 
        updatedAt: new Date().toISOString()
    };

    schools.push(newSchool);
    writeData(FILE_NAME, schools);
    res.json({ success: true, data: newSchool });
};

// Update
exports.updateSchool = (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let schools = readData(FILE_NAME);

    const index = schools.findIndex(s => s.id === id);
    if (index !== -1) {
        schools[index] = { ...schools[index], ...updates, updatedAt: new Date().toISOString() };
        writeData(FILE_NAME, schools);
        res.json({ success: true, data: schools[index] });
    } else {
        res.status(404).json({ success: false, message: 'School not found' });
    }
};

// Delete
exports.deleteSchool = (req, res) => {
    const { id } = req.params;
    let schools = readData(FILE_NAME);
    schools = schools.filter(s => s.id !== id);
    writeData(FILE_NAME, schools);
    res.json({ success: true, message: 'Deleted successfully' });
};