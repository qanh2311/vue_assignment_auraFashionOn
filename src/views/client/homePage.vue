<template>
  <HeaderLayout>
    <div class="home-page">
      <section class="banner-slider">
        <div
          id="mainCarousel"
          class="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#mainCarousel"
              data-bs-slide-to="0"
              class="active"
            ></button>
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="2"></button>
          </div>

          <div class="carousel-inner">
            <div class="carousel-item active">
              <img src="/images/banner (1).jpg" class="d-block w-100 banner-img" alt="Banner 1" />
            </div>
            <div class="carousel-item">
              <img src="/images/banner (2).jpg" class="d-block w-100 banner-img" alt="Banner 2" />
            </div>
            <div class="carousel-item">
              <img src="/images/banner (3).jpg" class="d-block w-100 banner-img" alt="Banner 3" />
            </div>
            <div class="carousel-item">
              <img src="/images/banner (4).jpg" class="d-block w-100 banner-img" alt="Banner 4" />
            </div>
          </div>

          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>

        <div class="search-bar-container">
          <div class="container">
            <div class="search-box-wrap d-flex shadow-lg">
              <input v-model="keyword" type="text" placeholder="Bạn muốn tìm sản phẩm gì ?" />
              <button class="btn-search-black px-4">Tìm kiếm ngay</button>
            </div>
          </div>
        </div>
      </section>

      <section class="container-fluid px-md-5 mt-5 pt-5">
        <div class="row g-4">
          <div
            class="col-md-6 col-12"
            v-for="(title, index) in ['THANH', 'NÀNG Ý', 'BẢN SẮC', 'MẢNH KÝ ỨC']"
            :key="index"
          >
            <div class="sub-banner-card">
              <div class="img-wrapper">
                <img :src="`/images/banner (${index + 1}).jpg`" class="img-fluid" :alt="title" />
                <div class="overlay-info">
                  <h2 class="collection-title">{{ title }}</h2>
                  <span class="shop-now-btn">XEM CHI TIẾT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="container py-5 mt-5">
        <h3 class="section-title text-center mb-5">SẢN PHẨM MỚI NHẤT</h3>

        <div class="row g-4">
          <div class="col-md-3 col-6" v-for="p in products" :key="p.id">
            <div class="product-item" @click="goToDetail(p)">
              <div class="product-thumb">
                <img
                  :src="p.images && p.images.length > 0 ? p.images[0] : '/images/no-image.png'"
                  class="img-fluid"
                  :alt="p.name"
                />
              </div>
              <div class="product-body text-center mt-3">
                <p class="product-name text-truncate">{{ p.name }}</p>
                <p class="product-price">{{ p.price?.toLocaleString() }}đ</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </HeaderLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../../composables/useDataStore'
import HeaderLayout from '../../layouts/header.vue'

const router = useRouter()
const { products: allProductsRef } = useDataStore()

const keyword = ref('')
const currentUser = JSON.parse(localStorage.getItem('currentUser'))

const allProducts = computed(() => {
  return allProductsRef.value.filter((p) => p.status === true)
})

const products = computed(() => {
  return allProducts.value.filter((p) => {
    // Kiểm tra nếu p.name tồn tại thì mới lọc, không thì bỏ qua sản phẩm đó
    return p.name && p.name.toLowerCase().includes(keyword.value.toLowerCase())
  })
})

// map category → slug
const categoryToSlug = {
  Váy: 'vay',
  'Chân váy': 'chan-vay',
  Áo: 'ao',
  Quần: 'quan',
}

const goToDetail = (product) => {
  if (!currentUser) {
    router.push('/login')
    return
  }

  const slug = categoryToSlug[product.category] || 'all'

  router.push(`/user/${currentUser.id}/category/${slug}/product/${product.id}`)
}
</script>

<style scoped>
.home-page {
  background: #0f0f14;
  min-height: 100vh;
  color: #fff;
}

/* 1. Hero Banner */
.banner-slider {
  position: relative;
}
.banner-img {
  height: 600px;
  width: 100%;
  object-fit: cover;
}

/* Hiệu ứng Fade chuyển cảnh mượt mà */
.carousel-fade .carousel-item {
  opacity: 0;
  transition-duration: 0.8s;
  transition-property: opacity;
}
.carousel-fade .carousel-item.active {
  opacity: 1;
}

/* 2. Search Bar */
.search-bar-container {
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 100%;
  z-index: 10;
}
.search-box-wrap {
  background: #fff;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 4px;
  overflow: hidden;
}
.search-box-wrap input {
  flex: 1;
  border: none;
  padding: 18px 25px;
  outline: none;
  color: #333;
}
.btn-search-black {
  background: #1a1a22;
  color: #fff;
  border: none;
  font-weight: 600;
  text-transform: uppercase;
}

/* 3. 4 Banner con */
.sub-banner-card {
  height: 450px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}
.img-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1s ease;
}
.sub-banner-card:hover img {
  transform: scale(1.1);
}
.overlay-info {
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 2;
}
.collection-title {
  font-size: 35px;
  font-weight: 800;
  letter-spacing: 4px;
}
.shop-now-btn {
  font-size: 12px;
  border-bottom: 2px solid #ff9eb5;
  padding-bottom: 5px;
}
.img-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 60%);
}

/* 4. Product List */
.section-title {
  color: #ff9eb5;
  font-weight: bold;
  letter-spacing: 5px;
  text-transform: uppercase;
}
.product-item {
  transition: 0.4s;
  background: #1a1a22;
  padding: 12px;
  border-radius: 12px;
}
.product-thumb {
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: #1a1a22;
}
.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-name {
  color: #ccc;
  font-size: 14px;
  margin-top: 10px;
}
.product-price {
  color: #ff9eb5;
  font-weight: bold;
  font-size: 17px;
}

@media (max-width: 768px) {
  .banner-img {
    height: 350px;
  }
  .sub-banner-card {
    height: 280px;
  }
  .search-bar-container {
    position: relative;
    bottom: 0;
    margin-top: 20px;
    padding: 0 15px;
  }
}
</style>
