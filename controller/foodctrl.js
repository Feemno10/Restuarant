const Food = require("../model/food_model");
const path = require("path");
const fs = require("fs");

exports.getAllfood = async (req, res) => {
  try {
    const foods = await Food.getAllfood();
    res.json({
      success: true,
      data: foods,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "โหลดรายการอาหารไม่สำเร็จ",
    });
  }
};

exports.getfoodById = async (req, res) => {
  try {
    const food = await Food.getfoodById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "ไม่พบรายการอาหาร",
      });
    }

    res.json({
      success: true,
      data: food,
    });
  } catch (err) {
    res.status(500).json({
      message: "โหลดข้อมูลอาหารไม่สำเร็จ",
    });
  }
};

exports.createfood = async (req, res) => {
  try {
    const { name, price, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        message: "กรอกข้อมูลไม่ครบ",
      });
    }

    let image = null;
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/public/image/${
        req.file.filename
      }`;
    }

    const foodId = await Food.createfood(name, price, category_id, image);

    res.status(201).json({
      message: "เพิ่มอาหารสำเร็จ",
      id: foodId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "เพิ่มอาหารไม่สำเร็จ",
    });
  }
};

exports.updatefood = async (req, res) => {
  try {
    const { name, price, category_id } = req.body;
    const id = req.params.id;

    const food = await Food.getfoodById(id);
    if (!food) {
      return res.status(404).json({ message: "ไม่พบอาหาร" });
    }

    let image = food.image;

    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/public/image/${
        req.file.filename
      }`;

      if (food.image) {
        const oldFile = food.image.split("/public/image/")[1];
        const oldPath = path.join(__dirname, "../public/image/", oldFile);
        fs.unlink(oldPath, () => {});
      }
    }

    await Food.updatefood(id, name, price, category_id, image);

    res.json({
      message: "แก้ไขอาหารสำเร็จ",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "แก้ไขอาหารไม่สำเร็จ",
    });
  }
};

exports.deletefood = async (req, res) => {
  try {
    const food = await Food.getfoodById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "ไม่พบอาหาร" });
    }

    if (food.image) {
      const fileName = food.image.split("/public/image/")[1];
      const filePath = path.join(__dirname, "../public/image/", fileName);
      fs.unlink(filePath, () => {});
    }

    await Food.deletefood(req.params.id);

    res.json({
      message: "ลบอาหารสำเร็จ",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "ลบอาหารไม่สำเร็จ",
    });
  }
};
