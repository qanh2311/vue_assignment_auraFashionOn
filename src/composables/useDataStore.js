import { ref } from 'vue'

// ===== CONFIGURATION LISTS =====
export const listSizes = ['S', 'M', 'L', 'XL', '2XL']
export const listColors = ['Xám', 'Xanh', 'Nâu', 'Đen', 'Trắng', 'Hồng', 'Be']
export const listCategories = ['Áo', 'Váy', 'Chân váy', 'Quần']

// ===== HARD-CODED DATA =====
const fixedProducts = [
  {
    id: '1',
    name: 'Áo Hoodie Form Rộng',
    price: 123000,
    images: [
      '/images/ao-hoodie (1).webp',
      '/images/ao-hoodie (2).webp',
      '/images/ao-hoodie (3).webp',
      '/images/ao-hoodie (4).webp',
    ],
    description: 'Áo hoodie chất nỉ ngoại dày dặn, form rộng unisex cực năng động.',
    category: 'Áo',
    status: true,
    colors: ['Nâu', 'Đen'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '2',
    name: 'Váy Trễ Vai Nhẹ',
    price: 320000,
    images: ['/images/vay-tre-vai-nhe (1).webp', '/images/vay-tre-vai-nhe (2).webp'],
    description: 'Thiết kế trễ vai quyến rũ, tôn dáng, phù hợp cho các buổi tiệc nhẹ.',
    category: 'Váy',
    status: true,
    colors: ['Trắng', 'Đen'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '3',
    name: 'Váy Suông Tay Dài',
    price: 280000,
    images: [
      '/images/vay-suong-tay-dai (1).webp',
      '/images/vay-suong-tay-dai (2).webp',
      '/images/vay-suong-tay-dai (3).webp',
      '/images/vay-suong-tay-dai (4).webp',
      '/images/vay-suong-tay-dai (5).webp',
      '/images/vay-suong-tay-dai (6).webp',
    ],
    description: 'Váy suông basic tay dài, chất liệu thun mềm mại, thoải mái vận động.',
    category: 'Váy',
    status: true,
    colors: ['Xanh mint', 'Kẻ sọc', 'Xanh dương'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '4',
    name: 'Váy Suông Form Rộng',
    price: 290000,
    images: [
      '/images/vay-suong-form-rong (1).webp',
      '/images/vay-suong-form-rong (2).webp',
      '/images/vay-suong-form-rong (3).webp',
    ],
    description: 'Váy suông dáng rộng phong cách Hàn Quốc, thoải mái che khuyết điểm.',
    category: 'Váy',
    status: true,
    colors: ['Xám', 'Kem'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '5',
    name: 'Váy Maxi Nhẹ',
    price: 350000,
    images: [
      '/images/vay-maxi-nhe (1).webp',
      '/images/vay-maxi-nhe (2).webp',
      '/images/vay-maxi-nhe (3).webp',
      '/images/vay-maxi-nhe (4).webp',
      '/images/vay-maxi-nhe (5).webp',
    ],
    description: 'Váy maxi dáng dài thướt tha, chất liệu voan nhẹ nhàng bay bổng.',
    category: 'Váy',
    status: true,
    colors: ['Hồng phấn', 'Kem', 'Trắng'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '6',
    name: 'Váy Len Dáng Ôm Nhẹ',
    price: 220000,
    images: [
      '/images/vay-len-dang-om-nhe (1).webp',
      '/images/vay-len-dang-om-nhe (2).webp',
      '/images/vay-len-dang-om-nhe (3).webp',
      '/images/vay-len-dang-om-nhe (4).webp',
      '/images/vay-len-dang-om-nhe (5).webp',
      '/images/vay-len-dang-om-nhe (6).webp',
      '/images/vay-len-dang-om-nhe (7).webp',
    ],
    description: 'Váy len tăm kẻ sọc dáng ôm, tôn đường cong cơ thể một cách tinh tế.',
    category: 'Váy',
    status: true,
    colors: ['Xanh kẻ', 'Đen kẻ', 'Nâu kẻ'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '9',
    name: 'Váy Body Basic',
    price: 210000,
    images: [
      '/images/vay-body-basic (1).webp',
      '/images/vay-body-basic (2).webp',
      '/images/vay-body-basic (3).webp',
      '/images/vay-body-basic (4).webp',
      '/images/vay-body-basic (5).webp',
      '/images/vay-body-basic (6).webp',
      '/images/vay-body-basic (7).webp',
    ],
    description: 'Váy body hai dây quyến rũ, chất thun co giãn tốt.',
    category: 'Váy',
    status: true,
    colors: ['Đen', 'Đỏ', 'Vàng'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '10',
    name: 'Hoa Nhí',
    price: 120000,
    images: [
      '/images/hoa-nhi (1).webp',
      '/images/hoa-nhi (2).webp',
      '/images/hoa-nhi (3).webp',
      '/images/hoa-nhi (4).webp',
      '/images/hoa-nhi (5).webp',
    ],
    description: 'Váy hoa nhí dễ thương, chất liệu nhẹ, phù hợp đi chơi.',
    category: 'Váy',
    status: true,
    colors: ['Be hoa', 'Vàng nhạt'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '11',
    name: 'Áo Crop-top Basic',
    price: 150000,
    images: [
      '/images/crop-top (1).webp',
      '/images/crop-top (2).webp',
      '/images/crop-top (3).webp',
      '/images/crop-top (4).webp',
      '/images/crop-top (5).webp',
    ],
    description: 'Áo croptop cổ tròn đơn giản, trẻ trung và năng động.',
    category: 'Áo',
    status: true,
    colors: ['Trắng', 'Đen', 'Xám'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '12',
    name: 'Chân Váy Xếp Ly Ngắn',
    price: 185000,
    images: [
      '/images/chan-vay-xep-ly (1).webp',
      '/images/chan-vay-xep-ly (2).webp',
      '/images/chan-vay-xep-ly (3).webp',
      '/images/chan-vay-xep-ly (4).webp',
      '/images/chan-vay-xep-ly (5).webp',
      '/images/chan-vay-xep-ly (6).webp',
      '/images/chan-vay-xep-ly (7).webp',
      '/images/chan-vay-xep-ly (8).webp',
    ],
    description: 'Chân váy xếp ly phong cách nữ sinh Hàn Quốc, có quần bảo hộ bên trong.',
    category: 'Chân váy',
    status: true,
    colors: ['Xám', 'Đen', 'Kem', 'Trắng'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '13',
    name: 'Chân Váy Kaki Dáng Dài',
    price: 260000,
    images: [
      '/images/chan-vay-kaki-dang-dai (1).webp',
      '/images/chan-vay-kaki-dang-dai (2).webp',
      '/images/chan-vay-kaki-dang-dai (3).webp',
      '/images/chan-vay-kaki-dang-dai (4).webp',
      '/images/chan-vay-kaki-dang-dai (5).webp',
      '/images/chan-vay-kaki-dang-dai (6).webp',
      '/images/chan-vay-kaki-dang-dai (7).webp',
    ],
    description: 'Chân váy kaki dáng suông dài thanh lịch, phù hợp đi làm hoặc đi học.',
    category: 'Chân váy',
    status: true,
    colors: ['Be', 'Trắng', 'Đen'],
    sizes: ['S', 'M', 'L'],
  },
  {
    id: '14',
    name: 'Chân Váy Jean Ngắn',
    price: 240000,
    images: [
      '/images/chan-vay-jean (1).webp',
      '/images/chan-vay-jean (2).webp',
      '/images/chan-vay-jean (3).webp',
    ],
    description: 'Chân váy jean denim cá tính, đường may chắc chắn kèm đai lưng.',
    category: 'Chân váy',
    status: true,
    colors: ['Xanh Denim'],
    sizes: ['S', 'M', 'L'],
  },
]

const fixedUsers = [
  {
    id: '1',
    username: 'client',
    password: '123',
    fullname: 'Nguyễn Văn Client',
    email: 'client@gmail.com',
    phone: '0987654321',
    avatar: 'https://i.pravatar.cc/150?u=1',
    status: true,
    role: 1,
    isEmployee: false,
  },
  {
    id: '2',
    username: 'admin',
    password: '123',
    fullname: 'Quản Trị Viên',
    email: 'admin@gmail.com',
    phone: '0900000000',
    avatar: 'https://i.pravatar.cc/150?u=2',
    status: true,
    role: 0,
    isEmployee: false,
  },
  {
    id: '3',
    username: 'qq',
    password: '123',
    fullname: 'Phạm Thị Quế Anh',
    email: 'anhptqth05962@gmail.com',
    phone: '09000000',
    avatar: 'https://i.pravatar.cc/150?u=3',
    status: true,
    role: 1,
    isEmployee: false,
  },
  {
    id: '4',
    username: 'staff1',
    password: '123',
    fullname: 'Phạm Hùng',
    email: 'staff1@example.com',
    phone: '0912345678',
    avatar: 'https://i.pravatar.cc/150?u=4',
    status: true,
    role: 2,
    isEmployee: true,
  },
  {
    id: '1769313756089',
    username: '123',
    password: '123',
    fullname: 'Người Dùng 123',
    email: 'anhptqth05962@gmail.com',
    phone: '09898989',
    avatar: 'https://i.pravatar.cc/1769313756089',
    status: true,
    role: 1,
    isEmployee: false,
  },
  {
    id: '1769339626397',
    username: 'nhi123',
    password: '123',
    fullname: 'toi la sieu nhan do',
    email: 'anhptqth05962@gmail.com',
    phone: '0989787231',
    avatar: '',
    status: true,
    role: 1,
    isEmployee: false,
  },
  {
    id: '1769339721800',
    username: '12345',
    password: '123',
    fullname: 'nhi',
    email: 'anhptqth05962@gmail.com',
    phone: '09876573214',
    avatar: '',
    status: true,
    role: 1,
    isEmployee: false,
  },
]

const fixedInvoices = [
  {
    id: 'INV1769314500000',
    userId: '1',
    date: '2026-01-24',
    items: [
      {
        productId: '2',
        name: 'Váy Trễ Vai Nhẹ',
        price: 320000,
        quantity: 1,
      },
    ],
    total: 320000,
    status: 'Đã thanh toán',
  },
  {
    id: 'INV1770990474365',
    customer: 'Khách Lẻ',
    items: [
      {
        productId: '1',
        name: 'Áo Hoodie Form Rộng',
        price: 123000,
        quantity: 1,
      },
      {
        productId: '2',
        name: 'Váy Trễ Vai Nhẹ',
        price: 320000,
        quantity: 1,
      },
      {
        productId: '3',
        name: 'Váy Suông Tay Dài',
        price: 280000,
        quantity: 3,
      },
    ],
    total: 1283000,
    date: '2026-02-13',
    status: 'Đã thanh toán',
  },
  {
    id: 'INV1771343344591',
    customer: 'Khách Lẻ',
    items: [
      {
        productId: '3',
        name: 'Váy Suông Tay Dài',
        price: 280000,
        quantity: 2,
        size: 'M',
        color: 'Xanh mint',
      },
      {
        productId: '1',
        name: 'Áo Hoodie Form Rộng',
        price: 123000,
        quantity: 1,
        size: 'M',
        color: 'Đen',
      },
    ],
    total: 683000,
    date: '2026-02-17',
    status: 'Đã thanh toán',
  },
]

export function useDataStore() {

  const storedProducts = JSON.parse(localStorage.getItem('all_products'))

  const products = ref(
    Array.isArray(storedProducts) && storedProducts.length > 0
      ? storedProducts
      : [...fixedProducts],
  )
  const users = ref(fixedUsers.filter((u) => u.role === 1))
  const employees = ref(fixedUsers.filter((u) => u.role === 2 || u.isEmployee))
  /* ================= EMPLOYEE CRUD ================= */
  const saveEmployees = () => {
    localStorage.setItem('all_employees', JSON.stringify(employees.value))
  }

  /* ADD EMPLOYEE + CREATE LOGIN ACCOUNT */
  const addEmployee = (emp) => {
    const id = Date.now().toString()

    const employeeData = {
      id,
      username: emp.username,
      fullname: emp.fullname,
      email: emp.email,
      phone: emp.phone,
      password: emp.password,
      status: emp.status ?? true,
      role: 2,
      isEmployee: true,
    }

    /* 1. Lưu vào danh sách nhân viên (dashboard) */
    employees.value.push(employeeData)
    localStorage.setItem('all_employees', JSON.stringify(employees.value))

    /* 2. Lưu vào danh sách tài khoản (login) */
    users.value.push({
      id,
      username: emp.username,
      password: emp.password,
      role: 2,
      status: employeeData.status,
    })

    localStorage.setItem('users', JSON.stringify(users.value))
  }

  /* UPDATE */
  const updateEmployee = (id, newData) => {
    const index = employees.value.findIndex((e) => e.id == id)

    if (index !== -1) {
      employees.value[index] = {
        ...employees.value[index],
        ...newData,
        role: 2,
        isEmployee: true,
      }
    }

    /* sync sang users (account login) */
    const userIndex = users.value.findIndex((u) => u.id == id)

    if (userIndex !== -1) {
      users.value[userIndex] = {
        ...users.value[userIndex],
        username: newData.username,
        password: newData.password,
        status: newData.status,
      }
    }

    localStorage.setItem('all_employees', JSON.stringify(employees.value))
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  /* DELETE */

  const deleteEmployee = (id) => {
    employees.value = employees.value.filter((e) => e.id != id)
    users.value = users.value.filter((u) => u.id != id)

    localStorage.setItem('all_employees', JSON.stringify(employees.value))
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  // Hóa đơn: Ưu tiên localStorage, nếu rỗng thì dùng mảng fixedInvoices mẫu
  const invoices = ref(JSON.parse(localStorage.getItem('all_invoices')) || [...fixedInvoices])

  const saveInvoices = () => {
    localStorage.setItem('all_invoices', JSON.stringify(invoices.value))
  }

  const addInvoice = (newInvoice) => {
    const invWithId = { ...newInvoice, id: 'INV' + Date.now() }
    invoices.value.push(invWithId)
    saveInvoices()
  }

  const carts = ref(JSON.parse(localStorage.getItem('all_user_carts')) || {})

  const saveCarts = () => {
    localStorage.setItem('all_user_carts', JSON.stringify(carts.value))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const saveProducts = () => {
    localStorage.setItem('all_products', JSON.stringify(products.value))
  }

  const addToCart = (product) => {
    const user =
      JSON.parse(localStorage.getItem('user_login')) ||
      JSON.parse(localStorage.getItem('currentUser')) ||
      JSON.parse(localStorage.getItem('user'))

    if (!user || !user.id) {
      alert('Bạn chưa đăng nhập hoặc phiên làm việc hết hạn!')
      return
    }

    const userId = user.id
    if (!carts.value[userId]) carts.value[userId] = []

    const existing = carts.value[userId].find(
      (p) => p.id === product.id && p.color === product.color && p.size === product.size,
    )

    if (existing) {
      existing.quantity += product.quantity
    } else {
      carts.value[userId].push({ ...product, ownerId: userId })
    }
    saveCarts()
    alert('Đã thêm vào giỏ hàng thành công!')
  }

  const removeFromCart = (userId, index) => {
    if (carts.value[userId]) {
      carts.value[userId].splice(index, 1)
      saveCarts()
    }
  }

  const clearCartSelection = (userId, selectedIndexes) => {
    if (carts.value[userId]) {
      const sortedIndexes = [...selectedIndexes].sort((a, b) => b - a)
      sortedIndexes.forEach((idx) => carts.value[userId].splice(idx, 1))
      saveCarts()
    }
  }

  return {
    products,
    users,
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    invoices,
    listCategories,
    carts,
    addToCart,
    removeFromCart,
    clearCartSelection,
    addInvoice,
    getAllAccounts: () => fixedUsers,
    addProduct: (p) => {
      products.value.push({ ...p, id: Date.now().toString() })
      saveProducts()
    },
    updateProduct: (id, p) => {
      const idx = products.value.findIndex((item) => item.id === id)
      if (idx !== -1) {
        products.value.splice(idx, 1, { ...p, id })
        saveProducts()
      }
    },
    deleteProduct: (id) => {
      const idx = products.value.findIndex((p) => p.id === id)
      if (idx !== -1) {
        products.value.splice(idx, 1)
        saveProducts()
      }
    },
    toggleUserStatus: (id) => {
      const u = users.value.find((user) => user.id === id)
      if (u) u.status = !u.status
    },
  }
}
