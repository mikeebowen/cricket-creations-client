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
        appBar: null,
        footer: () => import('@/components/Footer.vue'),
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
        appBar: () => import('@/components/Header.vue'),
        footer: () => import('@/components/Footer.vue'),
      },
    },
    {
      path: '/projects',
      name: 'projects',
      components: {
        default: () => import('@/views/Projects.vue'),
        appBar: () => import('@/components/Header.vue'),
        footer: () => import('@/components/Footer.vue'),
      },
    },
    {
      path: '/blog',
      name: 'blog',
      components: {
        default: () => import('@/views/Blog.vue'),
        appBar: () => import('@/components/Header.vue'),
        footer: () => import('@/components/Footer.vue'),
      },
    },
  ],
});
