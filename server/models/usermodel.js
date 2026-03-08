const db = require("../db");

const findUserByEmail = (email) => {
  return db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
};

const findUserById = async (userId) => {
  try {
    return db.oneOrNone("SELECT * FROM users WHERE userid = $1", [userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createUser = (user) => {
  return db.one(
    "INSERT INTO users (fullname, company, logintype, email, password, phonenumber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING userid",
    [
      user.fullname,
      user.company,
      user.logintype,
      user.email,
      user.password,
      user.phonenumber,
    ]
  );
};

const deleteUserByEmail = (email) => {
  return db.oneOrNone("DELETE FROM users WHERE email = $1", [email]);
};

const updateUserByEmail = (email, token) => {
  return db.none("UPDATE users SET token = $1 WHERE email = $2", [
    token,
    email,
  ]);
};

const getAllUsers = ({ filter = "", sort = "" } = {}) => {
  let query = "SELECT * FROM users";

  if (filter) {
    query += ` WHERE ${filter}`;
  }

  if (sort) {
    query += ` ORDER BY ${sort}`;
  }

  return db.any(query);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  deleteUserByEmail,
  updateUserByEmail,
  getAllUsers,
};
