import {
  createRouter,
  createWebHashHistory,
} from "vue-router";

import Website from "../views/Website.vue";
import Blog from "../views/Blog.vue";
import PostDetail from "../components/blog/[slug].vue";

const routes = [
  {
    path: "/",
    alias: "/resume-website",
    name: "Resume",
    component: Website,
  },
  {
    path: "/blog",
    name: "Blog",
    component: Blog,
  },
  {
    path: "/blog/:slug",
    name: "BlogPostDetail",
    component: PostDetail,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      return {
        el: to.hash,
        behavior: reducedMotion ? "auto" : "smooth",
      };
    }

    return {
      left: 0,
      top: 0,
    };
  },
});

export default router;