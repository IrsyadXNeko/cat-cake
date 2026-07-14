<script setup lang="ts">
import type { Menu, MenuCategory } from '~/types'
import { MENU_CATEGORIES } from '~/types'

definePageMeta({ layout: 'default' })

useHead({
  title: 'Cat Cake — Fluffy Treats to Brighten Your Day',
  meta: [{ name: 'description', content: 'Handcrafted bolu, cheesecake, fluffy pancakes, and cat-themed treats. Order via WhatsApp.' }],
})

// Fetch menus from server API
const { data: menus, status } = await useFetch<Menu[]>('/api/menu')
const isPending = computed(() => status.value === 'pending')

// Category filter
const activeCategory = ref<MenuCategory | 'All'>('All')

const filteredMenus = computed<Menu[]>(() => {
  if (!menus.value) return []
  if (activeCategory.value === 'All') return menus.value
  return menus.value.filter((m) => m.category === activeCategory.value)
})

const allCategories: ('All' | MenuCategory)[] = ['All', ...MENU_CATEGORIES]

// WhatsApp order link
const WHATSAPP_NUMBER = '6281234567890'
const whatsappUrl = computed(() =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Cat Cake! Saya mau order 🐾')}`
)

// USP data
const usps = [
  { icon: '🌾', title: 'Premium Ingredients', desc: 'Only the finest flour, eggs, and natural flavors' },
  { icon: '🐱', title: 'Cat-Themed Designs', desc: 'Every treat is crafted with adorable cat love' },
  { icon: '💝', title: 'Made with Love', desc: 'Handcrafted small batch, fresh every day' },
]

// Order steps
const orderSteps = [
  { step: '1', label: 'Choose Your Treats', icon: '🍰' },
  { step: '2', label: 'Chat via WhatsApp', icon: '💬' },
  { step: '3', label: 'Enjoy & Share', icon: '🐾' },
]

const scrollToMenu = () => {
  document
    .querySelector<HTMLElement>('#menu')
    ?.scrollIntoView({
      behavior: 'smooth',
    })
}
</script>

