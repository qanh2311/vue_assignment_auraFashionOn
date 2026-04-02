<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  invoices: Array,
  formatPrice: Function,
})
const emit = defineEmits(['update-invoice'])

const selected = ref(null)

function openInvoice(inv) {
  selected.value = inv
}

function recalcSelectedInvoice() {
  if (!selected.value) return
  const subtotal = (selected.value.items || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  )
  selected.value.subtotal = subtotal
  selected.value.total = subtotal - (selected.value.discount || 0)
}

function removeInvoiceItem(index) {
  if (!selected.value || !selected.value.items) return
  const item = selected.value.items[index]
  if (!item) return

  if (!confirm(`Xác nhận xóa sản phẩm "${item.name}" khỏi hóa đơn?`)) return

  selected.value.items.splice(index, 1)
  recalcSelectedInvoice()
  emit('update-invoice', { ...selected.value })
}
function closeModal() {
  selected.value = null
}

function printInvoice() {
  window.print()
}
</script>

<template>
  <div>
    <h3 class="fw-bold mb-4 px-2">Quản lý Hóa đơn</h3>

    <div class="card border-0 shadow-sm table-responsive rounded-4 overflow-hidden">
      <table class="table align-middle mb-0">
        <thead class="table-dark-pink text-nowrap">
          <tr>
            <th class="ps-4">Mã đơn</th>
            <th>Ngày/Giờ</th>
            <th>Khách hàng</th>
            <th>Nhân viên</th>
            <th>Thanh toán</th>
            <th>Tổng tiền</th>
            <th class="text-end pe-4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inv in props.invoices" :key="inv.id" class="table-row-hover">
            <td class="ps-4 fw-bold text-primary">#{{ inv.id }}</td>
            <td>
              <small class="d-block fw-medium">{{ inv.date }}</small>
              <small class="text-muted">{{ inv.time || '--:--' }}</small>
            </td>
            <td>
              <div class="fw-bold">{{ inv.customer }}</div>
              <small class="text-muted">{{ inv.phone || 'N/A' }}</small>
            </td>
            <td>{{ inv.staff || 'Hệ thống' }}</td>
            <td>
              <span
                class="badge rounded-pill bg-info-subtle text-info border border-info px-3 py-2"
              >
                {{ inv.paymentMethod || 'Tiền mặt' }}
              </span>
            </td>
            <td class="fw-bold text-dark">{{ props.formatPrice(inv.total) }}</td>
            <td class="text-end pe-4">
              <button
                class="btn btn-sm btn-outline-dark rounded-pill px-3 shadow-xs"
                @click="openInvoice(inv)"
              >
                <i class="bi bi-eye"></i> Xem chi tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selected" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card card shadow-lg p-4 invoice-print-area border-0 rounded-4">
        <div
          class="d-flex justify-content-between align-items-start border-bottom border-2 pb-3 mb-3"
        >
          <div>
            <h4 class="fw-bold mb-0 text-uppercase tracking-wider">Hóa đơn bán lẻ</h4>
            <span class="text-muted small">Mã đơn: #{{ selected.id }}</span>
          </div>
          <div class="text-end text-uppercase">
            <h5 class="fw-bold mb-0 text-pink-dark">AURA FASHION ON</h5>
            <small class="text-muted">ĐC: 123 Đường ABC, Hà Nội</small>
          </div>
        </div>

        <div class="row mb-4 small">
          <div class="col-6 lh-lg">
            <p class="mb-0"><strong>Khách hàng:</strong> {{ selected.customer }}</p>
            <p class="mb-0"><strong>SĐT:</strong> {{ selected.phone || 'N/A' }}</p>
            <p class="mb-0"><strong>Thanh toán:</strong> {{ selected.paymentMethod }}</p>
          </div>
          <div class="col-6 text-end lh-lg">
            <p class="mb-0"><strong>Ngày:</strong> {{ selected.date }}</p>
            <p class="mb-0"><strong>Giờ:</strong> {{ selected.time }}</p>
            <p class="mb-0"><strong>Thu ngân:</strong> {{ selected.staff }}</p>
          </div>
        </div>

        <div class="modal-body-scroll overflow-hidden mb-3">
          <table class="table table-sm border-bottom">
            <thead class="bg-light">
              <tr class="text-uppercase extra-small fw-bold">
                <th class="py-2">Sản phẩm</th>
                <th class="text-center py-2">Thông tin</th>
                <th class="text-center py-2">SL</th>
                <th class="text-end py-2">Đơn giá</th>
                <th class="text-end py-2">Thành tiền</th>
                <th class="text-end py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in selected.items" :key="item.name + item.size + index">
                <td class="py-2">
                  <div class="fw-bold text-dark">{{ item.name }}</div>
                </td>
                <td class="text-center py-2 small text-muted">
                  {{ item.size || '-' }} / {{ item.color || '-' }}
                </td>
                <td class="text-center py-2">{{ item.quantity }}</td>
                <td class="text-end py-2">{{ props.formatPrice(item.price || 0) }}</td>
                <td class="text-end py-2 fw-bold">
                  {{ props.formatPrice((item.price || 0) * (item.quantity || 1)) }}
                </td>
                <td class="text-end py-2">
                  <button class="btn btn-sm btn-outline-danger" @click="removeInvoiceItem(index)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="ms-auto pt-2" style="max-width: 300px">
            <div class="d-flex justify-content-between mb-1 small">
              <span class="text-muted">Tạm tính:</span>
              <span class="fw-medium">{{
                props.formatPrice(selected.subtotal || selected.total)
              }}</span>
            </div>
            <div class="d-flex justify-content-between mb-1 text-danger small">
              <span class="text-muted">Giảm giá:</span>
              <span class="fw-bold">-{{ props.formatPrice(selected.discount || 0) }}</span>
            </div>
            <div class="d-flex justify-content-between border-top border-2 pt-2 fw-bold fs-5 mb-3">
              <span class="text-dark">TỔNG CỘNG:</span>
              <span class="text-primary">{{ props.formatPrice(selected.total) }}</span>
            </div>

            <div
              v-if="selected.paymentMethod === 'Tiền mặt'"
              class="border-top pt-2 border-dashed-custom bg-light p-2 rounded-2"
            >
              <div class="d-flex justify-content-between mb-1 small italic text-muted">
                <span>Tiền khách đưa:</span>
                <span class="fw-bold">{{ props.formatPrice(selected.receivedCash || 0) }}</span>
              </div>
              <div class="d-flex justify-content-between small italic text-muted fw-bold">
                <span>Tiền thối lại:</span>
                <span class="text-pink-dark fw-bold fs-6">{{
                  props.formatPrice(selected.change || 0)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="d-flex justify-content-between align-items-center mt-4 no-print border-top pt-3"
        >
          <button
            class="btn btn-outline-primary px-4 shadow-sm rounded-pill fw-bold"
            @click="printInvoice"
          >
            <i class="bi bi-printer me-2"></i> In hóa đơn
          </button>
          <button class="btn btn-secondary px-4 shadow-sm rounded-pill fw-bold" @click="closeModal">
            Đóng
          </button>
        </div>

        <div class="text-center mt-4 mt-auto small text-muted italic">
          --- Cảm ơn Quý khách, hẹn gặp lại! ---
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- 1. GIAO DIỆN BẢNG DANH SÁCH (NỀN XÁM, CHỮ ĐEN) --- */
h3 {
  color: #ffb6c1 !important;
}

.card {
  background-color: #f2f2f2 !important;
  border: 1px solid #ddd !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
}

/* Ép toàn bộ chữ trong bảng ngoài thành màu đen */
.table,
.table td,
.table small {
  color: #1a1a1a !important;
}

/* Header của bảng */
.table-dark-pink {
  background-color: #e0e0e0 !important;
  border-bottom: 2px solid #ffb6c1 !important;
}
.table-dark-pink th {
  color: #333 !important;
  font-weight: 800 !important;
}

/* --- ĐỔI MÀU CÁC CỘT CHÍNH SANG HỒNG --- */

/* 1. Mã đơn hàng (#P...) */
.text-primary {
  color: #d63384 !important;
  font-weight: bold !important;
}

/* 2. TÊN KHÁCH HÀNG (Mới bổ sung) */
.table tbody td .fw-bold {
  color: #d63384 !important; /* Đổi tên khách hàng sang hồng đậm */
}

/* 3. Badge Thanh toán (Tiền mặt / Chuyển khoản) */
.badge.bg-info-subtle,
.badge.bg-light.text-dark {
  background-color: #ffd1dc !important; /* Nền hồng nhạt */
  color: #d63384 !important; /* Chữ hồng đậm */
  border: 1px solid #ffb6c1 !important; /* Viền hồng kem */
}

/* 4. Tổng tiền hàng */
.fw-bold.text-dark,
.table td:nth-child(6) {
  color: #d63384 !important;
  font-weight: bold !important;
}

/* --- 2. GIAO DIỆN HÓA ĐƠN MODAL (GIỮ NGUYÊN) --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 2000 !important;
  backdrop-filter: blur(4px);
}

.modal-card {
  background: #ffffff !important;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 16px !important;
  padding: 25px !important;
}

.modal-card * {
  color: #000000 !important; /* Chữ trong hóa đơn vẫn để đen để in ấn rõ nét */
}

/* --- 3. NÚT XEM CHI TIẾT --- */
.btn-outline-dark {
  border-color: #333 !important;
  color: #333 !important;
  border-radius: 20px !important;
}

.btn-outline-dark:hover {
  background-color: #ffb6c1 !important;
  border-color: #ffb6c1 !important;
  color: #000 !important;
}

@media print {
  .no-print {
    display: none !important;
  }
}

/* ================= RESPONSIVE (KHÔNG ĐỔI FORM) ================= */

/* Tablet */
@media (max-width: 992px) {
  /* bảng danh sách scroll ngang thay vì bể */
  .table-responsive {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    min-width: 900px;
  }

  /* modal cao hơn chút để vừa màn */
  .modal-card {
    max-height: 92vh !important;
  }
}

/* Mobile */
@media (max-width: 768px) {
  /* modal không vượt màn hình */
  .modal-card {
    width: 95% !important;
    max-height: 100vh !important;
    overflow-y: auto !important;
  }

  /* giữ nguyên 2 cột col-6, chỉ giảm padding */
  .modal-card .col-6 {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  /* bảng sản phẩm trong hóa đơn cho scroll ngang */
  .modal-body-scroll {
    overflow-x: auto !important;
  }

  .modal-body-scroll table {
    min-width: 600px;
  }

  /* phần tổng tiền không tràn */
  .ms-auto {
    max-width: 100% !important;
  }

  /* nút luôn nhìn thấy khi scroll */
  .no-print {
    position: sticky;
    bottom: 0;
    background: #fff;
    padding-top: 10px;
    z-index: 5;
  }
}

/* Mobile nhỏ */
@media (max-width: 480px) {
  .modal-card {
    padding: 16px !important;
  }

  .modal-card table {
    font-size: 13px;
  }

  .modal-card h4 {
    font-size: 18px;
  }

  .modal-card h5 {
    font-size: 16px;
  }
}
</style>
