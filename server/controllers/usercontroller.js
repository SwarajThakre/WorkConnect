const bcrypt = require("bcryptjs"); // Library for password hashing,importing bcrypt
const jwt = require("jsonwebtoken");
const db = require("../models/usermodel"); // User model
const validator = require("validator");

const createToken = (id) => {
  const SecretKey = "c6480460a2aa42ec51250b087614b3c8";
  return jwt.sign({ id }, SecretKey, { expiresIn: "3d" });
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { fullname, company, logintype, email, password, phonenumber } =
      req.body;

    // Validate input data
    if (!fullname || !company || !logintype || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email must be a valid email." });
    }

    // Check if user with the same email already exists
    const foundUser = await db.findUserByEmail(email);
    if (foundUser) {
      return res.status(409).json({ error: "Email already registered." });
    }

    // Generate salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = {
      fullname,
      company,
      logintype,
      email,
      password: hashedPassword,
      phonenumber,
    };

    // Insert the new user into the database
    const insertedUser = await db.createUser(newUser);
    // Get the newly created user (with _id) from the database
    const userWithId = await db.findUserByEmail(email);

    // Generate a token using the _id of the newly created user
    const token = createToken(userWithId.userid);
    return res.status(200).json({
      message: "User registered successfully.",
      id: userWithId.userid,
      token,
    });
  } catch (error) {
    // Log the error using a proper logging mechanism (e.g., Winston)
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ error: "An error occurred during registration." });
  }
};

// // Add this line to verify the secret key value
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await db.findUserByEmail(email);
    console.log("userLogin:", user);

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = createToken(user.userid);

    // Update the user's token in the database (optional step)
    await db.updateUserByEmail(email, token);

    res.status(200).json({
      id: user.userid,
      name: user.fullname,
      email: user.email,
      logintype: user.logintype,
      accountstatus: user.accountstatus,
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An error occurred during login." });
  }
};

const findUser = async (req, res) => {
  const userId = req.params.id; // Update this line to use 'id' instead of 'userId'

  try {
    const user = await db.findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while finding the user." });
  }
};

const getUser = async (req, res) => {
  try {
    const { filter, sort } = req.query;
    const users = await db.getAllUsers({ filter, sort });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, findUser, getUser };
