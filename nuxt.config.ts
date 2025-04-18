// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    css: ['~/assets/global.css'],
    modules: ['@nuxt/ui', '@nuxt/icon'],
    vite: {
        plugins: [tailwindcss()],
    },
})