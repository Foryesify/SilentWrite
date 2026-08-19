import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

// PWA
registerSW({ immediate: true })

createApp(App).mount('#root')
