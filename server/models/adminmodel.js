const db = require('../db');

  const findUserById = async (userId) => {
    try {
      return db.oneOrNone('SELECT * FROM users WHERE userid = $1', [userId]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const updateUserById = async (userId, updatedUserData) => {
    const { fullname, company, logintype, email, phonenumber } = updatedUserData;
    const query =
      'UPDATE users SET fullname = $1, company = $2, logintype = $3, email = $4, phonenumber = $5 WHERE userid = $6';
    const values = [fullname, company, logintype, email, phonenumber, userId];
    try {
      await db.query(query, values);
    } catch (error) {
      console.error('Error updating user by ID:', error);
      throw error;
    }
  }

  const getUserByName = (fullname, result) => {
    db.query('SELECT * FROM users WHERE fullname = $1', [fullname])
        .then((res) => {
            result(null, res);
        })
        .catch((err) => {
            console.log('Error while fetching user by name', err);
            result(err, null);
        });
};

  const deleteUserByUserId = (userid) => {
    console.log('Deleting user with userid:', userid); // Add this line for debugging
    return db.none('DELETE FROM users WHERE userid = $1', [userid]);

  };



module.exports ={
    findUserById,
    updateUserById,
    deleteUserByUserId,
    getUserByName
}