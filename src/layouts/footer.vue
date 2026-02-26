<template>
  <footer class="footer-container">
    <div class="container">
      <div class="row py-5">
        <div class="col-md-6 mb-6">
          <h5 class="fw-bold mb-3 text-pink">AURA FASHION</h5>
          <p class="text-pink-light small">
            Chuyên cung cấp các mẫu thời trang mới nhất, dẫn đầu xu hướng với chất lượng hàng đầu. 
            Nâng tầm phong cách cùng Aura.
          </p>
          <div class="social-icons mt-4">
            <a href="https://www.facebook.com/share/1FLy6vqSJP/" class="social-item">FB</a>
            <a href="#" class="social-item">IG</a>
            <a href="#" class="social-item">TT</a>
          </div>
        </div>

        <div class="col-md-6 mb-6">
          <h5 class="fw-bold mb-3 text-pink">Liên hệ</h5>
          <div class="contact-info small">
            <p class="mb-2"><span class="icon-pink"></span>Số 13 Trịnh Văn Bô, Hà Nội</p>
            <p class="mb-2"><span class="icon-pink"></span>Hotline: 0337 37 69 26</p>
            <p class="mb-2"><span class="icon-pink"></span>Email: anhptqth05962@gmail.com</p>
            <p class="mb-0"><span class="icon-pink"></span>Online : 7:00 - 11:00</p>
          </div>
        </div>
      </div>

      <div class="border-top-pink py-3 text-center">
        <small class="text-pink-muted">© 2026 Aura Fashion. Hello and see ya :).</small>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Tổng thể nền đen */
.footer-container {
  background-color: #0f0f14; /* Màu đen sâu giống trang account */
  background-color: #0f0f14; /* Màu đen sâu giống trang account */
  border-top: 1px solid #ff9eb533;
  margin-top: auto;
  color: #ffe4ec;
}

/* Màu chữ hồng kem */
.text-pink {
  color: #ff9eb5 !important;
  letter-spacing: 1.5px;
}

.text-pink-light {
  color: #ffd1dc;
  line-height: 1.6;
}

.text-pink-muted {
  color: #ff9eb588;
}

/* Link danh mục */
.footer-link {
  text-decoration: none;
  color: #ffd1dc;
  line-height: 2.2;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #ff9eb5;
  transform: translateX(5px); /* Hiệu ứng lướt nhẹ khi hover */
  text-shadow: 0 0 8px rgba(255, 158, 181, 0.5);
}

/* Social Icons */
.social-icons .social-item {
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
  color: #1a1a1a;
  background: #ff9eb5;
  padding: 8px 12px;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 12px;
  transition: 0.3s;
}

.social-icons .social-item:hover {
  background: #fff;
  color: #ff9eb5;
  box-shadow: 0 0 15px rgba(255, 158, 181, 0.6);
  transform: translateY(-3px);
}

/* Thông tin liên hệ */
.icon-pink {
  margin-right: 8px;
  filter: drop-shadow(0 0 2px #ff9eb5);
}

.border-top-pink {
  border-top: 1px solid #ff9eb522;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .text-md-center {
    text-align: left !important;
  }
}
</style>