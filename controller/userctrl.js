const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const JWT_SECRET = process.env.JWT_SECRET;
const User  = require('../model/user_model');

exports.updateuser = async (req,res)=>{
    const userId = Number (req.params.id);
    const { email , password , first_name , last_name , address} = req.body

    if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ message: "ไม่มีสิทธิแก้ไขข้อมูลผู้อื่น" });
}
    try{
        const existing = await User.checkemail(email);
        if(existing && existing.id !== userId){
            return res.status(403).json ({ message : "Email นี้ถูกใช้ไปแล้ว"})
        }
        if(password && password.trim()!==""){
            const hashed = await bcrypt.hash(password , 10)
            await User.updateuser(userId , email , hashed , first_name , last_name  , address);
        }else{
            await User.updateuserNopassword (userId , email , first_name , last_name ,address);
        }
        res.json ({ message : "แก้ไขสำเร็จแล้วจ้าาา"});
    }catch(e){
        res.status(500).json ({ message : "แก้ไขไม่สำเร็จ" , err : e.message})
    }
};

exports.upload = async (req,res) =>{
    const jwt = req.headers.jwt
    if(!jwt) return res.status(401).json ({message : "การเข้าถึงถูกปฏิเสธ"})

        try{
            const id = req.params.id
           if(!req.file) return res.status(400).json({message : "ไม่มีการอัพโหลดไฟล์"})

            const filename = req.file.filename
            const basePath = `${req.protocol}://${req.get("host")}/public/image/`
            const newImageUrl = `${basePath}${filename}`

              const existing = await User.checkid(id)

        if (existing && existing.img_user) {
            const oldFile = existing.img_user.replace(basePath, "")
            const oldPath = path.join(__dirname, "../public/image/", oldFile)

            fs.unlink(oldPath, err => {
                if (err) console.log("Failed to delete old image:", err.message)
            })
        }

        await User.upload(newImageUrl, id)

        res.status(200).json({
            message: "upload success",
            image: newImageUrl
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "update failed", error: e.message })
    }
};

exports.list = async (req, res) => {
    try {
        const users = await User.list();
        res.json(users);   
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ' });
    }
};

exports.setrole = async (req,res)=>{
    try{
        const { id } = req.params;
        if(Number(id) === Number(req.user.role)){
            return res.status(403).json ({ message : "ไม่สามารถแก้ไขบทบาทตนเองได้"});
        }
        await User.updaterole(req.params.id , req.user.role);
        res.json ({ message : "แก้ไขบทบาท สำเร็จ"})
    }catch(e){
        return res.status(500).json ({ message : "แก้ไขบทบาทไม่สำเร็จ" , err : e.message})
    }
};

exports.remove = async (req,res)=>{
    try{
        const { id } = req.params;
        if(Number(id) === Number(req.user.id)){
            return res.status(403).json ({ message : "ไม่สามารถลบบัญชีตัวเองได้นะจ๊ะ อย่าหวังเลย"})
        }
        await User.deleteuser(req.params.id)
        res.json ({ message : "ลบบัญชีสำเร็จ"})
    }catch(e){
        return res.status (500).json ({ message : "ลบบัญชีไม่สำเร็จ"})
    }
}
