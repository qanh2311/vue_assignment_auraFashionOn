<template>
  <HeaderLayout>
    <div class="orders-page" style="background-color: #f5f5f5; min-height: 100vh; padding: 20px 0;">
      <div class="container">
        
        <div class="card border-0 shadow-sm mb-3">
          <div class="d-flex justify-content-between text-center bg-white border-bottom">
            <div v-for="tab in tabs" :key="tab" 
                 class="flex-grow-1 py-3 tab-item cursor-pointer"
                 :class="{ 'active-tab': activeTab === tab }"
                 @click="activeTab = tab">
              {{ tab }}
            </div>
          </div>
          <div class="p-3 bg-light text-start">
            <div class="input-group shadow-sm">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input type="text" v-model="searchQuery" class="form-control border-start-0 ps-0" 
                     placeholder="Tìm kiếm theo ID đơn hàng hoặc Tên sản phẩm">
            </div>
          </div>
        </div>

        <div v-if="filteredInvoices.length > 0">
          <div v-for="inv in filteredInvoices" :key="inv.id" class="card mb-3 shadow-sm border-0 overflow-hidden">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
              <div>
                <span class="fw-bold">Mã đơn: {{ inv.id }}</span>
                <span class="mx-2 text-muted">|</span>
                <span class="small text-muted">{{ inv.date }}</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="bi bi-truck text-success me-2" v-if="inv.status.toLowerCase().includes('vận chuyển')"></i>
                <span class="fw-bold text-pink text-uppercase small">{{ inv.status }}</span>
              </div>
            </div>

            <div class="card-body p-0 text-start">
              <div v-for="(item, idx) in inv.items" :key="idx" class="p-3 border-bottom d-flex align-items-center bg-white">
                <img :src="item.image || 'https://placehold.co/80x80?text=No+Image'" 
                     class="rounded border" 
                     style="width: 80px; height: 80px; object-fit: cover;"
                     @error="(e) => e.target.src = 'https://placehold.co/80x80?text=No+Image'">
                
                <div class="ms-3 flex-grow-1">
                  <div class="fw-bold text-dark">{{ item.name }}</div>
                  <div class="small text-muted">Phân loại: {{ item.color || 'Mặc định' }}, Size: {{ item.size || 'Mặc định' }} | x{{ item.quantity }}</div>
                </div>
                <div class="text-end fw-bold text-pink">
                  {{ Number(item.price).toLocaleString() }}đ
                </div>
              </div>
            </div>

            <div class="card-footer bg-white p-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="small text-muted">
                   <i class="bi bi-wallet2 me-1"></i> {{ inv.method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Đã thanh toán qua ngân hàng' }}
                </div>
                <div class="text-end">
                  <div class="mb-3">
                    <span class="me-2 text-muted small">Tổng số tiền:</span>
                    <span class="fs-3 fw-bold text-pink">₫{{ inv.total.toLocaleString() }}</span>
                  </div>
                  <div class="d-flex gap-2 justify-content-end">
                    <button v-if="inv.status.toLowerCase().includes('hoàn thành')" 
                            @click="handleRepurchase(inv)" 
                            class="btn btn-outline-dark btn-sm px-4">
                      Mua Lại
                    </button>
                    <router-link :to="'/order-detail/' + inv.id" class="btn btn-pink-action btn-sm px-4 text-white text-decoration-none shadow-sm">
                      Xem chi tiết
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5 bg-white rounded shadow-sm border">
          <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb92339317001517efc083620583.png" 
               style="width: 100px; opacity: 0.6;" class="mb-3">
          <p class="text-muted fs-5">Chưa có đơn hàng nào ở mục này.</p>
          <router-link to="/home" class="btn btn-pink-action px-5 py-2 mt-2 text-white text-decoration-none">Tiếp tục mua sắm</router-link>
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
const activeTab = ref('Tất cả')
const searchQuery = ref('')
const tabs = ['Tất cả', 'Vận chuyển', 'Hoàn thành', 'Đã hủy']

const user = JSON.parse(localStorage.getItem('user_login')) || 
             JSON.parse(localStorage.getItem('currentUser')) || 
             JSON.parse(localStorage.getItem('user')) || {}

const filteredInvoices = computed(() => {
  let list = (store.invoices.value || []).filter(inv => String(inv.userId) === String(user.id))

  // Lọc tab dùng chuẩn hóa chuỗi để khớp "Đang vận chuyển" vào tab "Vận chuyển"
  if (activeTab.value !== 'Tất cả') {
    list = list.filter(inv => {
      const s = inv.status.trim().toLowerCase()
      const t = activeTab.value.trim().toLowerCase()
      return s.includes(t)
    })
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(inv => 
      inv.id.toLowerCase().includes(q) || 
      inv.items.some(item => item.name.toLowerCase().includes(q))
    )
  }

  return list.reverse()
})

const handleRepurchase = (inv) => {
  inv.items.forEach(item => {
    store.addToCart({ ...item, quantity: 1 })
  })
  router.push('/cart')
}
</script>

<style scoped>
.text-pink { color: #f28da8; }
.btn-pink-action { background-color: #f28da8; border: none; }
.tab-item { border-bottom: 2px solid transparent; font-size: 14px; transition: 0.2s; color: #555; }
.tab-item:hover { color: #f28da8; }
.active-tab { color: #f28da8; border-bottom: 2px solid #f28da8; font-weight: bold; }
.cursor-pointer { cursor: pointer; }
</style>