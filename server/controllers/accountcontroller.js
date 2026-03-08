const db = require('../db'); // Assuming you have a database connection

// Update account status for a user
const updateAccountStatus = async (req, res) => {
  const { id } = req.params;
  const { accountstatus } = req.body;

  try {
    const result = await db.none('UPDATE users SET accountstatus = $1 WHERE userid = $2', [accountstatus, id]);
    res.json({ message: 'Account status updated successfully' });
  } catch (error) {
    console.error('Error updating account status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  updateAccountStatus,
};
