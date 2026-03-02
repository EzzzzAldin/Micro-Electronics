const user = require('../models/User');
const createUser = async (req, res) => {
    try {
        const { userName,email } = req.body;
        if(!userName || !email) {
            return res.status(400).json({ message: "userName and email are required" });
        }
        const newUser = await user.create({ });   
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



const getUsers = async (req, res) => {
    try {