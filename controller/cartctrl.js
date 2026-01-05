const Cart = require('../model/cart_model');

exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const cart = await Cart.getCartByUser(user_id);
    res.json({ success: true, data: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "โหลดตะกร้าไม่สำเร็จ" });
  }
};

exports.addCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { food_id, quantity } = req.body;

    if (!food_id || !quantity) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    await Cart.addToCart(user_id, food_id, quantity);

    res.json({ success: true, message: "เพิ่มลงตะกร้าแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "เพิ่มลงตะกร้าไม่สำเร็จ" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    await Cart.updateCart(id, quantity);

    res.json({ success: true, message: "อัปเดตจำนวนสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "อัปเดตจำนวนไม่สำเร็จ" });
  }
};

exports.removeCart = async (req, res) => {
  try {
    const { id } = req.params;

    await Cart.removeCart(id);

    res.json({ success: true, message: "ลบรายการสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ลบรายการไม่สำเร็จ" });
  }
};
