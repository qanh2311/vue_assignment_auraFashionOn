<template>
  <HeaderLayout>
    <div v-if="product" class="product-detail-page container py-4">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <router-link to="/home" class="text-decoration-none text-dark">Trang chủ</router-link>
          </li>
          <li class="breadcrumb-item">
            <a href="#" class="text-decoration-none text-dark">{{ product.category }}</a>
          </li>
          <li class="breadcrumb-item active text-muted" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="row g-4">
        <div class="col-lg-7">
          <div class="row g-2">
            <div class="col-2 d-none d-md-block">
              <div class="thumb-gallery">
                <div
                  v-for="(img, index) in product.images"
                  :key="index"
                  class="thumb-item mb-2"
                  :class="{ active: selectedImage === img }"
                  @click="selectedImage = img"
                >
                  <img :src="img" class="img-fluid" :alt="product.name" />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-10">
              <div class="main-image-wrapper">
                <img
                  :src="selectedImage || product.images[0]"
                  class="img-fluid w-100"
                  :alt="product.name"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5 ps-lg-5">
          <h1 class="product-name h3 fw-bold text-uppercase mb-2">{{ product.name }}</h1>
          
          <div class="product-meta d-flex align-items-center gap-3 mb-3">
            <span class="small text-muted">SKU: {{ product.id }}</span>
            <div class="rating small">
              <span class="text-warning">★★★★★</span>
              <span class="text-muted ms-1">(0 Nhận xét)</span>
            </div>
          </div>

          <h2 class="product-price text-danger fw-bold mb-4">
            {{ product.price?.toLocaleString() }}đ
          </h2>

          <div class="option-section mb-4" v-if="product.colors?.length">
            <label class="fw-bold d-block mb-2 small">
              Màu sắc: <span class="fw-normal">{{ selectedColor }}</span>
            </label>
            <div class="d-flex gap-2">
              <button
                v-for="color in product.colors"
                :key="color"
                class="btn btn-outline-dark btn-sm rounded-0 px-3"
                :class="{ active: selectedColor === color }"
                @click="selectedColor = color"
              >
                {{ color }}
              </button>
            </div>
          </div>

          <div class="option-section mb-4" v-if="product.sizes?.length">
            <label class="fw-bold d-block mb-2 small">
              Size: <span class="fw-normal">{{ selectedSize }}</span>
            </label>
            <div class="d-flex gap-2">
              <button
                v-for="size in product.sizes"
                :key="size"
                class="btn btn-outline-dark btn-sm rounded-0 px-4"
                :class="{ active: selectedSize === size }"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="quantity-section d-flex align-items-center gap-3 mb-4">
            <label class="fw-bold small">Số lượng:</label>
            <div class="input-group" style="width: 120px">
              <button class="btn btn-outline-secondary border-dark" @click="qty > 1 ? qty-- : 1">-</button>
              <input type="text" class="form-control text-center border-dark" v-model.number="qty" />
              <button class="btn btn-outline-secondary border-dark" @click="qty++">+</button>
            </div>
          </div>

          <div class="action-buttons d-grid gap-2 mb-5">
            <button @click="addToCart" class="btn btn-outline-dark py-3 fw-bold rounded-0 text-uppercase">
              Thêm vào giỏ hàng
            </button>
            <!-- <button class="btn btn-dark py-3 fw-bold rounded-0 text-uppercase">Mua ngay</button> -->
          </div>

          <div class="product-description border-top pt-4">
            <h5 class="fw-bold text-uppercase mb-3 small" style="letter-spacing: 1px;">Mô tả sản phẩm</h5>
            <div 
              class="description-content text-muted small lh-lg" 
              v-html="product.description || 'Thông tin sản phẩm đang được cập nhật...'"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container py-5 text-center">
      <h3 class="text-muted">Sản phẩm không tồn tại hoặc đã bị xóa.</h3>
      <router-link to="/home" class="btn btn-dark mt-3 px-4">Quay lại trang chủ</router-link>
    </div>
  </HeaderLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDataStore } from '../../composables/useDataStore'
import HeaderLayout from '../../layouts/header.vue'

const route = useRoute()
const store = useDataStore()

// Lấy ID từ route params
const productId = computed(() => route.params.id)

// Tìm sản phẩm
const product = computed(() => {
  return store.products.value.find(p => String(p.id) === String(productId.value)) || null
})

const selectedImage = ref('')
const selectedColor = ref('')
const selectedSize = ref('')
const qty = ref(1)

const syncData = () => {
  if (product.value) {
    selectedImage.value = product.value.images?.[0] || ''
    selectedColor.value = product.value.colors?.[0] || ''
    selectedSize.value = product.value.sizes?.[0] || ''
    qty.value = 1
  }
}

watch(() => productId.value, syncData, { immediate: true })

const addToCart = () => {
  if (!product.value) return

  const item = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: selectedImage.value || product.value.images[0],
    color: selectedColor.value,
    size: selectedSize.value,
    quantity: qty.value,
  }

  store.addToCart(item)
}
</script>

<style scoped>
.breadcrumb { font-size: 13px; }
.thumb-gallery { max-height: 500px; overflow-y: auto; scrollbar-width: none; }
.thumb-gallery::-webkit-scrollbar { display: none; }

.thumb-item { 
  cursor: pointer; 
  border: 1px solid #eee; 
  opacity: 0.6; 
  transition: 0.3s; 
}
.thumb-item img { aspect-ratio: 3/4; object-fit: cover; }
.thumb-item.active { border-color: #000; opacity: 1; }

.main-image-wrapper img { 
  aspect-ratio: 3/4; 
  object-fit: cover; 
  background: #f9f9f9; 
}

.btn-outline-dark.active { 
  background-color: #000 !important; 
  color: #fff !important; 
}

.description-content {
  white-space: pre-line; /* Hiển thị xuống dòng cho văn bản thuần */
}

/* Tinh chỉnh phần mô tả cho chuyên nghiệp hơn */
.product-description h5 {
  border-left: 3px solid #000;
  padding-left: 10px;
}
</style>