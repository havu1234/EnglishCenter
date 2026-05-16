const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./student");

const app = express();
const PORT = 3000; // <--- ĐƯA DÒNG NÀY LÊN ĐÂY

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Để truy cập được HTML/CSS/JS trong folder public

// Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/EnglishCenter")
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

// API 2: Thêm học viên mới (ĐÃ SỬA)
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student({
      hoTen: req.body.hoTen,
      lopHoc: req.body.lopHoc,
      ngayNhapHoc: req.body.ngayNhapHoc,
      trangThai: "Đang học",
    });

    await student.save();
    res.status(201).json({ message: "Thêm thành công!", data: student });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API 3: Sửa học viên
app.put("/api/students/:id", async (req, res) => {
  try {
    const { hoTen, lopHoc, ngayNhapHoc, trangThai } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { hoTen, lopHoc, ngayNhapHoc, trangThai },
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
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
