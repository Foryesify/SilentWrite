import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'
import { initUserdata } from './user/userdata.js'

registerSW({ immediate: true })

initUserdata().then(() => {
  createApp(App).mount('#root')
})
