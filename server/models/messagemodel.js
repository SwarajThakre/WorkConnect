// models/messagemodel.js
const db = require("../db");

const createMessage = async (chatId, senderId, text) => {
  try {
    const query =
      "INSERT INTO message (chatid, senderid, text) VALUES ($1, $2, $3) RETURNING *";
    const response = await db.one(query, [chatId, senderId, text]);
    return response;
  } catch (error) {
    throw error;
  }
};

// const getMessages = async (chatId) => {
//     try {
//         const query = 'SELECT * FROM message WHERE chatid = $1';
//         console.log('chatId', chatId);
//         const messages = await db.any(query, [chatId]);
//         return messages;
//     } catch (error) {
//         console.error('Error executing query:', error);
//         throw error;
//     }
// };

const getMessages = async (chatId) => {
  try {
    // Validate chatId - check if it's defined and is a valid integer
    if (!chatId || isNaN(chatId)) {
      throw new Error("Invalid chatId");
    }

    const query = "SELECT * FROM message WHERE chatid = $1";
    console.log("chatId", chatId); // Debugging: Check chatId

    // Run the query with the chatId as a parameter
    const messages = await db.any(query, [chatId]);
    return messages;
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
};

module.exports = {
  createMessage,
  getMessages,
};
