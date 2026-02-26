<script setup>
import { ref, computed } from 'vue'
import { useDataStore, listSizes, listColors, listCategories } from '../composables/useDataStore.js'

import ProductsView from './dashboard/ProductsView.vue'
import UsersView from './dashboard/UsersView.vue'
import SalesView from './dashboard/SalesView.vue'
import EmployeesView from './dashboard/EmployeesView.vue'
import InvoicesView from './dashboard/InvoicesView.vue'

/* ================= PROPS ================= */
const props = defineProps({
  activeTab: String,
  showSidebar: Boolean,
})
const emit = defineEmits(['update:showSidebar'])

/* ================= STORE ================= */
const {
  products,
  users,
  employees,
  invoices,
  addProduct,
  updateProduct,
  deleteProduct,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  toggleUserStatus,
  addInvoice,
} = useDataStore()

/* ================= UI STATE ================= */
const showModal = ref(false)
const modalTarget = ref('product')
const showGallery = ref(false)
const galleryImages = ref([])
const search = ref('')

/* ================= PRODUCT STATE ================= */
const isEditing = ref(false)
const formData = ref({})

/* ================= EMPLOYEE STATE ================= */
const employeeIsEditing = ref(false)
const employeeForm = ref({})

/* ================= EMPLOYEE MODAL ================= */
function openEmployeeModal(emp = null) {
  modalTarget.value = 'employee'

  // EDIT
  if (emp) {
    employeeIsEditing.value = true

    employeeForm.value = {
      id: emp.id,
      username: emp.username || '',
      password: emp.password || '123',
      fullname: emp.fullname || '',
      email: emp.email || '',
      phone: emp.phone || '',
      avatar: emp.avatar || `https://i.pravatar.cc/150?u=${emp.id}`,
      status: emp.status ?? true,
      role: 2,
      isEmployee: true,
    }
  }
  // ADD
  else {
    employeeIsEditing.value = false
    const id = Date.now().toString()

    employeeForm.value = {
      id,
      username: '',
      password: '123',
      fullname: '',
      email: '',
      phone: '',
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      status: true,
      role: 2,
      isEmployee: true,
    }
  }

  showModal.value = true
}
/* ================= HANDLE FILE UPLOAD ================= */
const handleFileUpload = (event) => {
  const files = event.target.files
  if (!files) return

  // Duyệt qua danh sách file được chọn
  Array.from(files).forEach((file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      // Đẩy base64 của ảnh vào mảng images
      if (!formData.value.images) {
        formData.value.images = []
      }
      formData.value.images.push(e.target.result)
    }

    reader.readAsDataURL(file)
  })
}
/* ================= PRODUCT MODAL ================= */
const openModal = (target, item = null) => {
  modalTarget.value = target

  if (item) {
    isEditing.value = true
    formData.value = { ...item }
  } else {
    isEditing.value = false
    formData.value = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      images: [],
      description: '',
      category: 'Áo',
      status: true,
      colors: [],
      sizes: [],
    }
  }

  showModal.value = true
}

/* ================= SAVE ================= */
const saveChanges = () => {
  try {
    /* ===== EMPLOYEE ===== */
    if (modalTarget.value === 'employee') {
      if (!employeeForm.value.username || !employeeForm.value.fullname) {
        alert('Vui lòng nhập username và họ tên!')
        return
      }

      const payload = {
        id: String(employeeForm.value.id),
        username: String(employeeForm.value.username),
        password: String(employeeForm.value.password || '123'),
        fullname: String(employeeForm.value.fullname),
        email: String(employeeForm.value.email || ''),
        phone: String(employeeForm.value.phone || ''),
        avatar: employeeForm.value.avatar || `https://i.pravatar.cc/150?u=${employeeForm.value.id}`,
        status: Boolean(employeeForm.value.status),
        role: 2,
        isEmployee: true,
      }

      if (employeeIsEditing.value) {
        updateEmployee(payload.id, payload)
      } else {
        addEmployee(payload)
      }

      showModal.value = false
      alert('Lưu nhân viên thành công!')
      return
    }

    /* ===== PRODUCT ===== */
    if (modalTarget.value === 'product') {
      const payload = {
        ...formData.value,
        price: Number(formData.value.price || 0),
        colors: Array.isArray(formData.value.colors) ? formData.value.colors : [],
        sizes: Array.isArray(formData.value.sizes) ? formData.value.sizes : [],
      }

      if (isEditing.value) {
        updateProduct(payload.id, payload)
      } else {
        addProduct(payload)
      }

      showModal.value = false
      alert('Lưu sản phẩm thành công!')
    }
  } catch (e) {
    console.error('SAVE ERROR:', e)
    alert('Lỗi khi lưu! (mở F12 -> Console sẽ thấy lỗi)')
  }
}

