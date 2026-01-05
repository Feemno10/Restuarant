const express = require("express");
const router = express.Router();
const foodCtrl = require("../controller/foodctrl");
const upload = require("../middleware/upload");
const { auth, role } = require("../middleware/auth"); // 👈 เพิ่มตรงนี้

router.get("/", foodCtrl.getAllfood);

router.get("/:id", foodCtrl.getfoodById);

router.post(
  "/",auth, role("admin"), upload.single("image"),foodCtrl.createfood);

// แก้ไขอาหาร - admin เท่านั้น
router.put(
  "/:id",auth,role("admin"),upload.single("image"),foodCtrl.updatefood);

// ลบอาหาร - admin เท่านั้น
router.delete("/:id", auth, role("admin"), foodCtrl.deletefood);

module.exports = router;
