const Category = require("../model/category_model");

/* ดึงหมวดหมู่ทั้งหมด */
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ message: "โหลดหมวดหมู่ไม่สำเร็จ" });
  }
};

/* สร้างหมวดหมู่ (admin) */
exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "กรุณากรอกชื่อหมวดหมู่" });

    const id = await Category.create(name);
    res.status(201).json({
      message: "สร้างหมวดหมู่สำเร็จ",
      id
    });
  } catch (err) {
    res.status(500).json({ message: "สร้างหมวดหมู่ไม่สำเร็จ" });
  }
};

/* แก้ไขหมวดหมู่ (admin) */
exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;

    await Category.update(id, name);
    res.json({ message: "แก้ไขหมวดหมู่สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "แก้ไขหมวดหมู่ไม่สำเร็จ" });
  }
};

/* ลบหมวดหมู่ (admin) */
exports.remove = async (req, res) => {
  try {
    await Category.remove(req.params.id);
    res.json({ message: "ลบหมวดหมู่สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "ลบหมวดหมู่ไม่สำเร็จ" });
  }
};
