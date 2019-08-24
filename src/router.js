import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL || 8080,
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: () => import('@/views/Home.vue'),
        headerComponent: null,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        headerComponent: () => import('@/components/Header.vue'),
      },
    },
    {
      path: '/projects',
      name: 'projects',
      components: {
        default: () => import('@/views/Projects.vue'),
        headerComponent: () => import('@/components/Header.vue'),
      },
    },
    {
      path: '/blog',
      name: 'blog',
      components: {
        default: () => import('@/views/Blog.vue'),
        headerComponent: () => import('@/components/Header.vue'),
      },
    },
  ],
});
