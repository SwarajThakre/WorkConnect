const express = require("express");
const {
  createChat,
  userChat,
  findChat,
} = require("../controllers/chatcontroller");
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChat);
router.get("/find/:firstId(\\d+)/:secondId(\\d+)", findChat);

module.exports = router;