/* ================= INVOICE (FIX CRASH) ================= */
function handleAddInvoice(invoice) {
  try {
    addInvoice(invoice)
    alert('Tạo hóa đơn thành công!')
  } catch (e) {
    console.error(e)
    alert('Không thể tạo hóa đơn')
  }
}

/* ================= DELETE ================= */
const deleteItem = (id) => {
  if (confirm('Xác nhận xóa sản phẩm?')) deleteProduct(id)
}

const handleDeleteEmployee = (id) => {
  if (confirm('Xác nhận xóa nhân viên?')) deleteEmployee(id)
}

/* ================= OTHER ================= */
const filteredProducts = computed(() => {
  // Nếu products chưa có dữ liệu, trả về mảng rỗng ngay
  if (!products.value) return []

  // Nếu ô tìm kiếm trống, trả về toàn bộ mảng gốc để giữ nguyên thuộc tính .name
  if (!search.value || !search.value.trim()) {
    return products.value
  }

  // Lọc an toàn: Chỉ kiểm tra nếu name tồn tại mới toLowerCase
  return products.value.filter((p) => {
    const productName = p.name ? String(p.name).toLowerCase() : ''
    const searchTerm = search.value.toLowerCase()
    return productName.includes(searchTerm)
  })
})

const openGallery = (imgs) => {
  galleryImages.value = Array.isArray(imgs) ? imgs : []
  showGallery.value = true
}

const handleToggleUserStatus = (user) => {
  toggleUserStatus(user.id)
  alert('Đã cập nhật trạng thái tài khoản!')
}

const formatPrice = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

function toggleSidebar() {
  emit('update:showSidebar', !props.showSidebar)
}
</script>

