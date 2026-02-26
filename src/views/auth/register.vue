<template>
  <div class="register-page">
    <div class="register-card">
      <h3 class="title">ĐĂNG KÝ</h3>

      <div class="form-group">
        <label>Họ và tên</label>
        <input v-model="fullname" class="form-control" placeholder="Nhập họ tên đầy đủ" />
      </div>

      <div class="form-group">
        <label>Tài khoản</label>
        <input v-model="username" class="form-control" placeholder="Nhập username" />
      </div>

      <div class="form-group">
        <label>Mật khẩu</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          placeholder="Nhập mật khẩu"
        />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" class="form-control" placeholder="example@gmail.com" />
      </div>

      <div class="form-group">
        <label>Số điện thoại</label>
        <input v-model="phone" class="form-control" placeholder="0123456789" />
      </div>

      <button @click="handleRegister" class="btn-register">Đăng ký</button>

      <p class="login-link">
        Đã có tài khoản?
        <router-link to="/login">Đăng nhập</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../../composables/useDataStore'

const router = useRouter()
const { users } = useDataStore()
const fullname = ref('')
const username = ref('')
const password = ref('')
const email = ref('')
const phone = ref('')

const handleRegister = () => {
  if (!username.value || !password.value || !fullname.value) {
    alert('Vui lòng nhập đủ Họ tên, Tài khoản và Mật khẩu!')
    return
  }

  // Check if username already exists
  const isExisted = users.value.some((u) => u.username === username.value)

  if (isExisted) {
    alert('Tên tài khoản đã tồn tại!')
    return
  }

  const newUser = {
    id: Date.now().toString(),
    username: username.value,
    fullname: fullname.value,
    password: password.value,
    email: email.value || '',
    phone: phone.value || '',
    avatar: 'https://i.pravatar.cc/150?u=' + Date.now(),
    role: 1,
    status: true,
  }

  users.value.push(newUser)
  alert('Đăng ký thành công! Hãy đăng nhập.')
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000, #1a1a1a);
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-card {
  background: #111;
  padding: 30px 28px;
  width: 380px;
  border-radius: 16px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
  border: 1px solid #222;
}

.title {
  text-align: center;
  color: #ffb6c1; /* hồng kem */
  font-weight: bold;
  margin-bottom: 25px;
  letter-spacing: 1px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  color: #ddd;
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
}

.form-control {
  background: #1c1c1c;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  width: 100%;
}

.form-control::placeholder {
  color: #888;
}

.form-control:focus {
  background: #1c1c1c;
  border-color: #ffb6c1;
  box-shadow: 0 0 0 0.15rem rgba(255, 182, 193, 0.25);
  color: #fff;
  outline: none;
}

.btn-register {
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffb6c1, #ffd1dc);
  color: #000;
  font-weight: bold;
  margin-top: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-register:hover {
  background: linear-gradient(135deg, #ffd1dc, #ffb6c1);
  transform: translateY(-1px);
}

.login-link {
  text-align: center;
  margin-top: 15px;
  color: #ccc;
  font-size: 14px;
}

.login-link a {
  color: #ffb6c1;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
