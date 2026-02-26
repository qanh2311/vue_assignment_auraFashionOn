<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  employees: Array,
  openEmployeeModal: Function,
  deleteEmployee: Function,
})

const selectedEmployee = ref(null)
</script>

<template>
  <div class="employees-view-container">
    <div class="employees-header mb-4">
      <h3 class="fw-bold m-0">Quản lý Nhân viên</h3>
      <button class="btn btn-pink shadow-lg" @click="props.openEmployeeModal()">
        <span class="me-2">+</span>Thêm Nhân viên Mới
      </button>
    </div>

    <div class="card border-0 shadow-sm table-responsive rounded-4 overflow-hidden">
      <table class="table align-middle mb-0">
        <thead class="table-dark-pink text-nowrap">
          <tr>
            <th class="ps-4">ID</th>
            <th>Tài khoản</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Trạng thái</th>
            <th class="text-end pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in props.employees" :key="emp.id" class="table-row-hover">
            <td class="ps-4 fw-bold text-id">#{{ emp.id }}</td>
            <td class="text-black-solid fw-medium">{{ emp.username }}</td>
            <td class="text-name fw-bold">{{ emp.fullname }}</td>
            <td class="text-black-solid small">{{ emp.email }}</td>
            <td class="text-black-solid small">{{ emp.phone }}</td>
            <td>
              <span
                :class="[
                  'badge rounded-pill px-3 py-2',
                  emp.status ? 'badge-pink-active' : 'badge-gray-inactive',
                ]"
              >
                {{ emp.status ? 'Đang hoạt động' : 'Đã nghỉ việc' }}
              </span>
            </td>
            <td class="text-end pe-4">
              <button
                class="btn btn-sm btn-outline-dark rounded-pill px-3 me-2 shadow-xs"
                @click="props.openEmployeeModal(emp)"
                title="Chỉnh sửa"
              >
                Sửa
              </button>
              <button
                class="btn btn-sm btn-outline-danger-custom rounded-pill px-3 shadow-xs"
                @click="props.deleteEmployee(emp.id)"
                title="Xóa nhân viên"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* --- TỔNG THỂ --- */
.employees-view-container {
  padding: 0;
}

h3 {
  color: #ffb6c1 !important; /* Đã đổi sang màu hồng đậm */
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
}

/* --- CARD LIGHT THEME --- */

.employees-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-pink {
  background: linear-gradient(135deg, #ffb6c1, #ffd1dc);
  color: #000 !important;
  border: none !important;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-pink:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 182, 193, 0.3);
}

.card {
  background-color: #f2f2f2 !important;
  border: none !important;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* --- HEADER BẢNG --- */
.table-dark-pink {
  background-color: #e0e0e0 !important;
  border-bottom: 2px solid #d63384 !important;
}

.table-dark-pink th {
  color: #000000 !important;
  font-weight: 800 !important;
  text-transform: uppercase;
  font-size: 13px;
  padding: 18px 12px !important;
  border: none !important;
}

/* --- NỘI DUNG DÒNG --- */
.table tbody td {
  color: #1a1a1a !important;
  background-color: #f2f2f2 !important;
  border: none !important;
  padding: 14px 12px !important;
}

/* --- HIỆU ỨNG HOVER HỒNG NHẠT --- */
.table-row-hover {
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.table-row-hover:hover td {
  background-color: #fff5f7 !important; /* Hồng cực nhạt giống mẫu Hóa đơn */
}

/* --- ĐIỂM NHẤN MÀU SẮC --- */
.text-id {
  color: #d63384 !important; /* Hồng đậm cho ID */
}

.text-name {
  color: #d63384 !important; /* Hồng đậm cho Họ Tên giống khách hàng lẻ */
}

.text-black-solid {
  color: #333 !important;
}

/* --- BADGE TRẠNG THÁI --- */
.badge-pink-active {
  background-color: #ffeef2 !important;
  color: #d63384 !important;
  border: 1px solid #ffb6c1 !important;
  font-weight: 700;
}

.badge-gray-inactive {
  background-color: #f0f0f0 !important;
  color: #888 !important;
  border: 1px solid #ddd !important;
  font-weight: 700;
}

/* --- NÚT BẤM (BUTTONS) --- */
.btn-outline-dark {
  border: 1px solid #333 !important;
  color: #333 !important;
  font-weight: 600;
  transition: 0.3s;
}

.btn-outline-dark:hover {
  background-color: #ffb6c1 !important;
  border-color: #ffb6c1 !important;
  color: #000 !important;
}

.btn-outline-danger-custom {
  border: 1px solid #e63946 !important;
  color: #e63946 !important;
  font-weight: 600;
  transition: 0.3s;
}

.btn-outline-danger-custom:hover {
  background-color: #e63946 !important;
  color: #fff !important;
}

.shadow-xs {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.small {
  font-size: 12px;
  color: #666 !important;
}

/* ================= RESPONSIVE (KHÔNG ĐỔI FORM) ================= */

/* Tablet */
@media (max-width: 992px) {

  /* bảng scroll ngang thay vì bể */
  .table-responsive {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    min-width: 1000px;
  }
}


/* Mobile */
@media (max-width: 768px) {

  /* header xuống dòng nhưng không đổi layout */
  .employees-header {
    flex-wrap: wrap;
    gap: 10px;
  }

  .employees-header h3 {
    width: 100%;
  }

  .btn-pink {
    width: 100%;
    text-align: center;
  }

  /* bảng cho scroll ngang */
  .table-responsive {
    overflow-x: auto !important;
  }

  .table {
    min-width: 950px;
  }

  /* nút thao tác không bể */
  .table td.text-end {
    white-space: nowrap;
  }
}


/* Mobile nhỏ */
@media (max-width: 480px) {

  h3 {
    font-size: 18px;
  }

  .btn-pink {
    padding: 8px 16px;
    font-size: 12px;
  }

  .table th,
  .table td {
    font-size: 13px;
  }
}
</style>
