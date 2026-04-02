<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  products: Array,
  formatPrice: Function,
})
const emit = defineEmits(['create-invoice'])

// --- TRẠNG THÁI (STATE) ---
const selectedProduct = ref(null)
const selectedSize = ref('')
const selectedColor = ref('')
const selectedQty = ref(1)

const pendingInvoices = ref([])
const selectedInvoice = ref(null)
const showQRModal = ref(false)
const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!props.products) return []
  const term = String(searchQuery.value || '')
    .trim()
    .toLowerCase()
  if (!term) return props.products

  return props.products.filter((p) => {
    const id = p.id ? String(p.id).toLowerCase() : ''
    const name = p.name ? String(p.name).toLowerCase() : ''
    return id.includes(term) || name.includes(term)
  })
})

// --- LOGIC GIỎ HÀNG ---
function selectProduct(product) {
  selectedProduct.value = product
  selectedSize.value = product.sizes?.length ? product.sizes[0] : ''
  selectedColor.value = product.colors?.length ? product.colors[0] : ''
  selectedQty.value = 1
}

function addVariantToCart() {
  if (!selectedProduct.value || !selectedInvoice.value) return

  if (selectedQty.value <= 0) {
    alert('Số lượng không hợp lệ!')
    return
  }
  if (!selectedProduct.value || !selectedInvoice.value) return
  const inv = selectedInvoice.value
  const existing = inv.items.find(
    (i) =>
      i.product.id === selectedProduct.value.id &&
      i.size === selectedSize.value &&
      i.color === selectedColor.value,
  )
  if (existing) {
    existing.quantity += selectedQty.value
  } else {
    inv.items.push({
      product: { ...selectedProduct.value },
      size: selectedSize.value,
      color: selectedColor.value,
      quantity: selectedQty.value,
    })
  }
  recalcTotal(inv)
  selectedProduct.value = null
}

function recalcTotal(inv) {
  inv.subtotal = inv.items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  inv.total = inv.subtotal - (inv.discount || 0)
}

function createNewInvoice() {
  const inv = {
    id: 'P' + Date.now().toString().slice(-6),
    items: [],
    subtotal: 0,
    total: 0,
    customerName: '',
    customerPhone: '',
    paymentMethod: 'Tiền mặt',
    discount: 0,
    receivedCash: 0,
  }
  pendingInvoices.value.push(inv)
  selectedInvoice.value = inv
}

function cancelCurrentInvoice() {
  if (!selectedInvoice.value) return

  const confirmCancel = confirm('Bạn có chắc muốn huỷ hóa đơn này không?')
  if (!confirmCancel) return

  pendingInvoices.value = pendingInvoices.value.filter((inv) => inv.id !== selectedInvoice.value.id)

  selectedInvoice.value = pendingInvoices.value[0] || null
}

const changeAmount = computed(() => {
  if (!selectedInvoice.value || selectedInvoice.value.paymentMethod !== 'Tiền mặt') return 0
  const change = selectedInvoice.value.receivedCash - selectedInvoice.value.total
  return change > 0 ? change : 0
})

function checkout() {
  const inv = selectedInvoice.value
  if (!inv?.items.length) return

  if (inv.paymentMethod === 'Tiền mặt' && inv.receivedCash < inv.total) {
    alert('Số tiền khách đưa không đủ để thanh toán!')
    return
  }

  const finalInvoice = {
    id: inv.id,
    customer: inv.customerName || 'Khách Lẻ',
    phone: inv.customerPhone || 'N/A',
    staff: 'Hệ thống',
    paymentMethod: inv.paymentMethod,
    items: inv.items.map((i) => ({
      name: i.product.name,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      price: i.product.price,
    })),
    subtotal: inv.subtotal,
    discount: inv.discount || 0,
    total: inv.total,
    receivedCash: inv.receivedCash || 0,
    change: changeAmount.value || 0,
    date: new Date().toLocaleDateString('vi-VN'),
    time: new Date().toLocaleTimeString('vi-VN'),
    status: 'Đã thanh toán',
  }

  emit('create-invoice', finalInvoice)
  pendingInvoices.value = pendingInvoices.value.filter((x) => x.id !== inv.id)
  selectedInvoice.value = pendingInvoices.value[0] || null
  showQRModal.value = false
  alert('Thanh toán thành công!')
}

function removeItem(inv, idx) {
  inv.items.splice(idx, 1)
  recalcTotal(inv)
}
</script>

