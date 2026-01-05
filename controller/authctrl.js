const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../model/user_model');

exports.register = async (req, res) => {   
    try {
        const { email, password, first_name, last_name, address } = req.body;
        console.log("REGISTER:", req.body);

        if (!email || !password || !first_name || !last_name || !address) {
            return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
        }

        // ✅ แก้ตรงนี้
        const exist = await User.checkemail(email);
        if (exist) {
            return res.status(400).json({ message: "Email นี้ถูกใช้แล้ว" });
        }

        const hash = await bcrypt.hash(password, 10);

        const userId = await User.createuser(
            email,
            hash,
            first_name,
            last_name,
            address
        );

        return res.status(201).json({
            message: "สมัครสมาชิกสำเร็จ",
            data: {
                id: userId,
                email,
                first_name,
                last_name,
                address,
                role: 'user'
            }
        });
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "สมัครสมาชิกไม่สำเร็จ" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "กรอก email และ password" });
    }

    try {
        const user = await User.checkemail(email);
        if (!user) {
            return res.status(401).json({ message: "Email ไม่ถูกต้อง" });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            },
            JWT_SECRET,
            { expiresIn: "12h" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                avatar: user.avatar,
                address: user.address
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "เข้าสู่ระบบไม่สำเร็จ",
            error: err.message
        });
    }
};
