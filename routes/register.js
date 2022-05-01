const express = require("express");
const router = express.Router();
const auth = require('./../middleware/auth');
const userController = require("./../controllers/register");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/change-password", auth, userController.changepassword);

module.exports = router;
