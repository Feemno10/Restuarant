const { pool } = require("./conn");

/* =========================
   CREATE ORDER
========================= */
async function createOrder(user_id, total, address) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `INSERT INTO orders (user_id, status, total, address)
       VALUES (?, 'pending', ?, ?)`,
      [user_id, total, address]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

/* =========================
   ADD ORDER ITEMS
========================= */
async function addOrderItem(order_id, food_id, quantity, price) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `INSERT INTO orders_items (order_id, food_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [order_id, food_id, quantity, price]
    );
  } finally {
    conn.release();
  }
}

/* =========================
   GET USER ORDERS
========================= */
async function getOrdersByUser(user_id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC`,
      [user_id]
    );
    return rows;
  } finally {
    conn.release();
  }
}

/* =========================
   GET ORDER DETAIL
========================= */
async function getOrderDetail(order_id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT 
        oi.id,
        f.name,
        oi.quantity,
        oi.price
       FROM orders_items oi
       JOIN foods f ON oi.food_id = f.id
       WHERE oi.order_id = ?`,
      [order_id]
    );
    return rows;
  } finally {
    conn.release();
  }
}

module.exports = {
  createOrder,
  addOrderItem,
  getOrdersByUser,
  getOrderDetail
};
