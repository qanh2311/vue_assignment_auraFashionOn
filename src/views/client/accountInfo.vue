<template>
  <HeaderLayout>
    <div class="account-page py-5">
      <div class="container">
        <nav class="mb-5 text-center small opacity-75">
          <router-link to="/" class="text-pink text-decoration-none">Trang chủ</router-link> 
          <span class="mx-2 text-white">></span> 
          <span class="text-white">Tài khoản</span>
        </nav>

        <div class="row g-5 justify-content-center">
          <div class="col-md-4 text-center border-end-line">
            <div class="avatar-container mb-3 position-relative d-inline-block">
              <img 
                :src="user.avatar || DEFAULT_AVATAR" 
                class="rounded-circle profile-img cursor-pointer" 
                width="170" height="170" 
                @click="triggerFileInput"
              >
              <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleAvatarChange">
              <div class="camera-icon" @click="triggerFileInput">+</div>
            </div>
            <h4 class="fw-bold text-pink mt-3 text-uppercase">{{ user.fullname || user.username }}</h4>
            <button @click="handleLogout" class="btn-logout-minimal mt-2">Đăng xuất</button>
          </div>

          <div class="col-md-6 ps-md-5">
            <h3 class="form-title mb-5">THÔNG TIN TÀI KHOẢN</h3>
            
            <form @submit.prevent="handleUpdate" class="form-transparent">
              <div class="field-group mb-4">
                <label>Tên đăng nhập</label>
                <input :value="user.username" type="text" class="input-line line-disabled" disabled />
              </div>

              <div class="field-group mb-4">
                <label>Họ và tên</label>
                <input v-model="user.fullname" type="text" class="input-line" placeholder="Nhập họ tên..." />
              </div>

              <div class="field-group mb-4">
                <label>Địa chỉ Email</label>
                <input v-model="user.email" type="email" class="input-line" placeholder="email@example.com" />
              </div>

              <div class="field-group mb-4">
                <label>Số điện thoại</label>
                <input v-model="user.phone" type="text" class="input-line" placeholder="Số điện thoại liên hệ" />
              </div>

              <div class="field-group mb-5">
                <label>Mật khẩu mới</label>
                <div class="position-relative">
                  <input :type="showPass ? 'text' : 'password'" v-model="user.password" class="input-line" placeholder="Để trống nếu không muốn đổi" />
                  <span class="eye-toggle" @click="showPass = !showPass">
                    {{ showPass ? '🐵' : '🙈' }}
                  </span>
                </div>
              </div>

              <button class="btn-update-luxury w-100 py-3 fw-bold">
                CẬP NHẬT THÔNG TIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </HeaderLayout>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderLayout from '../../layouts/header.vue'

const DEFAULT_AVATAR = 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'
const router = useRouter()
const fileInput = ref(null)
const showPass = ref(false)

const user = reactive({
  id: '',
  username: '',
  fullname: '',
  email: '',
  phone: '',
  avatar: '',
  password: ''
})

onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  if (!storedUser) {
    router.push('/login')
  } else {
    Object.assign(user, storedUser)
  }
})

const triggerFileInput = () => { fileInput.value.click() }

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      user.avatar = e.target.result
      localStorage.setItem('user', JSON.stringify(user))
      window.dispatchEvent(new Event('user-updated'))
    }
    reader.readAsDataURL(file)
  }
}

const handleUpdate = () => {
  localStorage.setItem('user', JSON.stringify(user))
  window.dispatchEvent(new Event('user-updated'))
  alert('Cập nhật thành công!')
}

const handleLogout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.account-page { background:#0f0f14; min-height:100vh; color:#fff; }
.text-pink { color:#ff9eb5; }

/* Cột trái */
.border-end-line { border-right: 1px solid rgba(255, 158, 181, 0.1); }
.profile-img { border: 3px solid #ff9eb5; padding: 5px; object-fit: cover; }
.camera-icon { 
  position:absolute; bottom:8px; right:8px; background:#ff9eb5; 
  width:32px; height:32px; border-radius:50%; display:flex; 
  align-items:center; justify-content:center; cursor:pointer; font-size: 14px;
}
.btn-logout-minimal {
  background: transparent; border: 1px solid #ff9eb5;
  color: #ff9eb5; padding: 5px 25px; border-radius: 4px; transition: 0.3s;
}
.btn-logout-minimal:hover { background: #ff9eb5; color: #000; }

/* Form KHÔNG NỀN (Transparent) */
.form-title { 
  color: #ff9eb5; font-weight: 700; font-size: 22px; 
  border-bottom: 1px solid rgba(255, 158, 181, 0.2); 
  display: inline-block; padding-bottom: 10px;
}

.field-group label {
  display: block; color: #ff9eb5; font-size: 12px;
  font-weight: 600; text-transform: uppercase; margin-bottom: 5px;
  text-align: left;
}

.input-line {
  width: 100%; background: transparent; border: none;
  border-bottom: 1px solid rgba(255, 158, 181, 0.3);
  color: #ffffff !important;
  padding: 10px 0; font-size: 16px; transition: 0.3s;
}

.input-line:focus {
  outline: none; border-bottom-color: #ff9eb5;
  box-shadow: 0 4px 10px -5px rgba(255, 158, 181, 0.2);
}

.line-disabled { color: #666 !important; cursor: not-allowed; border-bottom-style: dashed; }

.btn-update-luxury {
  background: #ff9eb5; color: #1a1a22; border: none;
  letter-spacing: 1px; border-radius: 4px; transition: 0.3s;
}
.btn-update-luxury:hover { background: #ff7fa0; transform: translateY(-2px); }

.eye-toggle { position: absolute; right: 0; bottom: 10px; cursor: pointer; font-size: 18px; }
</style>