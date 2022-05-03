const express = require("express");
const router = express.Router();
const auth = require('./../middleware/auth');
const userController = require("./../controllers/register");
const upload = require("./../middleware/multer");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/change-password", auth, userController.changepassword);
router.post("/edit/:editId", auth, upload.single("photo"), userController.editUser);
router.get("/user-profile", auth, userController.profile);
// router.get("/logout", userController.logout);

module.exports = router;
