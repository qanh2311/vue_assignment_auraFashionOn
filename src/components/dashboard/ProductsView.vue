<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  products: Array,
  filteredProducts: Array,
  search: String,
  formatPrice: Function,
  openModal: Function,
  deleteItem: Function,
})
const emit = defineEmits(['update:search'])
</script>

<template>
  <div class="products-view-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold m-0">Danh sách Sản phẩm</h3>

      <div
        class="d-flex gap-2 p-1 bg-white rounded-pill shadow-sm border border-pink-light"
        style="max-width: 500px; width: 100%"
      >
        <input
          :value="props.search"
          @input="(e) => emit('update:search', e.target.value)"
          class="form-control border-0 ps-4 rounded-pill"
          placeholder="TÌM KIẾM SẢN PHẨM..."
        />
        <button
          class="btn btn-pink px-4 fw-bold text-nowrap rounded-pill"
          @click="props.openModal('product')"
        >
          + THÊM MỚI
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm table-responsive rounded-4 overflow-hidden">
      <table class="table align-middle mb-0">
        <thead class="table-dark-pink text-nowrap">
          <tr>
            <th class="ps-4">STT</th>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Phân loại</th>
            <th>Giá bán</th>
            <th class="text-end pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="props.filteredProducts?.length === 0">
            <td colspan="6" class="text-center py-5 text-muted">Không tìm thấy sản phẩm</td>
          </tr>
          <tr v-for="(p, i) in props.filteredProducts" :key="p.id" class="table-row-hover">
            <td class="ps-4 text-muted">{{ String(i + 1).padStart(2, '0') }}</td>
            <td>
              <div class="image-wrapper">
                <img
                  :src="p.images?.[0]"
                  @click="props.openGallery && props.openGallery(p.images)"
                  class="rounded-3 border shadow-xs"
                  width="50"
                  height="65"
                  style="object-fit: cover; cursor: pointer"
                  onerror="this.src = 'https://placehold.co/50x65?text=Aura'"
                />
              </div>
            </td>
            <td>
              <div class="fw-bold text-name">{{ p.name }}</div>
              <small class="text-muted text-uppercase" style="font-size: 11px"
                >ID: {{ p.id.toString().slice(-6).toUpperCase() }}</small
              >
            </td>
            <td>
              <span class="badge-pink">
                {{ p.category }}
              </span>
            </td>
            <td>
              <span class="text-price fw-bold">{{ props.formatPrice(p.price) }}</span>
            </td>
            <td class="text-end pe-4">
              <button
                class="btn btn-sm btn-outline-dark rounded-pill px-3 me-2"
                @click="props.openModal('product', p)"
              >
                Sửa
              </button>
              <button
                class="btn btn-sm btn-outline-danger-custom rounded-pill px-3"
                @click="props.deleteItem(p.id)"
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

/* ================= CONTAINER ================= */

.products-view-container {
  background-color: #000;
  min-height: 100vh;
  padding: 20px;
}

h3 {
  color: #ffb6c1 !important;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ================= SEARCH BAR ================= */

.border-pink-light {
  border: 1px solid #ffb6c1 !important;
}

.form-control {
  background-color: transparent !important;
  color: #000 !important;
  font-weight: 500;
}

.btn-pink {
  background: linear-gradient(135deg, #ffb6c1, #ffd1dc) !important;
  color: #000 !important;
  border: none;
  white-space: nowrap;
}

/* ================= CARD ================= */

.card {
  background-color: #ffffff !important;
  border: 1px solid #ffb6c1 !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
}

/* ================= TABLE ================= */

.table-dark-pink {
  background-color: #fcfcfc !important;
  border-bottom: 2px solid #ffb6c1 !important;
}

.table-dark-pink th {
  color: #000000 !important;
  font-weight: 800 !important;
  text-transform: uppercase;
  font-size: 13px;
  padding: 18px 12px !important;
  border: none !important;
}

.table tbody td {
  color: #000000 !important;
  background-color: #ffffff !important;
  border-bottom: 1px solid #f0f0f0 !important;
  padding: 15px 12px !important;
}

/* hover */
.table-row-hover {
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.table-row-hover:hover td {
  background-color: #fff5f7 !important;
}

/* highlight */
.text-name {
  color: #d63384 !important;
}

.text-price {
  color: #d63384 !important;
}

.badge-pink {
  background-color: #ffeef2 !important;
  color: #d63384 !important;
  border: 1px solid #ffb6c1 !important;
  border-radius: 20px;
  padding: 6px 14px;
  font-weight: 700;
  font-size: 11px;
}

/* buttons */
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
}

.btn-outline-danger-custom:hover {
  background-color: #e63946;
  color: #fff;
}

/* ================= IMAGE ================= */

.image-wrapper {
  display: flex;
  justify-content: center;
}

.image-wrapper img {
  transition: transform 0.2s;
}

.image-wrapper img:hover {
  transform: scale(1.05);
}

/* ===================================================== */
/* ===================== RESPONSIVE ==================== */
/* ===================================================== */

/* tablet */
@media (max-width: 991px) {
  /* header stack */
  .products-view-container > div:first-child {
    flex-direction: column;
    align-items: stretch !important;
    gap: 12px;
  }

  .products-view-container .bg-white {
    max-width: 100% !important;
  }

  /* Ẩn cột phân loại */
  table th:nth-child(4),
  table td:nth-child(4) {
    display: none;
  }
}

/* mobile */
@media (max-width: 576px) {
  .products-view-container {
    padding: 12px;
  }

  h3 {
    text-align: center;
    font-size: 16px;
  }

  /* search full width */
  .products-view-container .bg-white {
    flex-direction: column;
    border-radius: 14px !important;
    padding: 10px !important;
  }

  .form-control {
    width: 100%;
    margin-bottom: 8px;
  }

  .btn-pink {
    width: 100%;
    padding: 10px !important;
  }

  /* table scroll ngang mượt */
  .table-responsive {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 680px;
  }

  /* ảnh nhỏ lại */
  .image-wrapper img {
    width: 40px !important;
    height: 55px !important;
  }

  /* text nhỏ lại */
  .table tbody td {
    font-size: 13px;
    padding: 12px 8px !important;
  }

  /* ẩn cột giá trên mobile (vì đã hiển thị khi sửa) */
  table th:nth-child(5),
  table td:nth-child(5) {
    display: none;
  }

  /* nút nhỏ lại */
  .btn-outline-dark,
  .btn-outline-danger-custom {
    padding: 5px 10px !important;
    font-size: 11px;
  }
}
</style>
