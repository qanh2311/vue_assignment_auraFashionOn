```vue
<script setup>
import { useRouter } from 'vue-router'
import { defineProps, defineEmits } from 'vue'

const router = useRouter()

const props = defineProps({
  activeTab: String,
  showSidebar: Boolean,
})

const emit = defineEmits(['update:activeTab', 'update:showSidebar'])

const user = JSON.parse(localStorage.getItem('user') || 'null')

function selectTab(tab) {
  emit('update:activeTab', tab)
  emit('update:showSidebar', false)
}

/* LOGOUT THẬT */
function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('user_login')

  router.replace('/login')
}
</script>
```

<template>
  <div :class="['sidebar p-4 shadow-lg', { 'mobile-active': props.showSidebar }]">
    <h3 class="mb-5 fw-bold text-center brand-title">AURA FASHION ON</h3>

    <div class="nav flex-column nav-pills gap-3">
      <button
        v-if="user && user.role === 0"
        @click="selectTab('invoices')"
        :class="['nav-link-custom', { active: props.activeTab === 'invoices' }]"
      >
        Quản lý Hóa đơn
      </button>

      <button
        v-if="user && user.role === 0"
        @click="selectTab('users')"
        :class="['nav-link-custom', { active: props.activeTab === 'users' }]"
      >
        Quản Lý Tài khoản
      </button>

      <button
        v-if="user && user.role === 0"
        @click="selectTab('employees')"
        :class="['nav-link-custom', { active: props.activeTab === 'employees' }]"
      >
        Quản lý Nhân viên
      </button>

      <button
        v-if="user && user.role === 0"
        @click="selectTab('products')"
        :class="['nav-link-custom', { active: props.activeTab === 'products' }]"
      >
        Quản Lý Sản phẩm
      </button>

      <button
        @click="selectTab('sales')"
        :class="['nav-link-custom', { active: props.activeTab === 'sales' }]"
      >
        Bán hàng tại quầy
      </button>
    </div>

    <div class="mt-auto pt-4 border-top border-dark">
      <button class="btn-logout" @click="logout">Đăng xuất</button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  /* Tăng độ rộng menu lên 300px */
  width: 300px;
  height: 100vh;
  background: #111;
  border-right: 1px solid #222;
  transition: 0.3s;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.brand-title {
  color: #ffb6c1;
  letter-spacing: 3px;
  font-size: 1.6rem;
  text-transform: uppercase;
}

.nav-link-custom {
  background: transparent;
  border: 1px solid transparent;
  color: #ddd;
  text-align: left;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  transition: 0.3s;
  cursor: pointer;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-link-custom:hover {
  background: #1c1c1c;
  color: #ffb6c1;
}

.nav-link-custom.active {
  background: linear-gradient(135deg, #ffb6c1, #ffd1dc);
  color: #000;
  font-weight: bold;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.2);
}

.btn-logout {
  display: block;
  width: 100%;
  padding: 14px;
  border: 1px solid #333;
  border-radius: 12px;
  background: transparent;
  color: #ffb6c1;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-logout:hover {
  background: rgba(255, 182, 193, 0.1);
  border-color: #ffb6c1;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -300px;
  }
  .sidebar.mobile-active {
    left: 0;
  }
}
</style>
