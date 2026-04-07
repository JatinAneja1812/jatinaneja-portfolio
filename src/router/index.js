// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
// import Blog from '../views/Blog.vue'
// import PostDetail from '../components/blog/[slug].vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  // { path: '/blog', component: Blog },
  // {
  //   path: '/blog/:slug',
  //   name: 'BlogPostDetail',
  //   component: PostDetail,
  // },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

export default router