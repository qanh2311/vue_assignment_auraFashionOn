<template>
  <HeaderLayout>
    <div class="checkout-page" style="background-color: #f5f5f5; min-height: 100vh; padding-bottom: 50px;">
      <div class="container py-4">
        
        <div class="card border-0 shadow-sm mb-3 overflow-hidden">
          <div class="shopee-border-line"></div>
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-2 text-pink">
              <i class="bi bi-geo-alt-fill fs-5 me-2"></i>
              <h5 class="mb-0 fw-bold">Địa Chỉ Nhận Hàng</h5>
            </div>
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div v-if="selectedAddress" class="d-flex align-items-center gap-3">
                <span class="fw-bold fs-6">{{ selectedAddress.name }} {{ selectedAddress.phone }}</span>
                <span class="text-muted fs-6">{{ selectedAddress.detail }}</span>
                <span v-if="selectedAddress.isDefault" class="badge border text-pink ms-2">Mặc định</span>
              </div>
              <div v-else class="text-muted italic">Vui lòng thêm địa chỉ nhận hàng</div>
              <button @click="openAddressModal" class="btn btn-link text-decoration-none text-primary fw-bold p-0">Thay Đổi</button>
            </div>
          </div>
        </div>

        <div v-if="checkoutInfo">
          <div class="card border-0 shadow-sm mb-3">
            <div class="card-body p-4">
              <div class="row fw-bold text-muted border-bottom pb-2 mb-3">
                <div class="col-6">Sản phẩm</div>
                <div class="col-2 text-center">Đơn giá</div>
                <div class="col-2 text-center">Số lượng</div>
                <div class="col-2 text-end">Thành tiền</div>
              </div>
              <div v-for="item in checkoutInfo.items" :key="item.id + item.color + item.size" class="row align-items-center mb-3 border-bottom pb-3">
                <div class="col-6 d-flex align-items-center">
                  <img :src="item.image" class="rounded border" style="width: 50px; height: 50px; object-fit: cover;">
                  <div class="ms-3">
                    <div class="fw-bold small">{{ item.name }}</div>
                    <div class="extra-small text-muted">Loại: {{ item.color }}, Size: {{ item.size }}</div>
                  </div>
                </div>
                <div class="col-2 text-center small">{{ Number(item.price).toLocaleString() }}đ</div>
                <div class="col-2 text-center text-muted">x{{ item.quantity }}</div>
                <div class="col-2 text-end fw-bold text-pink">{{ (Number(item.price) * Number(item.quantity)).toLocaleString() }}đ</div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm mb-3">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-4">
                <h5 class="fw-bold mb-0 me-4">Phương thức thanh toán</h5>
                <div class="d-flex gap-3">
                  <button @click="method = 'cod'" class="btn btn-outline-payment" :class="{'active': method === 'cod'}">
                    Thanh toán khi nhận hàng
                  </button>
                  <button @click="method = 'bank'" class="btn btn-outline-payment" :class="{'active': method === 'bank'}">
                    Chuyển khoản Ngân hàng
                  </button>
                </div>
              </div>
              <div class="p-3 bg-light rounded small text-muted">
                <span v-if="method === 'cod'">Phí thu hộ: 0đ. Vui lòng thanh toán tổng số tiền khi nhận được hàng.</span>
                <span v-else>Vui lòng chuyển khoản theo cú pháp: [Mã đơn hàng] - [Số điện thoại]</span>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
              <div class="p-4 border-bottom text-end">
                <div class="d-flex justify-content-end mb-2">
                  <div class="text-muted me-5">Tổng tiền hàng:</div>
                  <div style="width: 120px;">{{ checkoutInfo.subtotal?.toLocaleString() }}đ</div>
                </div>
                <div class="d-flex justify-content-end mb-2">
                  <div class="text-muted me-5">Phí vận chuyển:</div>
                  <div style="width: 120px;">{{ checkoutInfo.shippingFee?.toLocaleString() }}đ</div>
                </div>
                <div class="d-flex justify-content-end align-items-center mt-3">
                  <div class="text-muted me-5">Tổng thanh toán:</div>
                  <div class="fs-3 fw-bold text-pink" style="width: 180px;">₫{{ checkoutInfo.totalPayment?.toLocaleString() }}</div>
                </div>
              </div>
              <div class="p-4 d-flex justify-content-between align-items-center bg-white">
                <div class="small text-muted w-50">
                  Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <a href="#" class="text-decoration-none text-primary">Điều khoản Aura Fashion</a>
                </div>
                <button @click="confirmOrder" class="btn btn-shopee-order px-5 py-3 fw-bold text-uppercase">
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center">
        <div class="modal-content-custom bg-white rounded shadow-lg p-4" style="width: 550px;">
          <h5 class="fw-bold mb-4 border-bottom pb-2">Địa Chỉ Của Tôi</h5>
          <div class="address-list mb-4" style="max-height: 300px; overflow-y: auto;">
            <div v-for="(addr, idx) in listAddresses" :key="idx" 
                 class="address-item p-3 border rounded mb-2 d-flex gap-3 align-items-start"
                 :class="{'border-pink': tempAddress === addr}" @click="tempAddress = addr">
              <input type="radio" :value="addr" v-model="tempAddress" class="form-check-input mt-1">
              <div class="flex-grow-1">
                <div class="fw-bold">{{ addr.name }} | {{ addr.phone }}</div>
                <p class="small text-muted mb-0">{{ addr.detail }}</p>
              </div>
            </div>
          </div>
          <div class="d-flex gap-2 justify-content-end">
            <button @click="showModal = false" class="btn btn-light">Hủy</button>
            <button @click="saveSelectedAddress" class="btn btn-pink-action px-4">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  </HeaderLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../../composables/useDataStore'
