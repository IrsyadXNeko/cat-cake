<script setup lang="ts">
const { cart, isOpen, totalItems, totalPrice, updateQuantity, removeItem, clearCart, toggleOpen, whatsappUrl } = useCart()

function formatIDR(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
</script>

<template>
  <div v-if="cart.length > 0" class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
    <!-- Cart popup -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div
        v-if="isOpen"
        class="bg-white rounded-3xl shadow-warm-lg w-[360px] max-w-[calc(100vw-48px)] max-h-[70vh] flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 pt-5 pb-3 border-b border-cream-100">
          <div>
            <h3 class="font-extrabold text-charcoal-900 text-base">Your Cart</h3>
            <p class="text-xs text-charcoal-400 mt-0.5">{{ totalItems }} item{{ totalItems > 1 ? 's' : '' }}</p>
          </div>
          <button
            class="p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 transition-colors"
            aria-label="Close cart"
            @click="toggleOpen"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Items list -->
        <div class="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex items-center gap-3 py-2"
          >
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-charcoal-900 truncate">{{ item.name }}</p>
              <p class="text-xs text-charcoal-400">{{ formatIDR(item.price) }} each</p>
            </div>
            <!-- Quantity controls -->
            <div class="flex items-center gap-1.5">
              <button
                class="w-7 h-7 rounded-full border border-cream-200 flex items-center justify-center text-sm font-bold text-charcoal-500 hover:bg-cream-100 hover:border-coral-400 hover:text-coral-500 transition-colors"
                @click="updateQuantity(item.id, item.quantity - 1)"
              >−</button>
              <span class="w-8 text-center text-sm font-bold text-charcoal-900">{{ item.quantity }}</span>
              <button
                class="w-7 h-7 rounded-full border border-cream-200 flex items-center justify-center text-sm font-bold text-charcoal-500 hover:bg-cream-100 hover:border-coral-400 hover:text-coral-500 transition-colors"
                @click="updateQuantity(item.id, item.quantity + 1)"
              >+</button>
            </div>
            <!-- Subtotal -->
            <span class="text-sm font-bold text-charcoal-900 w-20 text-right">{{ formatIDR(item.price * item.quantity) }}</span>
            <!-- Remove -->
            <button
              class="p-1 rounded-lg text-charcoal-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Remove item"
              @click="removeItem(item.id)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 pt-3 pb-5 border-t border-cream-100 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-charcoal-500">Total</span>
            <span class="text-lg font-extrabold text-coral-500">{{ formatIDR(totalPrice) }}</span>
          </div>
          <div class="flex gap-2">
            <button
              class="flex-1 px-4 py-2.5 rounded-full border border-cream-200 text-xs font-semibold text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-600 transition-colors"
              @click="clearCart"
            >Clear</button>
            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold text-sm px-4 py-2.5 rounded-full transition-all duration-200 hover:bg-green-600 active:scale-95 shadow-warm"
              @click="clearCart"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating cart button -->
    <button
      class="relative w-14 h-14 rounded-full bg-coral-500 text-white shadow-warm-lg hover:bg-coral-600 active:scale-95 transition-all duration-200 flex items-center justify-center"
      aria-label="Open cart"
      @click="toggleOpen"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
      </svg>
      <!-- Badge -->
      <span
        v-if="totalItems > 0"
        class="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] rounded-full bg-charcoal-900 text-white text-[11px] font-bold flex items-center justify-center px-1 shadow-warm"
      >
        {{ totalItems > 99 ? '99+' : totalItems }}
      </span>
    </button>
  </div>
</template>
