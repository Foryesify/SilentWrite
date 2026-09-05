import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'
import { initUserdata } from './user/userdata.js'
import { Appwindow, bindFileLaunches, listenFileLaunches } from './user/api.js'

listenFileLaunches()
if (!window.__TAURI_INTERNALS__) registerSW({ immediate: true })

initUserdata().then(() => {
  createApp(App).mount('#root')
  bindFileLaunches()
  Appwindow.reveal()
})
