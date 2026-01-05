const { pool } = require("./conn");

/* ดึงหมวดหมู่ทั้งหมด */
async function getAll() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT * FROM categories ORDER BY id ASC"
    );
    return rows;
  } finally {
    conn.release();
  }
}

/* ดึงหมวดหมู่ตาม id */
async function getById(id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT * FROM categories WHERE id=?",
      [id]
    );
    return rows[0] || null;
  } finally {
    conn.release();
  }
}

/* สร้างหมวดหมู่ */
async function create(name) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

/* แก้ไขหมวดหมู่ */
async function update(id, name) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "UPDATE categories SET name=? WHERE id=?",
      [name, id]
    );
  } finally {
    conn.release();
  }
}

/* ลบหมวดหมู่ */
async function remove(id) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "DELETE FROM categories WHERE id=?",
      [id]
    );
  } finally {
    conn.release();
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
