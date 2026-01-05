const express = require("express");
const router = express.Router();
const categoryCtrl = require("../controller/categoryctrl");
const { auth, role } = require("../middleware/auth");

/* ทุกคนดูได้ */
router.get("/", categoryCtrl.getAll);

/* admin เท่านั้น */
router.post("/", auth, role("admin"), categoryCtrl.create);
router.put("/:id", auth, role("admin"), categoryCtrl.update);
router.delete("/:id", auth, role("admin"), categoryCtrl.remove);

module.exports = router;