<template>
  <div class="d-flex vh-100 sales-white-theme">
    <div class="flex-grow-1 d-flex flex-column p-3 overflow-hidden product-section">
      <div v-if="selectedProduct" class="selection-overlay card shadow-sm mb-3 border-pink">
        <div class="card-body d-flex align-items-center gap-4">
          <div class="pe-4 border-end border-2 text-center">
            <div class="fw-bold fs-6 text-black">{{ selectedProduct.name }}</div>
            <div class="text-pink-accent fw-bold fs-5">
              {{ props.formatPrice(selectedProduct.price) }}
            </div>
          </div>
          <div class="flex-grow-1 d-flex gap-4">
            <div v-if="selectedProduct.sizes?.length">
              <div class="label-small text-black mb-2">SIZE</div>
              <div class="d-flex gap-2">
                <button
                  v-for="s in selectedProduct.sizes"
                  :key="s"
                  @click="selectedSize = s"
                  :class="['btn btn-sm btn-variant', selectedSize === s ? 'active' : '']"
                >
                  {{ s }}
                </button>
              </div>
            </div>
            <div v-if="selectedProduct.colors?.length">
              <div class="label-small text-black mb-2">MÀU</div>
              <div class="d-flex gap-2">
                <button
                  v-for="c in selectedProduct.colors"
                  :key="c"
                  @click="selectedColor = c"
                  :class="['btn btn-sm btn-variant', selectedColor === c ? 'active' : '']"
                >
                  {{ c }}
                </button>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-end gap-3">
            <!-- CHỌN SỐ LƯỢNG -->
            <div>
              <div class="label-small text-black mb-2">SỐ LƯỢNG</div>
              <div class="d-flex align-items-center gap-2">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="selectedQty > 1 ? selectedQty-- : null"
                >
                  -
                </button>

                <input
                  v-model.number="selectedQty"
                  type="number"
                  min="1"
                  class="form-control text-center"
                  style="width: 70px"
                />

                <button class="btn btn-sm btn-outline-secondary" @click="selectedQty++">+</button>
              </div>
            </div>

            <!-- BUTTONS -->
            <div class="d-flex gap-2">
              <button class="btn btn-add-cart px-4 fw-bold" @click="addVariantToCart">THÊM</button>
              <button class="btn btn-outline-dark" @click="selectedProduct = null">HỦY</button>
            </div>
          </div>
        </div>
      </div>

      <div class="product-grid flex-grow-1 overflow-auto">
        <div class="mb-3">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control form-control-sm"
            placeholder="Tìm sản phẩm (mã hoặc tên)..."
          />
        </div>
        <div class="row row-cols-2 row-cols-lg-4 row-cols-xxl-5 g-3">
          <div class="col" v-for="p in filteredProducts" :key="p.id">
            <div class="card h-100 product-card border-light-gray" @click="selectProduct(p)">
              <div class="ratio ratio-1x1 bg-white border-bottom">
                <img :src="p.images[0]" class="object-fit-cover p-1" />
              </div>
              <div class="card-body p-2 text-center">
                <p class="mb-1 small fw-bold text-black text-truncate">{{ p.name }}</p>
                <div class="text-pink-accent fw-bold small">{{ props.formatPrice(p.price) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-4 col-lg-3 h-100 p-2 sidebar-section border-start">
      <div class="card h-100 border-0 d-flex flex-column bg-white shadow-sm">
        <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 class="mb-0 fw-bold text-black text-uppercase small">HÓA ĐƠN HIỆN TẠI</h6>

          <div class="d-flex gap-2">
            <button class="btn btn-add-invoice-white" @click="createNewInvoice">
              <i class="bi bi-plus-lg me-1"></i> THÊM HĐ
            </button>

            <button
              v-if="selectedInvoice"
              class="btn btn-outline-danger btn-sm fw-bold"
              @click="cancelCurrentInvoice"
            >
              HUỶ
            </button>
          </div>
        </div>

        <div class="p-2 border-bottom d-flex gap-2 overflow-auto tab-area bg-light">
          <button
            v-for="inv in pendingInvoices"
            :key="inv.id"
            @click="selectedInvoice = inv"
            :class="['btn btn-invoice-tab', selectedInvoice?.id === inv.id ? 'active' : '']"
          >
            #{{ inv.id }}
          </button>
        </div>

        <div
          v-if="selectedInvoice"
          class="card-body p-0 flex-grow-1 d-flex flex-column overflow-hidden"
        >
          <div class="p-3 border-bottom bg-faint">
            <input
              v-model="selectedInvoice.customerName"
              type="text"
              class="form-control form-custom mb-2"
              placeholder="Tên khách hàng..."
            />
            <input
              v-model="selectedInvoice.customerPhone"
              type="text"
              class="form-control form-custom"
              placeholder="SĐT khách hàng..."
            />
          </div>

          <div class="cart-items flex-grow-1 overflow-auto p-3">
            <div
              v-for="(item, idx) in selectedInvoice.items"
              :key="idx"
              class="d-flex align-items-center mb-3 p-2 rounded border item-row-white"
            >
              <img
                :src="item.product.images[0]"
                class="rounded border"
                width="45"
                height="45"
                style="object-fit: cover"
              />
              <div class="ms-2 flex-grow-1 min-w-0">
                <div class="fw-bold small text-black text-truncate">{{ item.product.name }}</div>
                <div class="text-muted extra-small">
                  {{ item.size }} | {{ item.color }} |
                  <div class="d-flex align-items-center gap-2">
                    <button
                      class="btn btn-sm btn-outline-secondary"
                      @click="
                        item.quantity > 1 ? (item.quantity--, recalcTotal(selectedInvoice)) : null
                      "
                    >
                      -
                    </button>

                    <b class="text-black">{{ item.quantity }}</b>

                    <button
                      class="btn btn-sm btn-outline-secondary"
                      @click="(item.quantity++, recalcTotal(selectedInvoice))"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div class="text-end ms-2">
                <div class="fw-bold text-pink-accent small">
                  {{ props.formatPrice(item.product.price * item.quantity) }}
                </div>
                <button
                  @click="removeItem(selectedInvoice, idx)"
                  class="btn btn-link text-danger p-0"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="p-3 border-top bg-white mt-auto">
            <div class="mb-3">
              <label class="label-small text-black mb-2">PHƯƠNG THỨC THANH TOÁN</label>
              <div class="d-flex gap-2">
                <button
                  @click="selectedInvoice.paymentMethod = 'Tiền mặt'"
                  :class="[
                    'btn flex-fill py-2 fw-bold btn-pay-selector',
                    selectedInvoice.paymentMethod === 'Tiền mặt' ? 'active' : '',
                  ]"
                >
                  TIỀN MẶT
                </button>
                <button
                  @click="selectedInvoice.paymentMethod = 'Chuyển khoản'"
                  :class="[
                    'btn flex-fill py-2 fw-bold btn-pay-selector',
                    selectedInvoice.paymentMethod === 'Chuyển khoản' ? 'active' : '',
                  ]"
                >
                  CHUYỂN KHOẢN
                </button>
              </div>
            </div>

            <div
              v-if="selectedInvoice.paymentMethod === 'Tiền mặt'"
              class="mb-3 p-2 border rounded-3 bg-faint"
            >
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small fw-bold text-black">Khách đưa:</span>
                <input
                  v-model.number="selectedInvoice.receivedCash"
                  type="number"
                  class="text-end border-0 bg-transparent fw-bold text-black w-50"
                />
              </div>
              <div class="d-flex justify-content-between align-items-center border-top pt-1 mt-1">
                <span class="small fw-bold text-black">Tiền thối:</span>
                <span class="fw-bold fs-6 text-success">{{ props.formatPrice(changeAmount) }}</span>
              </div>
            </div>

            <div
              class="d-flex justify-content-between align-items-center mb-3 pt-2 border-top-dashed"
            >
              <span class="fw-bold text-black">TỔNG CỘNG:</span>
              <h4 class="fw-bold text-pink-accent mb-0">
                {{ props.formatPrice(selectedInvoice.total) }}
              </h4>
            </div>

            <button
              v-if="selectedInvoice.paymentMethod === 'Tiền mặt'"
              class="btn btn-checkout-pink w-100 py-3 fw-bold rounded-3 shadow"
              @click="checkout"
            >
              XÁC NHẬN THANH TOÁN
            </button>
            <button
              v-else
              class="btn btn-qr-trigger w-100 py-3 fw-bold rounded-3 shadow"
              @click="showQRModal = true"
            >
              HIỂN THỊ MÃ QR QUÉT
            </button>
          </div>
        </div>
        <div
          v-else
          class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted p-4"
        >
          <i class="bi bi-cart4 display-1 opacity-25"></i>
          <p class="mt-2 fw-bold text-black">CHƯA CÓ ĐƠN HÀNG</p>
        </div>
      </div>
    </div>

    <div
      v-if="showQRModal && selectedInvoice"
      class="qr-modal-overlay"
      @click.self="showQRModal = false"
    >
      <div class="qr-modal-card animate__animated animate__zoomIn">
        <div class="text-center mb-4">
          <h4 class="fw-bold text-black">QUÉT MÃ THANH TOÁN</h4>
          <p class="text-muted small">Mã đơn: {{ selectedInvoice.id }}</p>
        </div>
        <div class="qr-image-container text-center mb-4">
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=AURA_FASHION_PAY_${selectedInvoice.total}`"
            alt="QR Code"
            class="img-fluid border p-2 bg-white shadow-sm"
          />
        </div>
        <div class="total-info text-center mb-4">
          <span class="text-muted d-block small">Số tiền cần thanh toán</span>
          <h2 class="fw-bold text-pink-accent">{{ props.formatPrice(selectedInvoice.total) }}</h2>
        </div>
        <button class="btn btn-checkout-pink w-100 py-3 fw-bold rounded-pill" @click="checkout">
          ĐÃ NHẬN TIỀN (HOÀN TẤT)
        </button>
        <button
          class="btn btn-link w-100 text-muted mt-2 text-decoration-none"
          @click="showQRModal = false"
        >
          Đóng lại
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ================= BASE THEME ================= */

.sales-white-theme {
  background-color: #ffffff;
  color: #000000;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.product-section {
  background-color: #f8f9fa;
  min-width: 0;
}

.sidebar-section {
  background-color: #ffffff;
  min-width: 320px;
}

.bg-faint {
  background-color: #fcfcfc;
}

/* TEXT */
.text-black {
  color: #000000 !important;
}
.text-pink-accent {
  color: #d63384 !important;
}
.label-small {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #555;
}

/* PRODUCT CARD */
.product-card {
  background: #fff !important;
  border: 1px solid #eee !important;
  transition: 0.2s;
  cursor: pointer;
}
.product-card:hover {
  border-color: #ffb6c1 !important;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 182, 193, 0.3) !important;
}

/* BUTTONS */
.btn-variant {
  border: 1px solid #ddd;
  background: #fff;
  color: #000;
  font-weight: 500;
}
.btn-variant.active {
  background: #d63384;
  color: #fff;
  border-color: #d63384;
}

.btn-add-cart {
  background: #d63384;
  color: #fff;
  border: none;
}

.btn-checkout-pink {
  background: linear-gradient(135deg, #d63384, #ff8da1);
  color: #fff;
  border: none;
}

.btn-qr-trigger {
  background-color: #333;
  color: #ffb6c1;
  border: none;
}

.btn-add-invoice-white {
  background: #fff;
  border: 1.5px solid #d63384;
  color: #d63384;
  font-weight: 700;
  font-size: 11px;
  padding: 6px 15px;
  border-radius: 8px;
}

/* invoice tabs */
.btn-invoice-tab {
  background: #eee;
  color: #777;
  font-weight: 700;
  font-size: 11px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: 0.2s;
}
.btn-invoice-tab.active {
  background: #fff;
  color: #d63384;
  border-color: #d63384;
  box-shadow: 0 2px 8px rgba(214, 51, 132, 0.2);
}

/* payment buttons */
.btn-pay-selector {
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #555;
  border-radius: 8px;
  font-size: 13px;
}
.btn-pay-selector.active {
  background: #333;
  color: #fff;
  border-color: #333;
}

/* items */
.item-row-white {
  background-color: #ffffff;
  transition: 0.2s;
  border-color: #eee !important;
}

.form-custom {
  background-color: #f8f9fa !important;
  border: 1px solid #eee !important;
  color: #000 !important;
  font-weight: 500;
}

/* QR MODAL */
.qr-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  backdrop-filter: blur(4px);
}

.qr-modal-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
}

/* ================= RESPONSIVE ================= */

/* laptop nhỏ */
@media (max-width: 1200px) {
  .sidebar-section {
    min-width: 300px;
  }
}

/* tablet */
@media (max-width: 991px) {
  .sales-white-theme {
    flex-direction: column !important;
    height: auto;
  }

  .product-section {
    height: 55vh;
  }

  .sidebar-section {
    width: 100% !important;
    height: 45vh !important;
    border-left: none !important;
    border-top: 2px solid #eee;
  }

  .selection-overlay .card-body {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 20px !important;
  }

  .selection-overlay .flex-grow-1 {
    flex-direction: column !important;
    gap: 15px !important;
  }

  .cart-items {
    max-height: 250px;
  }
}

/* mobile */
@media (max-width: 576px) {
  .product-section {
    height: 50vh;
    padding: 10px !important;
  }

  .sidebar-section {
    height: 50vh !important;
    padding: 6px !important;
  }

  .product-grid .row {
    --bs-gutter-x: 0.5rem;
    --bs-gutter-y: 0.5rem;
  }

  .selection-overlay .card-body {
    padding: 15px !important;
  }

  /* quantity buttons không đè */
  .selection-overlay input[type='number'] {
    width: 60px !important;
  }

  .btn-add-cart {
    width: 100%;
  }

  .qr-modal-card {
    padding: 25px;
  }

  .cart-items {
    max-height: 200px;
  }
}
</style>
