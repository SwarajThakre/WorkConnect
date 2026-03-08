const chatModel = require('../models/chatmodel');

// Route to create a new chat
const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Create the chat if it doesn't exist
    const chat = await chatModel.createChat([senderId, receiverId]);

    if (chat) {
      return res.status(200).json(chat);
    } else {
      res.status(500).json({ error: 'Chat creation failed.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};




// Route to get all chats for a user based on email
const userChat = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.findUserChats(userId);

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.findChats([firstId, secondId]);

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createChat, userChat, findChat };