<template>
  <div>
    <!-- ─── NAVBAR ─────────────────────────────────────────────── -->
    <TheNavbar />

    <!-- ─── HERO SECTION ──────────────────────────────────────── -->
    <section
      id="home"
      class="relative min-h-dvh flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-16 md:pt-[72px] pb-20 overflow-hidden bg-charcoal-900"
    >
      <!-- Background image fills full viewport (also behind navbar) -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1612539466296-4ecf1db303e3?q=80&w=2143&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#2C2420]/85 via-[#2C2420]/60 to-[#2C2420]/10"></div>
      </div>

      <!-- Floating accents -->
      <div class="absolute top-24 right-12 w-16 h-16 rounded-2xl bg-white/80 shadow-warm flex items-center justify-center text-2xl animate-float backdrop-blur-sm" style="animation-delay: 0.5s" aria-hidden="true">🥐</div>
      <div class="absolute bottom-20 right-1/4 w-14 h-14 rounded-2xl bg-white/80 shadow-warm flex items-center justify-center text-xl animate-float backdrop-blur-sm" style="animation-delay: 1s" aria-hidden="true">☕</div>
      <div class="absolute top-1/3 right-8 w-12 h-12 rounded-2xl bg-white/80 shadow-warm flex items-center justify-center text-lg animate-float backdrop-blur-sm" style="animation-delay: 1.5s" aria-hidden="true">🌸</div>

      <!-- Content pushed below the fixed navbar -->
      <div class="max-w-7xl mx-auto w-full relative">
        <div class="max-w-2xl">
          <p class="text-sm font-semibold text-cream-100/80 mb-4">
            Handcrafted with love 🐾
          </p>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Fluffy Treats to<br />
            <span class="text-coral-300">Brighten Your Day</span>
          </h1>
          <p class="text-cream-100/80 text-lg leading-relaxed mb-8 max-w-md">
            Nestled in the spirit of minimalist Asian cafes, we craft premium
            cat-themed baked goods — bolu, cheesecake, fluffy pancakes and more.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a
              id="hero-whatsapp-cta"
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-full border-2 border-white/40 transition-all duration-200 hover:bg-[#6DBF9E]/20 hover:border-[#6DBF9E] active:scale-95 backdrop-blur-sm text-base"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </a>
            <button
              id="hero-view-menu"
              class="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-full border-2 border-white/40 transition-all duration-200 hover:bg-white/10 hover:border-white/60 active:scale-95 backdrop-blur-sm text-base"
              @click="scrollToMenu"
            >
              View Menu
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── MENU SECTION ───────────────────────────────────────── -->
    <section id="menu" class="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20 relative">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-coral-500/30 to-transparent rounded-full" aria-hidden="true"></div>
      <div class="max-w-7xl mx-auto">
        <!-- Section header -->
        <div class="text-center mb-10">
          <span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">
            <span class="w-6 h-px bg-coral-500/40" aria-hidden="true"></span>
            Our Selection
            <span class="w-6 h-px bg-coral-500/40" aria-hidden="true"></span>
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-charcoal-900 tracking-tight mb-3">
            Sweet Treats Menu
          </h2>
          <p class="text-charcoal-500 leading-relaxed max-w-xl mx-auto text-sm md:text-base">
            Every item is made fresh with premium ingredients, crafted with care in our little cat kitchen.
          </p>
        </div>

        <!-- Good points -->
        <div class="flex flex-wrap justify-center gap-3 md:gap-6 mb-12">
          <div class="flex items-center gap-2.5 px-4 py-2.5 bg-cream-50 rounded-full text-sm">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-coral-100 text-coral-500 text-xs" aria-hidden="true">🌾</span>
            <span class="font-semibold text-charcoal-700">Fresh Daily</span>
          </div>
          <div class="flex items-center gap-2.5 px-4 py-2.5 bg-cream-50 rounded-full text-sm">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-coral-100 text-coral-500 text-xs" aria-hidden="true">🥚</span>
            <span class="font-semibold text-charcoal-700">Premium Ingredients</span>
          </div>
          <div class="flex items-center gap-2.5 px-4 py-2.5 bg-cream-50 rounded-full text-sm">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-coral-100 text-coral-500 text-xs" aria-hidden="true">💬</span>
            <span class="font-semibold text-charcoal-700">Order via WhatsApp</span>
          </div>
          <div class="flex items-center gap-2.5 px-4 py-2.5 bg-cream-50 rounded-full text-sm">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-coral-100 text-coral-500 text-xs" aria-hidden="true">🐾</span>
            <span class="font-semibold text-charcoal-700">Cat-Themed Love</span>
          </div>
        </div>

        <!-- Category tabs -->
        <div class="relative flex gap-1 overflow-x-auto pb-2 mb-10 scrollbar-hide -mx-1 px-1 justify-center">
          <button
            v-for="cat in allCategories"
            :key="cat"
            :id="`tab-${cat.replace(/\s+/g, '-').toLowerCase()}`"
            class="relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
            :class="activeCategory === cat
              ? 'bg-coral-500 text-white shadow-warm scale-105'
              : 'text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100'"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="isPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="n in 8" :key="n" class="bg-cream-100 rounded-2xl overflow-hidden animate-pulse">
            <div class="aspect-[4/3] bg-cream-200"></div>
            <div class="p-4 space-y-3">
              <div class="flex gap-2 items-center">
                <div class="h-3 w-16 bg-cream-200 rounded-full"></div>
                <div class="h-1 w-1 bg-cream-200 rounded-full"></div>
                <div class="h-3 w-14 bg-cream-200 rounded-full"></div>
              </div>
              <div class="h-4 w-2/3 bg-cream-200 rounded-full"></div>
              <div class="h-3 w-full bg-cream-200 rounded-full"></div>
              <div class="h-3 w-4/5 bg-cream-200 rounded-full"></div>
              <div class="pt-3 mt-3 border-t border-cream-50 flex items-center justify-between">
                <div class="h-4 w-16 bg-cream-200 rounded-full"></div>
                <div class="h-3 w-12 bg-cream-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu grid -->
        <TransitionGroup
          v-else
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <MenuCard
            v-for="item in filteredMenus"
            :key="item.id"
            :menu="item"
          />
        </TransitionGroup>

        <!-- Empty state -->
        <div
          v-if="!isPending && filteredMenus.length === 0"
          class="text-center py-20"
        >
          <div class="text-7xl mb-4">🍽️</div>
          <p class="text-charcoal-500 text-lg font-semibold">No items in this category yet</p>
          <p class="text-charcoal-300 text-sm mt-1">Check back soon for new treats!</p>
        </div>
      </div>
    </section>

    <!-- ─── ABOUT US SECTION ───────────────────────────────────── -->
    <section id="about" class="py-20 px-4 sm:px-6 lg:px-8 bg-cream-50 scroll-mt-20 relative overflow-hidden">
      <!-- Subtle background decoration -->
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-coral-500/5 blur-3xl" aria-hidden="true"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-mint-400/5 blur-3xl" aria-hidden="true"></div>

      <div class="max-w-7xl mx-auto relative">
        <!-- Section label -->
        <div class="text-center mb-4">
          <span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-coral-500">
            <span class="w-6 h-px bg-coral-500/40" aria-hidden="true"></span>
            About Us
            <span class="w-6 h-px bg-coral-500/40" aria-hidden="true"></span>
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <!-- Bakery atmosphere image -->
          <div class="flex justify-center">
            <div class="relative">
              <div class="w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-warm-lg">
                <img
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=600&fit=crop&q=80"
                  alt="Cozy bakery atmosphere with fresh pastries"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5"></div>
              </div>
              <!-- Floating decorative elements -->
              <div class="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl bg-white shadow-warm flex items-center justify-center text-2xl" aria-hidden="true">🐱</div>
              <div class="absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-white shadow-warm flex items-center justify-center text-xl" aria-hidden="true">🧁</div>
            </div>
          </div>

          <!-- Story content -->
          <div>
            <h2 class="text-3xl md:text-4xl font-extrabold text-charcoal-900 tracking-tight mb-5">
              Baked with Love,<br />
              <span class="text-coral-500">Inspired by Cats</span>
            </h2>
            <p class="text-charcoal-500 leading-relaxed mb-6 text-sm md:text-base">
              Welcome to Cat Cake, where passion for baking meets our love for cats.
              Nestled in the spirit of minimalist Asian cafes, we craft premium,
              cat-themed baked goods using only the finest ingredients.
            </p>
            <p class="text-charcoal-500 leading-relaxed mb-8 text-sm md:text-base">
              Each creation is made with care, balancing delicate flavors and adorable
              designs to bring joy to every occasion. Our mission is to bake warmth,
              sweetness, and happiness into your day.
            </p>

            <!-- USP cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                v-for="usp in usps"
                :key="usp.title"
                class="bg-white rounded-2xl p-4 shadow-warm text-center hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div class="text-2xl mb-2" aria-hidden="true">{{ usp.icon }}</div>
                <h3 class="font-bold text-charcoal-900 text-xs mb-1">{{ usp.title }}</h3>
                <p class="text-charcoal-400 text-[11px] leading-relaxed">{{ usp.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FOOTER ─────────────────────────────────────────────── -->
    <footer class="bg-charcoal-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-charcoal-800">

          <!-- Brand -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl" aria-hidden="true">🐾</span>
              <span class="text-xl font-extrabold tracking-tight">Cat Cake</span>
            </div>
            <p class="text-charcoal-300 text-sm leading-relaxed max-w-[24ch]">
              Wholesome treats, happy moments. Handcrafted with love daily.
            </p>
          </div>

          <!-- Order steps -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-widest text-charcoal-400 mb-6">
              How to Order
            </h3>
            <ol class="space-y-4">
              <li
                v-for="step in orderSteps"
                :key="step.step"
                class="flex items-center gap-3"
              >
                <div class="w-8 h-8 rounded-full bg-coral-500 flex items-center justify-center text-sm font-extrabold flex-shrink-0">
                  {{ step.step }}
                </div>
                <span class="text-charcoal-300 text-sm">
                  {{ step.icon }} {{ step.label }}
                </span>
              </li>
            </ol>
          </div>

          <!-- Social media -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-widest text-charcoal-400 mb-6">
              Follow Us
            </h3>
            <div class="flex gap-3">
              <a
                id="footer-instagram"
                href="#"
                class="w-10 h-10 rounded-xl bg-charcoal-800 hover:bg-coral-500 flex items-center justify-center transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                id="footer-tiktok"
                href="#"
                class="w-10 h-10 rounded-xl bg-charcoal-800 hover:bg-coral-500 flex items-center justify-center transition-colors duration-200"
                aria-label="TikTok"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.77a4.85 4.85 0 01-1.07-.08z"/>
                </svg>
              </a>
              <a
                id="footer-whatsapp"
                :href="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-xl bg-charcoal-800 hover:bg-coral-500 flex items-center justify-center transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer bottom -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-charcoal-400 text-sm">
            &copy; {{ new Date().getFullYear() }} Cat Cake Bakery. All rights reserved.
          </p>
          <NuxtLink
            to="/admin"
            class="text-charcoal-400 text-sm hover:text-coral-400 transition-colors"
          >
            Admin Panel
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
