const { pool } = require('./conn');

async function getAllfood() {
    const conn = await pool.getConnection();
    try{
        const rows = await conn.query(
            `SELECT f.id , f.name , f.price , f.image , f.created_at, c.id AS categort_id ,
             c.name AS category_name FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            ORDER BY f.id DESC `
        );
        return rows[0] || null
    }finally{
        conn.release();
    }    
};

async function getfoodById(id) {
    const conn = await pool.getConnection();
    try{
        const rows = await conn.query(
           `
            SELECT 
                f.id,
                f.name,
                f.price,
                f.image,
                f.created_at,
                c.id AS category_id,
                c.name AS category_name
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            WHERE f.id = ?
        `, [id]);
        return rows[0] || null 
    }finally{
        conn.release();
    }
};

async function createfood(name , price , category_id , image) {
    const conn = await pool.getConnection();
    try{
        const result = await conn.query(
            "INSERT INTO foods (name , price , category_id , image)VALUES (?,?,?,?)",
            [name , price , category_id , image]
        );
        return result.insertId
    }finally{
        conn.release();
    }
};

async function updatefood(id , name ,price , category_id , image) {
    const conn = await pool.getConnection();
    try{
        await conn.query(
            `UPDATE foods SET name=? , price=? , category_id=? , image=? WHERE id=?` ,
            [id , name , price , category_id , image]
        );
    }finally{
        conn.release();
    }
};

async function deletefood(id) {
    const conn = await pool.getConnection();
    try{
        await conn.query(
            "DELETE FROM foods WHERE id=?",[id]
        )
    }finally{
        conn.release();
    }
};

module.exports = {getAllfood , getfoodById , createfood , updatefood , deletefood}

