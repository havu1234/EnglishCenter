let currentEditId = null;

// 1. Hàm hiển thị danh sách (Sửa lỗi tàng hình)
async function loadStudents() {
  try {
    const response = await fetch("/api/students");
    const data = await response.json();
    const tbody = document.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach((s, index) => {
      const tr = document.createElement("tr");

      // Xử lý Class màu sắc dựa trên CSS của bạn
      let colorClass = "";
      if (s.trangThai === "Đang học") colorClass = "status-active";
      else if (s.trangThai === "Bảo lưu") colorClass = "status-pending";
      else if (s.trangThai === "Đã nghỉ") colorClass = "status-dropped";
      else if (s.trangThai === "Hoàn thành") colorClass = "status-done";

      tr.innerHTML = `
                <td>#${index + 1}</td>
                <td>${s.hoTen}</td>
                <td>${s.lopHoc}</td>
                <td>${s.ngayNhapHoc}</td>
                <td><span class="status ${colorClass}">${s.trangThai || "Đang học"}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="prepareEdit('${s._id}')">Sửa</button>
                    <button class="btn btn-delete" onclick="deleteStudent('${s._id}')">Xóa</button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Lỗi khi load danh sách:", error);
  }
}

// 2. Hàm lưu dữ liệu (Dùng chung cho cả Thêm và Sửa)
async function handleSave(event) {
  event.preventDefault();

  const hoTen = document.getElementById("input-hoTen").value;
  const lopHoc = document.getElementById("select-lopHoc").value;
  const ngayNhapHoc = document.getElementById("input-ngayNhapHoc").value;

  const data = { hoTen, lopHoc, ngayNhapHoc };

  if (currentEditId) {
    // Khi ĐANG SỬA: Lấy thêm giá trị trạng thái từ ô chọn
    data.trangThai = document.getElementById("select-trangThai").value;

    await fetch(`/api/students/${currentEditId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } else {
    // Khi THÊM MỚI: Không gửi trangThai (Server sẽ tự hiểu là "Đang học")
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }
  resetForm();
  loadStudents();
}
// 3. Hàm chuẩn bị sửa (Đổ dữ liệu lên Form)
async function prepareEdit(id) {
  const response = await fetch("/api/students");
  const students = await response.json();
  const s = students.find((item) => item._id === id);

  if (s) {
    currentEditId = id;
    document.getElementById("input-hoTen").value = s.hoTen;
    document.getElementById("select-lopHoc").value = s.lopHoc;
    document.getElementById("input-ngayNhapHoc").value = s.ngayNhapHoc;

    // Hiển thị trạng thái hiện tại lên Form để người dùng chọn lại
    document.getElementById("select-trangThai").value =
      s.trangThai || "Đang học";

    document.getElementById("btn-main").innerText = "Xác nhận cập nhật";
    // ... hiện nút hủy
  }
}
// 4. Các hàm hỗ trợ khác
function resetForm() {
  currentEditId = null;
  document.getElementById("student-form").reset();
  document.getElementById("form-title").innerText = "Thêm học viên mới";
  document.getElementById("btn-main").innerText = "Lưu thông tin";
  document.getElementById("btn-cancel").style.display = "none";
}

async function deleteStudent(id) {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    loadStudents();
  }
}

window.onload = () => {
  loadStudents();
  // Gán sự kiện cho nút Lưu duy nhất
  const mainForm = document.getElementById("student-form");
  if (mainForm) mainForm.onsubmit = handleSave;

  const cancelBtn = document.getElementById("btn-cancel");
  if (cancelBtn) cancelBtn.onclick = resetForm;
};
