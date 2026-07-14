export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

const cart = ref<CartItem[]>([])
const isOpen = ref(false)

export function useCart() {
  const totalItems = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  function addItem(id: string, name: string, price: number): void {
    const existing = cart.value.find((item) => item.id === id)
    if (existing) {
      existing.quantity++
    } else {
      cart.value.push({ id, name, price, quantity: 1 })
    }
  }

  function removeItem(id: string): void {
    cart.value = cart.value.filter((item) => item.id !== id)
  }

  function updateQuantity(id: string, qty: number): void {
    if (qty <= 0) {
      removeItem(id)
      return
    }
    const item = cart.value.find((i) => i.id === id)
    if (item) item.quantity = qty
  }

  function clearCart(): void {
    cart.value = []
  }

  function toggleOpen(): void {
    isOpen.value = !isOpen.value
  }

  function closeCart(): void {
    isOpen.value = false
  }

  function openCart(): void {
    isOpen.value = true
  }

  const WHATSAPP_NUMBER = '6282312479588'

  const whatsappUrl = computed(() => {
    if (cart.value.length === 0) return '#'

    const lines = cart.value.map(
      (item) => `${item.name} x${item.quantity}`
    )
    const total = cart.value
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalFormatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(total)

    const message = `Halo Cat Cake! Saya ingin memesan:\n\n${lines.join('\n')}\n\nTotal: ${totalFormatted}\n\n`

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  })

  return {
    cart: readonly(cart),
    isOpen: readonly(isOpen),
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleOpen,
    closeCart,
    openCart,
    whatsappUrl,
  }
}
