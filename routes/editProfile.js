const express = require("express");
const router = express.Router();
const upload = require('./../middleware/multer');
const auth = require('./../middleware/auth');
const editController = require("./../controllers/editProfile");

router.post('/:editId', auth, upload.single('photo'), editController.editUser)

module.exports = router;