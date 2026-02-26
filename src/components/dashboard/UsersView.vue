<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  users: Array,
  toggleUserStatus: Function,
})

const selectedUser = ref(null)
</script>

<template>
  <div>
    <h3 class="fw-bold mb-4 px-2">Quản lý Tài khoản Khách</h3>

    <div class="card border-0 shadow-sm table-responsive rounded-4 overflow-hidden">
      <table class="table align-middle mb-0">
        <thead class="table-dark-pink text-nowrap">
          <tr>
            <th class="ps-4">STT</th>
            <th>Ảnh</th>
            <th>Họ và tên</th>
            <th>Tài khoản</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Trạng thái</th>
            <th class="text-center pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, i) in props.users" :key="u.id" class="table-row-hover">
            <td class="ps-4 text-black-solid fw-medium">{{ i + 1 }}</td>
            <td>
              <img
                :src="u.avatar"
                class="rounded-circle"
                width="45"
                height="45"
                style="object-fit: cover"
                onerror="this.src = 'https://i.pravatar.cc/150?u=user'"
              />
            </td>
            <td>
              <div class="fw-bold text-primary">{{ u.fullname || 'Chưa cập nhật' }}</div>
            </td>
            <td class="text-black-solid">{{ u.username }}</td>
            <td class="text-black-solid small">{{ u.email || 'N/A' }}</td>
            <td class="text-black-solid small">{{ u.phone || 'N/A' }}</td>
            <td>
              <span
                :class="[
                  'badge rounded-pill px-3 py-2',
                  u.status ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger',
                ]"
              >
                {{ u.status ? 'Hoạt động' : 'Đã khóa' }}
              </span>
            </td>
            <td class="text-center pe-4">
              <button
                @click="props.toggleUserStatus(u)"
                :class="[
                  'btn btn-sm btn-outline-dark rounded-pill px-3 shadow-xs',
                  u.status ? '' : '',
                ]"
              >
                {{ u.status ? 'Khóa' : 'Mở khóa' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xem chi tiết khách hàng -->
    <div v-if="selectedUser" class="modal-overlay" @click.self="selectedUser = null">
      <div class="modal-card card shadow-lg p-4 border-0 rounded-4">
        <div
          class="d-flex justify-content-between align-items-start border-bottom border-2 pb-3 mb-3"
        >
          <div>
            <h4 class="fw-bold mb-0 text-uppercase tracking-wider">Thông tin Khách hàng</h4>
            <span class="text-muted small">ID: {{ selectedUser.id }}</span>
          </div>
          <button class="btn-close btn-close-white" @click="selectedUser = null"></button>
        </div>

        <div class="row mb-4 small">
          <div class="col-md-4 text-center mb-3">
            <img
              :src="selectedUser.avatar"
              class="rounded-circle border border-secondary mb-2"
              width="120"
              height="120"
              style="object-fit: cover"
              onerror="this.src = 'https://i.pravatar.cc/150?u=user'"
            />
          </div>
          <div class="col-md-8 lh-lg">
            <p class="mb-2">
              <strong>Tên đầy đủ:</strong>
              <span class="text-pink-kem">{{ selectedUser.fullname || 'Chưa cập nhật' }}</span>
            </p>
            <p class="mb-2"><strong>Tài khoản:</strong> {{ selectedUser.username }}</p>
            <p class="mb-2"><strong>Email:</strong> {{ selectedUser.email || 'N/A' }}</p>
            <p class="mb-2"><strong>Điện thoại:</strong> {{ selectedUser.phone || 'N/A' }}</p>
            <p class="mb-2">
              <strong>Trạng thái:</strong>
              <span
                :class="['badge rounded-pill', selectedUser.status ? 'bg-success' : 'bg-danger']"
              >
                {{ selectedUser.status ? 'Hoạt động' : 'Đã khóa' }}
              </span>
            </p>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-4 border-top pt-3">
          <button
            class="btn btn-action shadow-sm"
            :class="selectedUser.status ? 'btn-lock' : 'btn-unlock'"
            @click="
              () => {
                props.toggleUserStatus(selectedUser)
                selectedUser = null
              }
            "
          >
            {{ selectedUser.status ? 'Khóa tài khoản' : 'Mở khóa' }}
          </button>
          <button
            class="btn btn-secondary px-4 shadow-sm rounded-pill fw-bold"
            @click="selectedUser = null"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- GIAO DIỆN BẢNG DANH SÁCH (NỀN XÁM, CHỮ ĐEN) --- */
/* ================= BASE STYLE ================= */

h3 {
  color: #ffb6c1 !important;
  text-transform: uppercase;
  font-size: 18px;
  letter-spacing: 0.5px;
}

.card {
  background-color: #f2f2f2 !important;
  border: 1px solid #ddd !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
}

/* text */
.table,
.table td,
.table small {
  color: #1a1a1a !important;
}

.table-dark-pink {
  background-color: #e0e0e0 !important;
  border-bottom: 2px solid #ffb6c1 !important;
}

.table-dark-pink th {
  color: #333 !important;
  font-weight: 800 !important;
  font-size: 12px;
  text-transform: uppercase;
  padding: 16px 10px !important;
}

/* hover */
.table-row-hover:hover td {
  background-color: #f9f9f9 !important;
  cursor: pointer;
}

.text-primary {
  color: #d63384 !important;
  font-weight: bold !important;
}

/* badge */
.bg-success-subtle {
  background-color: #d4edda !important;
  color: #155724 !important;
}

.bg-danger-subtle {
  background-color: #f8d7da !important;
  color: #721c24 !important;
}

/* button */
.btn-outline-dark {
  border-color: #333 !important;
  color: #333 !important;
  border-radius: 20px !important;
  padding: 6px 18px !important;
  font-weight: 600;
  font-size: 12px;
}

.btn-outline-dark:hover {
  background-color: #ffb6c1 !important;
  border-color: #ffb6c1 !important;
  color: #000 !important;
}

img.rounded-circle {
  border: 2px solid #ddd;
}

/* ================= MODAL ================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  width: 600px;
  max-width: 92%;
  background: white !important;
  color: #000;
}

/* ================= RESPONSIVE ================= */

/* tablet */
@media (max-width: 991px) {

  .table th:nth-child(5),
  .table td:nth-child(5),
  .table th:nth-child(6),
  .table td:nth-child(6) {
    display: none; /* ẩn email + phone cho vừa */
  }

  .modal-card {
    width: 500px;
  }
}

/* mobile */
@media (max-width: 576px) {

  h3 {
    font-size: 16px;
    text-align: center;
  }

  .card {
    border-radius: 14px !important;
  }

  /* bảng cuộn ngang mượt */
  .table-responsive {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 650px;
  }

  /* avatar nhỏ lại */
  img.rounded-circle {
    width: 36px !important;
    height: 36px !important;
  }

  /* nút nhỏ lại */
  .btn-outline-dark {
    padding: 5px 12px !important;
    font-size: 11px;
  }

  /* modal full screen mobile */
  .modal-overlay {
    align-items: flex-end;
  }

  .modal-card {
    width: 100%;
    max-width: 100%;
    height: 85vh;
    border-radius: 20px 20px 0 0 !important;
    overflow-y: auto;
    padding: 20px !important;
  }

  .modal-card img {
    width: 90px !important;
    height: 90px !important;
  }
}

</style>
