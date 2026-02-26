<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../../composables/useDataStore'

const router = useRouter()
const { getAllAccounts } = useDataStore()
const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    alert('Vui lòng nhập đầy đủ tài khoản và mật khẩu!')
    return
  }

  const allAccounts = getAllAccounts()
  const user = allAccounts.find(
    (a) => a.username === username.value && String(a.password) === String(password.value),
  )

  if (user) {
    if (user.status === false) {
      alert('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin!')
      return
    }

    localStorage.setItem('user', JSON.stringify(user))

    if (user.role === 0) {
      alert('Chào mừng Admin quay trở lại!')
      router.push('/admin')
    } else if (user.role === 2) {
      alert('Chào mừng nhân viên! Chuyển tới quầy bán hàng.')
      router.push({ path: '/admin', query: { tab: 'sales' } })
    } else {
      alert('Đăng nhập thành công!')
      router.push('/home')
    }
  } else {
    alert('Sai tài khoản hoặc mật khẩu!')
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h3 class="title">ĐĂNG NHẬP</h3>

      <div class="form-group">
        <label>Tài khoản</label>
        <input
          v-model="username"
          @keyup.enter="handleLogin"
          type="text"
          class="form-control"
          placeholder="Nhập username"
        />
      </div>

      <div class="form-group">
        <label>Mật khẩu</label>
        <div class="input-group">
          <input
            v-model="password"
            @keyup.enter="handleLogin"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            placeholder="Nhập mật khẩu"
          />
          <button class="btn-toggle" type="button" @click="showPassword = !showPassword">
            <span v-if="!showPassword">🙈</span>
            <span v-else>🙉</span>
          </button>
        </div>
      </div>

      <button @click="handleLogin" class="btn-login">Vào hệ thống</button>

      <p class="register-link">
        Chưa có tài khoản?
        <router-link to="/register">Đăng ký</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000, #1a1a1a);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
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
}

.form-control {
  background: #1c1c1c;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  padding: 10px 12px;
}

.form-control::placeholder {
  color: #888;
}

.form-control:focus {
  background: #1c1c1c;
  border-color: #ffb6c1;
  box-shadow: 0 0 0 0.15rem rgba(255, 182, 193, 0.25);
  color: #fff;
}

.input-group {
  display: flex;
}

.btn-toggle {
  background: #1c1c1c;
  border: 1px solid #333;
  border-left: none;
  color: #ffb6c1;
  padding: 0 12px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}

.btn-login {
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffb6c1, #ffd1dc);
  color: #000;
  font-weight: bold;
  margin-top: 10px;
  transition: 0.3s;
}

.btn-login:hover {
  background: linear-gradient(135deg, #ffd1dc, #ffb6c1);
  transform: translateY(-1px);
}

.register-link {
  text-align: center;
  margin-top: 15px;
  color: #ccc;
  font-size: 14px;
}

.register-link a {
  color: #ffb6c1;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
