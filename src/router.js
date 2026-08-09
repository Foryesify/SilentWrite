import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Editor from './views/Editor.vue'
import Settings from './views/Settings.vue'
import Library from './views/Library.vue'
import NotFound from './views/NotFound.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { name: 'Home', path: '/', component: Home },
    { name: 'Editor', path: '/editor/:id?', component: Editor },
    { name: 'Settings', path: '/settings', component: Settings },
    { name: 'Library', path: '/library', component: Library },
    { name: 'NotFound', path: '/:pathMatch(.*)*', component: NotFound },
  ],
})
