import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Editor from './views/Editor.vue'
import Settings from './views/Settings.vue'
import Library from './views/Library.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { name: 'Home', path: '/', component: Home, meta: { depth: 0 } },
    { name: 'Editor', path: '/editor/:id?', component: Editor, meta: { depth: 2 } },
    { name: 'Settings', path: '/settings', component: Settings, meta: { depth: 1 } },
    { name: 'Library', path: '/library', component: Library, meta: { depth: 1 } },
  ],
})
