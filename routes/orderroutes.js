const express = require("express");
const router = express.Router();
const orderCtrl = require("../controller/ordersctrl");
const { auth, role } = require("../middleware/auth");

router.post("/checkout", auth, orderCtrl.checkout);
router.get("/", auth, orderCtrl.getOrders);
router.get("/:id", auth, orderCtrl.getOrderById);
router.put("/status/:id", auth, orderCtrl.updateStatus);

module.exports = router;
