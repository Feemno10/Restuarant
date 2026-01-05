const { pool } = require("./conn");

async function addToCart(user_id, food_id, quantity) {
  const conn = await pool.getConnection();
  try {
    const existing = await conn.query(
      "SELECT * FROM cart WHERE user_id=? AND food_id=?",
      [user_id, food_id]
    );
    if (existing.length > 0) {
      const newQty = existing[0].quantity + quantity;
      await conn.query("UPDATE cart SET quantity=? WHERE id=?", [
        newQty,
        existing[0].id,
      ]);
      return existing[0].id;
    }
    const result = await conn.query(
      "INSERT INTO cart (user_id, food_id, quantity) VALUES (?,?,?)",
      [user_id, food_id, quantity]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};

async function removeFromCart(id) {
    const conn = await pool.getConnection();
    try{
        await conn.query (
            "DELETE FROM cart WHERE id=?", [id]
        );
    }finally{
        conn.release();
    }
};

async function updateCart(id , quantity) {
    const conn = await pool.getConnection();
    try{
        await conn.query(
            "UPDATE cart SET quantity WHERE id=?",[quantity , id]
        );
    }finally{
        conn.release();
    }
};

async function getCartByUser(user_id) {
    const conn = await pool.getConnection();
    try{
        const rows = await conn.query(
            `SELECT c.id , c.quantity , f.id AS food_id , f.name , f.price , f.image 
                FROM cart c
                JOIN foods f ON c.food_id = f.id
                WHERE c.user_id =? `,[user_id]
        );
        return rows[0] || null
    }finally{
        conn.release();
    }
};

async function clearCart(user_id) {
    const conn  = await pool.getConnection();
    try{
        await conn.query(
            "DELETE FROM cart WHERE user_id=?" , [user_id]
        );
    }finally{
        conn.release();
    }
}

module.exports = {addToCart , removeFromCart , updateCart , getCartByUser , clearCart}

