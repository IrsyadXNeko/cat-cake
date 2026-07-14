<script setup lang="ts">
import type { Menu, MenuFormData, MenuCategory } from '~/types'
import { MENU_CATEGORIES } from '~/types'

interface Props {
  editItem?: Menu | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: MenuFormData): void
}>()

const form = reactive<MenuFormData>({
  name: '',
  description: '',
  price: 0,
  category: 'Bolu',
  image_url: '',
  is_available: true,
})

// Populate form when editing
watch(
  () => props.editItem,
  (item) => {
    if (item) {
      form.name = item.name
      form.description = item.description
      form.price = item.price
      form.category = item.category
      form.image_url = item.image_url
      form.is_available = item.is_available
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm(): void {
  form.name = ''
  form.description = ''
  form.price = 0
  form.category = 'Bolu'
  form.image_url = ''
  form.is_available = true
}

const errors = reactive<Partial<Record<keyof MenuFormData, string>>>({})
const submitting = ref(false)

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k as keyof MenuFormData])

  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.description.trim()) errors.description = 'Description is required'
  if (!form.price || form.price <= 0) errors.price = 'Price must be greater than 0'
  if (!form.category) errors.category = 'Category is required'

  return Object.keys(errors).length === 0
}

async function handleSubmit(): Promise<void> {
  if (!validate()) return
  submitting.value = true
  try {
    emit('submit', { ...form })
  } finally {
    submitting.value = false
  }
}

// Close on backdrop click
function onBackdrop(e: MouseEvent): void {
  if ((e.target as HTMLElement).id === 'modal-backdrop') emit('close')
}
</script>

<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <div
      id="modal-backdrop"
      class="fixed inset-0 z-50 bg-charcoal-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      :aria-label="editItem ? 'Edit Menu Item' : 'Add New Menu Item'"
      @click="onBackdrop"
    >
      <!-- Modal panel -->
      <div
        class="bg-white rounded-3xl shadow-warm-lg w-full max-w-md max-h-[90dvh] overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 pb-4 border-b border-cream-100">
          <div>
            <h2 class="text-lg font-extrabold text-charcoal-900">
              {{ editItem ? 'Edit Menu Item' : 'Add New Menu' }}
            </h2>
            <p class="text-xs text-charcoal-400 mt-0.5">
              {{ editItem ? 'Update the menu details below' : 'Fill in the details to add a new item' }}
            </p>
          </div>
          <button
            id="modal-close"
            class="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 transition-colors"
            aria-label="Close modal"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Form body -->
        <form class="p-6 space-y-5" novalidate @submit.prevent="handleSubmit">

          <!-- Name -->
          <div>
            <label for="form-name" class="admin-label">Name *</label>
            <input
              id="form-name"
              v-model="form.name"
              type="text"
              class="admin-input"
              :class="{ 'ring-2 ring-red-400 border-transparent': errors.name }"
              placeholder="e.g. Bolu Pandan"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs text-red-500">{{ errors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="form-description" class="admin-label">Description *</label>
            <textarea
              id="form-description"
              v-model="form.description"
              rows="3"
              class="admin-input resize-none"
              :class="{ 'ring-2 ring-red-400 border-transparent': errors.description }"
              placeholder="Describe this item..."
            />
            <p v-if="errors.description" class="mt-1.5 text-xs text-red-500">{{ errors.description }}</p>
          </div>

          <!-- Price -->
          <div>
            <label for="form-price" class="admin-label">Price (IDR) *</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-charcoal-400 font-semibold">Rp</span>
              <input
                id="form-price"
                v-model.number="form.price"
                type="number"
                min="0"
                step="1000"
                class="admin-input pl-10"
                :class="{ 'ring-2 ring-red-400 border-transparent': errors.price }"
                placeholder="45000"
              />
            </div>
            <p v-if="errors.price" class="mt-1.5 text-xs text-red-500">{{ errors.price }}</p>
          </div>

          <!-- Category -->
          <div>
            <label for="form-category" class="admin-label">Category *</label>
            <select
              id="form-category"
              v-model="form.category"
              class="admin-input"
              :class="{ 'ring-2 ring-red-400 border-transparent': errors.category }"
            >
              <option v-for="cat in MENU_CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <p v-if="errors.category" class="mt-1.5 text-xs text-red-500">{{ errors.category }}</p>
          </div>

          <!-- Image URL -->
          <div>
            <label for="form-image-url" class="admin-label">Image URL</label>
            <input
              id="form-image-url"
              v-model="form.image_url"
              type="url"
              class="admin-input"
              placeholder="https://example.com/image.jpg"
            />
            <!-- Preview -->
            <div v-if="form.image_url" class="mt-2 h-20 rounded-xl overflow-hidden bg-cream-100">
              <img
                :src="form.image_url"
                alt="Preview"
                class="w-full h-full object-cover"
                @error="form.image_url = ''"
              />
            </div>
          </div>

          <!-- Availability toggle -->
          <div class="flex items-center justify-between py-2">
            <div>
              <p class="text-sm font-semibold text-charcoal-700">Available</p>
              <p class="text-xs text-charcoal-400">Toggle item visibility on the menu</p>
            </div>
            <button
              id="form-availability-toggle"
              type="button"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
              :class="form.is_available ? 'bg-mint-400' : 'bg-charcoal-200'"
              :aria-pressed="form.is_available"
              @click="form.is_available = !form.is_available"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200"
                :class="form.is_available ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button
              id="modal-cancel"
              type="button"
              class="btn-ghost flex-1 justify-center"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              id="modal-submit"
              type="submit"
              class="btn-primary flex-1 justify-center"
              :disabled="submitting"
            >
              <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ editItem ? 'Save Changes' : 'Add to Menu' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
