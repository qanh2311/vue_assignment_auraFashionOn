import { createRouter, createWebHistory } from 'vue-router'

// --- 1. IMPORT CÁC COMPONENT ---
// Auth
import Login from '../views/auth/login.vue'
import Register from '../views/auth/register.vue'

// Client
import Home from '../views/client/HomePage.vue'
import AccountInfo from '../views/client/accountInfo.vue'
import CategoryPage from '../views/client/CategoryPage.vue'
import ProductDetail from '../views/client/productDetail.vue'
import Cart from '../views/client/cart.vue'
import Checkout from '../views/client/checkout.vue'
import MyOrders from '../views/client/orders.vue' // <-- THÊM DÒNG NÀY (Tạo file orders.vue)

// Admin
import Dashboard from '../views/admin/adminPage.vue'

// --- 2. ĐỊNH NGHĨA DANH SÁCH ROUTES ---
const routes = [
  // Mặc định chuyển hướng về Login
  { path: '/', redirect: '/login' },

  // Nhóm route xác thực (Auth)
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },

  // Nhóm route dành cho khách hàng (Client)
  { path: '/home', name: 'Home', component: Home },
  { path: '/account', name: 'Account', component: AccountInfo },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/orders', name: 'MyOrders', component: MyOrders }, // <-- ROUTE ĐƠN HÀNG MỚI
  { path: '/category/:slug', name: 'Category', component: CategoryPage },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail },
  {path: '/order-detail/:id',name: 'OrderDetail',component: () => import('../views/client/orderDetail.vue'),},

  // Nhóm route dành cho quản trị (Admin/Staff)
  { path: '/admin', name: 'Admin', component: Dashboard },
]

// --- 3. KHỞI TẠO ROUTER ---
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 } // Cuộn lên đầu trang khi chuyển link
  },
})

// --- 4. LOGIC BẢO VỆ ROUTE (NAVIGATION GUARD) ---
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  // Tự động tìm user từ các key phổ biến nhất
  const user =
    JSON.parse(localStorage.getItem('user_login')) ||
    JSON.parse(localStorage.getItem('currentUser')) ||
    JSON.parse(localStorage.getItem('user'))

  // 1. Nếu trang yêu cầu đăng nhập mà chưa login -> Về Login
  if (authRequired && !user) {
    next('/login')
    return
  }

  // 2. Nếu đã login mà cố tình vào lại trang Login/Register -> Về Home
  if (user && publicPages.includes(to.path)) {
    next('/home')
    return
  }

  // 3. Bảo vệ khu vực Admin
  if (to.path.startsWith('/admin')) {
    // Role 0: Admin, Role 2: Staff/Employee
    if (user && (user.role === 0 || user.role === 2)) {
      next()
    } else {
      next('/home') // Không có quyền thì về trang chủ khách hàng
    }
    return
  }

  next()
})

export default router
