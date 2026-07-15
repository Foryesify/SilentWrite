import './assets/main.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Editor from './views/Editor.vue'
import Settings from './views/Settings.vue'
import Library from './views/Library.vue'
import NotFound from './views/NotFound.vue'
import About from './views/About.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { name: 'Home', path: '/', component: Home },
    { name: 'Editor', path: '/editor', component: Editor },
    { name: 'Settings', path: '/settings', component: Settings },
    { name: 'Library', path: '/library', component: Library },
    { name: 'About', path: '/about', component: About },
    { name: 'NotFound', path: '/:pathMatch(.*)*', component: NotFound },
  ],
})

createApp(App).use(router).mount('#app')
