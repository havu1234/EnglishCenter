const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./student");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Kết nối MongoDB
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/EnglishCenter";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("--- Đã kết nối MongoDB thành công ---"))
  .catch((err) => console.error("Lỗi kết nối DB:", err));

// API 1: Lấy danh sách học viên
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API 2: Thêm học viên mới (ĐÃ CẬP NHẬT SỐ ĐIỆN THOẠI)
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student({
      hoTen: req.body.hoTen,
      lopHoc: req.body.lopHoc,
      ngayNhapHoc: req.body.ngayNhapHoc,
      soDienThoai: req.body.soDienThoai, // THÊM DÒNG NÀY ĐỂ NHẬN SỐ ĐIỆN THOẠI
      trangThai: "Đang học",
    });

    await student.save();
    res.status(201).json({ message: "Thêm thành công!", data: student });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API 3: Sửa học viên (ĐÃ CẬP NHẬT SỐ ĐIỆN THOẠI)
app.put("/api/students/:id", async (req, res) => {
  try {
    // THÊM soDienThoai VÀO ĐOẠN BÓC TÁCH DỮ LIỆU (DESTRUCTURING)
    const { hoTen, lopHoc, ngayNhapHoc, trangThai, soDienThoai } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { hoTen, lopHoc, ngayNhapHoc, trangThai, soDienThoai }, // 🛠️ THÊM VÀO ĐÂY ĐỂ CHO PHÉP CẬP NHẬT
      { new: true, runValidators: true },
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API 4: Xóa học viên
app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng: ${PORT}`);
});
