const messageModel = require('../models/messagemodel');

// Create Message
const createMessage = async (req, res) => {
    const { chatId, senderId , text } = req.body;
    try {
        const response = await messageModel.createMessage(chatId, senderId , text);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get Messages
const getMessages = async (req, res) => {
    const { chatId} = req.params; // Use req.params instead of req.query
    try {
        const messages = await messageModel.getMessages(chatId);
        return res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    createMessage,
    getMessages,
};