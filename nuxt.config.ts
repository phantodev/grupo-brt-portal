// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', '@pinia/nuxt', '@nuxt/image', '@pinia-plugin-persistedstate/nuxt'],
  ssr: false, // Disable Server Side rendering
  // devtools: { enabled: true },
  build: {
    transpile: ['@vuepic/vue-datepicker', 'vue-toastification'],
  },
  components: [
    {
      path: '~/components', // Pasta padrão "components",
    },
    {
      path: '~/components/icons',
    },
    {
      path: '~/components/search',
    },
    {
      path: '~/components/flights',
    },
    {
      path: '~/components/login',
    },
    {
      path: '~/components/hotels',
    },
    {
      path: '~/components/budget',
    },
    {
      path: '~/components/booking',
    },
    {
      path: '~/components/signup',
    },
    {
      path: '~/components/dashboard',
    },
  ],
});
