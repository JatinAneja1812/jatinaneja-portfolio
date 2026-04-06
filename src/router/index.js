import { createRouter, createWebHistory } from 'vue-router';
// import Home from '../views/Home.vue';
import About from '../views/About.vue';
// import Quotes from '../views/Quotes.vue';
import Blog from '../views/Blog.vue';
// import Projects from '../views/Projects.vue';
import PostDetail from '../components/blog/[slug].vue';
const routes = [
    { path: '/', component: About },
    { path: '/about', component: About },
    // { path: '/quotes', component: Quotes },
    { path: '/blog', component: Blog },
    // { path: '/projects', component: Projects },
    {
        // The dynamic slug route
        path: '/blog/:slug',
        name: 'BlogPostDetail',
        component: PostDetail,
      },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
          return { selector: to.hash };
        } else if (savedPosition) {
          return savedPosition;
        } else {
          return { x: 0, y: 0 };
        }
      }
});
export default router;
