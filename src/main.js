import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'
import { initUserdata } from './user/userdata.js'
import { bindFileLaunches, listenFileLaunches } from './user/api.js'

listenFileLaunches()
registerSW({ immediate: true })

initUserdata().then(() => {
  createApp(App).mount('#root')
  bindFileLaunches()
})
