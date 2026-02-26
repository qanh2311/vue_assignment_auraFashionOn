<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminMenu from '../../components/AdminMenu.vue'
import Dashboard from '../../components/Dashboard.vue'

const route = useRoute()
const user = JSON.parse(localStorage.getItem('user') || 'null')
let initial = route.query.tab || 'products'
if (!initial && user && user.isEmployee && user.role === 2) {
  initial = 'sales'
}
const activeTab = ref(initial)
const showSidebar = ref(false)
</script>

<template>
  <div class="d-flex vh-100 bg-light admin-layout">
    <AdminMenu v-model:activeTab="activeTab" v-model:showSidebar="showSidebar" />

    <Dashboard :activeTab="activeTab" v-model:showSidebar="showSidebar" />
  </div>
</template>

<style scoped>
/* 1. KHỬ NỀN TRẮNG TỔNG THỂ */
.admin-layout {
  background-color: #000 !important; /* Đen tuyệt đối cho toàn bộ app */
  border: none !important;
}

/* 2. CẤU TRÚC SIDEBAR */
.sidebar {
  width: 300px;
  flex-shrink: 0;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: #000 !important; /* Đảm bảo sidebar không có nền trắng */
  border-right: 1px solid #222 !important;
}

/* Khử mọi viền trắng của Dashboard container khi router render */
.admin-layout :deep(.dashboard-container) {
  flex-grow: 1;
  overflow-x: hidden;
  background-color: #000 !important; 
  border: none !important;
}

/* 3. MODAL & OVERLAY (Giữ tông Dark) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85); /* Tối hơn để nổi bật modal */
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.modal-card {
  width: 95%;
  max-width: 700px;
  max-height: 90vh;
  border-radius: 16px;
  background: #111;
  color: #fff;
  border: 1px solid #ffb6c1; /* Viền hồng kem cho Modal */
  box-shadow: 0 10px 50px rgba(0, 0, 0, 1);
}

/* 4. THEME ĐEN - HỒNG KEM */
.text-pink {
  color: #ffb6c1 !important;
}

/* Tên sản phẩm khi hiển thị trong dashboard (dùng Deep Selector) */
:deep(.fs-6.fw-bold) {
  color: #ffb6c1 !important; /* Hiện tên sản phẩm màu hồng kem khi nhấn vào */
}

:deep(.text-dark), :deep(p), :deep(span), :deep(div) {
  color: #ffffff !important; /* Ép tất cả chữ trong component con sang trắng */
}

/* Button & Nav Link */
.btn-pink {
  background: linear-gradient(135deg, #ffb6c1, #ffd1dc);
  color: #000 !important;
  border: none;
  font-weight: bold;
}

.nav-link {
  color: #ffd1dc !important;
  border-radius: 12px;
  padding: 12px 20px;
  margin-bottom: 8px;
  background: transparent;
}

.nav-link.active {
  background: linear-gradient(135deg, #ffb6c1, #ffd1dc) !important;
  color: #000 !important; /* Chữ đen trên nền hồng */
  font-weight: bold;
}

/* Khử mọi box-shadow trắng mặc định của Bootstrap */
:deep(*) {
  box-shadow: none !important;
}

/* Tinh chỉnh scrollbar */
.modal-body-scroll::-webkit-scrollbar-thumb {
  background: #333;
}
</style>