<template>
  <div class="flex-grow-1 d-flex flex-column overflow-hidden">
    <header
      class="bg-white p-3 shadow-sm d-md-none d-flex justify-content-between align-items-center"
    >
      <button class="btn btn-dark" @click="toggleSidebar">☰</button>
      <h5 class="m-0">Hệ thống Quản lý</h5>
    </header>

    <main class="p-3 p-md-4 overflow-auto">
      <div v-if="props.activeTab === 'products'">
        <ProductsView
          :products="products"
          :filteredProducts="filteredProducts"
          :search="search"
          :formatPrice="formatPrice"
          :openModal="openModal"
          :deleteItem="deleteItem"
          @update:search="search = $event"
        />
      </div>

      <div v-if="props.activeTab === 'users'">
        <UsersView :users="users" :toggleUserStatus="handleToggleUserStatus" />
      </div>

      <!-- new sections -->
      <div v-if="props.activeTab === 'sales'">
        <SalesView
          :products="products"
          :formatPrice="formatPrice"
          @create-invoice="handleAddInvoice"
        />
      </div>

      <div v-if="props.activeTab === 'employees'">
        <EmployeesView
          :employees="employees"
          :openEmployeeModal="openEmployeeModal"
          :deleteEmployee="handleDeleteEmployee"
        />
      </div>

      <div v-if="props.activeTab === 'invoices'">
        <InvoicesView :invoices="invoices" :formatPrice="formatPrice" />
      </div>
    </main>
  </div>

  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal-card card shadow-lg">
      <div class="modal-header-section">
        <template v-if="modalTarget === 'product'">
          <h5 class="mb-0 fw-bold text-pink">
            {{ isEditing ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm Mới' }}
          </h5>
        </template>
        <template v-else-if="modalTarget === 'employee'">
          <h5 class="mb-0 fw-bold text-pink">
            {{ employeeIsEditing ? 'Cập nhật Nhân viên' : 'Thêm Nhân viên Mới' }}
          </h5>
        </template>
      </div>

      <div class="modal-body-scroll">
        <template v-if="modalTarget === 'product'">
          <div class="form-section">
            <div class="section-title">Thông tin cơ bản</div>
            <div class="row g-3">
              <div class="col-lg-8">
                <label class="form-label fw-bold">Tên sản phẩm</label>
                <input
                  v-model="formData.name"
                  class="form-control form-control-lg"
                  placeholder="Nhập tên sản phẩm..."
                />
              </div>
              <div class="col-lg-4">
                <label class="form-label fw-bold">Giá (đ)</label>
                <input
                  v-model="formData.price"
                  type="number"
                  class="form-control form-control-lg"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">Phân loại</div>
            <div class="row g-3">
              <div class="col-lg-6">
                <label class="form-label fw-bold">Danh mục</label>
                <select v-model="formData.category" class="form-select form-select-lg">
                  <option value="">Chọn danh mục</option>
                  <option v-for="c in listCategories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
              <div class="col-lg-6">
                <label class="form-label fw-bold">Trạng thái</label>
                <select v-model="formData.status" class="form-select form-select-lg">
                  <option :value="true">Hiển thị</option>
                  <option :value="false">Ẩn</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <label class="form-label fw-bold">Mô tả chi tiết</label>
            <textarea
              v-model="formData.description"
              class="form-control"
              rows="4"
              placeholder="Nhập mô tả sản phẩm..."
            ></textarea>
          </div>

          <div class="form-section">
            <div class="section-title">Màu sắc</div>
            <div class="checkbox-grid">
              <div v-for="color in listColors" :key="color" class="form-check checkbox-item">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'color-' + color"
                  :value="color"
                  v-model="formData.colors"
                />
                <label class="form-check-label" :for="'color-' + color">{{ color }}</label>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">Kích thước</div>
            <div class="checkbox-grid">
              <div v-for="sz in listSizes" :key="sz" class="form-check checkbox-item">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'size-' + sz"
                  :value="sz"
                  v-model="formData.sizes"
                />
                <label class="form-check-label" :for="'size-' + sz">{{ sz }}</label>
              </div>
            </div>
          </div>

          <div class="form-section">
            <label class="form-label fw-bold">Hình ảnh sản phẩm</label>
            <input
              type="file"
              @change="handleFileUpload"
              class="form-control"
              multiple
              accept="image/*"
            />
            <div v-if="formData.images?.length" class="mt-3 image-preview-grid">
              <div v-for="(img, idx) in formData.images" :key="idx" class="image-preview-item">
                <img
                  :src="img"
                  class="img-fluid rounded"
                  style="object-fit: cover; width: 100%; height: 100%"
                  onerror="this.src = 'https://placehold.co/100'"
                />
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="modalTarget === 'employee'">
          <div class="form-section">
            <div class="section-title">Thông tin cơ bản</div>
            <div class="row g-3">
              <div class="col-lg-6">
                <label class="form-label fw-bold">Username</label>
                <input
                  v-model="employeeForm.username"
                  class="form-control form-control-lg"
                  placeholder="Tên đăng nhập..."
                />
              </div>
              <div class="col-lg-6">
                <label class="form-label fw-bold">Họ và tên</label>
                <input
                  v-model="employeeForm.fullname"
                  class="form-control form-control-lg"
                  placeholder="Họ tên đầy đủ..."
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">Thông tin liên hệ</div>
            <div class="row g-3">
              <div class="col-lg-6">
                <label class="form-label fw-bold">Email</label>
                <input
                  v-model="employeeForm.email"
                  type="email"
                  class="form-control form-control-lg"
                  placeholder="email@example.com"
                />
              </div>
              <div class="col-lg-6">
                <label class="form-label fw-bold">Điện thoại</label>
                <input
                  v-model="employeeForm.phone"
                  class="form-control form-control-lg"
                  placeholder="0912345678"
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <label class="form-label fw-bold">Trạng thái làm việc</label>
            <select v-model="employeeForm.status" class="form-select form-select-lg">
              <option :value="true">Đang hoạt động</option>
              <option :value="false">Nghỉ việc</option>
            </select>
          </div>
        </template>
      </div>

      <div class="modal-footer-section">
        <button class="btn btn-secondary px-5" @click="showModal = false">Hủy</button>
        <button class="btn btn-pink px-5" @click="saveChanges">Xác nhận Lưu</button>
      </div>
    </div>
  </div>

  <div v-if="showGallery" class="modal-overlay" @click.self="showGallery = false">
    <div class="modal-card card p-3 shadow-lg" style="max-width: 500px">
      <div class="d-flex justify-content-between mb-3 align-items-center">
        <h5 class="m-0 fw-bold">Ảnh sản phẩm</h5>
        <button class="btn-close" @click="showGallery = false"></button>
      </div>
      <div class="row g-2 overflow-auto" style="max-height: 400px">
        <div class="col-4" v-for="(img, idx) in galleryImages" :key="idx">
          <img
            :src="img"
            class="img-fluid rounded border shadow-sm"
            style="height: 110px; width: 100%; object-fit: cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal Card Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.modal-card {
  width: 95%;
  max-width: 750px;
  max-height: 90vh;
  border-radius: 16px;
  background: #111 !important;
  color: #fff !important;
  border: 1px solid #ffb6c1 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9) !important;
}

/* Modal Header */
.modal-header-section {
  padding: 24px 28px;
  border-bottom: 2px solid #ffb6c1;
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.05), rgba(255, 209, 220, 0.05));
}

