const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userCtrl = require("../controller/userctrl");
const { auth, role } = require("../middleware/auth");
const upload = require('../middleware/upload'); 

router.get("/list", auth, role("admin"), userCtrl.list);


router.put("/:id", auth, userCtrl.updateuser);


router.post("/upload/:id", auth, upload.single("avatar"), userCtrl.upload);


router.put("/role/:id", auth, role("admin"), userCtrl.setrole);


router.delete("/:id", auth, role("admin"), userCtrl.remove);

module.exports = router;
