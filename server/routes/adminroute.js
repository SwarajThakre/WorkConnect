const express = require("express");

const {
  findUser,
  updateUser,
  deleteUser,
  getUserByName,
} = require("../controllers/admincontroller");

const router = express.Router();

router.get("/:id", findUser);
router.put("/:userid", updateUser);
router.get("/search/:fullname", getUserByName);
router.delete("/:userid", deleteUser);

module.exports = router;