import HeaderLayout from '../../layouts/header.vue'

const router = useRouter()
const store = useDataStore()
const checkoutInfo = ref(null)
const method = ref('cod')
const showModal = ref(false)

const listAddresses = ref([
  { name: 'Quỳnh Anh', phone: '0337376926', detail: 'Nhà Số 9 Ngõ 80/21, Tdp 2, Phương Canh, Nam Từ Liêm, Hà Nội', isDefault: true }
])
const selectedAddress = ref(listAddresses.value[0])
const tempAddress = ref(null)

onMounted(() => {
  const data = JSON.parse(localStorage.getItem('checkout_data'))
  if (!data) router.push('/cart')
  else checkoutInfo.value = data
})

const openAddressModal = () => { tempAddress.value = selectedAddress.value; showModal.value = true; }
const saveSelectedAddress = () => { selectedAddress.value = tempAddress.value; showModal.value = false; }

const confirmOrder = () => {
  if (!selectedAddress.value) return alert("Vui lòng chọn địa chỉ!");
  const user = JSON.parse(localStorage.getItem('user_login')) || JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'))
  
  if (!user || !user.id) return alert("Vui lòng đăng nhập lại!");

  const newInvoice = {
    id: 'INV' + Date.now(),
    userId: user.id,
    customer: selectedAddress.value.name,
    address: selectedAddress.value.detail,
    phone: selectedAddress.value.phone,
    items: checkoutInfo.value.items,
    total: checkoutInfo.value.totalPayment,
    method: method.value,
    status: 'Đang vận chuyển',
    date: new Date().toLocaleString()
  };

  store.addInvoice(newInvoice);

  // Xóa sản phẩm đã mua khỏi giỏ hàng
  const allUserCarts = JSON.parse(localStorage.getItem('all_user_carts')) || {}
  const userCart = allUserCarts[user.id] || []
  const remainingCart = userCart.filter(cartItem => 
    !checkoutInfo.value.items.some(bought => bought.id === cartItem.id && bought.color === cartItem.color && bought.size === cartItem.size)
  )
  allUserCarts[user.id] = remainingCart
  localStorage.setItem('all_user_carts', JSON.stringify(allUserCarts))
  store.carts.value = allUserCarts
  window.dispatchEvent(new Event('cart-updated'))

  localStorage.removeItem('checkout_data')
  alert("Đặt hàng thành công!");
  router.push('/orders'); 
}
</script>

<style scoped>
.text-pink { color: #f28da8; }
.btn-outline-payment { border: 1px solid #ddd; padding: 10px 20px; background: white; transition: 0.2s; border-radius: 4px; }
.btn-outline-payment.active { border-color: #f28da8; color: #f28da8; background-color: #fff9fa; }
.btn-shopee-order { background-color: #ee4d2d; color: white; border: none; border-radius: 2px; }
.shopee-border-line { height: 3px; width: 100%; background-image: repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px); background-size: 116px 3px; }
.modal-backdrop-custom { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; }
.border-pink { border-color: #f28da8 !important; background-color: #fff9fa; }
.btn-pink-action { background-color: #f28da8; color: white; border: none; }
</style>