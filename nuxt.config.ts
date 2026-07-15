// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },
  runtimeConfig: {
    supabaseServiceKey: '',
    public: {
      whatsappNumber: '6282312479588',
      adminUsername: 'admin',
      adminPassword: 'catcake2024',
      supabaseUrl: '',
    },
  },
  app: {
    head: {
      title: 'Cat Cake — Fluffy Treats to Brighten Your Day',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Cat Cake is a premium Japanese-Korean inspired bakery offering handcrafted bolu, cheesecake, fluffy pancakes, and adorable cat-themed treats. Order via WhatsApp.',
        },
        { property: 'og:title', content: 'Cat Cake — Fluffy Treats to Brighten Your Day' },
        {
          property: 'og:description',
          content: 'Handcrafted bolu, cheesecake, fluffy pancakes, and cat-themed treats.',
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap',
        },
      ],
    },
  },
})
