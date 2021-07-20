import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home.vue'
import NotFound from '/src/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  //catchall 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
