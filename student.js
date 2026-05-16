const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  hoTen: { type: String, required: true },
  lopHoc: { type: String, required: true },
  ngayNhapHoc: { type: String, required: true },
  trangThai: {
    type: String,
    default: "Đang học",
    enum: ["Đang học", "Bảo lưu", "Đã nghỉ", "Hoàn thành"], // Chỉ cho phép 4 giá trị này
  },
});

module.exports = mongoose.model("Student", studentSchema);
