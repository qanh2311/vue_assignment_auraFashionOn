<template>
  <HeaderLayout>
    <div class="category-page container py-5">
      <div class="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <h2 class="category-title text-uppercase m-0">{{ categoryName }}</h2>
        <div class="product-count text-muted">
          Có <span class="fw-bold text-dark">{{ filteredProducts.length }}</span> sản phẩm
        </div>
      </div>

      <div class="row g-4">
        <div
          class="col-6 col-md-4 col-lg-3"
          v-for="p in filteredProducts"
          :key="p.id"
        >
          <div class="product-card" @click="goToDetail(p.id)">
            <div class="image-wrapper">
              <img :src="p.images[0]" :alt="p.name" class="img-fluid" />
            </div>
            <div class="product-info pt-3">
              <h3 class="name">{{ p.name }}</h3>
              <p class="price">{{ p.price?.toLocaleString() }}đ</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="text-center text-muted mt-5">
        Không có sản phẩm trong danh mục này
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
const { products } = useDataStore()

// map slug -> tên hiển thị
const categoryMapping = {
  vay: 'Váy',
  'chan-vay': 'Chân váy',
  ao: 'Áo',
  quan: 'Quần'
}

const categoryName = computed(() => {
  return categoryMapping[route.params.slug] || 'Sản phẩm'
})

// chuẩn hóa category để so sánh
const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    return normalize(p.category) === route.params.slug
  })
})

const goToDetail = (id) => {
  router.push(`/product/${id}`)
}
</script>

<style scoped>
.category-page {
  background: #fff;
  min-height: 100vh;
}
.category-title {
  font-size: 24px;
  font-weight: 700;
}
.product-card {
  cursor: pointer;
}
.image-wrapper {
  aspect-ratio: 3/4;
  overflow: hidden;
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.name {
  font-size: 14px;
}
.price {
  font-weight: bold;
  color: #ff4d4f;
}
</style>