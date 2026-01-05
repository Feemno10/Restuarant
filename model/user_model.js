const { pool } = require('./conn');

async function checkemail(email) {
    const conn = await pool.getConnection();
    try{
        const rows = await conn.query(
            "SELECT * FROM users WHERE email=?", [email]
        )
        return rows[0] || null
    }finally{
        conn.release();
    }
};

async function checkid(id) {
    const conn = await pool.getConnection();
    try{
        const rows = await conn.query(
            "SELECT * FROM users WHERE id=?" , [id]
        )
        return rows[0] || null
    }finally{
        conn.release();
    }
};

async function createuser(email , password , first_name , last_name , address) {
    const conn = await pool.getConnection();
    try{
        const result = await conn.query(
            "INSERT INTO users (email , password , first_name , last_name , address , role) VALUES (?,?,?,?,?,?)",
            [email , password  , first_name , last_name , address , 'user']
        )
        return result.insertId
    }finally{
        conn.release();
    }    
};

async function updateuser(id , email , password , first_name , last_name , address) {
    const conn = await pool.getConnection();
    try{
        await conn.query(
            "UPDATE users SET email=? , password=? , first_name=? , last_name=? , address=? WHERE id=?",
            [email , password , first_name  , last_name , address , id]
        )
    }finally{
        conn.release();
    }
};

async function upload(avatar, id) {
    const conn = await pool.getConnection();
    try {
        await conn.query(
            "UPDATE users SET avatar=? WHERE id=?",
            [avatar, id]
        );
    } finally {
        conn.release();
    }
}

async function updateuserNopassword(id, email, first_name, last_name, address) {
    const conn = await pool.getConnection();
    try {
        await conn.query(
            "UPDATE users SET email=?, first_name=?, last_name=?, address=? WHERE id=?",
            [email, first_name, last_name, address, id]
        );
    } finally {
        conn.release();
    }
}

async function list() {
    const conn = await pool.getConnection();
    try {
        const rows = await conn.query(
            "SELECT id, email, first_name, last_name, role, avatar, address FROM users ORDER BY id ASC"
        );
        return rows;
    } finally {
        conn.release();
    }
}


async function updaterole(role , id) {
    const conn = await pool.getConnection();
    try{
        await conn.query(
            "UPDATE users SET role=? WHERE id=?" ,[role , id]
        );
    }finally{
        conn.release();
    }
};

async function deleteuser(id) {
    const conn = await pool.getConnection();
    try{
        await conn.query(
            "DELETE FROM users WHERE id=?" , [id]
        );
    }finally{
        conn.release();
    }
};

module.exports = { checkemail , checkid , createuser , updateuser , updateuserNopassword , updaterole , list , deleteuser , upload}