<template>
  <HeaderLayout>
    <div class="order-detail-page" v-if="order" style="background-color: #f5f5f5; min-height: 100vh;">
      <div class="container py-4 text-start">
        
        <div class="d-flex justify-content-between align-items-center mb-3 bg-white p-3 shadow-sm rounded border">
          <button @click="router.back()" class="btn btn-link text-dark text-decoration-none p-0 fw-bold">
            <i class="bi bi-chevron-left me-1"></i> TRỞ LẠI
          </button>
          <div class="text-end">
            <span class="text-muted small">MÃ ĐƠN HÀNG: {{ order.id }}</span>
            <span class="text-pink fw-bold ms-3 border-start ps-3 text-uppercase">{{ order.status }}</span>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body py-5 text-center">
             <div class="d-flex justify-content-around position-relative">
                <div class="stepper-line"></div>
                <div class="step-box active">
                  <div class="icon-circle"><i class="bi bi-receipt"></i></div>
                  <p class="small mt-2 mb-0 fw-bold">Đơn Hàng Đã Đặt</p>
                  <span class="extra-small text-muted">{{ order.date }}</span>
                </div>
                <div class="step-box" :class="{ active: order.status.toLowerCase().includes('vận chuyển') || order.status.toLowerCase().includes('hoàn thành') }">
                  <div class="icon-circle"><i class="bi bi-truck"></i></div>
                  <p class="small mt-2 mb-0 fw-bold">Đang Vận Chuyển</p>
                </div>
                <div class="step-box" :class="{ active: order.status.toLowerCase().includes('hoàn thành') }">
                  <div class="icon-circle"><i class="bi bi-check2-circle"></i></div>
                  <p class="small mt-2 mb-0 fw-bold">Hoàn Thành</p>
                </div>
             </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-3 overflow-hidden">
          <div class="shopee-border-line"></div>
          <div class="card-body p-4">
            <h6 class="fw-bold mb-3"><i class="bi bi-geo-alt-fill text-pink me-2"></i>Địa Chỉ Nhận Hàng</h6>
            <div class="row">
              <div class="col-md-5">
                <div class="fw-bold fs-5 mb-1">{{ order.customer }}</div>
                <div class="text-muted small">{{ order.phone }}</div>
                <div class="text-muted small">{{ order.address }}</div>
              </div>
              <div class="col-md-7 border-start ps-4">
                <div class="log-container small">
                  <div class="log-item text-success fw-bold mb-2">
                    <i class="bi bi-check-circle-fill"></i> {{ order.status }}
                  </div>
                  <div class="log-item text-muted">Cảm ơn bạn đã mua sắm tại Aura Fashion! Đơn hàng của bạn đang được xử lý theo lộ trình chuẩn.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm overflow-hidden">
          <div v-for="(item, idx) in order.items" :key="idx" class="p-3 border-bottom d-flex align-items-center bg-white">
            <img :src="item.image || 'https://placehold.co/70x70?text=No+Image'" 
                 class="rounded border" 
                 style="width: 70px; height: 70px; object-fit: cover;"
                 @error="(e) => e.target.src = 'https://placehold.co/70x70?text=No+Image'">
            <div class="ms-3 flex-grow-1">
              <div class="fw-bold text-dark">{{ item.name }}</div>
              <div class="small text-muted">Phân loại: {{ item.color }}, {{ item.size }} | x{{ item.quantity }}</div>
            </div>
            <div class="fw-bold text-pink">{{ (item.price * item.quantity).toLocaleString() }}đ</div>
          </div>
          <div class="p-4 text-end bg-light-pink border-top">
            <div class="mb-1 small text-muted">Tổng tiền hàng: {{ (order.total - 30000).toLocaleString() }}đ</div>
            <div class="mb-1 small text-muted">Phí vận chuyển: 30.000đ</div>
            <div class="mt-2 fw-bold fs-3 text-pink">Thành tiền: ₫{{ order.total.toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </HeaderLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '../../composables/useDataStore'
import HeaderLayout from '../../layouts/header.vue'

const route = useRoute()
const router = useRouter()
const store = useDataStore()

const order = computed(() => {
  return store.invoices.value.find(inv => String(inv.id) === String(route.params.id))
})
</script>

<style scoped>
.text-pink { color: #f28da8; }
.bg-light-pink { background-color: #fffafa; border-top: 1px dashed #f28da8; }
.shopee-border-line {
  height: 3px; width: 100%;
  background-image: repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px);
  background-size: 116px 3px;
}
.stepper-line { position: absolute; top: 22px; left: 15%; right: 15%; height: 3px; background: #e0e0e0; z-index: 0; }
.icon-circle { 
  width: 44px; height: 44px; border-radius: 50%; background: #fff; 
  border: 3px solid #e0e0e0; display: flex; align-items: center; 
  justify-content: center; z-index: 1; margin: 0 auto; 
}
.step-box.active .icon-circle { border-color: #26a17b; color: #26a17b; background: #f0fff4; }
.step-box.active p { color: #26a17b; }
.extra-small { font-size: 10px; }
</style>