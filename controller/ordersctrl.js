const Cart = require("../model/cart_model");
const Order = require("../model/orders_model");

exports.checkout = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { address } = req.body;

    const cartItems = await Cart.getCartByUser(user_id);
    if (!cartItems.length) {
      return res.status(400).json({ message: "ตะกร้าว่าง" });
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderId = await Order.createOrder(user_id, address, total);

    for (const item of cartItems) {
      await Order.addOrderItems(orderId, item.food_id, item.quantity, item.price);
    }

    // ล้าง cart หลัง checkout
    await Cart.clearCart(user_id);

    res.json({ success: true, message: "สั่งอาหารเรียบร้อย", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "สั่งอาหารไม่สำเร็จ" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await Order.getOrdersByUser(user_id);
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "โหลด order ไม่สำเร็จ" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "ไม่พบ order" });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "โหลด order ไม่สำเร็จ" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Order.updateOrderStatus(id, status);
    res.json({ success: true, message: "อัปเดตสถานะเรียบร้อย" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "อัปเดตสถานะไม่สำเร็จ" });
  }
};
