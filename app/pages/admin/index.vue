<script setup lang="ts">
import type { Menu, MenuFormData, AdminCredentials } from '~/types'
import { MENU_CATEGORIES } from '~/types'

definePageMeta({ layout: 'admin' })

useHead({ title: 'Admin Panel — Cat Cake' })

// Auth
const { session, login, logout, restoreSession } = useAdminAuth()

onMounted(() => {
  restoreSession()
  if (session.isAuthenticated) {
    fetchMenus()
  }
})

// Login form
const loginForm = reactive<AdminCredentials>({ username: '', password: '' })
const loginError = ref('')
const loginLoading = ref(false)

async function handleLogin(): Promise<void> {
  loginError.value = ''
  loginLoading.value = true
  await new Promise((r) => setTimeout(r, 400)) // simulate async
  const ok = login(loginForm)
  loginLoading.value = false
  if (ok) {
    await fetchMenus()
  } else {
    loginError.value = 'Invalid username or password'
  }
}

// Menu management
const { menus, pending, error, fetchMenus, createMenu, updateMenu, toggleAvailability, deleteMenu } =
  useMenu()

// Category filter for admin table
const filterCategory = ref<string>('All')
const search = ref('')

const displayedMenus = computed<Menu[]>(() => {
  let list = menus.value
  if (filterCategory.value !== 'All') {
    list = list.filter((m) => m.category === filterCategory.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter((m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
  }
  return list
})

// Modal state
const showModal = ref(false)
const editingItem = ref<Menu | null>(null)

function openAddModal(): void {
  editingItem.value = null
  showModal.value = true
}

function openEditModal(item: Menu): void {
  editingItem.value = item
  showModal.value = true
}

async function handleFormSubmit(data: MenuFormData): Promise<void> {
  try {
    if (editingItem.value) {
      await updateMenu(editingItem.value.id, data)
    } else {
      await createMenu(data)
    }
    showModal.value = false
    editingItem.value = null
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to save'
  }
}

// Delete confirmation
const deleteTargetId = ref<string | null>(null)

function confirmDelete(id: string): void {
  deleteTargetId.value = id
}

async function handleDelete(): Promise<void> {
  if (!deleteTargetId.value) return
  await deleteMenu(deleteTargetId.value)
  deleteTargetId.value = null
}

async function handleToggle(item: Menu): Promise<void> {
  await toggleAvailability(item.id, !item.is_available)
}

// Formatting
function formatIDR(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Stats
const stats = computed(() => ({
  total: menus.value.length,
  available: menus.value.filter((m) => m.is_available).length,
  outOfStock: menus.value.filter((m) => !m.is_available).length,
  categories: new Set(menus.value.map((m) => m.category)).size,
}))
</script>

<template>
  <div class="min-h-dvh bg-cream-50">

    <!-- ── LOGIN SCREEN ──────────────────────────────────────── -->
    <div
      v-if="!session.isAuthenticated"
      class="min-h-dvh flex items-center justify-center px-4"
    >
      <div class="w-full max-w-sm">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="text-6xl mb-4" aria-hidden="true">🐱</div>
          <h1 class="text-2xl font-extrabold text-charcoal-900">Cat Cake Admin</h1>
          <p class="text-charcoal-400 text-sm mt-1">Sign in to manage your menu</p>
        </div>

        <div class="bg-white rounded-3xl shadow-warm-lg p-8">
          <form id="login-form" novalidate @submit.prevent="handleLogin">
            <!-- Error alert -->
            <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100">
              <div
                v-if="loginError"
                class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2"
                role="alert"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                {{ loginError }}
              </div>
            </Transition>

            <div class="space-y-4">
              <div>
                <label for="login-username" class="admin-label">Username</label>
                <input
                  id="login-username"
                  v-model="loginForm.username"
                  type="text"
                  class="admin-input"
                  placeholder="admin"
                  autocomplete="username"
                  required
                />
              </div>
              <div>
                <label for="login-password" class="admin-label">Password</label>
                <input
                  id="login-password"
                  v-model="loginForm.password"
                  type="password"
                  class="admin-input"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              class="btn-primary w-full justify-center mt-6"
              :disabled="loginLoading"
            >
              <svg v-if="loginLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ loginLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="mt-4 p-3 bg-cream-50 rounded-xl border border-cream-200">
            <p class="text-xs text-charcoal-400 text-center">
              Demo credentials: <span class="font-mono font-bold text-charcoal-600">admin</span> /
              <span class="font-mono font-bold text-charcoal-600">catcake2024</span>
            </p>
          </div>
        </div>

        <div class="text-center mt-6">
          <NuxtLink to="/" class="text-sm text-charcoal-400 hover:text-coral-500 transition-colors">
            ← Back to website
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ── ADMIN DASHBOARD ──────────────────────────────────── -->
    <div v-else class="flex min-h-dvh">

      <!-- Sidebar -->
      <aside class="hidden md:flex flex-col w-60 bg-white border-r border-cream-200 fixed h-full">
        <!-- Sidebar logo -->
        <div class="p-6 border-b border-cream-100">
          <div class="flex items-center gap-2">
            <span class="text-2xl" aria-hidden="true">🐾</span>
            <span class="font-extrabold text-charcoal-900">Cat Cake</span>
          </div>
          <p class="text-xs text-charcoal-400 mt-1">Admin Panel</p>
        </div>

        <!-- Nav -->
        <nav class="flex-1 p-4 space-y-1" aria-label="Admin navigation">
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-coral-500/10 text-coral-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span class="text-sm font-semibold">Menu Items</span>
          </div>
        </nav>

        <!-- Logout -->
        <div class="p-4 border-t border-cream-100">
          <div class="flex items-center gap-3 px-3 py-2 mb-3">
            <div class="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-sm font-bold text-coral-600">
              {{ session.username?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-semibold text-charcoal-900">{{ session.username }}</p>
              <p class="text-xs text-charcoal-400">Administrator</p>
            </div>
          </div>
          <button
            id="admin-logout"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-charcoal-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            @click="logout"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 md:ml-60 p-6 lg:p-8">

        <!-- Mobile top bar -->
        <div class="md:hidden flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <span class="text-xl" aria-hidden="true">🐾</span>
            <span class="font-extrabold text-charcoal-900">Cat Cake Admin</span>
          </div>
          <button
            id="admin-mobile-logout"
            class="btn-ghost text-sm !px-3 !py-2"
            @click="logout"
          >
            Sign Out
          </button>
        </div>

        <!-- Page header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl font-extrabold text-charcoal-900">Menu Management</h1>
            <p class="text-charcoal-400 text-sm mt-0.5">Manage your bakery's menu items</p>
          </div>
          <button
            id="add-menu-btn"
            class="btn-primary text-sm self-start sm:self-auto"
            @click="openAddModal"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add New Menu
          </button>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-2xl p-4 shadow-warm">
            <p class="text-xs font-semibold text-charcoal-400 uppercase tracking-wide mb-1">Total Items</p>
            <p class="text-3xl font-extrabold text-charcoal-900">{{ stats.total }}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 shadow-warm">
            <p class="text-xs font-semibold text-charcoal-400 uppercase tracking-wide mb-1">Available</p>
            <p class="text-3xl font-extrabold text-mint-500">{{ stats.available }}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 shadow-warm">
            <p class="text-xs font-semibold text-charcoal-400 uppercase tracking-wide mb-1">Out of Stock</p>
            <p class="text-3xl font-extrabold text-charcoal-400">{{ stats.outOfStock }}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 shadow-warm">
            <p class="text-xs font-semibold text-charcoal-400 uppercase tracking-wide mb-1">Categories</p>
            <p class="text-3xl font-extrabold text-coral-500">{{ stats.categories }}</p>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <!-- Search -->
          <div class="relative flex-1">
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              id="admin-search"
              v-model="search"
              type="search"
              class="admin-input pl-10"
              placeholder="Search items..."
            />
          </div>
          <!-- Category filter -->
          <select
            id="admin-category-filter"
            v-model="filterCategory"
            class="admin-input sm:w-48"
          >
            <option value="All">All Categories</option>
            <option v-for="cat in MENU_CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Error banner -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600" role="alert">
          {{ error }}
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl shadow-warm overflow-hidden">

          <!-- Loading state -->
          <div v-if="pending" class="p-8 text-center">
            <div class="inline-flex items-center gap-3 text-charcoal-500">
              <svg class="animate-spin w-5 h-5 text-coral-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Loading menu items...
            </div>
          </div>

          <!-- Desktop table -->
          <div v-else class="hidden md:block overflow-x-auto">
            <table class="w-full text-sm" aria-label="Menu items table">
              <thead>
                <tr class="border-b border-cream-100">
                  <th class="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal-400">Image</th>
                  <th class="text-left px-4 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal-400">Name</th>
                  <th class="text-left px-4 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal-400">Category</th>
                  <th class="text-left px-4 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal-400">Price</th>
                  <th class="text-left px-4 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal-400">Status</th>
                  <th class="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-charcoal-400">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-cream-100">
                <tr v-for="item in displayedMenus" :key="item.id" class="table-row-hover">
                  <!-- Image -->
                  <td class="px-6 py-3">
                    <div class="w-12 h-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                      <img
                        :src="item.image_url || `https://picsum.photos/seed/${encodeURIComponent(item.name)}/100/100`"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </td>
                  <!-- Name & description -->
                  <td class="px-4 py-3">
                    <p class="font-semibold text-charcoal-900">{{ item.name }}</p>
                    <p class="text-charcoal-400 text-xs line-clamp-1 mt-0.5">{{ item.description }}</p>
                  </td>
                  <!-- Category -->
                  <td class="px-4 py-3">
                    <span class="inline-block px-2.5 py-1 rounded-full bg-cream-100 text-charcoal-600 text-xs font-semibold">
                      {{ item.category }}
                    </span>
                  </td>
                  <!-- Price -->
                  <td class="px-4 py-3">
                    <span class="font-bold text-charcoal-900">{{ formatIDR(item.price) }}</span>
                  </td>
                  <!-- Toggle -->
                  <td class="px-4 py-3">
                    <button
                      :id="`toggle-${item.id}`"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
                      :class="item.is_available ? 'bg-mint-400' : 'bg-charcoal-200'"
                      :aria-pressed="item.is_available"
                      :aria-label="`Toggle availability for ${item.name}`"
                      @click="handleToggle(item)"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200"
                        :class="item.is_available ? 'translate-x-6' : 'translate-x-1'"
                      />
                    </button>
                  </td>
                  <!-- Actions -->
                  <td class="px-6 py-3">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        :id="`edit-${item.id}`"
                        class="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 transition-colors"
                        :aria-label="`Edit ${item.name}`"
                        @click="openEditModal(item)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        :id="`delete-${item.id}`"
                        class="p-2 rounded-xl text-charcoal-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        :aria-label="`Delete ${item.name}`"
                        @click="confirmDelete(item.id)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Empty state -->
                <tr v-if="displayedMenus.length === 0">
                  <td colspan="6" class="py-16 text-center">
                    <div class="text-5xl mb-3" aria-hidden="true">🍽️</div>
                    <p class="text-charcoal-500 font-semibold">No items found</p>
                    <p class="text-charcoal-400 text-sm mt-1">Try adjusting your search or filter</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile card list -->
          <div class="md:hidden divide-y divide-cream-100">
            <div
              v-for="item in displayedMenus"
              :key="`m-${item.id}`"
              class="p-4 flex items-center gap-4"
            >
              <div class="w-14 h-14 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                <img
                  :src="item.image_url || `https://picsum.photos/seed/${encodeURIComponent(item.name)}/100/100`"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-charcoal-900 truncate">{{ item.name }}</p>
                <p class="text-xs text-charcoal-400">{{ item.category }}</p>
                <p class="text-sm font-bold text-coral-500 mt-0.5">{{ formatIDR(item.price) }}</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <button
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                  :class="item.is_available ? 'bg-mint-400' : 'bg-charcoal-200'"
                  :aria-pressed="item.is_available"
                  @click="handleToggle(item)"
                >
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200"
                    :class="item.is_available ? 'translate-x-6' : 'translate-x-1'" />
                </button>
                <div class="flex gap-1.5">
                  <button
                    class="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100"
                    @click="openEditModal(item)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-charcoal-400 hover:text-red-500 hover:bg-red-50"
                    @click="confirmDelete(item.id)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="displayedMenus.length === 0" class="py-16 text-center">
              <div class="text-5xl mb-3" aria-hidden="true">🍽️</div>
              <p class="text-charcoal-500 font-semibold">No items found</p>
            </div>
          </div>
        </div>

        <!-- Back to site link -->
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-charcoal-400 hover:text-coral-500 transition-colors">
            ← View public website
          </NuxtLink>
        </div>
      </main>
    </div>

    <!-- ── ADD/EDIT MODAL ──────────────────────────────────────── -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <MenuFormModal
        v-if="showModal"
        :edit-item="editingItem"
        @close="showModal = false; editingItem = null"
        @submit="handleFormSubmit"
      />
    </Transition>

    <!-- ── DELETE CONFIRM MODAL ────────────────────────────────── -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="deleteTargetId"
        class="fixed inset-0 z-50 bg-charcoal-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Confirm deletion"
      >
        <div class="bg-white rounded-3xl shadow-warm-lg w-full max-w-sm p-8 text-center">
          <div class="text-5xl mb-4" aria-hidden="true">🗑️</div>
          <h2 class="text-lg font-extrabold text-charcoal-900 mb-2">Delete this item?</h2>
          <p class="text-charcoal-400 text-sm mb-6">This action cannot be undone.</p>
          <div class="flex gap-3">
            <button
              id="delete-cancel"
              class="btn-ghost flex-1 justify-center"
              @click="deleteTargetId = null"
            >Cancel</button>
            <button
              id="delete-confirm"
              class="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-red-600 active:scale-95"
              @click="handleDelete"
            >Delete</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
