<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import FooterComponent from './footer.vue'

const router = useRouter()
const user = ref(null)
const cartCount = ref(0) 
const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const DEFAULT_AVATAR = 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'

const loadUserData = () => {
  // Lấy user từ các key đăng nhập bạn đang dùng
  const storedUser = localStorage.getItem('user_login') || localStorage.getItem('currentUser') || localStorage.getItem('user')
  if (storedUser) user.value = JSON.parse(storedUser)
}

// ===== SỬA LOGIC TÍNH TỔNG GIỎ HÀNG TẠI ĐÂY =====
const updateCartCount = () => {
  // 1. Xác định user đang đăng nhập
  const currentUser = JSON.parse(localStorage.getItem('user_login')) || 
                      JSON.parse(localStorage.getItem('currentUser')) || 
                      JSON.parse(localStorage.getItem('user'))

  if (currentUser && currentUser.id) {
    // 2. Lấy giỏ hàng tổng từ localStorage
    const allCarts = JSON.parse(localStorage.getItem('all_user_carts')) || {}
    // 3. Lấy đúng giỏ hàng của user hiện tại
    const userCart = allCarts[currentUser.id] || []
    
    // 4. Cộng dồn số lượng (quantity) của từng món
    cartCount.value = userCart.reduce((total, item) => total + Number(item.quantity), 0)
  } else {
    cartCount.value = 0
  }
}

const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value)

const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('user_login')
  localStorage.removeItem('currentUser')
  user.value = null
  isDropdownOpen.value = false
  router.push('/login')
}

onMounted(() => {
  loadUserData()
  updateCartCount()
  window.addEventListener('user-updated', loadUserData)
  window.addEventListener('cart-updated', updateCartCount)
  
  window.addEventListener('click', () => {
    isDropdownOpen.value = false
  })
})

onUnmounted(() => {
  window.removeEventListener('user-updated', loadUserData)
  window.removeEventListener('cart-updated', updateCartCount)
})
</script>

<template>
  <div class="main-layout">
    <header class="header sticky-top">
      <div class="container d-flex align-items-center justify-content-between py-2">
        <button class="menu-toggle d-md-none" @click="toggleMenu">
          <span class="bar" :class="{ 'open': isMenuOpen }"></span>
          <span class="bar" :class="{ 'open': isMenuOpen }"></span>
          <span class="bar" :class="{ 'open': isMenuOpen }"></span>
        </button>

        <div class="logo">
          <router-link to="/home" class="no-style">
            <img src="/images/logo.png" class="logo-img" alt="Logo" onerror="this.src='https://placehold.co/300x100/1a1a22/ff9eb5?text=AURA+FASHION'" />
          </router-link>
        </div>

        <nav class="menu" :class="{ 'mobile-open': isMenuOpen }">
          <router-link to="/home" class="nav-link" @click="isMenuOpen = false">Trang chủ</router-link>
          <router-link to="/category/vay" class="nav-link" @click="isMenuOpen = false">Váy</router-link>
          <router-link to="/category/chan-vay" class="nav-link" @click="isMenuOpen = false">Chân váy</router-link>
          <router-link to="/category/ao" class="nav-link" @click="isMenuOpen = false">Áo</router-link>
          <router-link to="/category/quan" class="nav-link" @click="isMenuOpen = false">Quần</router-link>
        </nav>

        <div class="d-flex align-items-center gap-3">
          <router-link to="/cart" class="no-style position-relative p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ff9eb5" class="bi bi-bag" viewBox="0 0 16 16">
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
            </svg>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>

          <div class="account-zone position-relative" @click.stop="isDropdownOpen = !isDropdownOpen">
            <div class="d-flex align-items-center cursor-pointer">
              <div class="nav-avatar-circle">
                <img :src="user?.avatar || DEFAULT_AVATAR" class="img-fluid" alt="avatar">
              </div>
              <div class="nav-user-text ms-2 text-start d-none d-sm-block">
                <span class="d-block greeting">Xin chào,</span>
                <span class="user-name fw-bold text-truncate">{{ user?.fullname || user?.username || 'Tài khoản' }}</span>
              </div>
            </div>

            <div v-if="isDropdownOpen" class="my-dropdown-menu shadow-lg">
              <router-link to="/orders" class="drop-item">Đơn hàng của tôi</router-link>
              <router-link to="/account" class="drop-item">Thông tin tài khoản</router-link>
              <div class="drop-divider"></div>
              <div class="drop-item text-danger" @click="handleLogout">Đăng xuất</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isMenuOpen" class="menu-overlay" @click="isMenuOpen = false"></div>
    </header>

    <main class="content-area">
      <slot /> 
    </main>

    <FooterComponent />
  </div>
</template>

<style scoped>
.cart-badge { position: absolute; top: 0; right: -2px; background-color: #ff4d4f; color: white; font-size: 10px; min-width: 16px; height: 16px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; }
.no-style, .nav-link, .user-name { text-decoration: none !important; color: inherit; border: none; outline: none; }
.header { background-color: #1a1a22; border-bottom: 1px solid rgba(255, 158, 181, 0.1); z-index: 1050; height: 80px; display: flex; align-items: center; }
.content-area { flex: 1; }
.logo-img { height: 55px; }
.menu { display: flex; gap: 30px; }
.nav-link { color: #ffd1dc !important; font-weight: 600; font-size: 13px; text-transform: uppercase; transition: 0.3s; }
.nav-link:hover, .router-link-active { color: #ff9eb5 !important; }
.nav-avatar-circle { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid #ff9eb5; overflow: hidden; }
.greeting { font-size: 10px; color: rgba(255, 158, 181, 0.7); display: block; }
.user-name { font-size: 13px; color: #ff9eb5 !important; max-width: 110px; display: block; }
.menu-toggle { background: none; border: none; display: flex; flex-direction: column; gap: 5px; padding: 10px; }
.bar { width: 25px; height: 2px; background: #ff9eb5; transition: 0.3s; }
.bar.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.bar.open:nth-child(2) { opacity: 0; }
.bar.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.cursor-pointer { cursor: pointer; }
.position-relative { position: relative; }

.my-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #1a1a22;
  border: 1px solid rgba(255, 158, 181, 0.2);
  border-radius: 4px;
  min-width: 180px;
  z-index: 9999;
  margin-top: 10px;
  padding: 5px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.drop-item {
  display: block;
  padding: 10px 20px;
  color: #ffd1dc !important;
  font-size: 13px;
  text-decoration: none !important;
  transition: 0.2s;
  cursor: pointer;
  text-align: left;
}

.drop-item:hover {
  background: rgba(255, 158, 181, 0.1);
  color: #ff9eb5 !important;
}

.drop-divider {
  height: 1px;
  background: rgba(255, 158, 181, 0.1);
  margin: 5px 0;
}

.text-danger { color: #ff4d4f !important; }

@media (max-width: 768px) {
  .header { height: 70px; }
  .menu {
    position: fixed; top: 0; left: -100%; width: 260px; height: 100vh;
    background: #1a1a22; flex-direction: column; padding: 80px 20px;
    transition: 0.4s ease; z-index: 1090; box-shadow: 5px 0 15px rgba(0,0,0,0.5);
  }
  .menu.mobile-open { left: 0; }
  .menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1080; }
}
</style>