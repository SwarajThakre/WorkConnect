const express = require("express");
const router = express.Router();
const { updateAccountStatus } = require("../controllers/accountcontroller");

// Update account status for a user
router.patch("/:id", updateAccountStatus);

module.exports = router;
