<script setup lang="ts">
import type { Menu } from '~/types'

interface Props {
  menu: Menu
}

const props = defineProps<Props>()
const { addItem } = useCart()

const added = ref(false)

function handleAddToCart(): void {
  addItem(props.menu.id, props.menu.name, props.menu.price)
  added.value = true
  setTimeout(() => { added.value = false }, 1200)
}

function formatIDR(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const imgSrc = computed(() =>
  props.menu.image_url ||
  `https://picsum.photos/seed/${encodeURIComponent(props.menu.name)}/400/300`
)
</script>

<template>
  <article class="card-menu group flex flex-col" :aria-label="`${menu.name} menu item`">
    <!-- Image -->
    <div class="relative overflow-hidden aspect-[4/3] bg-cream-100">
      <img
        :src="imgSrc"
        :alt="menu.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <!-- Gradient overlay for depth -->
      <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>

      <!-- Hover add-to-cart button -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
        <button
          class="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-charcoal-900 font-semibold text-sm px-5 py-2.5 rounded-full shadow-warm-md hover:bg-coral-500 hover:text-white hover:shadow-warm-lg active:scale-95"
          @click="handleAddToCart"
        >
          <svg v-if="!added" class="w-4 h-4 inline -mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <svg v-else class="w-4 h-4 inline -mt-0.5 mr-1.5 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ added ? 'Added!' : 'Add to Cart' }}
        </button>
      </div>
    </div>

    <!-- Card body -->
    <div class="flex flex-col flex-1 p-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[11px] font-semibold uppercase tracking-widest text-coral-500">
          {{ menu.category }}
        </span>
        <span class="w-1 h-1 rounded-full bg-cream-200" aria-hidden="true"></span>
        <span v-if="menu.is_available" class="text-[11px] font-semibold text-mint-500">Available</span>
        <span v-else class="text-[11px] font-semibold text-charcoal-300">Out of Stock</span>
      </div>
      <h3 class="font-extrabold text-charcoal-900 text-base leading-snug mb-1.5">
        {{ menu.name }}
      </h3>
      <p class="text-charcoal-500 text-sm leading-relaxed flex-1 line-clamp-2">
        {{ menu.description }}
      </p>
      <div class="mt-3 pt-3 border-t border-cream-100 flex items-center justify-between">
        <span class="text-lg font-extrabold text-coral-500">
          {{ formatIDR(menu.price) }}
        </span>
        <button
          class="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          :class="added ? 'text-mint-500' : 'text-charcoal-400 hover:text-coral-500'"
          @click="handleAddToCart"
        >
          <svg v-if="!added" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ added ? 'Added' : 'Add' }}
        </button>
      </div>
    </div>
  </article>
</template>
