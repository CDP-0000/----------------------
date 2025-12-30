const { readData, writeData } = require('../utils/db');
const FILE_NAME = 'branches.json';

exports.getBranches = (req, res) => res.json(readData(FILE_NAME));

exports.createBranch = (req, res) => {
    const data = readData(FILE_NAME);
    const newItem = { id: Date.now().toString(), ...req.body, updatedAt: new Date().toISOString() };
    data.push(newItem);
    writeData(FILE_NAME, data);
    res.json({ success: true, data: newItem });
};

exports.updateBranch = (req, res) => {
    const { id } = req.params;
    let data = readData(FILE_NAME);
    const index = data.findIndex(x => x.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body, updatedAt: new Date().toISOString() };
        writeData(FILE_NAME, data);
        res.json({ success: true, data: data[index] });
    } else {
        res.status(404).json({ success: false });
    }
};

exports.deleteBranch = (req, res) => {
    const { id } = req.params;
    let data = readData(FILE_NAME);
    data = data.filter(x => x.id !== id);
    writeData(FILE_NAME, data);
    res.json({ success: true });
};