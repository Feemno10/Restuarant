const pool = require('../config/db');

async function withTx(callback) {
    let conn 
    try{
        conn = await pool.getConnection();
        await conn.beginTransection();

        const result = await callback(conn)

        await conn.commit();
        return result
    }catch(err){
        if(conn) await conn.callback();
        throw e;
    }finally{
        conn.release();
    }
};

module.exports = { withTx , pool };