
const db = require('../models/adminmodel');


const findUser = async (req, res) => {
    const userId = req.params.id; // Update this line to use 'id' instead of 'userId'
  
    try {
      const user = await db.findUserById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while finding the user.' });
    }
  };

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userid;
        const deletedUser = await db.deleteUserByUserId(userId);

        if (deletedUser === null) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.json({ message: 'User not found ', deletedUser });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserByName = (req, res)=>{
    //console.log('get emp by id');
    db.getUserByName(req.params.fullname, (err, user)=>{
        if(err)
        res.send(err);
        console.log('single user data',user);
        res.send(user);
    })
}

const updateUser = async (req, res) => {
    const userId = req.params.userid;
    const updatedUserData = req.body; // Assuming the updated user data is sent in the request body

    try {
        const existingUser = await db.findUserById(userId);
        if (existingUser) {
            // Update user data
            const updatedUser = { ...existingUser, ...updatedUserData };
            await db.updateUserById(userId, updatedUser);
            return res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    findUser,
    deleteUser,
    updateUser,
    getUserByName
};