.modal-header-section h5 {
  margin: 0;
  font-size: 18px;
  letter-spacing: 0.5px;
}

/* Modal Body */
.modal-body-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  padding-bottom: 20px;
}

.modal-body-scroll::-webkit-scrollbar {
  width: 8px;
}

.modal-body-scroll::-webkit-scrollbar-track {
  background: #0a0a0a;
  border-radius: 4px;
}

.modal-body-scroll::-webkit-scrollbar-thumb {
  background: #ffb6c1;
  border-radius: 4px;
}

.modal-body-scroll::-webkit-scrollbar-thumb:hover {
  background: #ffc1d0;
}

/* Form Sections */
.form-section {
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #1a1a1a;
}

.form-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffb6c1;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

/* Form Controls */
.form-label {
  font-size: 14px;
  margin-bottom: 8px;
  color: #fff !important;
  display: block;
}

.form-control,
.form-select {
  background-color: #0a0a0a !important;
  border: 1px solid #333 !important;
  color: #fff !important;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  background-color: #000 !important;
  border-color: #ffb6c1 !important;
  color: #fff !important;
  box-shadow: 0 0 0 3px rgba(255, 182, 193, 0.1) !important;
}

.form-control::placeholder {
  color: #666 !important;
}

.form-control-lg,
.form-select-lg {
  padding: 12px 14px !important;
  font-size: 15px !important;
}

/* Checkbox Grid */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  padding: 16px;
  background: rgba(255, 182, 193, 0.03);
  border-radius: 8px;
  border: 1px solid #1a1a1a;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.checkbox-item:hover {
  background: rgba(255, 182, 193, 0.1);
}

.checkbox-item .form-check-input {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  border: 1.5px solid #444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-item .form-check-input:checked {
  background-color: #ffb6c1 !important;
  border-color: #ffb6c1 !important;
}

.checkbox-item .form-check-label {
  margin: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

/* Image Preview Grid */
.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  padding: 16px;
  background: rgba(255, 182, 193, 0.03);
  border-radius: 8px;
  border: 1px solid #1a1a1a;
}

.image-preview-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ffb6c1;
}

.image-preview-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Modal Footer */
.modal-footer-section {
  padding: 20px 28px;
  border-top: 1px solid #1a1a1a;
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.02), rgba(255, 209, 220, 0.02));
}

.modal-footer-section .btn {
  padding: 10px 24px;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-footer-section .btn-secondary {
  background-color: #1a1a1a !important;
  border-color: #333 !important;
  color: #fff !important;
}

.modal-footer-section .btn-secondary:hover {
  background-color: #222 !important;
  border-color: #444 !important;
}

.modal-footer-section .btn-pink {
  background: linear-gradient(135deg, #ffb6c1, #ffd1dc) !important;
  color: #000 !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(255, 182, 193, 0.3);
}

.modal-footer-section .btn-pink:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 182, 193, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-card {
    max-width: 90vw;
    max-height: 95vh;
  }

  .modal-header-section,
  .modal-body-scroll,
  .modal-footer-section {
    padding-left: 20px;
    padding-right: 20px;
  }

  .checkbox-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .modal-footer-section {
    flex-direction: column;
  }

  .modal-footer-section .btn {
    width: 100%;
  }
}
</style>
