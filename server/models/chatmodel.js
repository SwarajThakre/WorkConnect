const db = require('../db');

// const createChat = async (members) => {
//     try {
//         // Filter out invalid values and convert the remaining members to an array of integers
//         const membersArray = members.filter((value) => !isNaN(Number(value))).map(Number);

//         const query = 'INSERT INTO chat (members) VALUES ($1) RETURNING *';
//         const response = await db.one(query, [membersArray]);
//         response.members = membersArray; // Set the members field as an array
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };

const createChat = async (members) => {
    try {
        // Convert the members array to an array of integers
        const membersArray = members.map(Number);

        const query = 'SELECT * FROM chat WHERE $1 = ANY(members) AND $2 = ANY(members)';
        const existingChats = await db.any(query, [membersArray[0], membersArray[1]]);

        if (existingChats.length > 0) {
            // If existing chats are found, return the first existing chat
            return existingChats[0];
        }

        const insertQuery = 'INSERT INTO chat (members) VALUES ($1) RETURNING *';
        const response = await db.one(insertQuery, [membersArray]);
        response.members = membersArray; // Set the members field as an array
        return response;
    } catch (error) {
        throw error;
    }
};


const parseMembersArray = (chats) => {
    // Convert the members field from an array of text values to an array of integers for each chat
    return chats.map(chat => {
        chat.members = chat.members.map(Number);
        return chat;
    });
};

const findUserChats = async (userId) => {
    try {
        // Convert the userId to an integer
        const userIdInt = Number(userId);

        const query = 'SELECT * FROM chat WHERE $1 = ANY(members)';
        const chats = await db.any(query, [userIdInt]);
        return parseMembersArray(chats);
    } catch (error) {
        throw error;
    }
};

const findChats = async (firstId, secondId) => {
    try {
      const query = 'SELECT * FROM chat WHERE $1 = ANY(members) AND $2 = ANY(members)';
      const chats = await db.any(query, [firstId, secondId]);
      return chats;
    } catch (error) {
      throw error;
    }
  };
module.exports = {
    createChat,
    findUserChats,
    findChats,
};