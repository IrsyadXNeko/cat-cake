<script setup lang="ts">
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const SCROLL_THRESHOLD = 64

function onScroll(): void {
  isScrolled.value = window.scrollY > SCROLL_THRESHOLD
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const navLinks = [
  { label: 'Home', hash: '#home' },
  { label: 'Menu', hash: '#menu' },
  { label: 'About Us', hash: '#about' },
]

function scrollToSection(hash: string): void {
  isMenuOpen.value = false
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <nav
    id="navbar"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled
      ? 'bg-cream-50/90 backdrop-blur-md border-b border-cream-200 shadow-warm'
      : 'bg-transparent'"
    aria-label="Main navigation"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-[72px]">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 flex-shrink-0 group">
          <!-- <span class="text-2xl leading-none select-none" aria-hidden="true">🐾</span> -->
          <span
            class="text-xl font-extrabold tracking-tight transition-colors duration-300"
            :class="isScrolled
              ? 'text-charcoal-900 group-hover:text-coral-500'
              : 'text-white group-hover:text-coral-300'"
          >
            Cat Cake
          </span>
        </NuxtLink>

        <!-- Desktop nav links -->
        <div class="hidden md:flex items-center gap-6">
          <button
            v-for="link in navLinks"
            :key="link.hash"
            class="text-sm font-semibold transition-colors duration-300"
            :class="isScrolled
              ? 'text-charcoal-500 hover:text-charcoal-900'
              : 'text-white/70 hover:text-white'"
            @click="scrollToSection(link.hash)"
          >
            {{ link.label }}
          </button>
        </div>

        <!-- Desktop Login Admin button -->
        <div class="hidden md:flex items-center">
          <NuxtLink
            to="/admin"
            id="nav-login-admin"
            class="inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-full border-2 transition-all duration-300 text-sm"
            :class="isScrolled
              ? 'text-charcoal-700 border-charcoal-300 hover:bg-charcoal-100 hover:border-charcoal-500'
              : 'text-white border-white/40 hover:bg-white/10 hover:border-white/70'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Login Admin
          </NuxtLink>
        </div>

        <!-- Mobile hamburger -->
        <button
          id="nav-hamburger"
          class="md:hidden p-2 rounded-xl transition-colors duration-300"
          :class="isScrolled
            ? 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-100'
            : 'text-white/70 hover:text-white hover:bg-white/10'"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle navigation menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg v-if="!isMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden border-t px-4 py-4 flex flex-col gap-3 transition-colors duration-300"
        :class="isScrolled ? 'border-cream-200 bg-cream-50' : 'border-white/10 bg-charcoal-900/90 backdrop-blur-md'"
      >
        <button
          v-for="link in navLinks"
          :key="link.hash"
          class="text-left text-base font-semibold transition-colors py-1"
          :class="isScrolled
            ? 'text-charcoal-700 hover:text-coral-500'
            : 'text-white/80 hover:text-white'"
          @click="scrollToSection(link.hash)"
        >
          {{ link.label }}
        </button>
        <NuxtLink
          to="/admin"
          class="w-full justify-center mt-2 text-sm inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full border-2 transition-all duration-200"
          :class="isScrolled
            ? 'text-charcoal-300 border-charcoal-300 hover:bg-charcoal-100 hover:border-charcoal-500'
            : 'text-white border-white/40 hover:bg-white/10 hover:border-white/70'"
          @click="isMenuOpen = false"
        >
          Login Admin
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>
