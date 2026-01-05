const express = require("express");
const router = express.Router();

const cartCtrl = require("../controller/cartctrl");
const { auth, role } = require("../middleware/auth");

router.post("/add", auth, cartCtrl.addCart);
router.delete("/:id", auth, cartCtrl.removeCart)


router.get("/", auth, cartCtrl.getCart);
router.post("/add", auth, cartCtrl.addCart);
router.put("/update/:id", auth, cartCtrl.updateCart);
router.delete("/remove/:id", auth, cartCtrl.removeCart);

module.exports = router;
