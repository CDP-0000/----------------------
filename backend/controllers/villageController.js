const { readData, writeData } = require('../utils/db');
const FILE_NAME = 'villages.json';

exports.getVillages = (req, res) => res.json(readData(FILE_NAME));

exports.createVillage = (req, res) => {
    const data = readData(FILE_NAME);
    const newItem = { id: Date.now().toString(), ...req.body, updatedAt: new Date().toISOString() };
    data.push(newItem);
    writeData(FILE_NAME, data);
    res.json({ success: true, data: newItem });
};

exports.updateVillage = (req, res) => {
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

exports.deleteVillage = (req, res) => {
    const { id } = req.params;
    let data = readData(FILE_NAME);
    data = data.filter(x => x.id !== id);
    writeData(FILE_NAME, data);
    res.json({ success: true });
};