<template>
  <HeaderLayout>
    <div class="cart-page" style="background-color: #f5f5f5; min-height: 100vh; padding-bottom: 100px;">
      <div class="container py-4">
        <h2 class="text-center mb-5 pink-title text-uppercase fw-bold">🛒 Giỏ hàng của bạn</h2>

        <div v-if="cartItems.length > 0" class="bg-white shadow-sm rounded-2 overflow-hidden">
          <div class="row g-0 py-3 px-4 border-bottom fw-bold text-muted small text-uppercase bg-white">
            <div class="col-1 text-center">Chọn</div>
            <div class="col-4">Sản phẩm</div>
            <div class="col-2 text-center">Đơn giá</div>
            <div class="col-2 text-center">Số lượng</div>
            <div class="col-2 text-center">Thành tiền</div>
            <div class="col-1 text-center">Thao tác</div>
          </div>

          <div v-for="(item, index) in cartItems" :key="index" 
               class="row g-0 py-4 px-4 border-bottom align-items-center bg-white item-hover">
            <div class="col-1 text-center">
              <input type="checkbox" v-model="item.selected" class="form-check-input custom-checkbox">
            </div>

            <div class="col-4">
              <div class="d-flex align-items-center">
                <img :src="item.image" class="product-img border rounded" alt="product">
                <div class="ms-3">
                  <h6 class="fw-bold mb-1 small">{{ item.name }}</h6>
                  <p class="text-muted mb-0 extra-small">Phân loại: {{ item.color }} | Size: {{ item.size }}</p>
                </div>
              </div>
            </div>

            <div class="col-2 text-center small">{{ Number(item.price).toLocaleString() }}đ</div>

            <div class="col-2 text-center">
              <div class="qty-group d-inline-flex align-items-center border rounded">
                <button class="btn btn-sm px-2 border-0" @click="updateQty(index, -1)">-</button>
                <input type="text" class="form-control form-control-sm text-center border-0 bg-transparent" 
                       style="width: 35px;" :value="item.quantity" readonly>
                <button class="btn btn-sm px-2 border-0" @click="updateQty(index, 1)">+</button>
              </div>
            </div>

            <div class="col-2 text-center fw-bold pink-text">
              {{ (Number(item.price) * Number(item.quantity)).toLocaleString() }}đ
            </div>

            <div class="col-1 text-center">
              <button class="btn btn-link text-decoration-none text-dark small delete-hover" @click="removeItem(index)">
                Xóa
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5 bg-white rounded shadow-sm">
          <p class="text-muted">Giỏ hàng của bạn đang trống.</p>
          <router-link to="/home" class="btn btn-pink-action px-4 py-2 mt-2">Tiếp tục mua sắm</router-link>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="fixed-bottom bg-white border-top shadow-lg py-3">
        <div class="container d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <div class="form-check me-3 ms-2">
              <input type="checkbox" class="form-check-input custom-checkbox" v-model="selectAll" @change="handleSelectAll">
              <label class="ms-1 small cursor-pointer" @click="toggleSelectAll">Chọn Tất Cả</label>
            </div>
            <button class="btn btn-link text-decoration-none text-dark small me-3" @click="removeSelected">Xóa đã chọn</button>
          </div>

          <div class="d-flex align-items-center">
            <div class="text-end me-4">
              <div class="mb-0">Tổng thanh toán ({{ selectedItems.length }} sản phẩm): 
                <span class="fs-4 pink-text fw-bold">₫{{ totalPayment.toLocaleString() }}</span>
              </div>
            </div>
            <button 
              class="btn btn-pink-action px-5 py-2 fw-bold text-uppercase shadow-sm"
              @click="submitOrder"
            >
              Đặt hàng ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  </HeaderLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../../composables/useDataStore'
import HeaderLayout from '../../layouts/header.vue'

const store = useDataStore()
const router = useRouter()
const selectAll = ref(false)
const shippingFee = ref(30000)

// 1. Tìm user đang đăng nhập
const user = computed(() => 
  JSON.parse(localStorage.getItem('user_login')) || 
  JSON.parse(localStorage.getItem('currentUser')) || 
  JSON.parse(localStorage.getItem('user'))
)

// 2. Lấy giỏ hàng từ Store dựa trên ID người dùng
const cartItems = computed(() => {
  if (!user.value) return []
  return store.carts.value[user.value.id] || []
})

const updateQty = (index, change) => {
  const item = cartItems.value[index]
  if (item && item.quantity + change > 0) {
    item.quantity += change
    localStorage.setItem('all_user_carts', JSON.stringify(store.carts.value))
    // Phát sự kiện để Header cập nhật số lượng badge nếu cần
    window.dispatchEvent(new Event('cart-updated'))
  }
}

const removeItem = (index) => {
  if (confirm("Xác nhận xóa sản phẩm này?")) {
    store.removeFromCart(user.value.id, index)
  }
}

const removeSelected = () => {
  const selectedIndices = cartItems.value
    .map((item, idx) => item.selected ? idx : -1)
    .filter(idx => idx !== -1)

  if (selectedIndices.length > 0 && confirm("Xóa các mục đã chọn?")) {
    store.clearCartSelection(user.value.id, selectedIndices)
    selectAll.value = false
  }
}

const handleSelectAll = () => {
  cartItems.value.forEach(item => item.selected = selectAll.value)
}

const toggleSelectAll = () => {
  selectAll.value = !selectAll.value
  handleSelectAll()
}

// 3. LOGIC LỌC SẢN PHẨM ĐÃ TÍCH CHỌN
const selectedItems = computed(() => cartItems.value.filter(i => i.selected))

// Tổng tiền hàng của những món được tích
const subtotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    return sum + (Number(item.price) * Number(item.quantity))
  }, 0)
})

// Tổng thanh toán (Tiền hàng + Phí ship)
const totalPayment = computed(() => {
  if (selectedItems.value.length === 0) return 0
  return subtotal.value + shippingFee.value
})

// 4. HÀM CHUYỂN DỮ LIỆU QUA CHECKOUT
const submitOrder = () => {
  if (selectedItems.value.length === 0) {
    alert("Vui lòng tích chọn sản phẩm bạn muốn mua!")
    return
  }

  // Đóng gói dữ liệu hóa đơn tạm thời
  const checkoutData = {
    userId: user.value.id,
    items: selectedItems.value.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image,
      color: item.color,
      size: item.size
    })),
    subtotal: subtotal.value,
    shippingFee: shippingFee.value,
    totalPayment: totalPayment.value
  }

  // Lưu vào localStorage để trang Checkout.vue truy cập
  localStorage.setItem('checkout_data', JSON.stringify(checkoutData))

  // Chuyển hướng
  router.push('/checkout')
}
</script>

<style scoped>
.pink-title { color: #f28da8; }
.pink-text { color: #f28da8; }
.btn-pink-action { background-color: #f28da8; color: white; border: none; border-radius: 4px; transition: 0.3s; }
.btn-pink-action:hover { background-color: #e07b96; }
.product-img { width: 60px; height: 60px; object-fit: cover; }
.custom-checkbox { width: 1.2rem; height: 1.2rem; cursor: pointer; }
.custom-checkbox:checked { background-color: #f28da8; border-color: #f28da8; }
.fixed-bottom { z-index: 1030; box-shadow: 0 -5px 15px rgba(0,0,0,0.05); }
.cursor-pointer { cursor: pointer; }
</style>